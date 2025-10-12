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
  Search, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Eye,
  Download,
  UserCheck,
  Clock,
  AlertCircle
} from "lucide-react";

// Mock data for demonstration
const pendingStudents = [
  {
    id: "TMP001",
    name: "Rahul Kumar",
    email: "rahul@email.com",
    phone: "9876543210",
    course: "Full Stack Web Development", 
    centre: "Kochi Digital Hub",
    dateApplied: "2024-01-15",
    documents: ["10th Certificate", "12th Certificate", "Photo"],
    status: "Pending Review"
  },
  {
    id: "TMP002",
    name: "Priya Sharma",
    email: "priya@email.com", 
    phone: "9876543211",
    course: "Data Science & Analytics",
    centre: "Thiruvananthapuram Tech Center",
    dateApplied: "2024-01-14",
    documents: ["Degree Certificate", "Photo"],
    status: "Documents Missing"
  },
];

const approvedStudents = [
  {
    id: "LBS24001",
    tempId: "TMP003",
    name: "Arjun Menon",
    email: "arjun@email.com",
    phone: "9876543212", 
    course: "Digital Marketing Fundamentals",
    centre: "Calicut Innovation Lab",
    dateRegistered: "2024-01-10",
    dateApproved: "2024-01-12",
    status: "Active"
  },
  {
    id: "LBS24002", 
    tempId: "TMP004",
    name: "Sneha Nair",
    email: "sneha@email.com",
    phone: "9876543213",
    course: "Basic Computer Applications",
    centre: "Kochi Digital Hub", 
    dateRegistered: "2024-01-08",
    dateApproved: "2024-01-09",
    status: "Active"
  },
];

const StudentTable = ({ students, type }: { students: any[], type: string }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Student Details</TableHead>
        <TableHead>Course & Centre</TableHead>
        <TableHead>Application Date</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="w-[70px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {students.map((student) => (
        <TableRow key={student.id}>
          <TableCell>
            <div className="space-y-1">
              <div className="font-medium">{student.name}</div>
              <div className="text-sm text-muted-foreground">{student.email}</div>
              <div className="text-sm text-muted-foreground">{student.phone}</div>
              <div className="text-xs text-muted-foreground">
                ID: {student.id || student.tempId}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-1">
              <div className="text-sm font-medium">{student.course}</div>
              <div className="text-xs text-muted-foreground">{student.centre}</div>
            </div>
          </TableCell>
          <TableCell>
            <div className="text-sm">
              {type === 'pending' ? student.dateApplied : student.dateRegistered}
            </div>
            {type === 'approved' && student.dateApproved && (
              <div className="text-xs text-muted-foreground">
                Approved: {student.dateApproved}
              </div>
            )}
          </TableCell>
          <TableCell>
            <Badge
              variant={
                student.status === "Active" || student.status === "Pending Review" 
                  ? "default"
                  : student.status === "Documents Missing"
                  ? "destructive"
                  : "secondary"
              }
            >
              {student.status}
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
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                {type === 'pending' && (
                  <>
                    <DropdownMenuItem>
                      <CheckCircle className="mr-2 h-4 w-4 text-success" />
                      Approve Registration
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <XCircle className="mr-2 h-4 w-4 text-destructive" />
                      Reject Application
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Student
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Download Documents
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const Students = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Student Registration</h1>
          <p className="text-muted-foreground">
            Monitor registrations, approve applications, and manage student data
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button className="bg-gradient-accent hover:bg-accent">
            <UserCheck className="mr-2 h-4 w-4" />
            Bulk Approve
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Registrations
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              All time registrations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Approval
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">156</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Students
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">2,658</div>
            <p className="text-xs text-muted-foreground">
              Currently enrolled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Issues/Rejected
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">33</div>
            <p className="text-xs text-muted-foreground">
              Requiring attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Student Management Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Approval ({pendingStudents.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved Students ({approvedStudents.length})</TabsTrigger>
          <TabsTrigger value="all">All Students</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Student Registrations</CardTitle>
              <CardDescription>
                Review and approve new student applications from centres
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search pending registrations..."
                    className="pl-8"
                  />
                </div>
                <Button variant="outline">Filter by Centre</Button>
                <Button variant="outline">Filter by Course</Button>
              </div>
              <StudentTable students={pendingStudents} type="pending" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Students</CardTitle>
              <CardDescription>
                Students with confirmed registration and active enrollment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search approved students..."
                    className="pl-8"
                  />
                </div>
                <Button variant="outline">Filter by Centre</Button>
                <Button variant="outline">Filter by Course</Button>
              </div>
              <StudentTable students={approvedStudents} type="approved" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Students</CardTitle>
              <CardDescription>
                Complete directory of all students across all centres and courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search all students..."
                    className="pl-8"
                  />
                </div>
                <Button variant="outline">Advanced Filters</Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export All
                </Button>
              </div>
              <StudentTable students={[...pendingStudents, ...approvedStudents]} type="all" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Students;