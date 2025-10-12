import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/layout";
import { Badge } from "../../components/ui/data";
import { Button } from "../../components/ui/buttons";
import { LucideIcon, ArrowRight, Clock, ExternalLink } from "lucide-react";
import { cn } from "../../lib/utils";

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
}

export function StatsCard({ title, value, description, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("transition-all hover:shadow-elegant", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className="flex items-center mt-2">
            <span className={cn("text-xs font-medium", trend.value > 0 ? "text-success" : "text-destructive")}>
              {trend.value > 0 ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Module Card Component
interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  gradient?: string;
  className?: string;
}

export function ModuleCard({ title, description, icon: Icon, features, gradient = "bg-gradient-primary", className }: ModuleCardProps) {
  return (
    <Card className={cn("group transition-all duration-300 hover:shadow-glow hover:-translate-y-1 cursor-pointer", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className={cn("p-2 rounded-lg text-white", gradient)}>
            <Icon className="h-6 w-6" />
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
              {feature}
            </li>
          ))}
        </ul>
        <Button className="w-full mt-4 group-hover:bg-primary-glow transition-colors">
          Access Module
        </Button>
      </CardContent>
    </Card>
  );
}

// Recent Activity Component
const activities = [
  { id: 1, title: "New student registration", description: "Rahul Kumar registered for Web Development course", time: "2 hours ago", status: "pending" },
  { id: 2, title: "Centre allocation completed", description: "Kochi Centre allocated to Data Science course", time: "4 hours ago", status: "completed" },
  { id: 3, title: "Exam schedule updated", description: "Computer Science final exam scheduled for Dec 15", time: "6 hours ago", status: "updated" },
  { id: 4, title: "Fee payment received", description: "₹15,000 received from Digital Marketing batch", time: "1 day ago", status: "completed" }
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "pending": return "secondary";
    case "completed": return "default";
    case "updated": return "outline";
    default: return "secondary";
  }
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Activity
          <Button variant="ghost" size="sm">
            View All
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription>Latest updates from your education management system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 pb-4 last:pb-0 border-b last:border-0">
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">{activity.title}</p>
                  <Badge variant={getStatusVariant(activity.status)}>{activity.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
