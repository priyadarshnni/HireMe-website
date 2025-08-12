// Admin panel page for user and system management
import { useEffect } from "react";
import { useAuth } from "../hooks/use-auth"; // Authentication hook
import { useQuery } from "@tanstack/react-query"; // Data fetching
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"; // Card components
import { Button } from "../components/ui/button"; // Reusable button
import { Badge } from "../components/ui/badge"; // Badge component
import { Avatar, AvatarFallback } from "../components/ui/avatar"; // Avatar components
import { Link } from "wouter"; // Router link
import { useToast } from "../hooks/use-toast"; // Toast notifications
import { isUnauthorizedError } from "../lib/auth-utils"; // Auth utility functions

export default function Admin() {
  // Get current user info
  const { user } = useAuth();
  const { toast } = useToast(); // Toast for notifications

  // Fetch admin statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  // Fetch all users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    onError: (error) => {
      // Handle unauthorized access
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
        return;
      }
    },
  });

  // Fetch all projects
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/admin/projects"],
  });

  // Check admin access on component mount
  useEffect(() => {
    if (!user?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  // Show access denied message if user is not admin
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <i className="fas fa-shield-alt text-red-500 text-4xl mb-4"></i>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
              <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
              <Link href="/">
                <Button>Return to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Admin header */}
      <header className="bg-white shadow-sm border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side: Home button and admin logo */}
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-hire-primary hover:text-hire-secondary">
                  <i className="fas fa-arrow-left mr-2"></i>
                  Home
                </Button>
              </Link>
              
              {/* Visual separator */}
              <div className="w-px h-6 bg-neutral-200"></div>
              
              {/* Admin panel branding */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-shield-alt text-white text-sm"></i>
                </div>
                <span className="text-xl font-bold text-hire-secondary">Admin Panel</span>
              </div>
            </div>

            {/* Right side: Admin user info */}
            <div className="flex items-center space-x-4">
              <Badge variant="destructive">Admin Access</Badge>
              <Avatar>
                <AvatarFallback className="bg-red-500 text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main admin content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-users mr-2 text-blue-500"></i>
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {statsLoading ? "..." : stats?.totalUsers || 0}
              </div>
              <p className="text-sm text-neutral-600">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-folder mr-2 text-green-500"></i>
                Total Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {statsLoading ? "..." : stats?.totalProjects || 0}
              </div>
              <p className="text-sm text-neutral-600">Created projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-comments mr-2 text-purple-500"></i>
                Chat Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {statsLoading ? "..." : stats?.totalChatSessions || 0}
              </div>
              <p className="text-sm text-neutral-600">AI conversations</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Users management */}
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="text-center py-4">
                  <i className="fas fa-spinner fa-spin text-xl text-neutral-400"></i>
                  <p className="mt-2 text-neutral-600">Loading users...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {user.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-sm text-neutral-600">{user.email}</p>
                          </div>
                        </div>
                        <Badge variant={user.isAdmin ? "destructive" : "secondary"}>
                          {user.isAdmin ? "Admin" : "User"}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-neutral-600 text-center py-4">No users found</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Projects management */}
          <Card>
            <CardHeader>
              <CardTitle>Project Management</CardTitle>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="text-center py-4">
                  <i className="fas fa-spinner fa-spin text-xl text-neutral-400"></i>
                  <p className="mt-2 text-neutral-600">Loading projects...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects && projects.length > 0 ? (
                    projects.map((project) => (
                      <div key={project.id} className="p-3 bg-neutral-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{project.title}</h4>
                          <Badge variant="outline">{project.status}</Badge>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{project.description}</p>
                        <p className="text-xs text-neutral-500 mt-2">
                          Owner: {project.ownerUsername || "Unknown"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-neutral-600 text-center py-4">No projects found</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}