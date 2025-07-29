import {
  CreditCard,
  HelpCircle,
  LogOut,
  Mail,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";

import { Avatar } from "@/components/ui/avatar";
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
  plan: "Pro" as "Basic" | "Pro" | "Enterprise",
};

// Mock keyboard shortcuts
const keyboardShortcuts = [
  { key: "⌘ + K", description: "Open command palette" },
  { key: "⌘ + N", description: "Create new task" },
  { key: "⌘ + /", description: "Toggle shortcuts" },
  { key: "⌘ + B", description: "Toggle sidebar" },
  { key: "⌘ + ↵", description: "Save changes" },
  { key: "Esc", description: "Close modal/dialog" },
];

// Mock plan features
const planFeatures = {
  Basic: [
    { title: "5 Projects", description: "Create up to 5 projects", icon: "📁" },
    {
      title: "Basic Support",
      description: "Email support within 48h",
      icon: "💬",
    },
    { title: "1GB Storage", description: "File and asset storage", icon: "💾" },
  ],
  Pro: [
    {
      title: "Unlimited Projects",
      description: "Create unlimited projects",
      icon: "📁",
    },
    {
      title: "Priority Support",
      description: "Email & chat support within 4h",
      icon: "💬",
    },
    {
      title: "10GB Storage",
      description: "File and asset storage",
      icon: "💾",
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
    <div className="min-h-dvh bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          {/* Left Sidebar */}
          <div className="xl:col-span-4">
            {/* User Profile Section */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar
                    src={mockUser.avatar}
                    alt={mockUser.name}
                    fallback={mockUser.name.charAt(0)}
                    className="size-24"
                  />
                  <div className="text-center">
                    <h2 className="font-semibold text-xl">{mockUser.name}</h2>
                    <p className="text-muted-foreground text-sm">
                      {mockUser.email}
                    </p>
                    <Badge
                      variant={getPlanBadgeVariant(mockUser.plan)}
                      className="mt-2"
                    >
                      {mockUser.plan} Plan
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Keyboard Shortcuts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="size-5" />
                  Keyboard Shortcuts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {keyboardShortcuts.map((shortcut) => (
                    <div
                      key={shortcut.key}
                      className="flex items-center justify-between"
                    >
                      <span className="text-muted-foreground text-sm">
                        {shortcut.description}
                      </span>
                      <kbd className="rounded bg-muted px-2 py-1 font-mono text-muted-foreground text-xs">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="xl:col-span-8">
            {/* Tabs */}
            <div className="mb-6 border-border border-b">
              <nav className="flex gap-8">
                <button
                  type="button"
                  onClick={() => setActiveTab("account")}
                  className={`flex items-center gap-2 border-b-2 px-1 py-4 font-medium text-sm transition-colors ${
                    activeTab === "account"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <User className="size-4" />
                  Account
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("customization")}
                  className={`flex items-center gap-2 border-b-2 px-1 py-4 font-medium text-sm transition-colors ${
                    activeTab === "customization"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Settings className="size-4" />
                  Customization
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("contact")}
                  className={`flex items-center gap-2 border-b-2 px-1 py-4 font-medium text-sm transition-colors ${
                    activeTab === "contact"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <HelpCircle className="size-4" />
                  Contact Us
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "account" && (
              <div className="space-y-6">
                {/* Plan Benefits */}
                <div>
                  <h3 className="mb-4 font-semibold text-lg">
                    Your {mockUser.plan} Plan Benefits
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {planFeatures[mockUser.plan].map((feature) => (
                      <Card key={feature.title}>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="mb-3 text-2xl">{feature.icon}</div>
                            <h4 className="mb-2 font-medium">
                              {feature.title}
                            </h4>
                            <p className="text-muted-foreground text-sm">
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
                  <Button variant="outline" className="flex items-center gap-2">
                    <CreditCard className="size-4" />
                    Manage Subscription
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <LogOut className="size-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "customization" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customization Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border border-muted-foreground/25 border-dashed p-8 text-center">
                      <Settings className="mx-auto mb-4 size-12 text-muted-foreground" />
                      <h3 className="mb-2 font-medium text-lg">Coming Soon</h3>
                      <p className="text-muted-foreground text-sm">
                        Customization options will be available in a future
                        update.
                        <br />
                        You'll be able to personalize your workspace, themes,
                        and preferences.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="size-5" />
                      Contact Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="mb-2 block font-medium text-sm"
                          >
                            First Name
                          </label>
                          <Input
                            id="firstName"
                            placeholder="Enter your first name"
                            defaultValue="John"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="lastName"
                            className="mb-2 block font-medium text-sm"
                          >
                            Last Name
                          </label>
                          <Input
                            id="lastName"
                            placeholder="Enter your last name"
                            defaultValue="Doe"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block font-medium text-sm"
                        >
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          defaultValue={mockUser.email}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="subject"
                          className="mb-2 block font-medium text-sm"
                        >
                          Subject
                        </label>
                        <Input
                          id="subject"
                          placeholder="How can we help you?"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="message"
                          className="mb-2 block font-medium text-sm"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          rows={6}
                          className="flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Describe your question or issue in detail..."
                        />
                      </div>
                      <Button type="submit" className="w-full sm:w-auto">
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
