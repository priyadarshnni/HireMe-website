// Homepage component with navigation cards
import { Link } from "wouter"; // Router link component
import { Button } from "../components/ui/button"; // Reusable button component
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"; // Card components
import { useAuth } from "../hooks/use-auth"; // Authentication hook

export default function Home() {
  // Get current user info and logout function
  const { user, logout } = useAuth();

  // Define navigation pages with their details
  const pages = [
    {
      title: "Dashboard",
      description: "Main workspace with AI chat, projects, and tools",
      icon: "fas fa-tachometer-alt", // FontAwesome icon class
      path: "/dashboard",
      color: "bg-blue-500"
    },
    {
      title: "AI Chat",
      description: "Direct access to AI assistance in different modes",
      icon: "fas fa-robot",
      path: "/dashboard#chat",
      color: "bg-green-500"
    },
    {
      title: "Projects",
      description: "Manage and organize your projects",
      icon: "fas fa-folder",
      path: "/dashboard#projects",
      color: "bg-purple-500"
    }
  ];

  // Add admin page if user is admin
  if (user?.isAdmin) {
    pages.push({
      title: "Admin Panel",
      description: "Administrative tools and user management",
      icon: "fas fa-shield-alt",
      path: "/admin",
      color: "bg-red-500"
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hire-primary/5 to-hire-secondary/5">
      {/* Top navigation header */}
      <header className="bg-white shadow-sm border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo section */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-hire-primary to-hire-secondary rounded-lg flex items-center justify-center">
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <span className="text-xl font-bold text-hire-secondary">HireMe</span>
            </div>
            
            {/* User info and logout */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-600">Welcome, {user?.username}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-hire-secondary mb-4">
            Welcome to HireMe
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Your AI-powered assistant platform. Choose where you'd like to go:
          </p>
        </div>

        {/* Navigation cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pages.map((page) => (
            <Link key={page.path} href={page.path}>
              <Card className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-hire-primary/30">
                <CardHeader className="text-center pb-4">
                  {/* Page icon */}
                  <div className={`w-16 h-16 ${page.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <i className={`${page.icon} text-white text-2xl`}></i>
                  </div>
                  <CardTitle className="text-hire-secondary">{page.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-neutral-600">{page.description}</p>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      Go to {page.title}
                      <i className="fas fa-arrow-right ml-2"></i>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Statistics section */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-3xl font-bold text-hire-primary mb-2">5</div>
              <div className="text-neutral-600">AI Modes Available</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-3xl font-bold text-hire-secondary mb-2">24/7</div>
              <div className="text-neutral-600">AI Assistance</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-3xl font-bold text-green-600 mb-2">Free</div>
              <div className="text-neutral-600">Gemini AI Tier</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}