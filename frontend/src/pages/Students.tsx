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
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  aadhar_number?: string;
  guardian_name?: string;
  guardian_relation?: string;
  guardian_phone_number?: string;
  educational_qualification?: string;
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

const isCentre = localStorage.getItem("is_admin") === "false";

/* ---------------- TABLE ---------------- */

const StudentTable = ({
  students,
  onEdit,
  onDelete,
}: {
  students: Student[];
  onEdit: (s: Student) => void;
  onDelete: (s: Student) => void;
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
              <TableCell className="text-center">
                {isCentre && (
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
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);

/* ---------------- PAGE ---------------- */

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [centres, setCentres] = useState<Centre[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);

  const [formData, setFormData] = useState<any>({
    temporary_student_id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "Male",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    aadhar_number: "",
    guardian_name: "",
    guardian_relation: "",
    guardian_phone_number: "",
    educational_qualification: "",
    centre_id: "",
    course_id: "",
    registration_date: "",
    photo_path: null,
    payment_proof: null,
  });

  /* ---------------- FETCH ---------------- */

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsData, centresData, coursesData] = await Promise.all([
        apiFetch("/api/students/"),
        apiFetch("/api/centres/"),
        apiFetch("/api/courses/"),
      ]);

      setStudents(studentsData);
      setCentres(centresData);
      setCourses(coursesData);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData((p: any) => ({
      ...p,
      [name]: files?.[0] ?? value,
    }));
  };

  const openEdit = (s: Student) => {
    setEditing(s);
    setFormData({
      ...s,
      centre_id:
        centres.find((c) => c.centre_name === s.centre_name)?.centre_id || "",
      course_id:
        courses.find((c) => c.course_name === s.course_name)?.course_id || "",
      date_of_birth: s.date_of_birth.split("T")[0],
      registration_date: s.registration_date.split("T")[0],
    });
    setOpen(true);
  };

  const handleDelete = async (s: Student) => {
    if (!confirm("Delete this student?")) return;
    await apiFetch(`/api/students/${s.student_id}/`, { method: "DELETE" });
    setStudents((prev) => prev.filter((x) => x.student_id !== s.student_id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null && v !== "") payload.append(k, v as any);
    });

    if (editing) {
      await apiFetch(`/api/students/${editing.student_id}/`, {
        method: "PUT",
        body: payload,
      });
    } else {
      await apiFetch(`/api/students/`, {
        method: "POST",
        body: payload,
      });
    }

    setOpen(false);
    setEditing(null);
    fetchData();
  };

  /* ---------------- FILTER ---------------- */

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.first_name.toLowerCase().includes(q) ||
      s.last_name.toLowerCase().includes(q) ||
      (s.phone_number ?? "").includes(q)
    );
  });

  /* ---------------- UI ---------------- */

  if (loading) return <div>Loading students...</div>;
  if (error) return <div className="text-destructive">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Student Directory</h1>
          <p className="text-muted-foreground">Manage registered students</p>
        </div>

        {isCentre && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserCheck className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Edit Student" : "Add Student"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "temporary_student_id",
                    "first_name",
                    "middle_name",
                    "last_name",
                    "email",
                    "phone_number",
                    "date_of_birth",
                  ].map((f) => (
                    <Input
                      key={f}
                      name={f}
                      placeholder={f.replaceAll("_", " ")}
                      type={f.includes("date") ? "date" : "text"}
                      value={formData[f]}
                      onChange={handleChange}
                    />
                  ))}
                </div>

                <select
                  name="centre_id"
                  value={formData.centre_id}
                  onChange={handleChange}
                  className="border rounded-md w-full p-2"
                >
                  <option value="">Select Centre</option>
                  {centres.map((c) => (
                    <option key={c.centre_id} value={c.centre_id}>
                      {c.centre_name}
                    </option>
                  ))}
                </select>

                <select
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleChange}
                  className="border rounded-md w-full p-2"
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c.course_id} value={c.course_id}>
                      {c.course_name}
                    </option>
                  ))}
                </select>

                <Button type="submit" className="w-full">
                  {editing ? "Update Student" : "Save Student"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
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
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsPage;
