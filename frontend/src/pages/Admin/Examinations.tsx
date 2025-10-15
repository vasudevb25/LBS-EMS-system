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
  Search,
  MoreHorizontal,
  Calendar,
  FileText,
  Upload,
  Award,
  ClipboardCheck,
  Users,
  Eye,
  Edit,
  Trash,
} from "lucide-react";

interface Exam {
  exam_id: number;
  course_name: string;
  centre_name: string;
  exam_name: string;
  exam_date: string;
  exam_start_time: string;
  exam_end_time: string;
  subject_code: string;
  exam_type: "Regular" | "Supplementary";
  created_at: string;
}

interface ExamStats {
  scheduled_exams_this_month: number;
  total_regular: number;
  total_supply: number;
  total_available: number;
}

const ExamScheduleTable = ({ exams }: { exams: Exam[] }) => (
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
              variant={
                exam.exam_type === "Regular"
                  ? "default"
                  : exam.exam_type === "Supplementary"
                  ? "secondary"
                  : "outline"
              }
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
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" /> View
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
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

const AdminExaminations = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [stats, setStats] = useState<ExamStats | null>(null);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorExams, setErrorExams] = useState<string | null>(null);
  const [errorStats, setErrorStats] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredExams = exams.filter((exam) => {
    const q = searchQuery.toLowerCase();
    return (
      exam.course_name.toLowerCase().includes(q) ||
      exam.centre_name.toLowerCase().includes(q) ||
      exam.exam_name.toLowerCase().includes(q) ||
      exam.subject_code.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/examinations/");
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setExams(data);
      } catch (err: any) {
        setErrorExams(err.message);
      } finally {
        setLoadingExams(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/exam-stats/");
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setErrorStats(err.message);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchExams();
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
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
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" /> Import Schedule
          </Button>
          <Button className="bg-gradient-primary hover:bg-primary-glow">
            <Plus className="mr-2 h-4 w-4" /> Schedule Exam
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
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

        <TabsContent value="schedule" className="space-y-4">
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
                  <div className="relative flex-1">
                    <Input
                      placeholder="Search exams by course, date, or code..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline">Filter by Course</Button>
                  <Button variant="outline">Filter by Date</Button>
                </div>
                <ExamScheduleTable exams={filteredExams} />
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
                  <Button variant="outline">Bulk Download</Button>
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
