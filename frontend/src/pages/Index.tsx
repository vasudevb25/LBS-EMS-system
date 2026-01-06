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

const Index = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCentres: 0,
    totalCourses: 0,
    totalExams: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, centres, courses, exams] = await Promise.all([
          apiFetch("/api/students/"),
          apiFetch("/api/centres/"),
          apiFetch("/api/courses/"),
          apiFetch("/api/examinations/"),
        ]);

        setStats({
          totalStudents: Array.isArray(students) ? students.length : 0,
          totalCentres: Array.isArray(centres) ? centres.length : 0,
          totalCourses: Array.isArray(courses) ? courses.length : 0,
          totalExams: Array.isArray(exams) ? exams.length : 0,
        });
      } catch (err: any) {
        console.error("Dashboard stats error:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to LBS Education Management System. Monitor and manage your
          educational operations.
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div>Loading stats...</div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
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
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <ModuleCard
              title="Centre Management"
              description=""
              icon={Building2}
              features={[]}
              gradient="bg-gradient-primary"
              link="/app/centres"
            />
            <ModuleCard
              title="Course Management"
              description=""
              icon={BookOpen}
              features={[]}
              gradient="bg-gradient-accent"
              link="/app/courses"
            />
            <ModuleCard
              title="Student Registration"
              description=""
              icon={Users}
              features={[]}
              gradient="bg-gradient-secondary"
              link="/app/students"
            />
            <ModuleCard
              title="Examination System"
              description=""
              icon={ClipboardCheck}
              features={[]}
              gradient="bg-gradient-primary"
              link="/app/examinations"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Index;
