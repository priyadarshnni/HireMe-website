import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export default function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  
  const { signup, signupLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Validation Error",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    try {
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
      
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-hire-primary to-hire-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-robot text-white text-2xl"></i>
        </div>
        <CardTitle className="text-2xl font-bold text-hire-secondary">Join HireMe</CardTitle>
        <p className="text-neutral-600">Create your account to get started</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="johndoe"
              required
              disabled={signupLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="john@example.com"
              required
              disabled={signupLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="••••••••"
              required
              disabled={signupLoading}
            />
            <p className="text-xs text-neutral-500 mt-1">Must be at least 6 characters</p>
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              placeholder="••••••••"
              required
              disabled={signupLoading}
            />
          </div>
          
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
              className="rounded border-neutral-300 text-hire-primary focus:ring-hire-primary mt-1"
              disabled={signupLoading}
              required
            />
            <label className="text-sm text-neutral-600">
              I agree to the{" "}
              <a href="#" className="text-hire-primary hover:text-hire-secondary">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-hire-primary hover:text-hire-secondary">
                Privacy Policy
              </a>
            </label>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-hire-primary to-hire-secondary text-white py-3 font-semibold hover:shadow-lg transition-all"
            disabled={signupLoading}
          >
            {signupLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="flex items-center justify-center"
              disabled={signupLoading}
            >
              <i className="fab fa-google text-red-500 mr-2"></i>
              Google
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center"
              disabled={signupLoading}
            >
              <i className="fab fa-github text-neutral-800 mr-2"></i>
              GitHub
            </Button>
          </div>
        </div>
        
        {onSwitchToLogin && (
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-hire-primary hover:text-hire-secondary font-medium transition-colors"
                disabled={signupLoading}
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
