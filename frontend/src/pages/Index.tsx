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
  TrendingUp,
  Calendar,
} from "lucide-react";

const Index = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCentres: 0,
    totalCourses: 0,
    totalExams: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prefix, setPrefix] = useState("/");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, centresRes, coursesRes, examsRes] =
          await Promise.all([
            fetch("http://127.0.0.1:8000/api/students/"),
            fetch("http://127.0.0.1:8000/api/centres/"),
            fetch("http://127.0.0.1:8000/api/courses/"),
            fetch("http://127.0.0.1:8000/api/examinations/"),
          ]);

        if (!studentsRes.ok) throw new Error("Failed to fetch students");
        if (!centresRes.ok) throw new Error("Failed to fetch centres");
        if (!coursesRes.ok) throw new Error("Failed to fetch courses");
        if (!examsRes.ok) throw new Error("Failed to fetch examinations");

        const studentsData = await studentsRes.json();
        const centresData = await centresRes.json();
        const coursesData = await coursesRes.json();
        const examsData = await examsRes.json();

        setStats({
          totalStudents: studentsData.length,
          totalCentres: centresData.length,
          totalCourses: coursesData.length,
          totalExams: examsData.length,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const role = localStorage.getItem("user_role");
    if (role) {
      setPrefix(`/${role.toLowerCase()}`);
    }

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
            title="Total no of examinations"
            value={stats.totalExams.toLocaleString()}
            description="exam work"
            icon={UserCheck}
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Module Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <ModuleCard
              title="Centre Management"
              description=""
              icon={Building2}
              features={[]}
              gradient="bg-gradient-primary"
              link={`${prefix}/centres`}
            />
            <ModuleCard
              title="Course Management"
              description=""
              icon={BookOpen}
              features={[]}
              gradient="bg-gradient-accent"
              link={`${prefix}/courses`}
            />
            <ModuleCard
              title="Student Registration"
              description=""
              icon={Users}
              features={[]}
              gradient="bg-gradient-secondary"
              link={`${prefix}/students`}
            />
            <ModuleCard
              title="Examination System"
              description=""
              icon={ClipboardCheck}
              features={[]}
              gradient="bg-gradient-primary"
              link={`${prefix}/examinations`}
            />
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Index;
