import { useState, useEffect } from "react";
import { Button } from "../components/ui/buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/layout";
import { Input } from "../components/ui/inputs";
import {
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../components/ui/menus";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash,
  FileText,
  Clock,
  Users,
  DollarSign,
} from "lucide-react";

interface Course {
  course_id: number;
  course_code: string;
  course_name: string;
  stream: "Career" | "Certificate";
  duration: string;
  eligibility: string;
  mou_required: boolean;
  created_at: string;
}

interface Stats {
  total_courses: number;
  career_courses: number;
  certificate_courses: number;
}

const CourseTable = ({ courses }: { courses: Course[] }) => (
  <div className="max-h-[500px] overflow-y-auto border rounded-lg">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course Details</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Eligibility</TableHead>
          <TableHead>MOU Required</TableHead>
          <TableHead className="w-[70px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course) => (
          <TableRow key={course.course_id}>
            <TableCell>
              <div className="space-y-1">
                <div className="font-medium">{course.course_name}</div>
                <div className="text-sm text-muted-foreground">
                  Code: {course.course_code}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{course.duration}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="text-xs text-muted-foreground">
                {course.eligibility}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={course.mou_required ? "default" : "secondary"}>
                {course.mou_required ? "Required" : "Not Required"}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Course
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    Manage Syllabus
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Course
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const Courses = () => {
  const [careerCourses, setCareerCourses] = useState<Course[]>([]);
  const [certificateCourses, setCertificateCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/courses/?format=json"
        );
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data: Course[] = await res.json();

        const career = data.filter((c) => c.stream === "Career");
        const certificate = data.filter((c) => c.stream === "Certificate");

        setCareerCourses(career);
        setCertificateCourses(certificate);
        setStats({
          total_courses: data.length,
          career_courses: career.length,
          certificate_courses: certificate.length,
        });
      } catch (err: any) {
        console.error("Error loading courses:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error loading courses: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Course Management
          </h1>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-glow">
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_courses ?? "-"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Career Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats?.career_courses ?? "-"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Certificate Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {stats?.certificate_courses ?? "-"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="career" className="space-y-4">
        <TabsList>
          <TabsTrigger value="career">Career Courses</TabsTrigger>
          <TabsTrigger value="certificate">Certificate Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="career" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Career Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseTable courses={careerCourses} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseTable courses={certificateCourses} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Courses;
