/// <reference types="vite/client" />

import { useEffect, useState } from "react";
import {
  StatsCard,
  ModuleCard,
  RecentActivity,
} from "../components/Dashboard/DashboardComponents";
import {
  Users,
  GraduationCap,
  Building2,
  ClipboardCheck,
  UserCheck,
  BookOpen,
} from "lucide-react";
import { apiFetch } from "../lib/api";
import LoaderOverlay from "../components/ui/loadoverlay";
import CentreDashboard from "./CentreProfile";

const Index = () => {
  const isAdmin = localStorage.getItem("is_admin") === "true";

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCentres: 0,
    totalCourses: 0,
    totalExams: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return; // Centre dashboard handles its own loading

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const [students, centres, courses, exams] = await Promise.all([
          apiFetch("/api/students/"),
          apiFetch("/api/centres/"),
          apiFetch("/api/courses/"),
          apiFetch("/api/examinations/"),
        ]);

        setStats({
          totalStudents: students?.length || 0,
          totalCentres: centres?.length || 0,
          totalCourses: courses?.length || 0,
          totalExams: exams?.length || 0,
        });
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin]);

  // If centre → render centre dashboard directly
  if (!isAdmin) {
    return <CentreDashboard />;
  }

  return (
    <div className="relative">
      {loading && <LoaderOverlay />}

      <div className={loading ? "pointer-events-none blur-sm" : ""}>
        {error && (
          <div className="mb-4 text-destructive font-medium">
            Error: {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Welcome */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage the entire education system.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Students"
              value={stats.totalStudents.toLocaleString()}
              description="Across all centres"
              icon={Users}
            />
            <StatsCard
              title="Total Centres"
              value={stats.totalCentres.toLocaleString()}
              description="Currently operational"
              icon={Building2}
            />
            <StatsCard
              title="Courses Offered"
              value={stats.totalCourses.toLocaleString()}
              description="Career & Certificate"
              icon={GraduationCap}
            />
            <StatsCard
              title="Total Examinations"
              value={stats.totalExams.toLocaleString()}
              description="Scheduled exams"
              icon={UserCheck}
            />
          </div>

          {/* Modules + Activity */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <ModuleCard
                  title="Centre Management"
                  icon={Building2}
                  features={[]}
                  gradient="bg-gradient-primary"
                  link="/app/centres"
                  description={""}
                />
                <ModuleCard
                  title="Course Management"
                  icon={BookOpen}
                  features={[]}
                  gradient="bg-gradient-accent"
                  link="/app/courses"
                  description={""}
                />
                <ModuleCard
                  title="Student Registration"
                  icon={Users}
                  features={[]}
                  gradient="bg-gradient-secondary"
                  link="/app/students"
                  description={""}
                />
                <ModuleCard
                  title="Examination System"
                  icon={ClipboardCheck}
                  features={[]}
                  gradient="bg-gradient-primary"
                  link="/app/examinations"
                  description={""}
                />
              </div>
            </div>

            <div>
              <RecentActivity />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
