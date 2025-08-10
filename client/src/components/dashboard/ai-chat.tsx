import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/auth-utils";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  mode: string;
  projectId?: string;
}

export default function AIChat({ mode, projectId }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Reset chat when mode changes
    setMessages([]);
  }, [mode]);

  const chatMutation = useMutation({
    mutationFn: async (data: { mode: string; message: string; chatHistory: Message[]; projectId?: string }) => {
      const response = await apiRequest("POST", "/api/ai/chat", data);
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
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
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    chatMutation.mutate({
      mode,
      message: inputMessage,
      chatHistory: messages,
      projectId,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getModeInfo = (mode: string) => {
    const modeMap = {
      coding: { 
        name: "Coding Assistant", 
        greeting: "Hi! I'm your AI coding assistant. I can help you with React components, debugging, code reviews, and architecture decisions. What would you like to work on?",
        color: "from-blue-400 to-blue-600"
      },
      design: { 
        name: "Design Assistant", 
        greeting: "Hello! I'm your AI design assistant. I can help with UI/UX design, color schemes, typography, and design systems. How can I assist with your design needs?",
        color: "from-purple-400 to-purple-600"
      },
      marketing: { 
        name: "Marketing Assistant", 
        greeting: "Hey there! I'm your AI marketing assistant. I can help with content creation, campaign strategies, SEO, and growth tactics. What marketing challenge can I help you solve?",
        color: "from-green-400 to-green-600"
      },
      product: { 
        name: "Product Assistant", 
        greeting: "Hi! I'm your AI product management assistant. I can help with roadmaps, feature prioritization, user research, and requirements. What product challenge are you facing?",
        color: "from-orange-400 to-orange-600"
      },
      analysis: { 
        name: "Data Analysis Assistant", 
        greeting: "Hello! I'm your AI data analysis assistant. I can help with data visualization, statistical analysis, insights generation, and predictive modeling. What data would you like to analyze?",
        color: "from-red-400 to-red-600"
      },
    };
    return modeMap[mode as keyof typeof modeMap] || modeMap.coding;
  };

  const modeInfo = getModeInfo(mode);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex space-x-3">
            <div className={`w-8 h-8 bg-gradient-to-br ${modeInfo.color} rounded-full flex items-center justify-center flex-shrink-0`}>
              <i className="fas fa-robot text-white text-xs"></i>
            </div>
            <Card className="p-3 max-w-md bg-neutral-50 border-none">
              <p className="text-sm text-neutral-800">{modeInfo.greeting}</p>
            </Card>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`flex space-x-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
            {message.role === 'assistant' && (
              <div className={`w-8 h-8 bg-gradient-to-br ${modeInfo.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                <i className="fas fa-robot text-white text-xs"></i>
              </div>
            )}
            
            <Card className={`p-3 max-w-md ${
              message.role === 'user' 
                ? 'bg-gradient-to-r from-hire-primary to-hire-secondary text-white border-none' 
                : 'bg-neutral-50 border-none'
            }`}>
              <p className={`text-sm whitespace-pre-wrap ${
                message.role === 'user' ? 'text-white' : 'text-neutral-800'
              }`}>
                {message.content}
              </p>
              <div className={`text-xs mt-2 ${
                message.role === 'user' ? 'text-white/70' : 'text-neutral-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </Card>

            {message.role === 'user' && (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-hire-primary text-white text-xs">
                  {user?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {chatMutation.isPending && (
          <div className="flex space-x-3">
            <div className={`w-8 h-8 bg-gradient-to-br ${modeInfo.color} rounded-full flex items-center justify-center flex-shrink-0`}>
              <i className="fas fa-robot text-white text-xs"></i>
            </div>
            <Card className="p-3 bg-neutral-50 border-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-neutral-200 p-4">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask your ${modeInfo.name.toLowerCase()}...`}
            className="flex-1"
            disabled={chatMutation.isPending}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || chatMutation.isPending}
            className="bg-hire-primary hover:bg-hire-primary/90"
          >
            <i className="fas fa-paper-plane"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
