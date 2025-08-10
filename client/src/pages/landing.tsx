import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Landing() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { login, signup, loginLoading, signupLoading } = useAuth();
  const { toast } = useToast();

  const handleAuth = async (data: any, isSignup: boolean) => {
    try {
      if (isSignup) {
        await signup(data);
      } else {
        await login(data);
      }
      setAuthDialogOpen(false);
      toast({
        title: "Success",
        description: `${isSignup ? "Account created" : "Logged in"} successfully!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `${isSignup ? "Signup" : "Login"} failed`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-neutral-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-hire-primary to-hire-secondary rounded-lg flex items-center justify-center">
                  <i className="fas fa-robot text-white text-sm"></i>
                </div>
                <span className="text-xl font-bold text-hire-secondary">HireMe</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-neutral-600 hover:text-hire-secondary transition-colors">Home</a>
              <a href="#features" className="text-neutral-600 hover:text-hire-secondary transition-colors">Features</a>
              <a href="#how-it-works" className="text-neutral-600 hover:text-hire-secondary transition-colors">How it Works</a>
              <a href="#contact" className="text-neutral-600 hover:text-hire-secondary transition-colors">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
              <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-hire-secondary hover:text-hire-primary">
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-hire-primary to-hire-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-robot text-white text-2xl"></i>
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold text-hire-secondary">Welcome to HireMe</DialogTitle>
                    <p className="text-neutral-600 text-center">Sign in to access your AI assistant</p>
                  </DialogHeader>

                  <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="signin">Sign In</TabsTrigger>
                      <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="signin">
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        handleAuth({
                          email: formData.get('email'),
                          password: formData.get('password'),
                        }, false);
                      }} className="space-y-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder="john@example.com" 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="password">Password</Label>
                          <Input 
                            id="password" 
                            name="password" 
                            type="password" 
                            placeholder="••••••••" 
                            required 
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-hire-primary to-hire-secondary"
                          disabled={loginLoading}
                        >
                          {loginLoading ? "Signing in..." : "Sign In"}
                        </Button>
                      </form>
                    </TabsContent>
                    
                    <TabsContent value="signup">
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        handleAuth({
                          username: formData.get('username'),
                          email: formData.get('email'),
                          password: formData.get('password'),
                        }, true);
                      }} className="space-y-4">
                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input 
                            id="username" 
                            name="username" 
                            placeholder="johndoe" 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="signup-email">Email</Label>
                          <Input 
                            id="signup-email" 
                            name="email" 
                            type="email" 
                            placeholder="john@example.com" 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="signup-password">Password</Label>
                          <Input 
                            id="signup-password" 
                            name="password" 
                            type="password" 
                            placeholder="••••••••" 
                            required 
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-hire-primary to-hire-secondary"
                          disabled={signupLoading}
                        >
                          {signupLoading ? "Creating account..." : "Sign Up"}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
              
              <Button 
                className="bg-gradient-to-r from-hire-primary to-hire-secondary text-white hover:shadow-lg"
                onClick={() => setAuthDialogOpen(true)}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-hire-secondary leading-tight">
                  Your AI Employee for 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-hire-primary to-hire-secondary"> Everything</span>
                </h1>
                <p className="text-xl text-neutral-600 leading-relaxed">
                  HireMe is an AI-powered platform that acts as your dedicated team member, helping with coding, design, marketing, product management, and analysis. Get expert assistance 24/7.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-gradient-to-r from-hire-primary to-hire-secondary text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl"
                  onClick={() => setAuthDialogOpen(true)}
                >
                  Start Free Trial
                  <i className="fas fa-arrow-right ml-2"></i>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-hire-primary text-hire-primary px-8 py-4 rounded-xl font-semibold hover:bg-hire-primary hover:text-white"
                >
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-hire-secondary">50K+</div>
                  <div className="text-sm text-neutral-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-hire-secondary">1M+</div>
                  <div className="text-sm text-neutral-600">Tasks Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-hire-secondary">99.9%</div>
                  <div className="text-sm text-neutral-600">Uptime</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-hire-primary to-hire-secondary p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-robot text-white"></i>
                      </div>
                      <span className="text-white font-semibold">AI Assistant</span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-white bg-opacity-30 rounded-full"></div>
                      <div className="w-3 h-3 bg-white bg-opacity-30 rounded-full"></div>
                      <div className="w-3 h-3 bg-white bg-opacity-30 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-b border-neutral-100">
                  <div className="flex space-x-2 overflow-x-auto">
                    <span className="bg-hire-primary text-white px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">Coding</span>
                    <span className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">Design</span>
                    <span className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">Marketing</span>
                    <span className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">Analysis</span>
                  </div>
                </div>

                <div className="p-4 space-y-4 h-64 overflow-y-auto">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-hire-primary to-hire-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-robot text-white text-xs"></i>
                    </div>
                    <div className="bg-neutral-100 rounded-xl rounded-tl-none p-3 max-w-xs">
                      <p className="text-sm text-neutral-800">Hi! I'm your AI coding assistant. I can help you with React components, debugging, or code reviews. What would you like to work on?</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-hire-primary to-hire-secondary text-white rounded-xl rounded-tr-none p-3 max-w-xs">
                      <p className="text-sm">Can you help me create a responsive navbar component in React?</p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-hire-primary to-hire-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-robot text-white text-xs"></i>
                    </div>
                    <div className="bg-neutral-100 rounded-xl rounded-tl-none p-3 max-w-xs">
                      <p className="text-sm text-neutral-800">Absolutely! I'll create a responsive navbar with mobile menu, logo, and navigation links. Would you like me to include any specific styling framework?</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-neutral-100">
                  <div className="flex space-x-2">
                    <Input placeholder="Ask me anything..." className="flex-1" />
                    <Button className="bg-hire-primary text-white hover:bg-opacity-90">
                      <i className="fas fa-paper-plane"></i>
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 hidden lg:block">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-neutral-800">AI Online</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 hidden lg:block">
                <div className="text-center">
                  <div className="text-lg font-bold text-hire-primary">24/7</div>
                  <div className="text-xs text-neutral-600">Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-hire-secondary mb-4">
              One AI Assistant, Multiple Expertise Areas
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Get expert-level assistance across all aspects of your business with our specialized AI modes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "fas fa-code",
                title: "Coding Assistant",
                description: "Get help with code reviews, debugging, architecture decisions, and implementation across multiple programming languages.",
                color: "from-blue-400 to-blue-600",
                features: ["Code generation & optimization", "Bug detection & fixing", "Architecture recommendations"]
              },
              {
                icon: "fas fa-palette",
                title: "Design Assistant", 
                description: "Create stunning UI/UX designs, get feedback on visual elements, and ensure consistent design systems.",
                color: "from-purple-400 to-purple-600",
                features: ["UI/UX design guidance", "Color palette recommendations", "Design system creation"]
              },
              {
                icon: "fas fa-bullhorn",
                title: "Marketing Assistant",
                description: "Develop marketing strategies, create compelling content, and optimize campaigns for maximum impact.",
                color: "from-green-400 to-green-600", 
                features: ["Content creation & copywriting", "Campaign strategy development", "SEO optimization"]
              },
              {
                icon: "fas fa-tasks",
                title: "Product Management",
                description: "Plan product roadmaps, define requirements, prioritize features, and manage product lifecycle effectively.",
                color: "from-orange-400 to-orange-600",
                features: ["Roadmap planning", "Feature prioritization", "Requirements documentation"]
              },
              {
                icon: "fas fa-chart-line",
                title: "Data Analysis", 
                description: "Analyze complex data, generate insights, create reports, and make data-driven decisions with confidence.",
                color: "from-red-400 to-red-600",
                features: ["Data visualization", "Statistical analysis", "Predictive modeling"]
              },
              {
                icon: "fas fa-project-diagram",
                title: "Project Tracking",
                description: "Organize projects, track progress, collaborate with AI notes, and maintain comprehensive project documentation.",
                color: "from-hire-primary to-hire-secondary",
                features: ["Project organization", "AI-powered notes", "Progress tracking"]
              }
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                    <i className={`${feature.icon} text-white text-xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-hire-secondary mb-4">{feature.title}</h3>
                  <p className="text-neutral-600 mb-6">{feature.description}</p>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center">
                        <i className="fas fa-check text-hire-primary mr-2"></i>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-hire-secondary mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-neutral-600">
              Start leveraging AI assistance for your business in minutes, not hours.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Sign Up & Choose Mode",
                description: "Create your account and select the AI assistance mode that matches your current project needs."
              },
              {
                step: "2", 
                title: "Start Conversations",
                description: "Begin chatting with your AI assistant. Ask questions, share project details, and get expert-level guidance."
              },
              {
                step: "3",
                title: "Track & Manage", 
                description: "Organize projects, save important conversations, and track your progress with AI-powered insights."
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-hire-primary to-hire-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold text-hire-secondary mb-4">{step.title}</h3>
                <p className="text-neutral-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-hire-secondary mb-6">
                Ready to Transform Your Workflow?
              </h2>
              <p className="text-xl text-neutral-600 mb-8">
                Join thousands of entrepreneurs and startups who are already leveraging AI to accelerate their business growth.
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    title: "Free 14-day Trial",
                    description: "No credit card required. Full access to all AI modes."
                  },
                  {
                    title: "24/7 AI Availability", 
                    description: "Your AI assistant never sleeps. Get help whenever you need it."
                  },
                  {
                    title: "Expert-Level Assistance",
                    description: "Get guidance that matches industry experts across multiple domains."
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-hire-primary bg-opacity-10 rounded-full flex items-center justify-center mt-1">
                      <i className="fas fa-check text-hire-primary text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-hire-secondary mb-1">{benefit.title}</h4>
                      <p className="text-neutral-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-hire-secondary">Get Started Today</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="workEmail">Work Email</Label>
                    <Input id="workEmail" type="email" placeholder="john@company.com" />
                  </div>
                  
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Your Company" />
                  </div>
                  
                  <div>
                    <Label htmlFor="interest">Primary Interest</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your main focus area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coding">Coding & Development</SelectItem>
                        <SelectItem value="design">Design & UX</SelectItem>
                        <SelectItem value="marketing">Marketing & Growth</SelectItem>
                        <SelectItem value="product">Product Management</SelectItem>
                        <SelectItem value="analysis">Data Analysis</SelectItem>
                        <SelectItem value="all">All of the above</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-hire-primary to-hire-secondary text-white py-4 font-semibold hover:shadow-lg"
                    onClick={() => setAuthDialogOpen(true)}
                  >
                    Start Free Trial <i className="fas fa-arrow-right ml-2"></i>
                  </Button>
                </form>
                
                <p className="text-xs text-neutral-500 mt-4 text-center">
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-hire-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-hire-primary to-hire-accent rounded-lg flex items-center justify-center">
                  <i className="fas fa-robot text-white text-sm"></i>
                </div>
                <span className="text-xl font-bold">HireMe</span>
              </div>
              <p className="text-neutral-300 max-w-md mb-6">
                Empower your startup with AI-driven assistance across coding, design, marketing, and more. Your intelligent business partner, available 24/7.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'linkedin', 'github', 'discord'].map((social) => (
                  <a key={social} href="#" className="text-neutral-300 hover:text-hire-primary transition-colors">
                    <i className={`fab fa-${social} text-xl`}></i>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-neutral-300">
                {['Features', 'Pricing', 'API', 'Integration', 'Documentation'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-hire-primary transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-neutral-300">
                {['About', 'Blog', 'Careers', 'Contact', 'Press Kit'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-hire-primary transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-300 text-sm">
              © 2024 HireMe. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <a key={item} href="#" className="text-neutral-300 hover:text-hire-primary transition-colors text-sm">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
