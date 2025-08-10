import { type User, type InsertUser, type Project, type InsertProject, type ChatSession, type InsertChatSession } from "@shared/schema";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Project operations
  getProject(id: string): Promise<Project | undefined>;
  getProjectsByUser(userId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  searchProjects(userId: string, query: string): Promise<Project[]>;
  getAllProjects(): Promise<Project[]>;
  
  // Chat operations
  getChatSession(id: string): Promise<ChatSession | undefined>;
  getChatSessionsByUser(userId: string): Promise<ChatSession[]>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSession(id: string, updates: Partial<InsertChatSession>): Promise<ChatSession | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private chatSessions: Map<string, ChatSession>;
  private dataFile: string;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.chatSessions = new Map();
    this.dataFile = path.join(process.cwd(), 'data.json');
    this.loadData();
  }

  private async loadData() {
    try {
      const data = await fs.readFile(this.dataFile, 'utf-8');
      const parsed = JSON.parse(data);
      
      if (parsed.users) {
        this.users = new Map(parsed.users.map((u: User) => [u.id, u]));
      }
      if (parsed.projects) {
        this.projects = new Map(parsed.projects.map((p: Project) => [p.id, p]));
      }
      if (parsed.chatSessions) {
        this.chatSessions = new Map(parsed.chatSessions.map((c: ChatSession) => [c.id, c]));
      }
    } catch (error) {
      // File doesn't exist or is corrupted, start fresh
      await this.saveData();
    }
  }

  private async saveData() {
    const data = {
      users: Array.from(this.users.values()),
      projects: Array.from(this.projects.values()),
      chatSessions: Array.from(this.chatSessions.values()),
    };
    await fs.writeFile(this.dataFile, JSON.stringify(data, null, 2));
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    await this.saveData();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Project operations
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUser(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.userId === userId);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const now = new Date();
    const project: Project = {
      ...insertProject,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.projects.set(id, project);
    await this.saveData();
    return project;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updatedProject: Project = {
      ...project,
      ...updates,
      updatedAt: new Date(),
    };
    this.projects.set(id, updatedProject);
    await this.saveData();
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    const deleted = this.projects.delete(id);
    if (deleted) {
      await this.saveData();
    }
    return deleted;
  }

  async searchProjects(userId: string, query: string): Promise<Project[]> {
    const userProjects = await this.getProjectsByUser(userId);
    const lowerQuery = query.toLowerCase();
    
    return userProjects.filter(project => 
      project.title.toLowerCase().includes(lowerQuery) ||
      project.description?.toLowerCase().includes(lowerQuery) ||
      project.mode.toLowerCase().includes(lowerQuery)
    );
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  // Chat operations
  async getChatSession(id: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async getChatSessionsByUser(userId: string): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values()).filter(session => session.userId === userId);
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = randomUUID();
    const session: ChatSession = {
      ...insertSession,
      id,
      createdAt: new Date(),
    };
    this.chatSessions.set(id, session);
    await this.saveData();
    return session;
  }

  async updateChatSession(id: string, updates: Partial<InsertChatSession>): Promise<ChatSession | undefined> {
    const session = this.chatSessions.get(id);
    if (!session) return undefined;

    const updatedSession: ChatSession = {
      ...session,
      ...updates,
    };
    this.chatSessions.set(id, updatedSession);
    await this.saveData();
    return updatedSession;
  }
}

export const storage = new MemStorage();
