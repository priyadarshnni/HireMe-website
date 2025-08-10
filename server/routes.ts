import type { Express } from "express";
import { createServer, type Server } from "http";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { aiService } from "./openai";
import { insertUserSchema, insertProjectSchema, insertChatSessionSchema } from "@shared/schema";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key-change-in-production";

// Auth middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Admin middleware
const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(validatedData.email) || 
                          await storage.getUserByUsername(validatedData.username);
      
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      // Generate JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(400).json({ message: 'Invalid user data' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  app.get('/api/auth/me', authenticateToken, (req: any, res) => {
    res.json({
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
    });
  });

  // Project routes
  app.get('/api/projects', authenticateToken, async (req: any, res) => {
    try {
      const projects = await storage.getProjectsByUser(req.user.id);
      res.json(projects);
    } catch (error) {
      console.error('Get projects error:', error);
      res.status(500).json({ message: 'Failed to fetch projects' });
    }
  });

  app.post('/api/projects', authenticateToken, async (req: any, res) => {
    try {
      const validatedData = insertProjectSchema.parse({
        ...req.body,
        userId: req.user.id,
      });

      // Generate AI notes for the project
      const aiNotes = await aiService.generateProjectNotes(
        validatedData.mode,
        validatedData.title,
        validatedData.description || ''
      );

      const project = await storage.createProject({
        ...validatedData,
        notes: aiNotes,
      });

      res.json(project);
    } catch (error) {
      console.error('Create project error:', error);
      res.status(400).json({ message: 'Invalid project data' });
    }
  });

  app.put('/api/projects/:id', authenticateToken, async (req: any, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (project.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const updates = insertProjectSchema.partial().parse(req.body);
      const updatedProject = await storage.updateProject(req.params.id, updates);

      res.json(updatedProject);
    } catch (error) {
      console.error('Update project error:', error);
      res.status(400).json({ message: 'Failed to update project' });
    }
  });

  app.delete('/api/projects/:id', authenticateToken, async (req: any, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (project.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const deleted = await storage.deleteProject(req.params.id);
      res.json({ success: deleted });
    } catch (error) {
      console.error('Delete project error:', error);
      res.status(500).json({ message: 'Failed to delete project' });
    }
  });

  app.get('/api/projects/search', authenticateToken, async (req: any, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: 'Search query required' });
      }

      const projects = await storage.searchProjects(req.user.id, query);
      res.json(projects);
    } catch (error) {
      console.error('Search projects error:', error);
      res.status(500).json({ message: 'Search failed' });
    }
  });

  // AI Chat routes
  app.post('/api/ai/chat', authenticateToken, async (req: any, res) => {
    try {
      const { mode, message, chatHistory, projectId } = req.body;

      if (!mode || !message) {
        return res.status(400).json({ message: 'Mode and message are required' });
      }

      const response = await aiService.generateResponse(mode, message, chatHistory);

      // Save chat session
      const messages = [
        ...(chatHistory || []),
        { role: 'user', content: message, timestamp: new Date() },
        { role: 'assistant', content: response.message, timestamp: new Date() }
      ];

      await storage.createChatSession({
        userId: req.user.id,
        projectId: projectId || null,
        mode,
        messages: JSON.stringify(messages),
      });

      res.json(response);
    } catch (error) {
      console.error('AI chat error:', error);
      res.status(500).json({ message: 'AI chat failed' });
    }
  });

  app.post('/api/ai/analyze-query', authenticateToken, async (req: any, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ message: 'Query is required' });
      }

      const analysis = await aiService.analyzeUserQuery(query);
      res.json(analysis);
    } catch (error) {
      console.error('Query analysis error:', error);
      res.status(500).json({ message: 'Query analysis failed' });
    }
  });

  // Admin routes
  app.get('/api/admin/users', authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithProjects = await Promise.all(
        users.map(async (user) => {
          const projects = await storage.getProjectsByUser(user.id);
          return {
            ...user,
            projectCount: projects.length,
          };
        })
      );
      res.json(usersWithProjects);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  app.get('/api/admin/projects', authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error('Get all projects error:', error);
      res.status(500).json({ message: 'Failed to fetch projects' });
    }
  });

  app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      const projects = await storage.getAllProjects();
      
      // Get total chat sessions by getting all users' sessions
      const allChatSessions = [];
      for (const user of users) {
        const userSessions = await storage.getChatSessionsByUser(user.id);
        allChatSessions.push(...userSessions);
      }

      res.json({
        totalUsers: users.length,
        activeProjects: projects.length,
        aiInteractions: allChatSessions.length,
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ message: 'Failed to fetch stats' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
