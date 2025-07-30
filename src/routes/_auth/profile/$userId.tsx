import {
  Building2,
  CheckSquare,
  CreditCard,
  FolderOpen,
  HelpCircle,
  LogOut,
  Mail,
  Settings,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";

import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute({
  component: RouteComponent,
});

// Mock user data
const mockUser = {
  id: "user-123",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  plan: "Basic" as "Basic" | "Pro" | "Enterprise",
};

// Mock usage metrics
const mockMetrics = {
  workspaces: { current: 3, limit: 5 },
  projects: { current: 12, limit: 15 },
  tasks: { current: 87, limit: 100 },
};

// Pro tier limits
const proLimits = {
  workspaces: 25,
  projects: 100,
  tasks: 1000,
};

// Mock plan features
const planFeatures = {
  Basic: [
    {
      title: "15 Projects",
      description: "Create up to 15 projects",
      icon: "📁",
    },
    {
      title: "Basic Support",
      description: "Email support within 48h",
      icon: "💬",
    },
  ],
  Pro: [
    {
      title: "Unlimited Projects",
      description: "Create unlimited projects",
      icon: "📁",
    },
    {
      title: "Advanced Analytics",
      description: "Detailed project insights",
      icon: "📊",
    },
    {
      title: "Team Collaboration",
      description: "Invite up to 10 team members",
      icon: "👥",
    },
  ],
  Enterprise: [
    {
      title: "Unlimited Everything",
      description: "No limits on projects or users",
      icon: "♾️",
    },
    {
      title: "24/7 Support",
      description: "Phone, email & chat support",
      icon: "📞",
    },
    {
      title: "100GB Storage",
      description: "File and asset storage",
      icon: "💾",
    },
    {
      title: "Custom Analytics",
      description: "Custom reports and insights",
      icon: "📊",
    },
    {
      title: "Advanced Security",
      description: "SSO, audit logs, compliance",
      icon: "🔒",
    },
    {
      title: "Dedicated Manager",
      description: "Personal customer success manager",
      icon: "👤",
    },
  ],
};

function RouteComponent() {
  const [activeTab, setActiveTab] = useState<
    "account" | "customization" | "contact"
  >("account");

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case "Basic":
        return "outline";
      case "Pro":
        return "solid";
      case "Enterprise":
        return "solid";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-dvh overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-12">
          {/* Left Sidebar */}
          <div className="xl:col-span-4">
            {/* User Profile Section */}
            <div className="mb-8 flex flex-col items-center gap-6 rounded-2xl p-6">
              <div className="relative">
                <AvatarRoot className="size-28 ring-4 ring-primary/10">
                  <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                  <AvatarFallback className="font-semibold text-2xl">
                    {mockUser.name.charAt(0)}
                  </AvatarFallback>
                </AvatarRoot>
                <div className="absolute right-1 bottom-1 size-6 rounded-full border-2 border-background bg-green-500"></div>
              </div>
              <div className="text-center">
                <h2 className="font-bold text-xl tracking-tight">
                  {mockUser.name}
                </h2>
                <p className="mt-1 text-muted-foreground text-sm">
                  {mockUser.email}
                </p>
                <Badge
                  variant={getPlanBadgeVariant(mockUser.plan)}
                  className="mt-3 px-3 py-1 font-medium"
                >
                  {mockUser.plan} Plan
                </Badge>
              </div>
            </div>

            {/* Usage Metrics Section */}
            <Card className="mb-6 overflow-hidden border border-border/50 bg-gradient-to-br from-card to-card/80">
              <CardHeader className="px-0">
                <CardTitle className="flex items-center gap-3 font-semibold text-lg">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="size-4 text-primary" />
                  </div>
                  Usage Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-0">
                {/* Workspaces Metric */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10">
                        <Building2 className="size-4 text-blue-600" />
                      </div>
                      <span className="font-medium">Workspaces</span>
                    </div>
                    <span className="font-medium text-muted-foreground text-sm">
                      {mockMetrics.workspaces.current}/
                      {mockMetrics.workspaces.limit}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/50">
                    <div
                      className="h-full rounded-full border border-blue-400/30 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
                      style={{
                        width: `${(mockMetrics.workspaces.current / mockMetrics.workspaces.limit) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Projects Metric */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-green-500/10">
                        <FolderOpen className="size-4 text-green-600" />
                      </div>
                      <span className="font-medium">Projects</span>
                    </div>
                    <span className="font-medium text-muted-foreground text-sm">
                      {mockMetrics.projects.current}/
                      {mockMetrics.projects.limit}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/50">
                    <div
                      className="h-full rounded-full border border-green-400/30 bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out"
                      style={{
                        width: `${(mockMetrics.projects.current / mockMetrics.projects.limit) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Tasks Metric */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10">
                        <CheckSquare className="size-4 text-purple-600" />
                      </div>
                      <span className="font-medium">Tasks</span>
                    </div>
                    <span className="font-medium text-muted-foreground text-sm">
                      {mockMetrics.tasks.current}/{mockMetrics.tasks.limit}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/50">
                    <div
                      className="h-full rounded-full border border-purple-400/30 bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500 ease-out"
                      style={{
                        width: `${(mockMetrics.tasks.current / mockMetrics.tasks.limit) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Upgrade CTA */}
                <div className="mt-8 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-6">
                  <div className="text-center">
                    <h4 className="mb-2 font-bold text-base">Upgrade to Pro</h4>
                    <p className="mb-4 text-muted-foreground text-sm leading-relaxed">
                      Get {proLimits.workspaces} workspaces,{" "}
                      {proLimits.projects} projects, and {proLimits.tasks} tasks
                    </p>
                    <Button
                      size="sm"
                      className="w-full border border-primary/20 font-medium transition-all duration-200 hover:border-primary/40"
                    >
                      <Zap className="mr-2 size-3" />
                      Upgrade Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="xl:col-span-8">
            {/* Tabs */}
            <div className="mb-8 rounded-xl border border-border/40 bg-card/50 p-1">
              <nav className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("account")}
                  className={`flex items-center gap-2 rounded-lg px-4 py-3 font-medium text-sm transition-all duration-200 ${
                    activeTab === "account"
                      ? "border border-primary/20 bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <User className="size-4" />
                  Account
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("customization")}
                  className={`flex items-center gap-2 rounded-lg px-4 py-3 font-medium text-sm transition-all duration-200 ${
                    activeTab === "customization"
                      ? "border border-primary/20 bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Settings className="size-4" />
                  Customization
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("contact")}
                  className={`flex items-center gap-2 rounded-lg px-4 py-3 font-medium text-sm transition-all duration-200 ${
                    activeTab === "contact"
                      ? "border border-primary/20 bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <HelpCircle className="size-4" />
                  Contact Us
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "account" && (
              <div className="space-y-8">
                {/* Plan Benefits */}
                <div>
                  <h3 className="mb-6 font-bold text-2xl tracking-tight">
                    {mockUser.plan} Plan Benefits
                  </h3>
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {planFeatures[mockUser.plan].map((feature) => (
                      <Card
                        key={feature.title}
                        className="overflow-hidden border border-border/50 bg-gradient-to-br from-card to-card/80 transition-all duration-200 hover:scale-[1.02] hover:border-primary/30"
                      >
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className="mb-4 text-3xl">{feature.icon}</div>
                            <h4 className="mb-3 font-semibold text-lg">
                              {feature.title}
                            </h4>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border font-medium transition-all duration-200 hover:border-primary/40"
                  >
                    <CreditCard className="size-4" />
                    Manage Subscription
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex items-center gap-2 border border-destructive/20 font-medium transition-all duration-200 hover:border-destructive/40"
                  >
                    <LogOut className="size-4" />
                    Sign Out
                  </Button>
                </div>

                <div className="mt-16 rounded-xl border border-destructive/20 bg-destructive/5 p-6">
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-destructive text-xl">
                      Danger Zone
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Permanently delete all of your associated data
                    </p>
                  </div>

                  <Button
                    variant="destructive"
                    className="mt-4 flex w-fit items-center gap-2 border border-destructive/20 font-medium transition-all duration-200 hover:border-destructive/40"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "customization" && (
              <div className="space-y-6">
                <Card className="overflow-hidden border border-border/50 bg-gradient-to-br from-card to-card/80">
                  <CardHeader className="px-6 pt-6">
                    <CardTitle className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                        <Settings className="size-4" />
                      </div>
                      Customization Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <div className="p-8 text-center">
                      <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-muted/50">
                        <Settings className="size-8 text-muted-foreground" />
                      </div>
                      <h3 className="mb-3 font-bold text-xl">Coming Soon</h3>
                      <p className="mx-auto max-w-md text-muted-foreground text-sm leading-relaxed">
                        Customization options will be available in a future
                        update. You'll be able to personalize your workspace,
                        themes, and preferences.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-6">
                <Card className="overflow-hidden border border-border/50 bg-gradient-to-br from-card to-card/80">
                  <CardHeader className="px-6 pt-6">
                    <CardTitle className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                        <Mail className="size-4" />
                      </div>
                      Contact Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <form className="space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label
                            htmlFor="firstName"
                            className="block font-medium text-sm"
                          >
                            First Name
                          </label>
                          <Input
                            id="firstName"
                            placeholder="Enter your first name"
                            defaultValue="John"
                            className="transition-all duration-200 focus:border-primary/60"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="lastName"
                            className="block font-medium text-sm"
                          >
                            Last Name
                          </label>
                          <Input
                            id="lastName"
                            placeholder="Enter your last name"
                            defaultValue="Doe"
                            className="transition-all duration-200 focus:border-primary/60"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="block font-medium text-sm"
                        >
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          defaultValue={mockUser.email}
                          className="transition-all duration-200 focus:border-primary/60"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="subject"
                          className="block font-medium text-sm"
                        >
                          Subject
                        </label>
                        <Input
                          id="subject"
                          placeholder="How can we help you?"
                          className="transition-all duration-200 focus:border-primary/60"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="message"
                          className="block font-medium text-sm"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          rows={6}
                          className="flex w-full rounded-md border bg-transparent px-3 py-2 text-sm transition-all duration-200 placeholder:text-muted-foreground focus:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Describe your question or issue in detail..."
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full border border-primary/20 font-medium transition-all duration-200 hover:border-primary/40 sm:w-auto"
                      >
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
