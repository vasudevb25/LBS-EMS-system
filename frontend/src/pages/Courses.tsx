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
  Edit, 
  Trash, 
  FileText,
  Clock,
  Users,
  DollarSign
} from "lucide-react";

// Mock data for demonstration
const careerCourses = [
  {
    id: "CC001",
    name: "Full Stack Web Development",
    code: "FSWD2024",
    duration: "6 months",
    eligibility: "12th Pass",
    mouRequired: true,
    students: 145,
    centres: 8,
    fees: {
      registration: 1500,
      semester: 15000,
      exam: 2000,
      certification: 1000
    }
  },
  {
    id: "CC002",
    name: "Data Science & Analytics",
    code: "DSA2024", 
    duration: "8 months",
    eligibility: "Graduate",
    mouRequired: true,
    students: 89,
    centres: 5,
    fees: {
      registration: 2000,
      semester: 20000,
      exam: 2500,
      certification: 1500
    }
  },
];

const certificateCourses = [
  {
    id: "CT001",
    name: "Digital Marketing Fundamentals",
    code: "DMF2024",
    duration: "3 months", 
    eligibility: "10th Pass",
    mouRequired: false,
    students: 234,
    centres: 12,
    fees: {
      registration: 800,
      semester: 8000,
      exam: 1000,
      certification: 500
    }
  },
  {
    id: "CT002",
    name: "Basic Computer Applications",
    code: "BCA2024",
    duration: "2 months",
    eligibility: "8th Pass", 
    mouRequired: false,
    students: 567,
    centres: 15,
    fees: {
      registration: 500,
      semester: 5000,
      exam: 800,
      certification: 300
    }
  },
];

const CourseTable = ({ courses, type }: { courses: any[], type: string }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Course Details</TableHead>
        <TableHead>Duration & Eligibility</TableHead>
        <TableHead>Enrollment</TableHead>
        <TableHead>Fee Structure</TableHead>
        <TableHead>MOU Required</TableHead>
        <TableHead className="w-[70px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {courses.map((course) => (
        <TableRow key={course.id}>
          <TableCell>
            <div className="space-y-1">
              <div className="font-medium">{course.name}</div>
              <div className="text-sm text-muted-foreground">
                Code: {course.code}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">{course.duration}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {course.eligibility}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">{course.students} students</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {course.centres} centres
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-1 text-xs">
              <div>Registration: ₹{course.fees.registration}</div>
              <div>Semester: ₹{course.fees.semester}</div>
              <div>Exam: ₹{course.fees.exam}</div>
              <div>Certificate: ₹{course.fees.certification}</div>
            </div>
          </TableCell>
          <TableCell>
            <Badge variant={course.mouRequired ? "default" : "secondary"}>
              {course.mouRequired ? "Required" : "Not Required"}
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
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Course
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Manage Syllabus
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Update Fees
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Course
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const Courses = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
          <p className="text-muted-foreground">
            Manage career and certificate courses, fee structures, and syllabus content
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-glow">
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
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
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">15</div>
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
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">13</div>
            <p className="text-xs text-muted-foreground">
              Short-term programs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Enrollment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              Active students
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Course Management Tabs */}
      <Tabs defaultValue="career" className="space-y-4">
        <TabsList>
          <TabsTrigger value="career">Career Courses</TabsTrigger>
          <TabsTrigger value="certificate">Certificate Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="career" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Career Courses</CardTitle>
              <CardDescription>
                Long-term professional development programs requiring MOU
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search career courses..."
                    className="pl-8"
                  />
                </div>
                <Button variant="outline">Filter</Button>
              </div>
              <CourseTable courses={careerCourses} type="career" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Courses</CardTitle>
              <CardDescription>
                Short-term skill development programs and certifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search certificate courses..."
                    className="pl-8"
                  />
                </div>
                <Button variant="outline">Filter</Button>
              </div>
              <CourseTable courses={certificateCourses} type="certificate" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Courses;