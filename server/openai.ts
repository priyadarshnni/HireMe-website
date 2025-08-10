import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "your-openai-api-key"
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

export class AIService {
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
      
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
        ...chatHistory.map(msg => ({
          role: msg.role as "user" | "assistant",
          content: msg.content
        })),
        { role: "user", content: userMessage }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      const assistantMessage = response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

      return {
        message: assistantMessage,
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
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
      const prompt = `As an AI assistant in ${mode} mode, generate helpful project notes for a project titled "${title}" with description: "${description}". Provide structured notes including key considerations, recommendations, and next steps. Format as JSON with sections: overview, keyPoints, recommendations, nextSteps.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: this.getModeSystemPrompt(mode) },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800,
      });

      return response.choices[0]?.message?.content || '{"overview": "Project notes generation failed", "keyPoints": [], "recommendations": [], "nextSteps": []}';
    } catch (error) {
      console.error('OpenAI API error for project notes:', error);
      return '{"overview": "Unable to generate project notes", "keyPoints": [], "recommendations": [], "nextSteps": []}';
    }
  }

  async analyzeUserQuery(query: string): Promise<{
    intent: string;
    mode: string;
    confidence: number;
  }> {
    try {
      const prompt = `Analyze this user query and determine the most appropriate AI assistance mode. Query: "${query}". Respond with JSON containing: intent (what the user wants), mode (coding/design/marketing/product/analysis), confidence (0-1).`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: "You are an intent analysis system. Analyze user queries and determine the most appropriate assistance mode." 
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 200,
      });

      const result = JSON.parse(response.choices[0]?.message?.content || '{}');
      return {
        intent: result.intent || 'general assistance',
        mode: result.mode || 'coding',
        confidence: result.confidence || 0.5,
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

export const aiService = new AIService();
