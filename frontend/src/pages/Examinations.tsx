/// <reference types="vite/client" />

import { useEffect, useState } from "react";
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
  DropdownMenuTrigger,
} from "../components/ui/menus";
import {
  Plus,
  MoreHorizontal,
  Calendar,
  FileText,
  Award,
  ClipboardCheck,
  Edit,
  Trash,
  Users,
  Eye,
  BookOpenCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/overlays";
import { apiFetch } from "../lib/api";
import LoaderOverlay from "../components/ui/loadoverlay";

/* ---------------- TYPES ---------------- */

interface Exam {
  exam_id: number;
  exam_name: string;
  subject_code: string;
  exam_type: "Regular" | "Supplementary";
  exam_date: string;
  exam_start_time: string;
  exam_end_time: string;
  course: number;
  centre: number;
  course_name?: string;
  centre_name?: string;
  exam_fee: number;
}

interface ExamStats {
  scheduled_exams_this_month: number;
  total_regular: number;
  total_supply: number;
  total_available: number;
}

/* ---------------- HELPERS ---------------- */

const calculateDuration = (startTime: string, endTime: string): string => {
  if (!startTime || !endTime) return "";
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const mins = eh * 60 + em - (sh * 60 + sm);
  return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
};

/* ---------------- COMPONENT ---------------- */

const ExaminationsPage = () => {
  const isAdmin = localStorage.getItem("is_admin") === "true";

  /* GLOBAL LOADER */
  const [loading, setLoading] = useState(false);

  const [exams, setExams] = useState<Exam[]>([]);
  const [stats, setStats] = useState<ExamStats | null>(null);

  const [errorExams, setErrorExams] = useState<string | null>(null);
  const [errorStats, setErrorStats] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewingExam, setViewingExam] = useState<Exam | null>(null);

  const [courses, setCourses] = useState<any[]>([]);
  const [centres, setCentres] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    exam_name: "",
    subject_code: "",
    exam_type: "Regular" as "Regular" | "Supplementary",
    exam_date: "",
    exam_start_time: "",
    exam_end_time: "",
    course_name: "",
    centre_name: "",
    exam_fee: 0,
  });

  /* ---------------- FETCH ---------------- */

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [coursesData, centresData, examsData, statsData] =
        await Promise.all([
          apiFetch("/courses/"),
          apiFetch("/centres/"),
          apiFetch("/examinations/"),
          apiFetch("/exam-stats/"),
        ]);

      const courseMap = Object.fromEntries(
        coursesData.map((c: any) => [c.course_id, c.course_name]),
      );

      const centreMap = Object.fromEntries(
        centresData.map((c: any) => [c.centre_id, c.centre_name]),
      );

      setCourses(coursesData);
      setCentres(centresData);
      setStats(statsData);

      setExams(
        examsData.map((e: any) => ({
          ...e,
          exam_id: e.exam_id ?? e.id,
          course_name: courseMap[e.course] ?? "Unknown Course",
          centre_name: centreMap[e.centre] ?? "Unknown Centre",
        })),
      );
    } catch (err: any) {
      setErrorExams(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ---------------- CRUD ---------------- */

  const saveExam = async () => {
    if (
      !formData.exam_name ||
      !formData.subject_code ||
      !formData.course_name ||
      !formData.centre_name
    ) {
      alert("Fill all required fields");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await apiFetch(`/examinations/${editingId}/`, {
          method: "PATCH",
          body: JSON.stringify(formData),
        });
      } else {
        await apiFetch("/examinations/", {
          method: "POST",
          body: JSON.stringify(formData),
        });
      }

      setOpen(false);
      setEditingId(null);

      setFormData({
        exam_name: "",
        subject_code: "",
        exam_type: "Regular",
        exam_date: "",
        exam_start_time: "",
        exam_end_time: "",
        course_name: "",
        centre_name: "",
        exam_fee: 0,
      });

      await fetchAll();
    } finally {
      setLoading(false);
    }
  };

  const deleteExam = async (id: number) => {
    if (!confirm("Delete this exam?")) return;

    try {
      setLoading(true);
      await apiFetch(`/examinations/${id}/`, { method: "DELETE" });
      await fetchAll();
    } finally {
      setLoading(false);
    }
  };
  const onView = (exam: Exam) => {
    setViewingExam(exam);
    setViewOpen(true);
  };
  /* ---------------- FILTER ---------------- */

  const filteredExams = exams.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.exam_name.toLowerCase().includes(q) ||
      e.subject_code.toLowerCase().includes(q) ||
      (e.course_name ?? "").toLowerCase().includes(q) ||
      (e.centre_name ?? "").toLowerCase().includes(q)
    );
  });

  /* ---------------- UI ---------------- */

  return (
    <div className="relative">
      {loading && <LoaderOverlay />}

      <div className={loading ? "pointer-events-none blur-sm" : ""}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Examination System</h1>
              <p className="text-muted-foreground">
                Manage exams, schedules, and hall tickets
              </p>
            </div>

            {isAdmin && (
              <Dialog
                open={open}
                onOpenChange={(v) => {
                  setOpen(v);
                  if (!v) setEditingId(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {editingId ? "Edit Exam" : "Schedule Exam"}
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? "Edit Exam" : "Schedule New Exam"}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-3">
                    <Input
                      placeholder="Exam Name"
                      value={formData.exam_name}
                      onChange={(e) =>
                        setFormData({ ...formData, exam_name: e.target.value })
                      }
                    />

                    <Input
                      placeholder="Subject Code"
                      value={formData.subject_code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subject_code: e.target.value,
                        })
                      }
                    />

                    <select
                      className="w-full border p-2 rounded"
                      value={formData.exam_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          exam_type: e.target.value as
                            | "Regular"
                            | "Supplementary",
                        })
                      }
                    >
                      <option value="Regular">Regular</option>
                      <option value="Supplementary">Supplementary</option>
                    </select>

                    <Input
                      type="date"
                      value={formData.exam_date}
                      onChange={(e) =>
                        setFormData({ ...formData, exam_date: e.target.value })
                      }
                    />

                    <Input
                      type="time"
                      value={formData.exam_start_time}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          exam_start_time: e.target.value,
                        })
                      }
                    />

                    <Input
                      type="time"
                      value={formData.exam_end_time}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          exam_end_time: e.target.value,
                        })
                      }
                    />

                    <select
                      className="w-full border p-2 rounded"
                      value={formData.course_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          course_name: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Course</option>
                      {courses.map((c) => (
                        <option key={c.course_id} value={c.course_name}>
                          {c.course_name}
                        </option>
                      ))}
                    </select>

                    <select
                      className="w-full border p-2 rounded"
                      value={formData.centre_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          centre_name: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Centre</option>
                      {centres.map((c) => (
                        <option key={c.centre_id} value={c.centre_name}>
                          {c.centre_name}
                        </option>
                      ))}
                    </select>

                    <Button className="w-full" onClick={saveExam}>
                      {editingId ? "Update Exam" : "Create Exam"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Scheduled Exams
                </CardTitle>
                <Calendar className="h-7 w-7 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.scheduled_exams_this_month ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Regular
                </CardTitle>
                <FileText className="h-7 w-7 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {stats?.total_regular ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">exams</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Supplementary
                </CardTitle>
                <ClipboardCheck className="h-7 w-7 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">
                  {stats?.total_supply ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">exams</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Available
                </CardTitle>
                <BookOpenCheck className="h-7 w-7 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {stats?.total_available ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">exams</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Cetificates
                </CardTitle>
                <Award className="h-7 w-7 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">
                  {stats?.total_available ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Generated this month
                </p>
              </CardContent>
            </Card>
          </div>
          {/* Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2"></CardHeader>
            <CardContent>
              <Input
                placeholder="Search exams..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam</TableHead>

                    <TableHead>Schedule</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Centre</TableHead>
                    <TableHead>Exam Fees</TableHead>
                    {isAdmin && <TableHead />}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredExams.map((e) => (
                    <TableRow key={e.exam_id}>
                      <TableCell>
                        <div className="font-medium">{e.exam_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {e.subject_code}
                        </div>
                      </TableCell>

                      <TableCell>
                        {e.exam_date} •{" "}
                        {calculateDuration(e.exam_start_time, e.exam_end_time)}
                      </TableCell>

                      <TableCell>
                        <Badge>{e.exam_type}</Badge>
                      </TableCell>

                      <TableCell>{e.centre_name}</TableCell>

                      <TableCell>
                        {e.exam_fee ? e.exam_fee.toLocaleString() : "N/A"}
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
                              <DropdownMenuItem onClick={() => onView(e)}>
                                <Eye className="mr-2 h-4 w-4" /> View
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingId(e.exam_id);
                                  setFormData({
                                    exam_name: e.exam_name,
                                    subject_code: e.subject_code,
                                    exam_type: e.exam_type,
                                    exam_date: e.exam_date,
                                    exam_start_time: e.exam_start_time,
                                    exam_end_time: e.exam_end_time,
                                    course_name: e.course_name ?? "",
                                    centre_name: e.centre_name ?? "",
                                    exam_fee: e.exam_fee ?? 0,
                                  });
                                  setOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => deleteExam(e.exam_id)}
                              >
                                <Trash className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Dialog open={viewOpen} onOpenChange={setViewOpen}>
            <DialogContent>
              {viewingExam && (
                <div className="space-y-6 text-base">
                  <div className="border-b pb-4">
                    <h2 className="text-3xl font-bold">
                      {viewingExam.exam_name}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Code: {viewingExam.subject_code}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                    <div>
                      <p className="font-semibold text-muted-foreground">
                        Course
                      </p>
                      <p className="text-xl">{viewingExam.course_name}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-muted-foreground">
                        Centre
                      </p>
                      <p className="text-xl">{viewingExam.centre_name}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-muted-foreground">
                        Exam Type
                      </p>
                      <Badge className="text-base px-4 py-1">
                        {viewingExam.exam_type}
                      </Badge>
                    </div>

                    <div>
                      <p className="font-semibold text-muted-foreground">
                        Date
                      </p>
                      <p className="text-xl">{viewingExam.exam_date}</p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="font-semibold text-muted-foreground">
                        Time
                      </p>
                      <p className="text-xl">
                        {viewingExam.exam_start_time} –{" "}
                        {viewingExam.exam_end_time} (
                        {calculateDuration(
                          viewingExam.exam_start_time,
                          viewingExam.exam_end_time,
                        )}
                        )
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ExaminationsPage;
