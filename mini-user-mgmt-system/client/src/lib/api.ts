export type User = {
  id: number;
  name: string;
  role: "admin" | "user";
};

export const api = {
  login: async (): Promise<User> => {
    return {
      id: 1,
      name: "Demo Admin",
      role: "admin"
    };
  },

  logout: async () => {
    return true;
  },

  getUsers: async (): Promise<User[]> => {
    return [
      { id: 1, name: "Demo Admin", role: "admin" },
      { id: 2, name: "Demo User", role: "user" }
    ];
  }
};
