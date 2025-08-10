import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import LoginForm from "@/components/auth/login-form";
import SignupForm from "@/components/auth/signup-form";

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = "" }: NavbarProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authTab, setAuthTab] = useState("signin");

  const handleAuthSuccess = () => {
    setAuthDialogOpen(false);
  };

  return (
    <nav className={`bg-white shadow-sm border-b border-neutral-100 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-hire-primary to-hire-secondary rounded-lg flex items-center justify-center">
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <span className="text-xl font-bold text-hire-secondary">HireMe</span>
            </div>
          </Link>
          
          {/* Navigation Links - Only show on public pages */}
          {!isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#home"
                className="text-neutral-600 hover:text-hire-secondary transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Home
              </a>
              <a
                href="#features"
                className="text-neutral-600 hover:text-hire-secondary transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-neutral-600 hover:text-hire-secondary transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                How it Works
              </a>
              <a
                href="#contact"
                className="text-neutral-600 hover:text-hire-secondary transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Contact
              </a>
            </div>
          )}

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Admin Link */}
                {user?.isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      <i className="fas fa-shield-alt mr-2"></i>
                      Admin
                    </Button>
                  </Link>
                )}

                {/* User Profile */}
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
                  <Button variant="ghost" size="sm" onClick={logout} title="Logout">
                    <i className="fas fa-sign-out-alt"></i>
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Sign In Button */}
                <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-hire-secondary hover:text-hire-primary"
                      onClick={() => setAuthTab("signin")}
                    >
                      Sign In
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md p-0">
                    <DialogHeader className="sr-only">
                      <DialogTitle>Authentication</DialogTitle>
                    </DialogHeader>
                    <Tabs value={authTab} onValueChange={setAuthTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="signin" className="m-0 border-none">
                        <LoginForm
                          onSuccess={handleAuthSuccess}
                          onSwitchToSignup={() => setAuthTab("signup")}
                        />
                      </TabsContent>
                      
                      <TabsContent value="signup" className="m-0 border-none">
                        <SignupForm
                          onSuccess={handleAuthSuccess}
                          onSwitchToLogin={() => setAuthTab("signin")}
                        />
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
                
                {/* Get Started Button */}
                <Button
                  className="bg-gradient-to-r from-hire-primary to-hire-secondary text-white hover:shadow-lg"
                  onClick={() => {
                    setAuthTab("signup");
                    setAuthDialogOpen(true);
                  }}
                >
                  Get Started
                </Button>
              </>
            )}

            {/* Mobile Menu Button - Only show on public pages */}
            {!isAuthenticated && (
              <Button variant="ghost" size="sm" className="md:hidden text-neutral-600">
                <i className="fas fa-bars"></i>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
