import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

// Mock the database module
vi.mock("./db", () => ({
  getUserByEmail: vi.fn(),
  createUser: vi.fn(),
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

describe("auth.signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully creates a new user with valid credentials", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(db.getUserByEmail).mockResolvedValue(null);
    vi.mocked(db.createUser).mockResolvedValue(1);

    const result = await caller.auth.signup({
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePass123!",
    });

    expect(result.success).toBe(true);
    expect(vi.mocked(db.getUserByEmail)).toHaveBeenCalledWith("john@example.com");
    expect(vi.mocked(db.createUser)).toHaveBeenCalledWith(
      "John Doe",
      "john@example.com",
      "SecurePass123!"
    );
  });

  it("rejects signup if email already exists", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(db.getUserByEmail).mockResolvedValue({
      id: 1,
      email: "john@example.com",
      name: "John Doe",
      password: "hashed",
      openId: "test",
      loginMethod: "email",
      role: "user",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    });

    try {
      await caller.auth.signup({
        name: "John Doe",
        email: "john@example.com",
        password: "SecurePass123!",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("CONFLICT");
      expect(error.message).toContain("Email already registered");
    }
  });

  it("rejects password with insufficient strength", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(db.getUserByEmail).mockResolvedValue(null);

    try {
      await caller.auth.signup({
        name: "John Doe",
        email: "john@example.com",
        password: "weak", // Too weak
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.message).toContain("Password must");
    }
  });

  it("rejects password without uppercase letter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(db.getUserByEmail).mockResolvedValue(null);

    try {
      await caller.auth.signup({
        name: "John Doe",
        email: "john@example.com",
        password: "securepass123!", // No uppercase
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
    }
  });

  it("rejects password without special character", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(db.getUserByEmail).mockResolvedValue(null);

    try {
      await caller.auth.signup({
        name: "John Doe",
        email: "john@example.com",
        password: "SecurePass123", // No special character
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
    }
  });

  it("rejects invalid email format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.signup({
        name: "John Doe",
        email: "invalid-email",
        password: "SecurePass123!",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.message).toContain("Invalid email");
    }
  });

  it("rejects empty name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.signup({
        name: "",
        email: "john@example.com",
        password: "SecurePass123!",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
    }
  });
});
