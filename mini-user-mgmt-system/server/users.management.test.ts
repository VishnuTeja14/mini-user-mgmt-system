import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

vi.mock("./db", () => ({
  getAllUsers: vi.fn(),
  getUserCount: vi.fn(),
  updateUserStatus: vi.fn(),
  updateUserProfile: vi.fn(),
  getUserByEmail: vi.fn(),
  updateUserPassword: vi.fn(),
  verifyPassword: vi.fn(),
}));

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      email: "admin@example.com",
      name: "Admin User",
      password: "hashed",
      openId: "admin",
      loginMethod: "email",
      role: "admin",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      email: "user@example.com",
      name: "Regular User",
      password: "hashed",
      openId: "user",
      loginMethod: "email",
      role: "user",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("users.list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("admin can retrieve paginated user list", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const mockUsers = [
      {
        id: 1,
        email: "user1@example.com",
        name: "User 1",
        password: "hashed",
        openId: "user1",
        loginMethod: "email",
        role: "user" as const,
        status: "active" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
    ];

    vi.mocked(db.getAllUsers).mockResolvedValue(mockUsers);
    vi.mocked(db.getUserCount).mockResolvedValue(1);

    const result = await caller.users.list({ page: 1, limit: 10 });

    expect(result.users).toEqual(mockUsers);
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.pages).toBe(1);
    expect(vi.mocked(db.getAllUsers)).toHaveBeenCalledWith(10, 0);
  });

  it("regular user cannot access user list", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.users.list({ page: 1, limit: 10 });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
      expect(error.message).toContain("Only admins can view all users");
    }
  });

  it("calculates pagination correctly", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(db.getAllUsers).mockResolvedValue([]);
    vi.mocked(db.getUserCount).mockResolvedValue(25);

    const result = await caller.users.list({ page: 2, limit: 10 });

    expect(result.pages).toBe(3);
    expect(result.page).toBe(2);
    expect(vi.mocked(db.getAllUsers)).toHaveBeenCalledWith(10, 10);
  });
});

describe("users.activate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("admin can activate a user", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.users.activate({ userId: 2 });

    expect(result.success).toBe(true);
    expect(vi.mocked(db.updateUserStatus)).toHaveBeenCalledWith(2, "active");
  });

  it("regular user cannot activate users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.users.activate({ userId: 2 });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
      expect(error.message).toContain("Only admins can activate users");
    }
  });
});

describe("users.deactivate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("admin can deactivate a user", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.users.deactivate({ userId: 2 });

    expect(result.success).toBe(true);
    expect(vi.mocked(db.updateUserStatus)).toHaveBeenCalledWith(2, "inactive");
  });

  it("regular user cannot deactivate users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.users.deactivate({ userId: 2 });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
      expect(error.message).toContain("Only admins can deactivate users");
    }
  });
});

describe("users.updateProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("user can update their profile", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const updatedUser = {
      id: 2,
      email: "newemail@example.com",
      name: "Updated Name",
      password: "hashed",
      openId: "user",
      loginMethod: "email",
      role: "user" as const,
      status: "active" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    vi.mocked(db.getUserByEmail).mockResolvedValue(null);
    vi.mocked(db.updateUserProfile).mockResolvedValue(undefined);
    vi.mocked(db.getUserByEmail).mockResolvedValueOnce(null).mockResolvedValueOnce(updatedUser);

    const result = await caller.users.updateProfile({
      name: "Updated Name",
      email: "newemail@example.com",
    });

    expect(result?.email).toBe("newemail@example.com");
    expect(result?.name).toBe("Updated Name");
  });

  it("rejects profile update with duplicate email", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const existingUser = {
      id: 3,
      email: "existing@example.com",
      name: "Existing User",
      password: "hashed",
      openId: "existing",
      loginMethod: "email",
      role: "user" as const,
      status: "active" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    vi.mocked(db.getUserByEmail).mockResolvedValue(existingUser);

    try {
      await caller.users.updateProfile({
        name: "Updated Name",
        email: "existing@example.com",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("CONFLICT");
      expect(error.message).toContain("Email already in use");
    }
  });
});

describe("users.changePassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("user can change their password with correct current password", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const mockUser = {
      id: 2,
      email: "user@example.com",
      name: "Regular User",
      password: "hashed",
      openId: "user",
      loginMethod: "email",
      role: "user" as const,
      status: "active" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    vi.mocked(db.getUserByEmail).mockResolvedValue(mockUser);
    vi.mocked(db.verifyPassword).mockResolvedValue(true);
    vi.mocked(db.updateUserPassword).mockResolvedValue(undefined);

    const result = await caller.users.changePassword({
      currentPassword: "OldPass123!",
      newPassword: "NewPass456!",
    });

    expect(result.success).toBe(true);
    expect(vi.mocked(db.updateUserPassword)).toHaveBeenCalledWith(2, "NewPass456!");
  });

  it("rejects password change with incorrect current password", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const mockUser = {
      id: 2,
      email: "user@example.com",
      name: "Regular User",
      password: "hashed",
      openId: "user",
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
      await caller.users.changePassword({
        currentPassword: "WrongPass123!",
        newPassword: "NewPass456!",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error.message).toContain("Current password is incorrect");
    }
  });

  it("rejects weak new password", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const mockUser = {
      id: 2,
      email: "user@example.com",
      name: "Regular User",
      password: "hashed",
      openId: "user",
      loginMethod: "email",
      role: "user" as const,
      status: "active" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    vi.mocked(db.getUserByEmail).mockResolvedValue(mockUser);
    vi.mocked(db.verifyPassword).mockResolvedValue(true);

    try {
      await caller.users.changePassword({
        currentPassword: "OldPass123!",
        newPassword: "weak",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.message).toContain("Password must");
    }
  });
});
