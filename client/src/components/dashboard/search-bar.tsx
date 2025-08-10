import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/auth-utils";

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  mode: string;
  createdAt: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["/api/projects/search", { q: query }],
    enabled: query.length > 2,
    onError: (error: Error) => {
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 2);
  };

  const getModeColor = (mode: string) => {
    const colors = {
      coding: "bg-blue-100 text-blue-800",
      design: "bg-purple-100 text-purple-800",
      marketing: "bg-green-100 text-green-800",
      product: "bg-orange-100 text-orange-800",
      analysis: "bg-red-100 text-red-800",
    };
    return colors[mode as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery(result.title);
    setIsOpen(false);
    // You could implement navigation to the project here
  };

  return (
    <div ref={searchRef} className="relative w-64">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search projects..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length > 2 && setIsOpen(true)}
          className="pl-10"
        />
        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"></i>
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg border">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-neutral-500">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Searching...
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {searchResults.map((result: SearchResult) => (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="p-3 hover:bg-neutral-50 cursor-pointer border-b border-neutral-100 last:border-b-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-hire-secondary text-sm truncate">
                          {result.title}
                        </h4>
                        {result.description && (
                          <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                            {result.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <Badge className={`text-xs ${getModeColor(result.mode)}`}>
                            {result.mode}
                          </Badge>
                          <span className="text-xs text-neutral-500">
                            {new Date(result.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : query.length > 2 ? (
              <div className="p-4 text-center text-neutral-500">
                <i className="fas fa-search mb-2"></i>
                <p className="text-sm">No projects found</p>
                <p className="text-xs mt-1">Try different keywords</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
