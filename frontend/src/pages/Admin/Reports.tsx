import { useState, useEffect } from "react";
import { Button } from "../../components/ui/buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/data";
import {
  FileText,
  Download,
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  GraduationCap,
} from "lucide-react";

// Define types
interface Centre {
  centre_id: number;
  centre_name: string;
}

interface Course {
  course_id: number;
  course_name: string;
}

interface StudentStats {
  total_students: number;
  students_joined_last_month: number;
}

interface CentreStats {
  total_centres: number;
}

const AdminReports = () => {
  const [centres, setCentres] = useState<Centre[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);
  const [examTotal, setExamTotal] = useState<number>(0);
  const [centreStats, setCentreStats] = useState<CentreStats | null>(null);
  const [reportType, setReportType] = useState<string | null>(null); // FIXED: moved here

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          studentsRes,
          centresStatsRes,
          examsRes,
          stdStatsRes,
          coursesRes,
          centresListRes,
        ] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/students/"),
          fetch("http://127.0.0.1:8000/api/centre-stats/"),
          fetch("http://127.0.0.1:8000/api/exam-stats/"),
          fetch("http://127.0.0.1:8000/api/std-stats/"),
          fetch("http://127.0.0.1:8000/api/courses/"),
          fetch("http://127.0.0.1:8000/api/centres/"), // dropdown data
        ]);

        if (!studentsRes.ok)
          throw new Error(`Students API error: ${studentsRes.status}`);

        const studentsData = await studentsRes.json();
        const centresStatsData = await centresStatsRes.json();
        const examsData = await examsRes.json();
        const stdStatsData = await stdStatsRes.json();
        const coursesData = await coursesRes.json();
        const centresListData = await centresListRes.json();

        setCentres(centresListData);
        setCourses(coursesData);
        setCentreStats(centresStatsData);
        setExamTotal(examsData.total_available ?? 0);
        setStudentStats({
          total_students: studentsData.length,
          students_joined_last_month:
            stdStatsData.students_joined_last_month ?? 0,
        });
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };

    fetchData();
  }, []);

  const reportStats: {
    title: string;
    value: number;
    icon: any;
    description: string;
    change?: string;
  }[] = [
    {
      title: "Total Students",
      value: studentStats?.total_students ?? 0,
      icon: Users,
      description: "Currently enrolled across all centres",
      change: undefined,
    },
    {
      title: "New Students (Last Month)",
      value: studentStats?.students_joined_last_month ?? 0,
      icon: TrendingUp,
      description: "Registrations compared to previous month",
      change: undefined,
    },
    {
      title: "Total Centres",
      value: centreStats?.total_centres ?? 0,
      icon: BarChart3,
      description: "Active learning centres",
      change: undefined,
    },
    {
      title: "Total Exams Conducted",
      value: examTotal,
      icon: GraduationCap,
      description: "Exams conducted till date",
      change: undefined,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            Generate comprehensive reports and analyze performance metrics
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button className="bg-gradient-primary hover:bg-primary-glow">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        {reportStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <span className="text-xs font-medium text-success">
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Student Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Student Reports</span>
                </CardTitle>
                <CardDescription>
                  Registration, enrollment, and performance reports
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Report Type Selector */}
                <Select onValueChange={(value) => setReportType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="centre">By Centre</SelectItem>
                    <SelectItem value="course">By Course</SelectItem>
                  </SelectContent>
                </Select>

                {/* Conditional dropdowns */}
                <div className="grid gap-2 grid-cols-1">
                  {reportType === "centre" && (
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Centre" />
                      </SelectTrigger>
                      <SelectContent>
                        {centres.map((c) => (
                          <SelectItem
                            key={c.centre_id}
                            value={String(c.centre_id)}
                          >
                            {c.centre_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {reportType === "course" && (
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem
                            key={course.course_id}
                            value={String(course.course_name)}
                          >
                            {course.course_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Generate Student Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
