import { GoogleGenAI } from "@google/genai";

// Google Gemini AI integration - free tier available
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || ""
});

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIResponse {
  message: string;
  suggestions?: string[];
  analysis?: any;
}

export class GeminiAIService {
  private getModeSystemPrompt(mode: string): string {
    const prompts = {
      coding: "You are an expert software engineer and coding assistant. Help with code reviews, debugging, architecture decisions, and implementation across multiple programming languages. Provide clear, practical solutions with code examples when appropriate.",
      design: "You are a professional UI/UX designer and design system expert. Help with visual design, user experience, color palettes, typography, layout, and design system creation. Provide actionable design guidance and recommendations.",
      marketing: "You are a strategic marketing expert and content creator. Help with marketing strategies, content creation, copywriting, campaign development, SEO optimization, and growth tactics. Provide data-driven marketing insights.",
      product: "You are an experienced product manager and strategy consultant. Help with product roadmaps, feature prioritization, requirements documentation, user research, and product lifecycle management. Provide strategic product guidance.",
      analysis: "You are a data scientist and business analyst expert. Help with data analysis, statistical modeling, data visualization, insights generation, and predictive analytics. Provide clear, actionable data insights."
    };
    
    return prompts[mode as keyof typeof prompts] || prompts.coding;
  }

  async generateResponse(
    mode: string,
    userMessage: string,
    chatHistory: AIMessage[] = []
  ): Promise<AIResponse> {
    try {
      const systemPrompt = this.getModeSystemPrompt(mode);
      
      // Build conversation history for context
      let conversationContext = `${systemPrompt}\n\nConversation history:\n`;
      chatHistory.forEach(msg => {
        conversationContext += `${msg.role}: ${msg.content}\n`;
      });
      conversationContext += `user: ${userMessage}\n\nPlease respond as the assistant:`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: conversationContext,
      });

      const assistantMessage = response.text || "I apologize, but I couldn't generate a response. Please try again.";

      return {
        message: assistantMessage,
      };
    } catch (error: any) {
      console.error('Gemini API error:', error);
      
      if (error?.status === 429) {
        return {
          message: "I've reached my usage limit. Please try again in a moment or check your Gemini API quota.",
        };
      }
      
      if (error?.status === 401 || error?.message?.includes('API key')) {
        return {
          message: "There's an issue with the Gemini API key. Please check that your GEMINI_API_KEY is configured correctly.",
        };
      }
      
      if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_AI_API_KEY) {
        return {
          message: "Gemini AI is not configured. Please set up your GEMINI_API_KEY to use AI features.",
        };
      }
      
      return {
        message: "I'm experiencing technical difficulties. Please try again in a moment.",
      };
    }
  }

  async generateProjectNotes(
    mode: string,
    title: string,
    description: string
  ): Promise<string> {
    try {
      const systemPrompt = this.getModeSystemPrompt(mode);
      const prompt = `${systemPrompt}\n\nGenerate helpful project notes for a project titled "${title}" with description: "${description}". Provide structured notes including key considerations, recommendations, and next steps. Format as JSON with sections: overview, keyPoints, recommendations, nextSteps.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const content = response.text || "";
      
      // Try to extract JSON from the response
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          JSON.parse(jsonMatch[0]); // Validate JSON
          return jsonMatch[0];
        }
      } catch (parseError) {
        // If JSON parsing fails, create a structured response
      }

      // Fallback: create structured JSON from the text response
      return JSON.stringify({
        overview: content.slice(0, 200) + "...",
        keyPoints: ["Review project requirements", "Plan implementation approach"],
        recommendations: ["Start with core features", "Implement iteratively"],
        nextSteps: ["Define technical specifications", "Set up development environment"]
      });

    } catch (error: any) {
      console.error('Gemini API error for project notes:', error);
      
      if (error?.status === 429) {
        return '{"overview": "Gemini usage limit reached. Please try again later.", "keyPoints": [], "recommendations": [], "nextSteps": []}';
      }
      
      return '{"overview": "Unable to generate project notes", "keyPoints": [], "recommendations": [], "nextSteps": []}';
    }
  }

  async analyzeUserQuery(query: string): Promise<{
    intent: string;
    mode: string;
    confidence: number;
  }> {
    try {
      const prompt = `Analyze this user query and determine the most appropriate AI assistance mode. Query: "${query}". 

Available modes:
- coding: Programming, debugging, code review, software development
- design: UI/UX design, visual design, user experience
- marketing: Marketing strategy, content creation, campaigns
- product: Product management, roadmaps, requirements
- analysis: Data analysis, statistics, insights

Respond with JSON containing: intent (what the user wants), mode (one of the 5 modes above), confidence (0-1).

Example: {"intent": "help with debugging code", "mode": "coding", "confidence": 0.9}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const content = response.text || "";
      
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          return {
            intent: result.intent || 'general assistance',
            mode: result.mode || 'coding',
            confidence: result.confidence || 0.5,
          };
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
      }

      return {
        intent: 'general assistance',
        mode: 'coding',
        confidence: 0.5,
      };
    } catch (error) {
      console.error('Query analysis error:', error);
      return {
        intent: 'general assistance',
        mode: 'coding',
        confidence: 0.5,
      };
    }
  }
}

export const aiService = new GeminiAIService();