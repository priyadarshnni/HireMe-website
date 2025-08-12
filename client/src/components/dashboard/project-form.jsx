// Project creation form component
import { useState } from "react";
import { Button } from "../ui/button"; // Reusable button
import { Input } from "../ui/input"; // Input field
import { Label } from "../ui/label"; // Label component
import { Textarea } from "../ui/textarea"; // Textarea component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"; // Select dropdown
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"; // Card components
import { useMutation, useQueryClient } from "@tanstack/react-query"; // API management
import { apiRequest } from "../../lib/queryClient"; // API helper
import { useToast } from "../../hooks/use-toast"; // Toast notifications
import { isUnauthorizedError } from "../../lib/auth-utils"; // Auth utilities

export default function ProjectForm({ onClose, onSuccess }) {
  // Form state management
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mode: "", // AI mode for the project
  });

  // React Query setup
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Available AI modes
  const modes = [
    { id: "coding", name: "Coding", icon: "fas fa-code" },
    { id: "design", name: "Design", icon: "fas fa-palette" },
    { id: "marketing", name: "Marketing", icon: "fas fa-bullhorn" },
    { id: "product", name: "Product", icon: "fas fa-tasks" },
    { id: "analysis", name: "Analysis", icon: "fas fa-chart-line" },
  ];

  // API mutation for creating projects
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
    onSuccess: () => {
      // Refresh projects list after creation
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      
      toast({
        title: "Success",
        description: "Project created successfully with AI-generated notes!",
      });
      
      onSuccess(); // Call parent success handler
    },
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
      
      // Handle general creation errors
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    
    // Validate required fields
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Project title is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.mode) {
      toast({
        title: "Validation Error", 
        description: "Please select an AI mode",
        variant: "destructive",
      });
      return;
    }

    // Submit the form
    createMutation.mutate(formData);
  };

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            <i className="fas fa-plus mr-2 text-hire-primary"></i>
            Create New Project
          </span>
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <i className="fas fa-times"></i>
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Project title */}
          <div>
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter project title"
              required
            />
          </div>

          {/* Project description */}
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Briefly describe your project"
              rows={3}
            />
          </div>

          {/* AI mode selection */}
          <div>
            <Label htmlFor="mode">AI Assistant Mode</Label>
            <Select value={formData.mode} onValueChange={(value) => handleChange('mode', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose AI mode for this project" />
              </SelectTrigger>
              <SelectContent>
                {modes.map((mode) => (
                  <SelectItem key={mode.id} value={mode.id}>
                    <div className="flex items-center">
                      <i className={`${mode.icon} mr-2`}></i>
                      {mode.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-neutral-500 mt-1">
              This determines the type of AI assistance you'll receive for this project
            </p>
          </div>

          {/* Form buttons */}
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-plus mr-2"></i>
                  Create Project
                </>
              )}
            </Button>
          </div>
        </form>
        
        {/* Form help text */}
        <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
          <p className="text-xs text-neutral-600">
            <i className="fas fa-lightbulb mr-1 text-yellow-500"></i>
            <strong>Tip:</strong> The AI will automatically generate helpful notes and suggestions for your project based on the selected mode.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}