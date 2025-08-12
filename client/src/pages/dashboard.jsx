// Main dashboard page with AI chat and project management
import { useState } from "react";
import { useAuth } from "../hooks/use-auth"; // Authentication hook
import { Button } from "../components/ui/button"; // Reusable button
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"; // Card components
import { Input } from "../components/ui/input"; // Input field
import { Avatar, AvatarFallback } from "../components/ui/avatar"; // Avatar components
import { Badge } from "../components/ui/badge"; // Badge component
import { Link, useLocation } from "wouter"; // Router components
import AIChat from "../components/dashboard/ai-chat"; // AI chat component
import ProjectList from "../components/dashboard/project-list"; // Project list component
import ProjectForm from "../components/dashboard/project-form"; // Project form component
import SearchBar from "../components/dashboard/search-bar"; // Search component

export default function Dashboard() {
  // Get user data and logout function
  const { user, logout } = useAuth();
  const [location, navigate] = useLocation(); // Router navigation
  
  // Component state management
  const [selectedMode, setSelectedMode] = useState("coding"); // Current AI mode
  const [showProjectForm, setShowProjectForm] = useState(false); // Show/hide project form
  const [selectedProject, setSelectedProject] = useState(null); // Currently selected project

  // Define AI assistant modes with their properties
  const modes = [
    { id: "coding", name: "Coding", icon: "fas fa-code", color: "bg-blue-500" },
    { id: "design", name: "Design", icon: "fas fa-palette", color: "bg-purple-500" },
    { id: "marketing", name: "Marketing", icon: "fas fa-bullhorn", color: "bg-green-500" },
    { id: "product", name: "Product", icon: "fas fa-tasks", color: "bg-orange-500" },
    { id: "analysis", name: "Analysis", icon: "fas fa-chart-line", color: "bg-red-500" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top navigation header */}
      <header className="bg-white shadow-sm border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side: Home button and logo */}
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-hire-primary hover:text-hire-secondary">
                  <i className="fas fa-arrow-left mr-2"></i>
                  Home
                </Button>
              </Link>
              
              {/* Visual separator */}
              <div className="w-px h-6 bg-neutral-200"></div>
              
              {/* Dashboard logo - clicking resets the dashboard */}
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={() => {
                  // Reset dashboard state when logo is clicked
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setSelectedProject(null);
                  setShowProjectForm(false);
                  setSelectedMode("coding");
                }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-hire-primary to-hire-secondary rounded-lg flex items-center justify-center">
                  <i className="fas fa-robot text-white text-sm"></i>
                </div>
                <span className="text-xl font-bold text-hire-secondary">Dashboard</span>
              </div>
            </div>
            
            {/* Right side: Search, admin button, and user menu */}
            <div className="flex items-center space-x-4">
              <SearchBar />
              
              {/* Admin button - only show if user is admin */}
              {user?.isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    <i className="fas fa-shield-alt mr-2"></i>
                    Admin
                  </Button>
                </Link>
              )}

              {/* User profile section */}
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-hire-primary text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                  <Badge variant="secondary" className="text-xs">
                    {user?.isAdmin ? "Admin" : "User"}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <i className="fas fa-sign-out-alt"></i>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main dashboard content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left sidebar - AI Modes */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-robot mr-2 text-hire-primary"></i>
                  AI Assistant Modes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {modes.map((mode) => (
                    <Button
                      key={mode.id}
                      variant={selectedMode === mode.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedMode(mode.id)}
                    >
                      <i className={`${mode.icon} mr-2`}></i>
                      {mode.name}
                    </Button>
                  ))}
                </div>
                
                {/* Mode description */}
                <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-600">
                    Current mode: <strong>{modes.find(m => m.id === selectedMode)?.name}</strong>
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    The AI will provide specialized assistance based on your selected mode.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Projects section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    <i className="fas fa-folder mr-2 text-hire-primary"></i>
                    Projects
                  </span>
                  <Button 
                    size="sm" 
                    onClick={() => setShowProjectForm(true)}
                  >
                    <i className="fas fa-plus mr-1"></i>
                    New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectList 
                  selectedProject={selectedProject}
                  onSelectProject={setSelectedProject}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right side - AI Chat */}
          <div className="lg:col-span-2">
            <AIChat 
              mode={selectedMode}
              selectedProject={selectedProject}
            />
          </div>
        </div>
      </div>

      {/* Project form modal */}
      {showProjectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <ProjectForm 
              onClose={() => setShowProjectForm(false)}
              onSuccess={() => {
                setShowProjectForm(false);
                // Refresh projects list here if needed
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}