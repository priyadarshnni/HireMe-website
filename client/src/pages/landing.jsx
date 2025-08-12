// Landing page for user authentication (login/signup)
import { useState } from "react";
import { Button } from "../components/ui/button"; // Reusable button
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"; // Card components
import LoginForm from "../components/auth/login-form"; // Login form component
import SignupForm from "../components/auth/signup-form"; // Signup form component

export default function Landing() {
  // State to track whether user wants to login or signup
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-hire-primary/10 to-hire-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* App branding section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-hire-primary to-hire-secondary rounded-lg flex items-center justify-center">
              <i className="fas fa-robot text-white text-xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-hire-secondary">HireMe</h1>
          </div>
          <p className="text-neutral-600">Your AI-powered team member</p>
        </div>

        {/* Authentication form card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isLogin ? "Welcome Back" : "Get Started"}
            </CardTitle>
            <p className="text-center text-sm text-neutral-600">
              {isLogin 
                ? "Sign in to your account to continue"
                : "Create your account to get started"
              }
            </p>
          </CardHeader>
          <CardContent>
            {/* Render login or signup form based on state */}
            {isLogin ? <LoginForm /> : <SignupForm />}
            
            {/* Toggle between login and signup */}
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-hire-primary hover:text-hire-secondary"
              >
                {isLogin ? "Sign up here" : "Sign in here"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features preview */}
        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-600 mb-4">What you'll get:</p>
          <div className="flex justify-center space-x-6 text-xs text-neutral-500">
            <div className="flex items-center">
              <i className="fas fa-code mr-1 text-hire-primary"></i>
              <span>AI Coding</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-palette mr-1 text-hire-primary"></i>
              <span>Design Help</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-chart-line mr-1 text-hire-primary"></i>
              <span>Marketing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}