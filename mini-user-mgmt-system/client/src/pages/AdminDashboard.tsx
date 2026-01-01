import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

// Dummy users data
const DUMMY_USERS = Array.from({ length: 23 }).map((_, i) => ({
  id: i + 1,
  email: `user${i + 1}@example.com`,
  name: `User ${i + 1}`,
  role: i % 5 === 0 ? "admin" : "user",
  status: i % 3 === 0 ? "inactive" : "active",
}));

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [usersData, setUsersData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching data
  useEffect(() => {
    setIsLoading(true);
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setTimeout(() => {
      setUsersData(DUMMY_USERS.slice(start, end));
      setIsLoading(false);
    }, 500);
  }, [currentPage]);

  const totalPages = Math.ceil(DUMMY_USERS.length / pageSize);

  const handleActivate = (userId: number) => {
    toast.success(`User ${userId} activated`);
    setUsersData((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: "active" } : u))
    );
  };

  const handleDeactivate = (userId: number) => {
    toast.success(`User ${userId} deactivated`);
    setUsersData((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: "inactive" } : u))
    );
  };

  const handleLogout = () => {
    toast.success("Logged out!");
    setLocation("/login");
  };

  // Simulate current user as admin
  const user = { name: "Admin User", role: "admin" };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.name}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Total users: {DUMMY_USERS.length}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="animate-spin" />
              </div>
            ) : usersData.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersData.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.email}</TableCell>
                          <TableCell>{user.name || "-"}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-sm ${
                              user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                            }`}>
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-sm ${
                              user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {user.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {user.status === "active" ? (
                                <Button variant="outline" size="sm" onClick={() => handleDeactivate(user.id)}>
                                  Deactivate
                                </Button>
                              ) : (
                                <Button variant="outline" size="sm" onClick={() => handleActivate(user.id)}>
                                  Activate
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">No users found</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
