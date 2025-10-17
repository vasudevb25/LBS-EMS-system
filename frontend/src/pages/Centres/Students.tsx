import { Button } from "../../components/ui/buttons";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/layout";
import { Input } from "../../components/ui/inputs";
import {
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
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Download,
  UserCheck,
  Trash,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/overlays";

interface Student {
  date_of_birth: string;
  student_id: number;
  temporary_student_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  course_name: string;
  centre_name: string;
  registration_date: string;
}

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

const StudentTable = ({ students, onEdit, onDelete }: StudentTableProps) => (
  <div className="max-h-[500px] overflow-y-auto border rounded-lg">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Centre</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Registration Date</TableHead>
          <TableHead className="w-[80px] text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {students.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={7}
              className="text-center py-4 text-muted-foreground"
            >
              No students found.
            </TableCell>
          </TableRow>
        ) : (
          students.map((student) => (
            <TableRow key={student.student_id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">
                    {student.first_name} {student.middle_name || ""}{" "}
                    {student.last_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ID: {student.temporary_student_id}
                  </div>
                </div>
              </TableCell>
              <TableCell>{student.email || "—"}</TableCell>
              <TableCell>{student.course_name}</TableCell>
              <TableCell>{student.centre_name}</TableCell>
              <TableCell>{student.phone_number || "—"}</TableCell>
              <TableCell>
                {new Date(student.registration_date).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(student)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(student)}
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);
const CentreStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [centres, setCentres] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
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
  });

  // -----------------------
  // Fetch Data
  // -----------------------
  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8000/api/students/"),
      fetch("http://127.0.0.1:8000/api/centres/"),
      fetch("http://127.0.0.1:8000/api/courses/"),
    ])
      .then(async ([studentsRes, centresRes, coursesRes]) => {
        if (!studentsRes.ok || !centresRes.ok || !coursesRes.ok)
          throw new Error("Failed to load data");
        const studentsData = await studentsRes.json();
        const centresData = await centresRes.json();
        const coursesData = await coursesRes.json();

        setStudents(studentsData);
        setCentres(centresData);
        setCourses(coursesData);
      })
      .catch((err) => {
        console.error(err);
        setError("Error loading data");
      })
      .finally(() => setLoading(false));
  }, []);

  // -----------------------
  // Form Handlers
  // -----------------------
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      first_name: student.first_name,
      middle_name: student.middle_name || "",
      last_name: student.last_name,
      date_of_birth: student.date_of_birth || "",
      gender: "Male",
      email: student.email || "",
      phone_number: student.phone_number || "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      aadhar_number: "",
      guardian_name: "",
      guardian_relation: "",
      guardian_phone_number: "",
      educational_qualification: "",
      centre_id:
        centres.find((c) => c.centre_name === student.centre_name)?.centre_id ||
        "",
      course_id:
        courses.find((c) => c.course_name === student.course_name)?.course_id ||
        "",
    });
    setOpen(true);
  };

  const handleDelete = async (student: Student) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/students/${student.student_id}/`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete student");

      setStudents((prev) =>
        prev.filter((s) => s.student_id !== student.student_id)
      );
    } catch (err: any) {
      alert("Error deleting student: " + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        centre_id: Number(formData.centre_id),
        course_id: Number(formData.course_id),
        created_by: 1, // static for now
      };

      let res;
      if (selectedStudent) {
        // Editing existing student
        res = await fetch(
          `http://127.0.0.1:8000/api/students/${selectedStudent.student_id}/`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // Adding new student
        res = await fetch("http://127.0.0.1:8000/api/students/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Failed to save student");

      const refresh = await fetch("http://127.0.0.1:8000/api/students/");
      setStudents(await refresh.json());

      setOpen(false);
      setSelectedStudent(null);
      setFormData({
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
      });
    } catch (err: any) {
      alert("Error saving student: " + err.message);
    }
  };

  const filteredStudents = students.filter((student) => {
    const q = searchQuery.toLowerCase();
    const phone = (student.phone_number ?? "").toLowerCase();
    return (
      student.first_name.toLowerCase().includes(q) ||
      (student.middle_name ?? "").toLowerCase().includes(q) ||
      student.last_name.toLowerCase().includes(q) ||
      phone.includes(q)
    );
  });

  // -----------------------
  // Render
  // -----------------------
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Student Directory
          </h1>
          <p className="text-muted-foreground">
            View and manage registered student information
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-accent hover:bg-accent">
                <UserCheck className="mr-2 h-4 w-4" />
                Add New Student
              </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    name="first_name"
                    placeholder="First Name"
                    required
                    value={formData.first_name}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="last_name"
                    placeholder="Last Name"
                    required
                    value={formData.last_name}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="phone_number"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="date_of_birth"
                    placeholder="Date of Birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                  />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="border rounded-md p-2"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Select Centre</label>
                  <select
                    name="centre_id"
                    value={formData.centre_id}
                    onChange={handleInputChange}
                    className="border rounded-md w-full p-2"
                    required
                  >
                    <option value="">-- Select Centre --</option>
                    {centres.map((c) => (
                      <option key={c.centre_id} value={c.centre_id}>
                        {c.centre_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Select Course</label>
                  <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleInputChange}
                    className="border rounded-md w-full p-2"
                    required
                  >
                    <option value="">-- Select Course --</option>
                    {courses.map((c) => (
                      <option key={c.course_id} value={c.course_id}>
                        {c.course_name}
                      </option>
                    ))}
                  </select>
                </div>

                <Button type="submit" className="w-full">
                  Save Student
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>
            Complete directory of students across all centres and courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-6">Loading...</div>
          ) : error ? (
            <div className="text-center py-6 text-destructive">{error}</div>
          ) : (
            <StudentTable
              students={filteredStudents}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CentreStudents;
