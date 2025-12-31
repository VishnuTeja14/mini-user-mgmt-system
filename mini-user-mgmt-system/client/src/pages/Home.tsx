import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Users, Lock, Shield } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user) {
    // Redirect authenticated users to dashboard
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">User Management System</h1>
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => setLocation("/login")}
            >
              Login
            </Button>
            <Button 
              onClick={() => setLocation("/signup")}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Manage Users with Ease
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            A comprehensive user management system with role-based access control and secure authentication
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => setLocation("/signup")}
            >
              Get Started
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => setLocation("/login")}
            >
              Login
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">User Management</h3>
            <p className="text-gray-600">
              Easily manage user accounts, roles, and permissions with an intuitive interface
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
            <p className="text-gray-600">
              Strong password hashing and secure authentication mechanisms to protect user accounts
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
            <p className="text-gray-600">
              Control access levels with admin and user roles for granular permission management
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-20 bg-white rounded-lg shadow-md p-12">
          <h3 className="text-2xl font-bold mb-8">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">User Registration</h4>
                <p className="text-gray-600">Create new accounts with email validation and password strength requirements</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Secure Login</h4>
                <p className="text-gray-600">Authenticate with email and password using bcrypt hashing</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Profile Management</h4>
                <p className="text-gray-600">Update profile information and change passwords securely</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Admin Dashboard</h4>
                <p className="text-gray-600">View all users, activate/deactivate accounts, and manage permissions</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Pagination</h4>
                <p className="text-gray-600">Efficiently browse through user lists with pagination support</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Error Handling</h4>
                <p className="text-gray-600">Clear error messages and validation feedback for better user experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 User Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
