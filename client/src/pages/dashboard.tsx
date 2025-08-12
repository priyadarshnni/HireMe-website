import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import AIChat from "@/components/dashboard/ai-chat";
import ProjectList from "@/components/dashboard/project-list";
import ProjectForm from "@/components/dashboard/project-form";
import SearchBar from "@/components/dashboard/search-bar";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [location, navigate] = useLocation();
  const [selectedMode, setSelectedMode] = useState("coding");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const modes = [
    { id: "coding", name: "Coding", icon: "fas fa-code", color: "bg-blue-500" },
    { id: "design", name: "Design", icon: "fas fa-palette", color: "bg-purple-500" },
    { id: "marketing", name: "Marketing", icon: "fas fa-bullhorn", color: "bg-green-500" },
    { id: "product", name: "Product", icon: "fas fa-tasks", color: "bg-orange-500" },
    { id: "analysis", name: "Analysis", icon: "fas fa-chart-line", color: "bg-red-500" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-hire-primary hover:text-hire-secondary">
                  <i className="fas fa-arrow-left mr-2"></i>
                  Home
                </Button>
              </Link>
              
              <div className="w-px h-6 bg-neutral-200"></div>
              
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={() => {
                  // Reset dashboard state
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
            
            <div className="flex items-center space-x-4">
              <SearchBar />
              
              {user?.isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    <i className="fas fa-shield-alt mr-2"></i>
                    Admin
                  </Button>
                </Link>
              )}

              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-hire-primary text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-hire-secondary">{user?.username}</p>
                  <p className="text-xs text-neutral-500">{user?.email}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <i className="fas fa-sign-out-alt"></i>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Projects Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Projects</CardTitle>
                  <Button 
                    size="sm" 
                    onClick={() => setShowProjectForm(true)}
                    className="bg-hire-primary hover:bg-hire-primary/90"
                  >
                    <i className="fas fa-plus mr-1"></i>
                    New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ProjectList 
                  onSelectProject={setSelectedProject}
                  selectedProject={selectedProject}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[80vh]">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">AI Assistant</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-neutral-600">Online</span>
                  </div>
                </div>
                
                {/* Mode Selection */}
                <div className="flex space-x-2 overflow-x-auto">
                  {modes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedMode(mode.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedMode === mode.id
                          ? 'bg-hire-primary text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      <i className={mode.icon}></i>
                      <span>{mode.name}</span>
                    </button>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent className="p-0 h-full">
                <AIChat 
                  mode={selectedMode}
                  projectId={selectedProject?.id}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Project Form Modal */}
      {showProjectForm && (
        <ProjectForm 
          onClose={() => setShowProjectForm(false)}
          onSuccess={() => {
            setShowProjectForm(false);
          }}
        />
      )}
    </div>
  );
}
