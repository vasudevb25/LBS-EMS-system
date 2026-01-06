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
  DropdownMenuLabel,
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
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/overlays";
import { apiFetch } from "../lib/api";

/* ---------------- TYPES ---------------- */

interface Exam {
  exam_id: number;
  exam_name: string;
  subject_code: string;
  exam_type: "Regular" | "Supplementary";
  exam_date: string;
  exam_start_time: string;
  exam_end_time: string;
  course_name: string;
  centre_name: string;
}

interface ExamStats {
  scheduled_exams_this_month: number;
  total_regular: number;
  total_supply: number;
  total_available: number;
}

/* ---------------- STAT CARD ---------------- */

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value?: number;
  icon: JSX.Element;
}) => (
  <Card>
    <CardHeader className="flex justify-between pb-2">
      <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value ?? 0}</div>
    </CardContent>
  </Card>
);

/* ---------------- COMPONENT ---------------- */

const ExaminationsPage = () => {
  const isAdmin = localStorage.getItem("is_admin") === "true";

  const [exams, setExams] = useState<Exam[]>([]);
  const [stats, setStats] = useState<ExamStats | null>(null);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorExams, setErrorExams] = useState<string | null>(null);
  const [errorStats, setErrorStats] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

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
  });

  /* ---------------- FETCH ---------------- */

  const fetchExams = async () => {
    try {
      setLoadingExams(true);
      const data = await apiFetch("/api/examinations/");
      setExams(
        data.map((e: any) => ({
          ...e,
          exam_id: e.exam_id ?? e.id,
        }))
      );
    } catch (err: any) {
      setErrorExams(err.message || "Failed to load exams");
    } finally {
      setLoadingExams(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const data = await apiFetch("/api/exam-stats/");
      setStats(data);
    } catch (err: any) {
      setErrorStats(err.message || "Failed to load stats");
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchCourses = async () => {
    const data = await apiFetch("/api/courses/");
    setCourses(data);
  };

  const fetchCentres = async () => {
    const data = await apiFetch("/api/centres/");
    setCentres(data);
  };

  useEffect(() => {
    fetchExams();
    fetchStats();
    fetchCourses();
    fetchCentres();
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

    if (editingId) {
      await apiFetch(`/api/examinations/${editingId}/`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
    } else {
      await apiFetch("/api/examinations/", {
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
    });
    fetchExams();
  };

  const deleteExam = async (id: number) => {
    if (!confirm("Delete this exam?")) return;
    await apiFetch(`/api/examinations/${id}/`, { method: "DELETE" });
    fetchExams();
  };

  /* ---------------- FILTER ---------------- */

  const filteredExams = exams.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.exam_name.toLowerCase().includes(q) ||
      e.subject_code.toLowerCase().includes(q) ||
      e.course_name.toLowerCase().includes(q) ||
      e.centre_name.toLowerCase().includes(q)
    );
  });

  /* ---------------- UI ---------------- */

  return (
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
                    setFormData({ ...formData, subject_code: e.target.value })
                  }
                />

                <select
                  className="w-full border p-2 rounded"
                  value={formData.exam_type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      exam_type: e.target.value as any,
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
                    setFormData({ ...formData, course_name: e.target.value })
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
                    setFormData({ ...formData, centre_name: e.target.value })
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

      {/* Stats */}
      {loadingStats ? (
        <div>Loading stats...</div>
      ) : errorStats ? (
        <div className="text-destructive">{errorStats}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Scheduled"
            value={stats?.scheduled_exams_this_month}
            icon={<Calendar />}
          />
          <StatCard
            title="Regular"
            value={stats?.total_regular}
            icon={<FileText />}
          />
          <StatCard
            title="Supplementary"
            value={stats?.total_supply}
            icon={<ClipboardCheck />}
          />
          <StatCard
            title="Available"
            value={stats?.total_available}
            icon={<Award />}
          />
        </div>
      )}

      {/* Exams */}
      <Tabs defaultValue="schedule">
        <TabsList>
          <TabsTrigger value="schedule">Exam Schedule</TabsTrigger>
          <TabsTrigger value="halltickets">Hall Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          {loadingExams ? (
            <div>Loading exams...</div>
          ) : errorExams ? (
            <div className="text-destructive">{errorExams}</div>
          ) : (
            <Card>
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
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Centre</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExams.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No exams found.
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredExams.map((e) => (
                      <TableRow key={e.exam_id}>
                        <TableCell>
                          <div className="font-medium">{e.exam_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {e.subject_code}
                          </div>
                        </TableCell>
                        <TableCell>{e.exam_date}</TableCell>
                        <TableCell>
                          <Badge>{e.exam_type}</Badge>
                        </TableCell>
                        <TableCell>{e.centre_name}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingId(e.exam_id);
                                  setFormData({ ...e });
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="halltickets">
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Hall ticket generation coming next
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExaminationsPage;
