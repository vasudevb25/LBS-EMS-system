/// <reference types="vite/client" />

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

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
import LoaderOverlay from "../components/ui/loadoverlay";

import {
  Users,
  BookOpen,
  AlertCircle,
  GraduationCap,
  UserCheck,
} from "lucide-react";

import {
  StatsCard,
  RecentActivity,
} from "../components/Dashboard/DashboardComponents";

/* ---------------- TYPES ---------------- */

interface Centre {
  centre_id: number;
  centre_code: string;
  centre_name: string;
  location?: string;
  district?: string;
  email?: string;
  validity_start_date: string;
  validity_end_date: string;
  is_active: boolean;
}

interface Course {
  course_id: number;
  course_name: string;
  duration: string;
  fee: number;
  status: string;
  students_count: number;
}

interface Student {
  student_id: number;
  first_name: string;
  last_name: string;
  course_name: string;
  registration_date: string;
}

/* ---------------- COMPONENT ---------------- */

const CentreDashboard = () => {
  const centreId = localStorage.getItem("centre_id");

  const [centre, setCentre] = useState<Centre | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!centreId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [centreData, coursesData, studentsData] = await Promise.all([
          apiFetch(`/centres/${centreId}/`),
          apiFetch(`/courses/?centre=${centreId}`),
          apiFetch(`/students/?centre=${centreId}`),
        ]);

        setCentre(centreData);
        setCourses(coursesData);
        setStudents(studentsData);

        setStats({
          totalStudents: studentsData?.length || 0,
          totalCourses: coursesData?.length || 0,
        });
      } catch (err: any) {
        setError(err.message || "Failed to load centre dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [centreId]);

  if (!centre) return null;

  const daysUntilExpiry = Math.ceil(
    (new Date(centre.validity_end_date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const validityProgress = Math.max(
    0,
    Math.min(100, Math.round((1 - daysUntilExpiry / 1095) * 100)),
  );

  return (
    <div className="relative">
      {loading && <LoaderOverlay />}

      <div className={loading ? "pointer-events-none blur-sm" : ""}>
        {error && (
          <div className="mb-4 text-destructive font-medium">{error}</div>
        )}

        <div className="space-y-8">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <Avatar className="h-16 w-16">
                <AvatarFallback>
                  {centre.centre_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-3xl font-bold">{centre.centre_name}</h1>
                <p className="text-muted-foreground">
                  Code: {centre.centre_code}
                </p>
                <Badge variant={centre.is_active ? "default" : "secondary"}>
                  {centre.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <Button variant="outline">Edit Profile</Button>
          </div>

          {/* STATS */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Students"
              value={stats.totalStudents.toString()}
              description="Registered students"
              icon={Users}
            />

            <StatsCard
              title="Courses"
              value={stats.totalCourses.toString()}
              description="Allocated courses"
              icon={BookOpen}
            />

            <StatsCard
              title="Validity"
              value={`${daysUntilExpiry} days`}
              description="Until expiry"
              icon={GraduationCap}
            />

            <StatsCard
              title="Status"
              value={centre.is_active ? "Active" : "Inactive"}
              description="Centre state"
              icon={UserCheck}
            />
          </div>

          {/* MAIN GRID */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Accreditation Validity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Valid From: {centre.validity_start_date}</p>
                  <p>Valid Until: {centre.validity_end_date}</p>

                  <div className="mt-4">
                    <Progress value={validityProgress} />
                  </div>

                  {daysUntilExpiry < 30 && (
                    <div className="flex items-center gap-2 text-destructive mt-3">
                      <AlertCircle className="h-4 w-4" />
                      Expiring soon
                    </div>
                  )}
                </CardContent>
              </Card>

              <Tabs defaultValue="students">
                <TabsList>
                  <TabsTrigger value="students">Students</TabsTrigger>
                  <TabsTrigger value="courses">Courses</TabsTrigger>
                </TabsList>

                <TabsContent value="students">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Students</CardTitle>
                      <CardDescription>Latest enrollments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Registered</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((s) => (
                            <TableRow key={s.student_id}>
                              <TableCell>
                                {s.first_name} {s.last_name}
                              </TableCell>
                              <TableCell>{s.course_name}</TableCell>
                              <TableCell>
                                {new Date(
                                  s.registration_date,
                                ).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="courses">
                  <Card>
                    <CardHeader>
                      <CardTitle>Allocated Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Course</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Fee</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {courses.map((c) => (
                            <TableRow key={c.course_id}>
                              <TableCell>{c.course_name}</TableCell>
                              <TableCell>{c.duration}</TableCell>
                              <TableCell>₹{c.fee}</TableCell>
                              <TableCell>
                                <Badge>{c.status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* RIGHT */}
            <div>
              <RecentActivity />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentreDashboard;
