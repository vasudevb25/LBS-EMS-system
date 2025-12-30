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
import { LucideIcon, ArrowRight, Clock, ExternalLink } from "lucide-react";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
const API_URL = import.meta.env.VITE_API_URL;

// Stats Card Component
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
                trend.value > 0 ? "text-success" : "text-destructive"
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

// Module Card Component
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

  const handleClick = () => {
    if (link && link !== "#") {
      navigate(link);
    }
  };

  return (
    <Card
      className={cn(
        "group transition-all duration-300 hover:shadow-glow hover:-translate-y-1 cursor-pointer",
        className
      )}
    >
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
            <li
              key={index}
              className="flex items-center text-sm text-muted-foreground"
            >
              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
              {feature}
            </li>
          ))}
        </ul>
        <Button
          className="w-full mt-4 group-hover:bg-primary-glow transition-colors"
          onClick={handleClick}
        >
          Access Module
        </Button>
      </CardContent>
    </Card>
  );
}

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
  exam_name: string;
  centre_name: string;
  created_at: string;
}

type ActivityType = "centre" | "course" | "exam";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  created_at: string; // raw timestamp for sorting
  timeAgo: string; // human readable
  badgeText: string;
}

const getBadgeColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case "centre":
      return "bg-blue-400 text-white"; // Blue badge
    case "course":
      return "bg-green-500 text-white"; // Green badge
    case "exam":
      return "bg-yellow-400 text-black"; // Yellow badge
    default:
      return "bg-gray-300 text-black"; // Default gray badge
  }
};

const getTimeAgo = (dateString: string) => {
  const created = new Date(dateString);
  const diff = Date.now() - created.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchActivities = async () => {
      try {
        const [centresRes, coursesRes, examsRes] = await Promise.all([
          fetch(`${API_URL}/api/centres/`),
          fetch(`${API_URL}/api/courses/`),
          fetch(`${API_URL}/api/examinations/`),
        ]);

        if (!centresRes.ok)
          throw new Error(`Centres fetch failed: ${centresRes.status}`);
        if (!coursesRes.ok)
          throw new Error(`Courses fetch failed: ${coursesRes.status}`);
        if (!examsRes.ok)
          throw new Error(`Exams fetch failed: ${examsRes.status}`);

        const [centres, courses, exams]: [Centre[], Course[], Exam[]] =
          await Promise.all([
            centresRes.json(),
            coursesRes.json(),
            examsRes.json(),
          ]);

        const centreActivities: Activity[] = centres.map((c) => ({
          id: `centre-${c.centre_id}`,
          type: "centre",
          title: "New Centre Created",
          description: `${c.centre_name} has been added to the system.`,
          created_at: c.created_at,
          timeAgo: getTimeAgo(c.created_at),
          badgeText: "Centre",
        }));

        const courseActivities: Activity[] = courses.map((c) => ({
          id: `course-${c.course_id}`,
          type: "course",
          title: "New Course Added",
          description: `${c.course_name} (${c.stream}) created.`,
          created_at: c.created_at,
          timeAgo: getTimeAgo(c.created_at),
          badgeText: "Course",
        }));

        const examActivities: Activity[] = exams.map((e) => ({
          id: `exam-${e.exam_id}`,
          type: "exam",
          title: "Exam Scheduled",
          description: `${e.exam_name} created by ${e.centre_name}.`,
          created_at: e.created_at,
          timeAgo: getTimeAgo(e.created_at),
          badgeText: "Exam",
        }));

        // combine and sort newest -> oldest by created_at
        const all = [
          ...centreActivities,
          ...courseActivities,
          ...examActivities,
        ].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        if (mounted) {
          setActivities(all);
        }
      } catch (err: any) {
        console.error("Error fetching activities:", err);
        if (mounted) setError(err.message || "Failed to load activities");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchActivities();

    return () => {
      mounted = false;
    };
  }, []);

  const items = useMemo(
    () =>
      activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start space-x-4 pb-4 last:pb-0 border-b last:border-0"
          role="listitem"
        >
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">
                {activity.title}
              </p>
              <Badge className={getBadgeColor(activity.type)}>
                {activity.badgeText}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              {activity.description}
            </p>

            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              {activity.timeAgo}
            </div>
          </div>
        </div>
      )),
    [activities]
  );

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Activity
        </CardTitle>
        <CardDescription>
          Latest updates from your education management system
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading activities...</p>
        ) : error ? (
          <p className="text-sm text-destructive">Error: {error}</p>
        ) : activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity</p>
        ) : (
          <AnimatedList
            items={items}
            onItemSelect={(item, index) => console.log("Selected:", index)}
            showGradients={true}
            enableArrowNavigation={true}
            displayScrollbar={true}
          />
        )}
      </CardContent>
    </Card>
  );
}
