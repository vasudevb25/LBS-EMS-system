import { StatsCard, ModuleCard, RecentActivity } from "../components/Dashboard/DashboardComponents";
import { 
  Users, 
  GraduationCap, 
  Building2, 
  ClipboardCheck,
  UserCheck,
  BookOpen,
  TrendingUp,
  Calendar
} from "lucide-react";

const Index = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to LBS Education Management System. Monitor and manage your educational operations.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value="2,847"
          description="Across all centres"
          icon={Users}
          trend={{ value: 12, label: "from last month" }}
        />
        <StatsCard
          title="Active Centres"
          value="45"
          description="Currently operational"
          icon={Building2}
          trend={{ value: 8, label: "from last month" }}
        />
        <StatsCard
          title="Courses Offered"
          value="28"
          description="Career & Certificate"
          icon={GraduationCap}
        />
        <StatsCard
          title="Pending Registrations"
          value="156"
          description="Awaiting approval"
          icon={UserCheck}
          trend={{ value: -5, label: "from yesterday" }}
        />
      </div>

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
                "Centre performance tracking"
              ]}
              gradient="bg-gradient-primary"
            />
            <ModuleCard
              title="Course Management"
              description="Comprehensive course administration and fee structure"
              icon={BookOpen}
              features={[
                "Career & certificate courses",
                "Syllabus & content uploads",
                "Fee structure definition",
                "Eligibility management"
              ]}
              gradient="bg-gradient-accent"
            />
            <ModuleCard
              title="Student Registration"
              description="Streamlined student onboarding and data management"
              icon={Users}
              features={[
                "Auto-sync from centres",
                "Approval workflow",
                "Document management",
                "ID generation system"
              ]}
              gradient="bg-gradient-secondary"
            />
            <ModuleCard
              title="Examination System"
              description="End-to-end exam management and certification"
              icon={ClipboardCheck}
              features={[
                "Exam scheduling",
                "Hall ticket generation", 
                "Marks entry & results",
                "QR code certificates"
              ]}
              gradient="bg-gradient-primary"
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
