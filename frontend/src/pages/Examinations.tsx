/// <reference types="vite/client" />

import { useEffect, useState } from "react";
import { Button } from "../components/ui/buttons";
import {
  Card,
  CardContent,
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
}

interface ExamStats {
  scheduled_exams_this_month: number;
  total_regular: number;
  total_supply: number;
  total_available: number;
}

/* ---------------- HELPERS ---------------- */

const calculateDuration = (start: string, end: string) => {
  if (!start || !end) return "";
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const mins = eh * 60 + em - (sh * 60 + sm);
  return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
};

/* ---------------- COMPONENT ---------------- */

const ExaminationsPage = () => {
  const isAdmin = localStorage.getItem("is_admin") === "true";

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [exams, setExams] = useState<Exam[]>([]);
  const [stats, setStats] = useState<ExamStats | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [centres, setCentres] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

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

  /* ---------------- FETCH ALL ---------------- */

  useEffect(() => {
    const loadAll = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [coursesData, centresData, examsData, statsData] =
          await Promise.all([
            apiFetch("/api/courses/"),
            apiFetch("/api/centres/"),
            apiFetch("/api/examinations/"),
            apiFetch("/api/exam-stats/"),
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
        setError(err.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    loadAll();
  }, []);

  /* ---------------- GUARDS ---------------- */
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-destructive">
        {error}
      </div>
    );
  }

  /* ---------------- FILTER ---------------- */

  const filteredExams = exams.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.exam_name.toLowerCase().includes(q) ||
      e.subject_code.toLowerCase().includes(q) ||
      e.course_name?.toLowerCase().includes(q) ||
      e.centre_name?.toLowerCase().includes(q)
    );
  });

  /* ---------------- UI ---------------- */
  return (
    <div className="relative">
      {isLoading && <LoaderOverlay />}

      <div className={isLoading ? "pointer-events-none select-none" : ""}>
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
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Schedule Exam
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? "Edit Exam" : "Schedule Exam"}
                    </DialogTitle>
                  </DialogHeader>
                  <Button className="w-full">Save (hook later)</Button>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ["Scheduled", stats?.scheduled_exams_this_month, Calendar],
              ["Regular", stats?.total_regular, FileText],
              ["Supplementary", stats?.total_supply, ClipboardCheck],
              ["Available", stats?.total_available, Award],
            ].map(([label, value, Icon]: any, i) => (
              <Card key={i}>
                <CardHeader className="pb-2 flex justify-between">
                  <CardTitle className="text-sm text-muted-foreground">
                    {label}
                  </CardTitle>
                  <Icon className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{value ?? 0}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Exams Table */}
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
                    <TableHead>Schedule</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Centre</TableHead>
                    {isAdmin && <TableHead />}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExams.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No exams found
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
                      <TableCell>
                        {e.exam_date} •{" "}
                        {calculateDuration(e.exam_start_time, e.exam_end_time)}
                      </TableCell>
                      <TableCell>
                        <Badge>{e.exam_type}</Badge>
                      </TableCell>
                      <TableCell>{e.centre_name}</TableCell>
                      {isAdmin && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
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
        </div>{" "}
      </div>
    </div>
  );
};

export default ExaminationsPage;
