import { Button } from "../components/ui/buttons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/layout";
import { Input } from "../components/ui/inputs";
import { Badge, Tabs, TabsContent, TabsList, TabsTrigger, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/data";
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
  Calendar, 
  FileText, 
  Upload,
  Download,
  Award,
  ClipboardCheck,
  Users,
  BookOpen
} from "lucide-react";

// Mock data for demonstration
const examSchedules = [
  {
    id: "EX001",
    examName: "Full Stack Web Development - Final",
    course: "Full Stack Web Development",
    date: "2024-02-15",
    time: "10:00 AM",
    duration: "3 hours",
    subject: "Project Implementation",
    code: "FSWD_FINAL_2024",
    registeredStudents: 45,
    status: "Scheduled"
  },
  {
    id: "EX002", 
    examName: "Data Science - Mid Term",
    course: "Data Science & Analytics",
    date: "2024-02-20",
    time: "2:00 PM", 
    duration: "2 hours",
    subject: "Statistics & Probability",
    code: "DSA_MID_2024",
    registeredStudents: 23,
    status: "Registration Open"
  },
];

const results = [
  {
    id: "RES001",
    examName: "Digital Marketing - Final",
    course: "Digital Marketing Fundamentals", 
    examDate: "2024-01-20",
    totalStudents: 67,
    resultsUploaded: 67,
    passed: 61,
    failed: 6,
    status: "Published",
    certificatesGenerated: 61
  },
  {
    id: "RES002",
    examName: "Basic Computer - Assessment",
    course: "Basic Computer Applications",
    examDate: "2024-01-18",
    totalStudents: 89,
    resultsUploaded: 89,
    passed: 85,
    failed: 4, 
    status: "Published",
    certificatesGenerated: 85
  },
];

const ExamScheduleTable = ({ exams }: { exams: any[] }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Exam Details</TableHead>
        <TableHead>Schedule</TableHead>
        <TableHead>Registration</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="w-[70px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {exams.map((exam) => (
        <TableRow key={exam.id}>
          <TableCell>
            <div className="space-y-1">
              <div className="font-medium">{exam.examName}</div>
              <div className="text-sm text-muted-foreground">{exam.course}</div>
              <div className="text-xs text-muted-foreground">
                Code: {exam.code}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">{exam.date}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {exam.time} ({exam.duration})
              </div>
              <div className="text-xs text-muted-foreground">
                Subject: {exam.subject}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">{exam.registeredStudents} students</span>
            </div>
          </TableCell>
          <TableCell>
            <Badge
              variant={
                exam.status === "Scheduled"
                  ? "default"
                  : exam.status === "Registration Open" 
                  ? "secondary"
                  : "outline"
              }
            >
              {exam.status}
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
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Hall Tickets
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Attendance
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Enter Marks
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const ResultsTable = ({ results }: { results: any[] }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Exam Details</TableHead>
        <TableHead>Results Summary</TableHead>
        <TableHead>Pass Rate</TableHead>
        <TableHead>Certificates</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="w-[70px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {results.map((result) => (
        <TableRow key={result.id}>
          <TableCell>
            <div className="space-y-1">
              <div className="font-medium">{result.examName}</div>
              <div className="text-sm text-muted-foreground">{result.course}</div>
              <div className="text-xs text-muted-foreground">
                Date: {result.examDate}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-1 text-sm">
              <div>Total: {result.totalStudents}</div>
              <div className="text-success">Passed: {result.passed}</div>
              <div className="text-destructive">Failed: {result.failed}</div>
            </div>
          </TableCell>
          <TableCell>
            <div className="text-lg font-semibold">
              {Math.round((result.passed / result.totalStudents) * 100)}%
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-1">
              <Award className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">{result.certificatesGenerated} generated</span>
            </div>
          </TableCell>
          <TableCell>
            <Badge variant="default">
              {result.status}
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
                  <Download className="mr-2 h-4 w-4" />
                  Download Results
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Award className="mr-2 h-4 w-4" />
                  Generate Certificates
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  View Detailed Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const Examinations = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Examination System</h1>
          <p className="text-muted-foreground">
            Manage exam schedules, hall tickets, marks entry, and result declaration
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Schedule
          </Button>
          <Button className="bg-gradient-primary hover:bg-primary-glow">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Exam
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Scheduled Exams
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hall Tickets
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">345</div>
            <p className="text-xs text-muted-foreground">
              Generated this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Results Published
            </CardTitle>
            <ClipboardCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">8</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Certificates
            </CardTitle>
            <Award className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">278</div>
            <p className="text-xs text-muted-foreground">
              Generated this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Examination Management Tabs */}
      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Exam Schedule</TabsTrigger>
          <TabsTrigger value="halltickets">Hall Tickets</TabsTrigger>
          <TabsTrigger value="marks">Marks Entry</TabsTrigger>
          <TabsTrigger value="results">Results & Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Examination Schedule</CardTitle>
              <CardDescription>
                Manage upcoming exams, schedules, and student registration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search exams by course, date, or code..."
                    className="pl-8"
                  />
                </div>
                <Button variant="outline">Filter by Course</Button>
                <Button variant="outline">Filter by Date</Button>
              </div>
              <ExamScheduleTable exams={examSchedules} />
            </CardContent>
          </Card>
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
                <h3 className="text-lg font-semibold mb-2">Hall Ticket Management</h3>
                <p className="text-muted-foreground mb-4">
                  Select an exam to generate hall tickets for registered students
                </p>
                <div className="flex justify-center space-x-2">
                  <Button>Generate All Hall Tickets</Button>
                  <Button variant="outline">Bulk Download</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marks Entry System</CardTitle>
              <CardDescription>
                Upload attendance, internal marks, and external examination results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Marks Management</h3>
                <p className="text-muted-foreground mb-4">
                  Import marks from centres and upload external examination results
                </p>
                <div className="flex justify-center space-x-2">
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Marks (Excel)
                  </Button>
                  <Button variant="outline">Manual Entry</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Results & Certificate Generation</CardTitle>
              <CardDescription>
                Publish exam results and generate QR-coded certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search results..."
                    className="pl-8"
                  />
                </div>
                <Button variant="outline">Filter by Course</Button>
                <Button variant="outline">
                  <Award className="mr-2 h-4 w-4" />
                  Generate Certificates
                </Button>
              </div>
              <ResultsTable results={results} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Examinations;