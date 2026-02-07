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
import LoaderOverlay from "../components/ui/loadoverlay";

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

const ROYALTY = 0.25;
const GST = 0.18;

/* ---------------- PAGE ---------------- */

const CoursesPage = () => {
  const isAdmin = localStorage.getItem("is_admin") === "true";

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
      setError(null);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
    setFormData(course);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingCourse
      ? `/api/courses/${editingCourse.course_id}/`
      : `/api/courses/`;

    await apiFetch(url, {
      method: editingCourse ? "PUT" : "POST",
      body: JSON.stringify(formData),
    });

    setOpen(false);
    fetchCourses();
  };

  const deleteCourse = async (id: number) => {
    if (!confirm("Delete this course?")) return;
    await apiFetch(`/api/courses/${id}/`, { method: "DELETE" });
    fetchCourses();
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="relative">
      {loading && <LoaderOverlay />}

      <div className={loading ? "pointer-events-none blur-sm" : ""}>
        {error && (
          <div className="mb-4 text-destructive font-medium">{error}</div>
        )}

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Course Management</h1>

            {isAdmin && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAddModal}>
                    <Plus className="mr-2 h-4 w-4" /> Add Course
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingCourse ? "Edit Course" : "Add Course"}
                    </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      name="course_name"
                      placeholder="Course Name"
                      value={formData.course_name}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      name="course_code"
                      placeholder="Course Code"
                      value={formData.course_code}
                      onChange={handleInputChange}
                      required
                    />
                    <select
                      name="stream"
                      value={formData.stream}
                      onChange={handleInputChange}
                      className="border rounded-md w-full p-2"
                    >
                      <option value="Career">Career</option>
                      <option value="Certificate">Certificate</option>
                    </select>
                    <Input
                      name="duration"
                      placeholder="Duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                    />
                    <Input
                      name="eligibility"
                      placeholder="Eligibility"
                      value={formData.eligibility}
                      onChange={handleInputChange}
                    />
                    <Input
                      name="fee"
                      type="number"
                      placeholder="Fee"
                      value={formData.fee}
                      onChange={handleInputChange}
                    />

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="mou_required"
                        checked={formData.mou_required}
                        onChange={handleInputChange}
                      />
                      MOU Required
                    </label>

                    <Button type="submit" className="w-full">
                      {editingCourse ? "Update" : "Save"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard title="Total Courses" value={stats?.total_courses} />
            <StatCard title="Career Courses" value={stats?.career_courses} />
            <StatCard
              title="Certificate Courses"
              value={stats?.certificate_courses}
            />
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
                isAdmin={isAdmin}
              />
            </TabsContent>

            <TabsContent value="certificate">
              <CourseTable
                courses={certificateCourses}
                onEdit={openEditModal}
                onDelete={deleteCourse}
                isAdmin={isAdmin}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;

/* ---------------- HELPERS ---------------- */

function StatCard({ title, value }: { title: string; value?: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{value ?? 0}</div>
      </CardContent>
    </Card>
  );
}

const CourseTable = ({
  courses,
  onEdit,
  onDelete,
  isAdmin,
}: {
  courses: Course[];
  onEdit: (c: Course) => void;
  onDelete: (id: number) => void;
  isAdmin: boolean;
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
              colSpan={6}
              className="text-center text-muted-foreground"
            >
              No courses found
            </TableCell>
          </TableRow>
        ) : (
          courses.map((c) => (
            <TableRow key={c.course_id}>
              <TableCell>
                <div className="font-medium">{c.course_name}</div>
                <div className="text-xs text-muted-foreground">
                  Code: {c.course_code}
                </div>
              </TableCell>
              <TableCell>
                <Clock className="inline h-3 w-3 mr-1" />
                {c.duration}
              </TableCell>
              <TableCell>{c.eligibility}</TableCell>
              <TableCell className="text-xs">
                ₹{c.fee}
                <br />
                Royalty: ₹{ROYALTY * c.fee}
                <br />
                GST: ₹{GST * ROYALTY * c.fee}
              </TableCell>
              <TableCell>
                <Badge>{c.mou_required ? "Required" : "No"}</Badge>
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
