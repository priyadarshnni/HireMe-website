// AI chat component for different assistant modes
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button"; // Reusable button
import { Input } from "../ui/input"; // Input field
import { Card } from "../ui/card"; // Card component
import { Avatar, AvatarFallback } from "../ui/avatar"; // Avatar components
import { useAuth } from "../../hooks/use-auth"; // Authentication hook
import { useMutation } from "@tanstack/react-query"; // API mutations
import { apiRequest } from "../../lib/queryClient"; // API helper
import { useToast } from "../../hooks/use-toast"; // Toast notifications
import { isUnauthorizedError } from "../../lib/auth-utils"; // Auth utilities

export default function AIChat({ mode, selectedProject }) {
  // Component state for chat functionality
  const [messages, setMessages] = useState([]); // Chat messages array
  const [inputMessage, setInputMessage] = useState(""); // Current input text
  const messagesEndRef = useRef(null); // Reference for auto-scrolling
  const { user } = useAuth(); // Current user info
  const { toast } = useToast(); // Toast notifications

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clear chat history when AI mode changes
  useEffect(() => {
    setMessages([]);
  }, [mode]);

  // API mutation for sending chat messages
  const chatMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest("POST", "/api/ai/chat", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Add AI response to chat
      const assistantMessage = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
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
      
      // Handle general chat errors
      toast({
        title: "Chat Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    
    // Validate input
    if (!inputMessage.trim()) return;

    // Add user message to chat immediately
    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Prepare data for AI request
    const chatData = {
      mode,
      message: inputMessage,
      chatHistory: [...messages, userMessage],
      projectId: selectedProject?.id,
    };

    // Clear input field
    setInputMessage("");

    // Send to AI
    chatMutation.mutate(chatData);
  };

  // Get mode-specific information
  const getModeInfo = (mode) => {
    const modes = {
      coding: { name: "Coding Assistant", icon: "fas fa-code", color: "text-blue-500" },
      design: { name: "Design Assistant", icon: "fas fa-palette", color: "text-purple-500" },
      marketing: { name: "Marketing Assistant", icon: "fas fa-bullhorn", color: "text-green-500" },
      product: { name: "Product Assistant", icon: "fas fa-tasks", color: "text-orange-500" },
      analysis: { name: "Analysis Assistant", icon: "fas fa-chart-line", color: "text-red-500" },
    };
    return modes[mode] || modes.coding;
  };

  const currentMode = getModeInfo(mode);

  return (
    <Card className="h-full flex flex-col">
      {/* Chat header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <i className={`${currentMode.icon} ${currentMode.color} text-lg`}></i>
          <div>
            <h2 className="font-semibold">{currentMode.name}</h2>
            <p className="text-sm text-neutral-600">
              {selectedProject ? `Working on: ${selectedProject.title}` : "General assistance"}
            </p>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-96 max-h-96">
        {messages.length === 0 ? (
          // Welcome message when chat is empty
          <div className="text-center text-neutral-500 py-8">
            <i className={`${currentMode.icon} ${currentMode.color} text-3xl mb-3`}></i>
            <p className="text-lg font-medium mb-2">Hi! I'm your {currentMode.name}</p>
            <p className="text-sm">
              Ask me anything about {mode}. I'm here to help you build amazing things!
            </p>
          </div>
        ) : (
          // Display all chat messages
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-4xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Message avatar */}
                <Avatar className="flex-shrink-0">
                  <AvatarFallback className={message.role === 'user' ? 'bg-hire-primary text-white' : 'bg-neutral-200'}>
                    {message.role === 'user' 
                      ? user?.username?.charAt(0).toUpperCase() 
                      : <i className={currentMode.icon}></i>
                    }
                  </AvatarFallback>
                </Avatar>
                
                {/* Message content */}
                <div className={`rounded-lg p-3 ${
                  message.role === 'user' 
                    ? 'bg-hire-primary text-white ml-4' 
                    : 'bg-neutral-100 text-neutral-900'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-hire-primary/70' : 'text-neutral-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Loading indicator when AI is thinking */}
        {chatMutation.isPending && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-4xl">
              <Avatar>
                <AvatarFallback className="bg-neutral-200">
                  <i className={currentMode.icon}></i>
                </AvatarFallback>
              </Avatar>
              <div className="bg-neutral-100 rounded-lg p-3">
                <p className="text-neutral-600">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  AI is thinking...
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Auto-scroll target */}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input form */}
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask your ${currentMode.name.toLowerCase()}...`}
            disabled={chatMutation.isPending}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={chatMutation.isPending || !inputMessage.trim()}
          >
            {chatMutation.isPending ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-paper-plane"></i>
            )}
          </Button>
        </form>
        
        {/* Input hint */}
        <p className="text-xs text-neutral-500 mt-2">
          Press Enter to send, or click the send button
        </p>
      </div>
    </Card>
  );
}