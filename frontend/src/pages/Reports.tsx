import { Button } from "../components/ui/buttons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/layout";
// import { Input } from "../components/ui/inputs";
import { Badge, Tabs, TabsContent, TabsList, TabsTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/data";
import { 
  FileText,
  Download, 
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  GraduationCap
} from "lucide-react";

// Mock data for report stats
const reportStats = [
  {
    title: "Student Reports",
    value: "2,847",
    description: "Total registrations",
    icon: Users,
    change: "+12%"
  },
  {
    title: "Financial Reports", 
    value: "₹48.5L",
    description: "Total collections",
    icon: DollarSign,
    change: "+8%"
  },
  {
    title: "Course Performance",
    value: "85%",
    description: "Average pass rate",
    icon: GraduationCap,
    change: "+3%"
  },
  {
    title: "Centre Analytics",
    value: "45",
    description: "Active centres",
    icon: BarChart3,
    change: "+5%"
  }
];

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate comprehensive reports and analyze performance metrics
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button className="bg-gradient-primary hover:bg-primary-glow">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        {reportStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <span className="text-xs font-medium text-success">
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Student Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Student Reports</span>
                </CardTitle>
                <CardDescription>
                  Registration, enrollment, and performance reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="registrations">Registration Summary</SelectItem>
                    <SelectItem value="enrollments">Enrollment Details</SelectItem>
                    <SelectItem value="performance">Student Performance</SelectItem>
                    <SelectItem value="attendance">Attendance Report</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="grid gap-2 grid-cols-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Centre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Centres</SelectItem>
                      <SelectItem value="kochi">Kochi Hub</SelectItem>
                      <SelectItem value="tvm">TVM Center</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      <SelectItem value="web">Web Development</SelectItem>
                      <SelectItem value="data">Data Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Generate Student Report
                </Button>
              </CardContent>
            </Card>

            {/* Financial Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-accent" />
                  <span>Financial Reports</span>
                </CardTitle>
                <CardDescription>
                  Fee collection, payment tracking, and revenue analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collections">Fee Collections</SelectItem>
                    <SelectItem value="pending">Pending Payments</SelectItem>
                    <SelectItem value="revenue">Revenue Analysis</SelectItem>
                    <SelectItem value="gst">GST Summary</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="grid gap-2 grid-cols-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full bg-gradient-accent">
                  <Download className="mr-2 h-4 w-4" />
                  Generate Financial Report
                </Button>
              </CardContent>
            </Card>

            {/* Examination Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-success" />
                  <span>Examination Reports</span>
                </CardTitle>
                <CardDescription>
                  Exam results, performance metrics, and certificates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="results">Exam Results</SelectItem>
                    <SelectItem value="performance">Performance Analysis</SelectItem>
                    <SelectItem value="certificates">Certificate Status</SelectItem>
                    <SelectItem value="halltickets">Hall Ticket Summary</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="grid gap-2 grid-cols-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Exam" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Exams</SelectItem>
                      <SelectItem value="recent">Recent Exams</SelectItem>
                      <SelectItem value="upcoming">Upcoming Exams</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="semester">This Semester</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full bg-gradient-secondary">
                  <Download className="mr-2 h-4 w-4" />
                  Generate Exam Report
                </Button>
              </CardContent>
            </Card>

            {/* Centre Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-warning" />
                  <span>Centre Analytics</span>
                </CardTitle>
                <CardDescription>
                  Centre performance and comparative analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select analytics type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">Centre Performance</SelectItem>
                    <SelectItem value="comparison">Comparative Analysis</SelectItem>
                    <SelectItem value="enrollment">Enrollment Trends</SelectItem>
                    <SelectItem value="revenue">Revenue by Centre</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="space-y-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Generate Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Custom Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span>Custom Reports</span>
                </CardTitle>
                <CardDescription>
                  Build custom reports with specific parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                  <h4 className="font-medium mb-2">Custom Report Builder</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create tailored reports with your specific requirements
                  </p>
                  <Button variant="outline" className="w-full">
                    Launch Report Builder
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Quick Reports</span>
                </CardTitle>
                <CardDescription>
                  Pre-configured reports for instant insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-3 w-3" />
                  Today's Registrations
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-3 w-3" />
                  This Week's Collections
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-3 w-3" />
                  Pending Approvals
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-3 w-3" />
                  Upcoming Exams
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Automated reports that run on schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Automated Reporting</h3>
                <p className="text-muted-foreground mb-4">
                  Set up recurring reports to be generated and delivered automatically
                </p>
                <Button>Create Scheduled Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Interactive charts and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Interactive Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  Explore data with interactive charts and real-time insights
                </p>
                <Button>Launch Analytics</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;