# HireMe - AI-Powered Assistant Platform

## Overview

HireMe is a full-stack AI-powered platform designed to act as a dedicated team member for startups and entrepreneurs. The application provides specialized AI assistance across five key domains: coding & development, design & UX, marketing & growth, product management, and data analysis. Users can interact with AI through real-time chat, manage projects with AI-generated notes, and access a comprehensive dashboard for project organization and search functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built using modern React 18 with TypeScript, utilizing Vite for fast development and hot module replacement. The application follows a component-based architecture with clear separation of concerns:

- **UI Framework**: React 18 with TypeScript for type safety and modern React features
- **Build Tool**: Vite for fast development builds and optimized production bundles
- **Styling**: TailwindCSS with a custom design system inspired by Wise app aesthetics (clean, modern, blue/green accents)
- **Component Library**: Shadcn/ui components built on Radix UI primitives for accessibility and consistency
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and data fetching

The frontend follows a page-based routing structure with authenticated and unauthenticated routes. The design emphasizes responsive layouts that work across all device sizes, with a focus on clean white space, rounded cards, and soft shadows.

### Backend Architecture

The backend implements a RESTful API using Node.js and Express with a modular architecture:

- **Server Framework**: Express.js with TypeScript for type-safe API development
- **Database Layer**: Currently uses in-memory storage with JSON file persistence, structured to easily migrate to PostgreSQL via Drizzle ORM
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **API Integration**: OpenAI GPT-4o integration for AI chat functionality
- **Middleware**: Custom authentication and admin authorization middleware

The backend is designed with clear separation between routes, storage, and business logic, making it highly maintainable and testable.

### Data Storage Solutions

The application uses a flexible storage architecture that supports both development and production environments:

- **Development**: In-memory storage with JSON file persistence for easy local development
- **Production Ready**: Drizzle ORM configuration for PostgreSQL migration
- **Schema Design**: Well-defined database schema with proper relationships between users, projects, and chat sessions
- **Data Models**: Users, Projects, and ChatSessions with appropriate foreign key relationships

### Authentication and Authorization

The security architecture implements a multi-layered approach:

- **JWT Authentication**: Stateless authentication using JSON Web Tokens
- **Password Security**: bcrypt for secure password hashing with salt rounds
- **Role-Based Access**: Admin and regular user roles with appropriate permissions
- **Route Protection**: Middleware-based route protection for authenticated and admin-only endpoints
- **Token Management**: Client-side token storage with automatic refresh handling

### AI Integration Architecture

The AI system is designed around specialized modes for different use cases:

- **Mode-Based Prompting**: Specialized system prompts for coding, design, marketing, product management, and analysis
- **Context Management**: Chat history preservation for coherent conversations
- **Response Formatting**: Structured AI responses with suggestions and analysis
- **Error Handling**: Robust error handling for API failures and rate limiting

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity for production deployment
- **drizzle-orm**: Type-safe ORM for database operations and migrations
- **drizzle-kit**: Database schema management and migration tools

### AI Services
- **OpenAI API**: GPT-4o model integration for intelligent chat responses and project assistance

### Frontend Libraries
- **@tanstack/react-query**: Server state management, caching, and data synchronization
- **wouter**: Lightweight routing solution for single-page application navigation
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **react-hook-form**: Form state management with validation
- **@hookform/resolvers**: Form validation resolver integrations

### Backend Services
- **jsonwebtoken**: JWT token generation and verification for authentication
- **bcrypt**: Password hashing and verification for secure user authentication
- **express**: Web application framework for API development

### Development Tools
- **Vite**: Fast build tool with hot module replacement for development
- **TypeScript**: Static type checking for both frontend and backend code
- **TailwindCSS**: Utility-first CSS framework for consistent styling
- **PostCSS**: CSS processing for TailwindCSS integration

### UI and Styling
- **class-variance-authority**: Utility for creating consistent component variants
- **clsx**: Conditional className utility for dynamic styling
- **tailwind-merge**: Utility for merging TailwindCSS classes intelligently
- **lucide-react**: Icon library for consistent iconography

The architecture supports easy migration from the current SQLite-based development setup to PostgreSQL in production, with Drizzle ORM providing the abstraction layer for database operations.