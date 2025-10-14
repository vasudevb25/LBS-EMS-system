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
              description="Manage centres, course allocation, and validity tracking"
              icon={Building2}
              features={[
                "Add/Edit/Delete centres",
                "Course allocation system",
                "Validity date management",
                "Centre performance tracking",
              ]}
              gradient="bg-gradient-primary"
              link="/centres"
            />
            <ModuleCard
              title="Course Management"
              description="Comprehensive course administration and fee structure"
              icon={BookOpen}
              features={[
                "Career & certificate courses",
                "Syllabus & content uploads",
                "Fee structure definition",
                "Eligibility management",
              ]}
              gradient="bg-gradient-accent"
              link="/courses"
            />
            <ModuleCard
              title="Student Registration"
              description="Streamlined student onboarding and data management"
              icon={Users}
              features={[
                "Auto-sync from centres",
                "Approval workflow",
                "Document management",
                "ID generation system",
              ]}
              gradient="bg-gradient-secondary"
              link="/students"
            />
            <ModuleCard
              title="Examination System"
              description="End-to-end exam management and certification"
              icon={ClipboardCheck}
              features={[
                "Exam scheduling",
                "Hall ticket generation",
                "Marks entry & results",
                "QR code certificates",
              ]}
              gradient="bg-gradient-primary"
              link="/examinations"
            />
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          <RecentActivity />

          {/* Quick Actions */}
          <div className="grid gap-3">
            <button className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium">Schedule Exam</span>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </button>

            <button className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-accent" />
                <span className="font-medium">Approve Students</span>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
