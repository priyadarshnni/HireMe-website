// Login form component for user authentication
import { useState } from "react";
import { Button } from "../ui/button"; // Reusable button component
import { Input } from "../ui/input"; // Input field component
import { Label } from "../ui/label"; // Label component
import { useAuth } from "../../hooks/use-auth"; // Authentication hook
import { useToast } from "../../hooks/use-toast"; // Toast notification hook

export default function LoginForm({ onSuccess, onSwitchToSignup }) {
  // Form state to track user input
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  
  // Get login function and loading state from auth hook
  const { login, loginLoading } = useAuth();
  const { toast } = useToast(); // Toast for showing notifications

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    
    // Validate required fields
    if (!formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Attempt login with user credentials
      await login({
        email: formData.email,
        password: formData.password,
      });
      
      // Show success message
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      
      // Call success callback if provided
      onSuccess?.();
    } catch (error) {
      // Show error message if login fails
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email input field */}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
      </div>

      {/* Password input field */}
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />
      </div>

      {/* Remember me checkbox */}
      <div className="flex items-center space-x-2">
        <input
          id="rememberMe"
          name="rememberMe"
          type="checkbox"
          checked={formData.rememberMe}
          onChange={handleChange}
          className="rounded"
        />
        <Label htmlFor="rememberMe" className="text-sm">Remember me</Label>
      </div>

      {/* Submit button */}
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loginLoading}
      >
        {loginLoading ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Signing in...
          </>
        ) : (
          <>
            <i className="fas fa-sign-in-alt mr-2"></i>
            Sign In
          </>
        )}
      </Button>
    </form>
  );
}