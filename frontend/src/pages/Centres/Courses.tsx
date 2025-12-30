import { useState, useEffect } from "react";
import { Button } from "../../components/ui/buttons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/layout";
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
} from "../../components/ui/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../components/ui/menus";
import { Input } from "../../components/ui/inputs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/overlays";

import { Plus, MoreHorizontal, Edit, Trash, Clock } from "lucide-react";

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

const CentreCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [careerCourses, setCareerCourses] = useState<Course[]>([]);
  const [certificateCourses, setCertificateCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    course_code: "",
    course_name: "",
    stream: "Career",
    duration: "",
    eligibility: "",
    mou_required: false,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/courses/");
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data: Course[] = await res.json();

      setCourses(data);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : false;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const openAddModal = () => {
    setEditingCourse(null);
    setFormData({
      course_code: "",
      course_name: "",
      stream: "Career",
      duration: "",
      eligibility: "",
      mou_required: false,
    });
    setOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      course_code: course.course_code,
      course_name: course.course_name,
      stream: course.stream,
      duration: course.duration,
      eligibility: course.eligibility,
      mou_required: course.mou_required,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editingCourse ? "PUT" : "POST";
      const url = editingCourse
        ? `http://127.0.0.1:8000/api/courses/${editingCourse.course_id}/`
        : "http://127.0.0.1:8000/api/courses/";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        let errorMsg = `HTTP ${res.status} - ${res.statusText}`;
        try {
          const data = await res.json();
          if (typeof data === "object" && data !== null) {
            errorMsg = Object.entries(data)
              .map(([field, value]) => `${field}: ${value}`)
              .join("\n");
          } else if (typeof data === "string") {
            errorMsg = data;
          }
        } catch (jsonErr) {
          // fallback if JSON parsing fails
        }
        throw new Error(errorMsg);
      }

      await fetchCourses();
      setOpen(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Unknown error";
      alert("Error saving course:\n" + message);
      console.error(err);
    }
  };

  const deleteCourse = async (course_id: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/courses/${course_id}/`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        let errorMsg = `HTTP ${res.status} - ${res.statusText}`;
        try {
          const data = await res.json();
          if (typeof data === "object" && data !== null) {
            errorMsg = Object.entries(data)
              .map(([field, value]) => `${field}: ${value}`)
              .join("\n");
          } else if (typeof data === "string") {
            errorMsg = data;
          }
        } catch (jsonErr) {
          // fallback if JSON parsing fails
        }
        throw new Error(errorMsg);
      }

      await fetchCourses();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Unknown error";
      alert("Error deleting course:\n" + message);
      console.error(err);
    }
  };

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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openAddModal}
              className="bg-gradient-primary hover:bg-primary-glow"
            >
              <Plus className="mr-2 h-4 w-4" />
              {editingCourse ? "Edit Course" : "Add Course"}
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? "Edit Course" : "Add New Course"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Course Name
                </label>
                <Input
                  name="course_name"
                  value={formData.course_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Course Code
                </label>
                <Input
                  name="course_code"
                  value={formData.course_code}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Stream</label>
                <select
                  name="stream"
                  value={formData.stream}
                  onChange={handleInputChange}
                  className="border rounded-md w-full p-2"
                >
                  <option value="Career">Career</option>
                  <option value="Certificate">Certificate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Duration
                </label>
                <Input
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Eligibility
                </label>
                <Input
                  name="eligibility"
                  value={formData.eligibility}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="mou_required"
                  checked={formData.mou_required}
                  onChange={handleInputChange}
                />
                <label className="text-sm">MOU Required</label>
              </div>

              <Button type="submit" className="w-full mt-2">
                {editingCourse ? "Update Course" : "Save Course"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
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
            <CardTitle className="text-sm text-muted-foreground">
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
            <CardTitle className="text-sm text-muted-foreground">
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

        <TabsContent value="career">
          <CourseTable
            courses={careerCourses}
            onEdit={openEditModal}
            onDelete={deleteCourse}
          />
        </TabsContent>

        <TabsContent value="certificate">
          <CourseTable
            courses={certificateCourses}
            onEdit={openEditModal}
            onDelete={deleteCourse}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

/* --- Table Component --- */
const CourseTable = ({
  courses,
  onEdit,
  onDelete,
}: {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (id: number) => void;
}) => (
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
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">{course.duration}</span>
              </div>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {course.eligibility}
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
                  <DropdownMenuItem onClick={() => onEdit(course)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(course.course_id)}
                  >
                    <Trash className="mr-2 h-4 w-4" /> Delete
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

export default CentreCourses;
