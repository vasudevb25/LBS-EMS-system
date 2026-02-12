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
  Eye,
  BookText,
  BookCheck,
  Bookmark,
  BookmarkCheck,
  BookMarked,
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

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);

  const [formData, setFormData] = useState({
    course_code: "",
    course_name: "",
    stream: "Career",
    duration: "",
    eligibility: "",
    fee: 0,
    mou_required: false,
  });

  /* ---------- FILTER ---------- */
  const filtered = courses.filter(
    (c) =>
      c.course_name.toLowerCase().includes(search.toLowerCase()) ||
      c.stream.toLowerCase().includes(search.toLowerCase()) ||
      c.course_code.toLowerCase().includes(search.toLowerCase()),
  );

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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Courses
                </CardTitle>
                <BookText className="h-7 w-7 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {stats?.total_courses ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Career & Certificate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Career Courses
                </CardTitle>
                <BookCheck className="h-7 w-7 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {stats?.career_courses ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Long-term programs
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Certificate Courses
                </CardTitle>
                <BookMarked className="h-7 w-7 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">
                  {stats?.certificate_courses ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Short-term programs
                </p>
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
                onView={setViewingCourse}
                isAdmin={isAdmin}
              />
            </TabsContent>

            <TabsContent value="certificate">
              <CourseTable
                courses={certificateCourses}
                onEdit={openEditModal}
                onDelete={deleteCourse}
                onView={setViewingCourse}
                isAdmin={isAdmin}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* VIEW DIALOG */}
      <Dialog
        open={!!viewingCourse}
        onOpenChange={() => setViewingCourse(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Course Details</DialogTitle>
          </DialogHeader>

          {viewingCourse && (
            <div className="space-y-6 text-base">
              {/* Header Section */}
              <div className="border-b pb-4">
                <h2 className="text-3xl font-bold">
                  {viewingCourse.course_name}
                </h2>
                <p className="text-muted-foreground text-lg">
                  Code: {viewingCourse.course_code}
                </p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                <div className="space-y-2">
                  <p className="font-semibold text-muted-foreground">Stream</p>
                  <p className="text-xl">{viewingCourse.stream}</p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-muted-foreground">
                    Duration
                  </p>
                  <p className="text-xl">{viewingCourse.duration}</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <p className="font-semibold text-muted-foreground">
                    Eligibility
                  </p>
                  <p className="text-lg leading-relaxed">
                    {viewingCourse.eligibility}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-muted-foreground">Fee</p>
                  <p className="text-2xl font-bold text-primary">
                    ₹ {viewingCourse.fee}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-muted-foreground">
                    MOU Requirement
                  </p>
                  <Badge
                    variant={
                      viewingCourse.mou_required ? "default" : "secondary"
                    }
                    className="text-base px-4 py-1"
                  >
                    {viewingCourse.mou_required ? "Required" : "Not Required"}
                  </Badge>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="border-t pt-4">
                <h3 className="text-xl font-semibold mb-3">
                  Financial Breakdown
                </h3>
                <div className="space-y-2 text-lg">
                  <p>Royalty (25%): ₹ {viewingCourse.fee * 0.25}</p>
                  <p>
                    GST (18% of Royalty): ₹ {viewingCourse.fee * 0.25 * 0.18}
                  </p>
                  <p className="font-bold text-primary">
                    Registration Total: ₹{" "}
                    {viewingCourse.fee * 0.25 + viewingCourse.fee * 0.25 * 0.18}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoursesPage;

/* ---------------- HELPERS ---------------- */

const CourseTable = ({
  courses,
  onEdit,
  onDelete,
  onView,
  isAdmin,
}: {
  courses: Course[];
  onEdit: (c: Course) => void;
  onDelete: (id: number) => void;
  onView: (c: Course) => void;
  isAdmin: boolean;
}) => {
  const [search, setSearch] = useState("");

  const filteredCourses = courses.filter(
    (c) =>
      c.course_name.toLowerCase().includes(search.toLowerCase()) ||
      c.stream.toLowerCase().includes(search.toLowerCase()) ||
      c.course_code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="border rounded-lg overflow-y-auto max-h-[500px]">
      <Card>
        <CardHeader />
        <CardContent>
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />

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
              {filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={isAdmin ? 6 : 5}
                    className="text-center text-muted-foreground"
                  >
                    No courses found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((c) => (
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
                      Royalty: ₹{(c.fee * ROYALTY).toFixed(2)}
                      <br />
                      GST: ₹{(c.fee * ROYALTY * GST).toFixed(2)}
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
                            <DropdownMenuItem onClick={() => onView(c)}>
                              <Eye className="mr-2 h-4 w-4" /> View
                            </DropdownMenuItem>

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
        </CardContent>
      </Card>
    </div>
  );
};
