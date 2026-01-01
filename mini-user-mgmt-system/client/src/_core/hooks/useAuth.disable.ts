// client/src/_core/hooks/useAuth.disable.ts

// Dummy useAuth for frontend-only deployment
export function useAuth() {
  return {
    user: null,            // no user is logged in
    loading: false,        // not loading
    error: null,           // no error
    isAuthenticated: false,
    refresh: async () => null,
    logout: async () => {
      console.log("Logout called (frontend-only)");
    },
  };
}
