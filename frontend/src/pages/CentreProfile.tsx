import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/layout";
import {
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/data";
import { Progress } from "../components/ui/feedback";
import { Button } from "../components/ui/buttons";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  Edit,
  Download,
  FileText,
  GraduationCap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Mock centre data
const centreData = {
  id: "LBS001",
  name: "Kochi Digital Hub",
  logo: "",
  establishedYear: 2020,
  address: {
    street: "123 Tech Park Road",
    city: "Kochi",
    district: "Ernakulam",
    state: "Kerala",
    pincode: "682001",
  },
  contact: {
    phone: "+91 9876543210",
    email: "kochi@lbsdigital.com",
    website: "www.kochidigitalhub.com",
  },
  coordinator: {
    name: "Dr. Rajesh Kumar",
    phone: "+91 9876543211",
    email: "rajesh@lbsdigital.com",
  },
  validity: {
    from: "2023-01-01",
    to: "2025-12-31",
    status: "Active",
  },
  stats: {
    totalStudents: 234,
    activeStudents: 189,
    graduatedStudents: 45,
    totalCourses: 12,
    passRate: 87,
    placementRate: 72,
  },
};

const allocatedCourses = [
  {
    id: "C001",
    name: "Web Development",
    duration: "6 months",
    students: 45,
    status: "Active",
    fee: 15000,
  },
  {
    id: "C002",
    name: "Data Science",
    duration: "8 months",
    students: 32,
    status: "Active",
    fee: 20000,
  },
  {
    id: "C003",
    name: "Digital Marketing",
    duration: "4 months",
    students: 28,
    status: "Active",
    fee: 12000,
  },
  {
    id: "C004",
    name: "Graphic Design",
    duration: "6 months",
    students: 22,
    status: "Active",
    fee: 14000,
  },
  {
    id: "C005",
    name: "Mobile App Development",
    duration: "8 months",
    students: 18,
    status: "Upcoming",
    fee: 18000,
  },
];

const recentStudents = [
  {
    id: "S001",
    name: "Arun Menon",
    course: "Web Development",
    enrolledDate: "2024-01-15",
    status: "Active",
  },
  {
    id: "S002",
    name: "Priya Sharma",
    course: "Data Science",
    enrolledDate: "2024-01-12",
    status: "Active",
  },
  {
    id: "S003",
    name: "Rahul Kumar",
    course: "Digital Marketing",
    enrolledDate: "2024-01-10",
    status: "Active",
  },
  {
    id: "S004",
    name: "Anitha Nair",
    course: "Graphic Design",
    enrolledDate: "2024-01-08",
    status: "Active",
  },
  {
    id: "S005",
    name: "Mohammed Faiz",
    course: "Web Development",
    enrolledDate: "2024-01-05",
    status: "Pending",
  },
];

const CentreProfile = () => {
  const daysUntilExpiry = Math.ceil(
    (new Date(centreData.validity.to).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20 border-4 border-primary/20">
            <AvatarImage src={centreData.logo} alt={centreData.name} />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-bold">
              {centreData.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {centreData.name}
              </h1>
              <Badge
                variant={
                  centreData.validity.status === "Active"
                    ? "default"
                    : "secondary"
                }
              >
                {centreData.validity.status}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              Centre ID: {centreData.id} • Established{" "}
              {centreData.establishedYear}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {centreData.address.city}, {centreData.address.district}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {centreData.stats.totalStudents}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-success flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12%
              </span>
              <span className="text-xs text-muted-foreground">
                from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Courses
            </CardTitle>
            <BookOpen className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {centreData.stats.totalCourses}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Career & Certificate programs
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pass Rate
            </CardTitle>
            <Award className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {centreData.stats.passRate}%
            </div>
            <Progress value={centreData.stats.passRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Placement Rate
            </CardTitle>
            <GraduationCap className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {centreData.stats.placementRate}%
            </div>
            <Progress
              value={centreData.stats.placementRate}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Centre Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Centre Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Address
                  </h4>
                  <p className="text-sm">
                    {centreData.address.street}
                    <br />
                    {centreData.address.city}, {centreData.address.district}
                    <br />
                    {centreData.address.state} - {centreData.address.pincode}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </h4>
                    <p className="text-sm">{centreData.contact.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email
                    </h4>
                    <p className="text-sm">{centreData.contact.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coordinator Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Centre Coordinator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {centreData.coordinator.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{centreData.coordinator.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Primary Coordinator
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </h4>
                    <p className="text-sm">{centreData.coordinator.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email
                    </h4>
                    <p className="text-sm">{centreData.coordinator.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Validity Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Accreditation & Validity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Valid From
                    </h4>
                    <p className="text-lg font-semibold">
                      {centreData.validity.from}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Valid Until
                    </h4>
                    <p className="text-lg font-semibold">
                      {centreData.validity.to}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Days Remaining
                    </h4>
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-lg font-semibold ${daysUntilExpiry > 90 ? "text-success" : daysUntilExpiry > 30 ? "text-warning" : "text-destructive"}`}
                      >
                        {daysUntilExpiry} days
                      </p>
                      {daysUntilExpiry > 90 ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-warning" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Validity Progress
                    </span>
                    <span className="font-medium">
                      {Math.round((1 - daysUntilExpiry / 1095) * 100)}% elapsed
                    </span>
                  </div>
                  <Progress
                    value={Math.round((1 - daysUntilExpiry / 1095) * 100)}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Allocated Courses</CardTitle>
              <CardDescription>
                Courses currently assigned to this centre
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Fee (₹)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocatedCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span className="font-medium">{course.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {course.duration}
                        </div>
                      </TableCell>
                      <TableCell>{course.students}</TableCell>
                      <TableCell>₹{course.fee.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            course.status === "Active" ? "default" : "secondary"
                          }
                        >
                          {course.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Enrollments</CardTitle>
              <CardDescription>
                Latest student registrations at this centre
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Enrolled Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ID: {student.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.course}</TableCell>
                      <TableCell>{student.enrolledDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.status === "Active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Centre Documents</CardTitle>
              <CardDescription>
                Important documents and certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  {
                    name: "Registration Certificate",
                    date: "2023-01-01",
                    type: "PDF",
                  },
                  {
                    name: "Accreditation Letter",
                    date: "2023-01-15",
                    type: "PDF",
                  },
                  {
                    name: "Infrastructure Report",
                    date: "2023-06-01",
                    type: "PDF",
                  },
                  { name: "Faculty Details", date: "2024-01-01", type: "XLSX" },
                ].map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded: {doc.date}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{doc.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CentreProfile;
