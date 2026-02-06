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
import { Search, MoreHorizontal, Edit, Trash, UserCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/overlays";
import { apiFetch } from "../lib/api";

/* ---------------- TYPES ---------------- */

interface Student {
  student_id: number;
  temporary_student_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email?: string;
  phone_number?: string;
  course_name: string;
  centre_name: string;
  registration_date: string;
}

interface Centre {
  centre_id: number;
  centre_name: string;
}

interface Course {
  course_id: number;
  course_name: string;
}

/* ---------------- TABLE ---------------- */

const StudentTable = ({
  students,
  onEdit,
  onDelete,
  isCentre,
}: {
  students: Student[];
  onEdit: (s: Student) => void;
  onDelete: (s: Student) => void;
  isCentre: boolean;
}) => (
  <div className="max-h-[500px] overflow-y-auto border rounded-lg">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Centre</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Registered</TableHead>
          {isCentre && (
            <TableHead className="w-[80px] text-center">Actions</TableHead>
          )}
        </TableRow>
      </TableHeader>

      <TableBody>
        {students.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={7}
              className="text-center text-muted-foreground"
            >
              No students found
            </TableCell>
          </TableRow>
        ) : (
          students.map((s) => (
            <TableRow key={s.student_id}>
              <TableCell>
                <div className="font-medium">
                  {s.first_name} {s.middle_name ?? ""} {s.last_name}
                </div>
                <div className="text-xs text-muted-foreground">
                  ID: {s.temporary_student_id}
                </div>
              </TableCell>

              <TableCell>{s.email || "—"}</TableCell>
              <TableCell>{s.course_name}</TableCell>
              <TableCell>{s.centre_name}</TableCell>
              <TableCell>{s.phone_number || "—"}</TableCell>
              <TableCell>
                {new Date(s.registration_date).toLocaleDateString()}
              </TableCell>

              {isCentre && (
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(s)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(s)}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);

/* ---------------- PAGE ---------------- */

const StudentsPage = () => {
  const isCentre = localStorage.getItem("is_admin") === "false";

  const [students, setStudents] = useState<Student[]>([]);
  const [centres, setCentres] = useState<Centre[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [formData, setFormData] = useState<any>({});

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, c, co] = await Promise.all([
          apiFetch("/api/students/"),
          apiFetch("/api/centres/"),
          apiFetch("/api/courses/"),
        ]);
        setStudents(s);
        setCentres(c);
        setCourses(co);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------------- UI ---------------- */

  if (loading) return <div>Loading students...</div>;
  if (error) return <div className="text-destructive">{error}</div>;

  const filtered = students.filter((s) =>
    `${s.first_name} ${s.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Student Directory</h1>
          <p className="text-muted-foreground">Manage registered students</p>
        </div>

        {isCentre && (
          <Button>
            <UserCheck className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>Across all centres and courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <StudentTable
            students={filtered}
            onEdit={setEditing}
            onDelete={() => {}}
            isCentre={isCentre}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsPage;
