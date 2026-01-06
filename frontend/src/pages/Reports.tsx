/// <reference types="vite/client" />

import { useState, useEffect } from "react";
import { Button } from "../components/ui/buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/layout";
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
} from "../components/ui/data";
import {
  Download,
  BarChart3,
  TrendingUp,
  Users,
  GraduationCap,
} from "lucide-react";
import { apiFetch } from "../lib/api";

/* ---------------- Interfaces ---------------- */

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

/* ---------------- Component ---------------- */

const ReportsPage = () => {
  const [centres, setCentres] = useState<Centre[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);
  const [examTotal, setExamTotal] = useState(0);
  const [centreStats, setCentreStats] = useState<CentreStats | null>(null);

  const [reportType, setReportType] = useState<"centre" | "course" | null>(
    null
  );
  const [selectedCentre, setSelectedCentre] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /* ---------------- Fetch Dashboard Data ---------------- */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          students,
          centreStatsData,
          examStats,
          stdStats,
          coursesData,
          centresData,
        ] = await Promise.all([
          apiFetch("/api/students/"),
          apiFetch("/api/centre-stats/"),
          apiFetch("/api/exam-stats/"),
          apiFetch("/api/std-stats/"),
          apiFetch("/api/courses/"),
          apiFetch("/api/centres/"),
        ]);

        setCentres(centresData);
        setCourses(coursesData);
        setCentreStats(centreStatsData);
        setExamTotal(examStats?.total_available ?? 0);

        setStudentStats({
          total_students: students.length,
          students_joined_last_month: stdStats?.students_joined_last_month ?? 0,
        });

        setSelectedCentre(null);
        setSelectedCourse(null);
      } catch (err) {
        console.error("Error fetching report data:", err);
      }
    };

    fetchData();
  }, []);

  /* ---------------- CSV Helpers ---------------- */

  const convertToCSV = (data: any[]) => {
    if (!data.length) return "";
    const headers = Object.keys(data[0]);
    return [
      headers.join(","),
      ...data.map((row) =>
        headers.map((h) => JSON.stringify(row[h] ?? "")).join(",")
      ),
    ].join("\n");
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ---------------- Generate Report ---------------- */

  const handleGenerateReport = async () => {
    try {
      setIsLoading(true);

      let url = "/api/students/";

      if (reportType === "centre" && selectedCentre) {
        url += `?centre_id=${selectedCentre}`;
      }

      if (reportType === "course" && selectedCourse) {
        url += `?course_id=${selectedCourse}`;
      }

      const data = await apiFetch(url);

      if (!Array.isArray(data) || data.length === 0) {
        alert("No students found for this selection.");
        return;
      }

      let filename = "student_report_all.csv";

      if (reportType === "centre") {
        const centreName =
          centres.find((c) => String(c.centre_id) === selectedCentre)
            ?.centre_name ?? "centre";
        filename = `student_report_${centreName.replace(/\s+/g, "_")}.csv`;
      }

      if (reportType === "course") {
        const courseName =
          courses.find((c) => String(c.course_id) === selectedCourse)
            ?.course_name ?? "course";
        filename = `student_report_${courseName.replace(/\s+/g, "_")}.csv`;
      }

      downloadCSV(convertToCSV(data), filename);
    } catch (err) {
      console.error("Error generating report:", err);
      alert("Failed to generate report.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- Stats ---------------- */

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
      description: "Recent registrations",
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
      description: "Exams till date",
    },
  ];

  /* ---------------- Render ---------------- */

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground">
          Generate comprehensive reports and analyze performance metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {reportStats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">
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

      <Tabs defaultValue="generate">
        <TabsList>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Student Reports</CardTitle>
              <CardDescription>
                Export student data by centre or course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={(v) => setReportType(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="centre">By Centre</SelectItem>
                  <SelectItem value="course">By Course</SelectItem>
                </SelectContent>
              </Select>

              {reportType === "centre" && (
                <Select onValueChange={setSelectedCentre}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Centre" />
                  </SelectTrigger>
                  <SelectContent>
                    {centres.map((c) => (
                      <SelectItem key={c.centre_id} value={String(c.centre_id)}>
                        {c.centre_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {reportType === "course" && (
                <Select onValueChange={setSelectedCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c.course_id} value={String(c.course_id)}>
                        {c.course_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Button
                onClick={handleGenerateReport}
                disabled={
                  isLoading ||
                  !reportType ||
                  (reportType === "centre" && !selectedCentre) ||
                  (reportType === "course" && !selectedCourse)
                }
              >
                <Download className="mr-2 h-4 w-4" />
                {isLoading ? "Generating..." : "Generate Student Report"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
