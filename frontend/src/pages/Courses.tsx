/// <reference types="vite/client" />

import { useState, useEffect } from "react";
import { Button } from "../components/ui/buttons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/layout";
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
import { Input } from "../components/ui/inputs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/overlays";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash,
  Clock,
  FileText,
} from "lucide-react";
import { apiFetch } from "../lib/api";

/* ---------------- TYPES ---------------- */

interface Course {
  course_id: number;
  course_code: string;
  course_name: string;
  stream: "Career" | "Certificate";
  duration: string;
  eligibility: string;
  mou_required: boolean;
  fee: number;
  created_at: string;
}

interface Stats {
  total_courses: number;
  career_courses: number;
  certificate_courses: number;
}

const RoyalityPercentage = 25 / 100;
const GST = 18 / 100;

/* ---------------- PAGE ---------------- */
const isAdmin = localStorage.getItem("is_admin") === "true";

const CoursesPage = () => {
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
    fee: 0,
    mou_required: false,
  });
  /* ---------------- FETCH ---------------- */

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const data: Course[] = await apiFetch("/api/courses/");

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
      console.error(err);
      setError(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /* ---------------- FORM ---------------- */

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : false;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddModal = () => {
    setEditingCourse(null);
    setFormData({
      course_code: "",
      course_name: "",
      stream: "Career",
      duration: "",
      eligibility: "",
      fee: 0,
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
      fee: course.fee,
      mou_required: course.mou_required,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editingCourse ? "PUT" : "POST";
      const url = editingCourse
        ? `/api/courses/${editingCourse.course_id}/`
        : `/api/courses/`;

      await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      await fetchCourses();
      setOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save course");
    }
  };

  const deleteCourse = async (course_id: number) => {
    if (!confirm("Delete this course?")) return;

    try {
      await apiFetch(`/api/courses/${course_id}/`, {
        method: "DELETE",
      });
      await fetchCourses();
    } catch (err: any) {
      alert(err.message || "Failed to delete course");
    }
  };

  /* ---------------- UI ---------------- */

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error loading courses: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Course Management</h1>

        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddModal}>
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCourse ? "Edit Course" : "Add Course"}
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
                  <label className="block text-sm font-medium mb-1">
                    Stream
                  </label>
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

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Lumpsum Fee
                  </label>
                  <Input
                    name="fee"
                    value={formData.fee}
                    type="number"
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
                  {editingCourse ? "Update" : "Save"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Courses
            </CardTitle>
            <FileText className="h-7 w-7 text" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {stats?.total_courses ?? "-"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Career Courses
            </CardTitle>
            <FileText className="h-7 w-7 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {stats?.career_courses ?? "-"}
            </div>
          </CardContent>
        </Card>{" "}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Certificate Courses
            </CardTitle>
            <FileText className="h-7 w-7 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-accent">
              {stats?.certificate_courses ?? "-"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="career">
        <TabsList>
          <TabsTrigger value="career">Career</TabsTrigger>
          <TabsTrigger value="certificate">Certificate</TabsTrigger>
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

/* ---------------- COMPONENTS ---------------- */

const CourseTable = ({
  courses,
  onEdit,
  onDelete,
}: {
  courses: Course[];
  onEdit: (c: Course) => void;
  onDelete: (id: number) => void;
}) => (
  <div className="border rounded-lg overflow-y-auto max-h-[500px]">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Eligibility</TableHead>
          <TableHead>Fees</TableHead>
          <TableHead>MOU</TableHead>
          {isAdmin && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center text-muted-foreground"
            >
              No courses found
            </TableCell>
          </TableRow>
        ) : (
          courses.map((c) => (
            <TableRow key={c.course_id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{c.course_name}</div>
                  <div className="text-sm text-muted-foreground">
                    Code: {c.course_code}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{c.duration}</span>
                </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {c.eligibility}
              </TableCell>{" "}
              <TableCell>
                <div className="space-y-1 text-xs">
                  <div>Lumpsum fees: ₹ {c.fee > 0 ? c.fee : 0}</div>
                  <div>Royality: ₹{RoyalityPercentage * c.fee}</div>
                  <div>GST: ₹{GST * (RoyalityPercentage * c.fee)}</div>
                  <div>
                    Registration fees: ₹
                    {RoyalityPercentage * c.fee +
                      GST * (RoyalityPercentage * c.fee)}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={c.mou_required ? "default" : "secondary"}>
                  {c.mou_required ? "Required" : "Not Required"}
                </Badge>
              </TableCell>
              {isAdmin && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onEdit(c)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(c.course_id)}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);

export default CoursesPage;
