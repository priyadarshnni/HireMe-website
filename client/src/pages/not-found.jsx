// 404 error page component
import { Link } from "wouter"; // Router link
import { Button } from "../components/ui/button"; // Reusable button

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-hire-primary/5 to-hire-secondary/5 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Large 404 display */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-hire-primary/20">404</h1>
          <h2 className="text-2xl font-bold text-hire-secondary mt-4">Page Not Found</h2>
          <p className="text-neutral-600 mt-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Navigation options */}
        <div className="space-y-4">
          <Link href="/">
            <Button className="bg-hire-primary hover:bg-hire-primary/90">
              <i className="fas fa-home mr-2"></i>
              Go Home
            </Button>
          </Link>
          
          {/* Go back button using browser history */}
          <div>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Go Back
            </Button>
          </div>
        </div>

        {/* Helpful links */}
        <div className="mt-8 text-sm text-neutral-500">
          <p>Need help? Here are some useful links:</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/" className="hover:text-hire-primary">Home</Link>
            <Link href="/dashboard" className="hover:text-hire-primary">Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}