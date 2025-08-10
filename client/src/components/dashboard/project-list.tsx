import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/auth-utils";

interface Project {
  id: string;
  title: string;
  description?: string;
  mode: string;
  createdAt: string;
}

interface ProjectListProps {
  onSelectProject: (project: Project | null) => void;
  selectedProject: Project | null;
}

export default function ProjectList({ onSelectProject, selectedProject }: ProjectListProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["/api/projects"],
    onError: (error: Error) => {
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

  const deleteMutation = useMutation({
    mutationFn: async (projectId: string) => {
      await apiRequest("DELETE", `/api/projects/${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      if (selectedProject) {
        onSelectProject(null);
      }
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    },
    onError: (error: Error) => {
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
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  const getModeColor = (mode: string) => {
    const colors = {
      coding: "bg-blue-100 text-blue-800",
      design: "bg-purple-100 text-purple-800",
      marketing: "bg-green-100 text-green-800",
      product: "bg-orange-100 text-orange-800",
      analysis: "bg-red-100 text-red-800",
    };
    return colors[mode as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-neutral-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-neutral-500">
        <i className="fas fa-exclamation-triangle mb-2 text-lg"></i>
        <p>Failed to load projects</p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="p-4 text-center text-neutral-500">
        <i className="fas fa-folder-open mb-2 text-2xl"></i>
        <p className="text-sm">No projects yet</p>
        <p className="text-xs mt-1">Create your first project to get started</p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="space-y-3 p-4">
        {projects.map((project: Project) => (
          <Card 
            key={project.id}
            className={`cursor-pointer transition-colors hover:shadow-md ${
              selectedProject?.id === project.id ? 'ring-2 ring-hire-primary' : ''
            }`}
            onClick={() => onSelectProject(project)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-hire-secondary truncate">{project.title}</h4>
                  {project.description && (
                    <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{project.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <Badge className={`text-xs ${getModeColor(project.mode)}`}>
                      {project.mode}
                    </Badge>
                    <span className="text-xs text-neutral-500">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("Are you sure you want to delete this project?")) {
                      deleteMutation.mutate(project.id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                >
                  <i className="fas fa-trash text-xs"></i>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
