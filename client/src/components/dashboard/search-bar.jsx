// Search bar component for finding projects
import { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input"; // Input field
import { Card, CardContent } from "../ui/card"; // Card components
import { Badge } from "../ui/badge"; // Badge component
import { useQuery } from "@tanstack/react-query"; // Data fetching
import { apiRequest } from "../../lib/queryClient"; // API helper
import { useToast } from "../../hooks/use-toast"; // Toast notifications
import { isUnauthorizedError } from "../../lib/auth-utils"; // Auth utilities

export default function SearchBar() {
  // Component state
  const [query, setQuery] = useState(""); // Search query text
  const [isOpen, setIsOpen] = useState(false); // Dropdown visibility
  const searchRef = useRef(null); // Reference for click outside detection
  const { toast } = useToast(); // Toast notifications

  // Search API call - only triggers when query is 3+ characters
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["/api/projects/search", { q: query }],
    enabled: query.length > 2, // Only search with meaningful input
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
    },
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 2); // Show results when search is meaningful
  };

  // Handle search result selection
  const handleResultSelect = (result) => {
    setQuery(result.title); // Fill input with selected title
    setIsOpen(false); // Close dropdown
    
    // Show success message
    toast({
      title: "Project Selected",
      description: `Selected: ${result.title}`,
    });
  };

  // Get mode-specific styling
  const getModeStyle = (mode) => {
    const styles = {
      coding: "bg-blue-500",
      design: "bg-purple-500",
      marketing: "bg-green-500", 
      product: "bg-orange-500",
      analysis: "bg-red-500",
    };
    return styles[mode] || "bg-neutral-500";
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search input */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search projects..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(query.length > 2)}
          className="pl-10 w-64"
        />
        {/* Search icon */}
        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"></i>
        
        {/* Loading indicator */}
        {isLoading && (
          <i className="fas fa-spinner fa-spin absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400"></i>
        )}
      </div>

      {/* Search results dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 z-50">
          <Card className="shadow-lg">
            <CardContent className="p-0 max-h-64 overflow-y-auto">
              
              {/* Show loading state */}
              {isLoading && (
                <div className="p-4 text-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  <span className="text-sm text-neutral-600">Searching...</span>
                </div>
              )}

              {/* Show results */}
              {!isLoading && searchResults && (
                <>
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((result) => (
                        <div
                          key={result.id}
                          className="px-4 py-2 hover:bg-neutral-50 cursor-pointer"
                          onClick={() => handleResultSelect(result)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {/* Mode indicator */}
                              <div className={`w-2 h-2 ${getModeStyle(result.mode)} rounded-full`}></div>
                              <span className="font-medium text-sm">{result.title}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {result.mode}
                            </Badge>
                          </div>
                          
                          {/* Description if available */}
                          {result.description && (
                            <p className="text-xs text-neutral-600 mt-1 line-clamp-1 ml-4">
                              {result.description}
                            </p>
                          )}
                          
                          {/* Date */}
                          <p className="text-xs text-neutral-500 mt-1 ml-4">
                            Created: {new Date(result.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // No results found
                    <div className="p-4 text-center">
                      <i className="fas fa-search text-neutral-300 text-xl mb-2"></i>
                      <p className="text-sm text-neutral-600">No projects found</p>
                      <p className="text-xs text-neutral-500">Try a different search term</p>
                    </div>
                  )}
                </>
              )}

              {/* Search hint */}
              <div className="border-t border-neutral-100 p-3 bg-neutral-50">
                <p className="text-xs text-neutral-500 text-center">
                  <i className="fas fa-lightbulb mr-1"></i>
                  Type 3+ characters to search your projects
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}