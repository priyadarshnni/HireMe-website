// Project list component for managing user projects
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "../ui/card"; // Card components
import { Button } from "../ui/button"; // Reusable button
import { Badge } from "../ui/badge"; // Badge component
import { apiRequest } from "../../lib/queryClient"; // API helper
import { useToast } from "../../hooks/use-toast"; // Toast notifications
import { isUnauthorizedError } from "../../lib/auth-utils"; // Auth utilities

export default function ProjectList({ onSelectProject, selectedProject }) {
  // React Query client for cache management
  const queryClient = useQueryClient();
  const { toast } = useToast(); // Toast notifications

  // Fetch user's projects from API
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["/api/projects"], // Cache key for projects
    onError: (error) => {
      // Handle authentication errors
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

  // Mutation for deleting projects
  const deleteMutation = useMutation({
    mutationFn: async (projectId) => {
      await apiRequest("DELETE", `/api/projects/${projectId}`);
    },
    onSuccess: () => {
      // Refresh projects list after deletion
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      
      // Clear selection if deleted project was selected
      if (selectedProject) {
        onSelectProject(null);
      }
      
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  // Handle project deletion with confirmation
  const handleDeleteProject = (projectId, projectTitle) => {
    if (window.confirm(`Are you sure you want to delete "${projectTitle}"?`)) {
      deleteMutation.mutate(projectId);
    }
  };

  // Get mode-specific styling
  const getModeStyle = (mode) => {
    const styles = {
      coding: "bg-blue-500",
      design: "bg-purple-500", 
      marketing: "bg-green-500",
      product: "bg-orange-500",
      analysis: "bg-red-500",
    };
    return styles[mode] || "bg-neutral-500";
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <i className="fas fa-spinner fa-spin text-xl text-neutral-400"></i>
        <p className="mt-2 text-neutral-600 text-sm">Loading projects...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        <i className="fas fa-exclamation-triangle text-xl mb-2"></i>
        <p className="text-sm">Failed to load projects</p>
      </div>
    );
  }

  // Show empty state
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-8">
        <i className="fas fa-folder-open text-4xl text-neutral-300 mb-3"></i>
        <p className="text-neutral-600">No projects yet</p>
        <p className="text-sm text-neutral-500">Create your first project to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <Card 
          key={project.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedProject?.id === project.id 
              ? 'ring-2 ring-hire-primary border-hire-primary' 
              : 'hover:border-hire-primary/30'
          }`}
          onClick={() => onSelectProject(project)}
        >
          <CardContent className="p-4">
            {/* Project header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {/* Mode indicator dot */}
                <div className={`w-3 h-3 ${getModeStyle(project.mode)} rounded-full`}></div>
                <h4 className="font-medium text-sm">{project.title}</h4>
              </div>
              
              {/* Delete button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card selection
                  handleDeleteProject(project.id, project.title);
                }}
                disabled={deleteMutation.isPending}
                className="h-6 w-6 p-0 text-neutral-400 hover:text-red-500"
              >
                {deleteMutation.isPending ? (
                  <i className="fas fa-spinner fa-spin text-xs"></i>
                ) : (
                  <i className="fas fa-trash text-xs"></i>
                )}
              </Button>
            </div>

            {/* Project description */}
            {project.description && (
              <p className="text-xs text-neutral-600 mb-2 line-clamp-2">
                {project.description}
              </p>
            )}

            {/* Project metadata */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {project.mode}
              </Badge>
              
              <span className="text-xs text-neutral-500">
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Selection indicator */}
            {selectedProject?.id === project.id && (
              <div className="mt-2 flex items-center text-xs text-hire-primary">
                <i className="fas fa-check-circle mr-1"></i>
                Selected for AI chat
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}