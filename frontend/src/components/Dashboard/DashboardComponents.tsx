/// <reference types="vite/client" />

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/layout";
import AnimatedList from "../../components/ui/Animatedlist";
import { Badge } from "../../components/ui/data";
import { Button } from "../../components/ui/buttons";
import { LucideIcon, ArrowRight, Clock } from "lucide-react";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "../../lib/api";

/* ---------------- Stats Card ---------------- */

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("transition-all hover:shadow-elegant", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={cn(
                "text-xs font-medium",
                trend.value > 0 ? "text-success" : "text-destructive",
              )}
            >
              {trend.value > 0 ? "+" : ""}
              {trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ---------------- Module Card ---------------- */

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  gradient?: string;
  className?: string;
  link?: string;
}

export function ModuleCard({
  title,
  description,
  icon: Icon,
  features,
  gradient = "bg-gradient-primary",
  className,
  link = "#",
}: ModuleCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className={cn(
        "group transition-all duration-300 hover:shadow-glow hover:-translate-y-1 cursor-pointer",
        className,
      )}
      onClick={() => link !== "#" && navigate(link)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className={cn("p-2 rounded-lg text-white", gradient)}>
            <Icon className="h-6 w-6" />
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center text-sm text-muted-foreground"
            >
              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
              {feature}
            </li>
          ))}
        </ul>

        <Button className="w-full mt-4">Access Module</Button>
      </CardContent>
    </Card>
  );
}

/* ---------------- Recent Activity ---------------- */

interface Centre {
  centre_id: number;
  centre_name: string;
  created_at: string;
}

interface Course {
  course_id: number;
  course_name: string;
  stream: string;
  created_at: string;
}

interface Exam {
  exam_id: number;
  exam_name?: string;
  exam_type?: string;
  created_at: string;
}

type ActivityType = "centre" | "course" | "exam";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  created_at: string;
  timeAgo: string;
  badgeText: string;
}

const getBadgeColor = (type: ActivityType) => {
  switch (type) {
    case "centre":
      return "bg-blue-500 text-white";
    case "course":
      return "bg-green-500 text-white";
    case "exam":
      return "bg-yellow-400 text-black";
    default:
      return "bg-gray-300";
  }
};

const getTimeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} day ago`;
};

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const results = await Promise.allSettled([
          apiFetch("/api/centres/"),
          apiFetch("/api/courses/"),
          apiFetch("/api/examinations/"),
        ]);

        const centres: Centre[] =
          results[0].status === "fulfilled" ? results[0].value : [];
        const courses: Course[] =
          results[1].status === "fulfilled" ? results[1].value : [];
        const exams: Exam[] =
          results[2].status === "fulfilled" ? results[2].value : [];

        const combined: Activity[] = [
          ...centres.map((c) => ({
            id: `centre-${c.centre_id}`,
            type: "centre" as const,
            title: "New Centre Created",
            description: `${c.centre_name} added`,
            created_at: c.created_at,
            timeAgo: getTimeAgo(c.created_at),
            badgeText: "Centre",
          })),
          ...courses.map((c) => ({
            id: `course-${c.course_id}`,
            type: "course" as const,
            title: "New Course Added",
            description: `${c.course_name} (${c.stream})`,
            created_at: c.created_at,
            timeAgo: getTimeAgo(c.created_at),
            badgeText: "Course",
          })),
          ...exams.map((e) => ({
            id: `exam-${e.exam_id}`,
            type: "exam" as const,
            title: "Exam Scheduled",
            description: e.exam_name ?? e.exam_type ?? "Exam scheduled",
            created_at: e.created_at,
            timeAgo: getTimeAgo(e.created_at),
            badgeText: "Exam",
          })),
        ].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

        if (mounted) setActivities(combined);
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load activity");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const items = useMemo(
    () =>
      activities.map((a) => (
        <div key={a.id} className="flex space-x-4 pb-4 border-b last:border-0">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between">
              <p className="text-sm font-medium">{a.title}</p>
              <Badge className={getBadgeColor(a.type)}>{a.badgeText}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{a.description}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {a.timeAgo}
            </div>
          </div>
        </div>
      )),
    [activities],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest updates from your education management system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity yet</p>
        ) : (
          <AnimatedList items={items} />
        )}
      </CardContent>
    </Card>
  );
}
