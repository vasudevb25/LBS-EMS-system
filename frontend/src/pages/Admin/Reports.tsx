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
const API_URL = import.meta.env.VITE_API_URL;

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
  const [reportType, setReportType] = useState<string | null>(null);
  const [selectedCentre, setSelectedCentre] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
          fetch(`${API_URL}/api/students/`),
          fetch(`${API_URL}/api/centre-stats/`),
          fetch(`${API_URL}/api/exam-stats/`),
          fetch(`${API_URL}/api/std-stats/`),
          fetch(`${API_URL}/api/courses/`),
          fetch(`${API_URL}/api/centres/`),
        ]);

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

        // ✅ Reset selections to avoid sending invalid IDs
        setSelectedCentre(null);
        setSelectedCourse(null);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };

    fetchData();
  }, []);

  // ✅ Convert JSON to CSV
  const convertToCSV = (data: any[]) => {
    if (!data.length) return "";
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((field) => JSON.stringify(row[field] ?? "")).join(",")
      ),
    ];
    return csvRows.join("\n");
  };

  // ✅ Trigger file download
  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateReport = async () => {
    try {
      let url = `${API_URL}/api/students/`;

      if (reportType === "centre" && selectedCentre) {
        // ✅ Only send valid centre IDs
        const validCentre = centres.find(
          (c) => String(c.centre_id) === selectedCentre
        );
        if (!validCentre) {
          alert(
            "Selected Centre does not exist. Please select a valid Centre."
          );
          return;
        }
        url += `?centre_id=${selectedCentre}`;
      } else if (reportType === "course" && selectedCourse) {
        // ✅ Only send valid course IDs
        const validCourse = courses.find(
          (c) => String(c.course_id) === selectedCourse
        );
        if (!validCourse) {
          alert(
            "Selected Course does not exist. Please select a valid Course."
          );
          return;
        }
        url += `?course_id=${selectedCourse}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch report data");

      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        alert("No students found for this selection.");
        return;
      }

      const csv = convertToCSV(data);

      let filename = "student_report_all.csv";
      if (reportType === "centre" && selectedCentre) {
        const centreName =
          centres.find((c) => String(c.centre_id) === selectedCentre)
            ?.centre_name ?? "unknown_centre";
        filename = `student_report_${centreName.replace(/\s+/g, "_")}.csv`;
      } else if (reportType === "course" && selectedCourse) {
        const courseName =
          courses.find((c) => String(c.course_id) === selectedCourse)
            ?.course_name ?? "unknown_course";
        filename = `student_report_${courseName.replace(/\s+/g, "_")}.csv`;
      }

      downloadCSV(csv, filename);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const reportStats = [
    {
      title: "Total Students",
      value: studentStats?.total_students ?? 0,
      icon: Users,
      description: "Currently enrolled across all centres",
    },
    {
      title: "New Students (Last Month)",
      value: studentStats?.students_joined_last_month ?? 0,
      icon: TrendingUp,
      description: "Registrations compared to previous month",
    },
    {
      title: "Total Centres",
      value: centreStats?.total_centres ?? 0,
      icon: BarChart3,
      description: "Active learning centres",
    },
    {
      title: "Total Exams Conducted",
      value: examTotal,
      icon: GraduationCap,
      description: "Exams conducted till date",
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
          {/* <Button
            className="bg-gradient-primary hover:bg-primary-glow"
            onClick={handleGenerateReport}
            disabled={isLoading}
          >
            <FileText className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate Student Report"}
          </Button> */}
        </div>
      </div>

      {/* Stats */}
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
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                <Select onValueChange={(value) => setReportType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="centre">By Centre</SelectItem>
                    <SelectItem value="course">By Course</SelectItem>
                  </SelectContent>
                </Select>

                {reportType === "centre" && (
                  <Select onValueChange={(value) => setSelectedCentre(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Centre" />
                    </SelectTrigger>
                    <SelectContent>
                      {centres.map((c) => (
                        <SelectItem
                          key={c.centre_id} // must match the id
                          value={String(c.centre_id)} // send ID as string to backend
                        >
                          {c.centre_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {reportType === "course" && (
                  <Select onValueChange={(value) => setSelectedCourse(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem
                          key={course.course_id} // use ID
                          value={String(course.course_id)} // use ID as string
                        >
                          {course.course_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <Button
                  className="w-full"
                  onClick={handleGenerateReport}
                  disabled={
                    isLoading ||
                    !reportType || // no type selected
                    (reportType === "centre" && !selectedCentre) || // centre selected but no centre chosen
                    (reportType === "course" && !selectedCourse) // course selected but no course chosen
                  }
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isLoading ? "Generating..." : "Generate Student Report"}
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
