import { useState, useEffect } from "react";
import { Button } from "../../components/ui/buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/layout";
import { Input } from "../../components/ui/inputs";
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
} from "../../components/ui/overlays";

const API_URL = import.meta.env.VITE_API_URL;

// ------------------ Interfaces ------------------

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

// ------------------ Main Component ------------------

const AdminExaminations = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [stats, setStats] = useState<ExamStats | null>(null);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorExams, setErrorExams] = useState<string | null>(null);
  const [errorStats, setErrorStats] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [editingExamId, setEditingExamId] = useState<number | null>(null);

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

  const [courses, setCourses] = useState<any[]>([]);
  const [centres, setCentres] = useState<any[]>([]);

  const filteredExams = exams.filter((exam) => {
    const q = searchQuery.toLowerCase();
    return (
      (exam.course_name?.toLowerCase() ?? "").includes(q) ||
      (exam.centre_name?.toLowerCase() ?? "").includes(q) ||
      (exam.exam_name?.toLowerCase() ?? "").includes(q) ||
      (exam.subject_code?.toLowerCase() ?? "").includes(q)
    );
  });

  // ------------------ Exam Schedule Table ------------------

  const ExamScheduleTable = ({
    exams,
    onDelete,
    onEdit,
  }: {
    exams: Exam[];
    onDelete: (id: number) => void;
    onEdit: (exam: Exam) => void;
  }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Exam Details</TableHead>
          <TableHead>Schedule</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Centre</TableHead>
          <TableHead className="w-[70px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exams.map((exam) => (
          <TableRow key={exam.exam_id}>
            <TableCell>
              <div className="space-y-1">
                <div className="font-medium">{exam.exam_name}</div>
                <div className="text-sm text-muted-foreground">
                  {exam.course_name}
                </div>
                <div className="text-xs text-muted-foreground">
                  Code: {exam.subject_code}
                </div>
              </div>
            </TableCell>

            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{exam.exam_date}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {exam.exam_start_time} - {exam.exam_end_time}
                </div>
              </div>
            </TableCell>

            <TableCell>
              <Badge
                variant={exam.exam_type === "Regular" ? "default" : "secondary"}
              >
                {exam.exam_type}
              </Badge>
            </TableCell>

            <TableCell>
              <div className="text-sm text-muted-foreground">
                {exam.centre_name}
              </div>
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
                  <DropdownMenuItem onClick={() => onEdit(exam)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(exam.exam_id)}
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
  );

  // ---------------- Fetch Functions ----------------

  const fetchExams = async () => {
    try {
      const res = await fetch(`${API_URL}/api/examinations/`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      const normalized = data.map((exam: any) => ({
        ...exam,
        exam_id: exam.exam_id ?? exam.id,
      }));
      setExams(normalized);
    } catch (err: any) {
      setErrorExams(err.message);
    } finally {
      setLoadingExams(false);
    }
  };

  const fetchCourses = async () => {
    const res = await fetch(`${API_URL}/api/courses/`);
    const data = await res.json();
    setCourses(data.map((c: any) => ({ ...c, id: Number(c.id) })));
  };

  const fetchCentres = async () => {
    const res = await fetch(`${API_URL}/api/centres/`);
    const data = await res.json();
    setCentres(data.map((c: any) => ({ ...c, id: Number(c.id) })));
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/exam-stats/`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setErrorStats(err.message);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchExams();
    fetchStats();
    fetchCourses();
    fetchCentres();
  }, []);

  // ---------------- CRUD Handlers ----------------

  const handleSaveExam = async () => {
    if (
      !formData.exam_name ||
      !formData.subject_code ||
      !formData.course_name ||
      !formData.centre_name
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = { ...formData };

    try {
      const res = await fetch(
        editingExamId
          ? `${API_URL}/api/examinations/${editingExamId}/`
          : `${API_URL}/api/examinations/`,
        {
          method: editingExamId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to save exam: ${errText}`);
      }

      setOpen(false);
      setEditingExamId(null);
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
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    await fetch(`${API_URL}/api/examinations/${id}/`, {
      method: "DELETE",
    });
    fetchExams();
  };

  // ---------------- Render ----------------

  return (
    <div className="space-y-6">
      {/* Header & Dialog */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Examination System
          </h1>
          <p className="text-muted-foreground">
            Manage exam schedules, hall tickets, marks entry, and result
            declaration
          </p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) setEditingExamId(null);
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="mr-2 h-4 w-4" />{" "}
              {editingExamId ? "Edit Exam" : "Schedule Exam"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingExamId ? "Edit Exam" : "Schedule New Exam"}
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
                    exam_type: e.target.value as "Regular" | "Supplementary",
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
                  setFormData({ ...formData, exam_start_time: e.target.value })
                }
              />
              <Input
                type="time"
                value={formData.exam_end_time}
                onChange={(e) =>
                  setFormData({ ...formData, exam_end_time: e.target.value })
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
                  <option key={c.id} value={c.course_name}>
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
                  <option key={c.id} value={c.centre_name}>
                    {c.centre_name}
                  </option>
                ))}
              </select>

              <Button onClick={handleSaveExam} className="w-full">
                {editingExamId ? "Update Exam" : "Create Exam"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      {loadingStats ? (
        <div>Loading stats...</div>
      ) : errorStats ? (
        <div className="text-red-500">Error: {errorStats}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Scheduled Exams
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.scheduled_exams_this_month ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Regular
              </CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {stats?.total_regular ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">exams</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Supplementary
              </CardTitle>
              <ClipboardCheck className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {stats?.total_supply ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">exams</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available
              </CardTitle>
              <Award className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {stats?.total_available ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">exams</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Exam Schedule</TabsTrigger>
          <TabsTrigger value="halltickets">Hall Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          {loadingExams ? (
            <div>Loading exams...</div>
          ) : errorExams ? (
            <div className="text-red-500">Error: {errorExams}</div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Examination Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Input
                    placeholder="Search exams by course, date, or code..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <ExamScheduleTable
                  exams={filteredExams}
                  onDelete={handleDelete}
                  onEdit={(exam) => {
                    setEditingExamId(exam.exam_id);
                    setFormData({
                      exam_name: exam.exam_name,
                      subject_code: exam.subject_code,
                      exam_type: exam.exam_type,
                      exam_date: exam.exam_date,
                      exam_start_time: exam.exam_start_time,
                      exam_end_time: exam.exam_end_time,
                      course_name: exam.course_name,
                      centre_name: exam.centre_name,
                    });
                    setOpen(true);
                  }}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="halltickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hall Ticket Generation</CardTitle>
              <CardDescription>
                Generate and manage hall tickets for scheduled examinations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Hall Ticket Management
                </h3>
                <p className="text-muted-foreground mb-4">
                  Select an exam to generate hall tickets for registered
                  students
                </p>
                <div className="flex justify-center space-x-2">
                  <Button>Generate All Hall Tickets</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminExaminations;
