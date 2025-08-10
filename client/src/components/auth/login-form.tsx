import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

export default function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  
  const { login, loginLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
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
        <CardTitle className="text-2xl font-bold text-hire-secondary">Welcome Back</CardTitle>
        <p className="text-neutral-600">Sign in to access your AI assistant</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="john@example.com"
              required
              disabled={loginLoading}
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
              disabled={loginLoading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                className="rounded border-neutral-300 text-hire-primary focus:ring-hire-primary"
                disabled={loginLoading}
              />
              <span className="text-sm text-neutral-600">Remember me</span>
            </label>
            <button
              type="button"
              className="text-sm text-hire-primary hover:text-hire-secondary transition-colors"
              disabled={loginLoading}
            >
              Forgot password?
            </button>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-hire-primary to-hire-secondary text-white py-3 font-semibold hover:shadow-lg transition-all"
            disabled={loginLoading}
          >
            {loginLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Signing in...
              </>
            ) : (
              "Sign In"
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
              disabled={loginLoading}
            >
              <i className="fab fa-google text-red-500 mr-2"></i>
              Google
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center"
              disabled={loginLoading}
            >
              <i className="fab fa-github text-neutral-800 mr-2"></i>
              GitHub
            </Button>
          </div>
        </div>
        
        {onSwitchToSignup && (
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-hire-primary hover:text-hire-secondary font-medium transition-colors"
                disabled={loginLoading}
              >
                Sign up
              </button>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
