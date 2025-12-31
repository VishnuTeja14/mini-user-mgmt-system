import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    signup: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required"),
          email: z.string().email("Invalid email format"),
          password: z.string().min(8, "Password must be at least 8 characters"),
        })
      )
      .mutation(async ({ input }) => {
        // Check if user already exists
        const existingUser = await db.getUserByEmail(input.email);
        if (existingUser) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email already registered",
          });
        }

        // Validate password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(input.password)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Password must contain uppercase, lowercase, number, and special character",
          });
        }

        try {
          const userId = await db.createUser(input.name, input.email, input.password);
          const user = await db.getUserByEmail(input.email);
          return {
            success: true,
            user,
          };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create user",
          });
        }
      }),
    login: publicProcedure
      .input(
        z.object({
          email: z.string().email("Invalid email format"),
          password: z.string().min(1, "Password is required"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const user = await db.getUserByEmail(input.email);
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        // Verify password
        const isPasswordValid = await db.verifyPassword(user.password, input.password);
        if (!isPasswordValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        // Check if user is active
        if (user.status !== "active") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "User account is inactive",
          });
        }

        return {
          success: true,
          user,
        };
      }),
  }),

  users: router({
    // Get current user profile
    profile: protectedProcedure.query(({ ctx }) => ctx.user),
    
    // Update user profile
    updateProfile: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required"),
          email: z.string().email("Invalid email format"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authenticated",
          });
        }

        // Check if email is already taken by another user
        if (input.email !== ctx.user.email) {
          const existingUser = await db.getUserByEmail(input.email);
          if (existingUser) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Email already in use",
            });
          }
        }

        await db.updateUserProfile(ctx.user.id, input.name, input.email);
        const updatedUser = await db.getUserByEmail(input.email);
        return updatedUser;
      }),
    
    // Change password
    changePassword: protectedProcedure
      .input(
        z.object({
          currentPassword: z.string().min(1, "Current password is required"),
          newPassword: z.string().min(8, "Password must be at least 8 characters"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authenticated",
          });
        }

        const user = await db.getUserByEmail(ctx.user.email);
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Verify current password
        const isPasswordValid = await db.verifyPassword(user.password, input.currentPassword);
        if (!isPasswordValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Current password is incorrect",
          });
        }

        // Validate new password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(input.newPassword)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Password must contain uppercase, lowercase, number, and special character",
          });
        }

        await db.updateUserPassword(ctx.user.id, input.newPassword);
        return { success: true };
      }),
    
    // Admin: Get all users with pagination
    list: protectedProcedure
      .input(
        z.object({
          page: z.number().int().positive().default(1),
          limit: z.number().int().positive().default(10),
        })
      )
      .query(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can view all users",
          });
        }

        const offset = (input.page - 1) * input.limit;
        const users = await db.getAllUsers(input.limit, offset);
        const total = await db.getUserCount();
        
        return {
          users,
          total,
          page: input.page,
          limit: input.limit,
          pages: Math.ceil(total / input.limit),
        };
      }),
    
    // Admin: Activate user
    activate: protectedProcedure
      .input(z.object({ userId: z.number().int().positive() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can activate users",
          });
        }

        await db.updateUserStatus(input.userId, "active");
        return { success: true };
      }),
    
    // Admin: Deactivate user
    deactivate: protectedProcedure
      .input(z.object({ userId: z.number().int().positive() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can deactivate users",
          });
        }

        await db.updateUserStatus(input.userId, "inactive");
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
