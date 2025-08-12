// Main app component that handles routing and authentication
import { Switch, Route } from "wouter"; // Router for page navigation
import { queryClient } from "./lib/queryClient"; // API data management
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster"; // Toast notifications
import { TooltipProvider } from "./components/ui/tooltip"; // Tooltip support
import { useAuth } from "./hooks/use-auth"; // Custom hook for authentication
import Landing from "./pages/landing"; // Login/signup page
import Home from "./pages/home"; // Main homepage
import Dashboard from "./pages/dashboard"; // User dashboard
import Admin from "./pages/admin"; // Admin panel
import NotFound from "./pages/not-found"; // 404 page

function App() {
  return (
    // Provide React Query for API calls throughout the app
    <QueryClientProvider client={queryClient}>
      {/* Enable tooltips throughout the app */}
      <TooltipProvider>
        <AppContent />
        {/* Toast notification container */}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  // Get authentication state and user info
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hire-primary mx-auto"></div>
          <p className="mt-2 text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Define page routes based on authentication status
  return (
    <Switch>
      {!isAuthenticated ? (
        // Show landing page if not logged in
        <Route path="/" component={Landing} />
      ) : (
        // Show authenticated pages if logged in
        <>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          {/* Only show admin page if user is admin */}
          {user?.isAdmin && <Route path="/admin" component={Admin} />}
        </>
      )}
      {/* Catch-all route for 404 errors */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;