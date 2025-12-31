import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

vi.mock("./db", () => ({
  getUserByEmail: vi.fn(),
  verifyPassword: vi.fn(),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("auth.login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully logs in user with correct credentials", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const mockUser = {
      id: 1,
      email: "john@example.com",
      name: "John Doe",
      password: "hashed",
      openId: "test",
      loginMethod: "email",
      role: "user" as const,
      status: "active" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    vi.mocked(db.getUserByEmail).mockResolvedValue(mockUser);
    vi.mocked(db.verifyPassword).mockResolvedValue(true);

    const result = await caller.auth.login({
      email: "john@example.com",
      password: "SecurePass123!",
    });

    expect(result.success).toBe(true);
    expect(result.user.email).toBe("john@example.com");
    expect(vi.mocked(db.verifyPassword)).toHaveBeenCalledWith("hashed", "SecurePass123!");
  });

  it("rejects login with incorrect password", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const mockUser = {
      id: 1,
      email: "john@example.com",
      name: "John Doe",
      password: "hashed",
      openId: "test",
      loginMethod: "email",
      role: "user" as const,
      status: "active" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    vi.mocked(db.getUserByEmail).mockResolvedValue(mockUser);
    vi.mocked(db.verifyPassword).mockResolvedValue(false);

    try {
      await caller.auth.login({
        email: "john@example.com",
        password: "WrongPassword123!",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error.message).toContain("Invalid email or password");
    }
  });

  it("rejects login with non-existent email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(db.getUserByEmail).mockResolvedValue(null);

    try {
      await caller.auth.login({
        email: "nonexistent@example.com",
        password: "SecurePass123!",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error.message).toContain("Invalid email or password");
    }
  });

  it("rejects login for inactive user", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const mockUser = {
      id: 1,
      email: "john@example.com",
      name: "John Doe",
      password: "hashed",
      openId: "test",
      loginMethod: "email",
      role: "user" as const,
      status: "inactive" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    vi.mocked(db.getUserByEmail).mockResolvedValue(mockUser);
    vi.mocked(db.verifyPassword).mockResolvedValue(true);

    try {
      await caller.auth.login({
        email: "john@example.com",
        password: "SecurePass123!",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
      expect(error.message).toContain("User account is inactive");
    }
  });

  it("rejects invalid email format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.login({
        email: "invalid-email",
        password: "SecurePass123!",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
    }
  });
});
