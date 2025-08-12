// Signup form component for user registration
import { useState } from "react";
import { Button } from "../ui/button"; // Reusable button component
import { Input } from "../ui/input"; // Input field component
import { Label } from "../ui/label"; // Label component
import { useAuth } from "../../hooks/use-auth"; // Authentication hook
import { useToast } from "../../hooks/use-toast"; // Toast notification hook

export default function SignupForm({ onSuccess, onSwitchToLogin }) {
  // Form state to track user input
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  // Get signup function and loading state from auth hook
  const { signup, signupLoading } = useAuth();
  const { toast } = useToast(); // Toast for showing notifications

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    
    // Validate required fields
    if (!formData.username || !formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    // Check password length
    if (formData.password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      // Attempt signup with user data
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      
      // Show success message
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
      
      // Call success callback if provided
      onSuccess?.();
    } catch (error) {
      // Show error message if signup fails
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    }
  };

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username input field */}
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          placeholder="Choose a username"
          required
        />
      </div>

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
          placeholder="Create a password"
          required
        />
        <p className="text-xs text-neutral-500 mt-1">
          Must be at least 6 characters
        </p>
      </div>

      {/* Confirm password input field */}
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
        />
      </div>

      {/* Submit button */}
      <Button 
        type="submit" 
        className="w-full" 
        disabled={signupLoading}
      >
        {signupLoading ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Creating account...
          </>
        ) : (
          <>
            <i className="fas fa-user-plus mr-2"></i>
            Create Account
          </>
        )}
      </Button>
    </form>
  );
}