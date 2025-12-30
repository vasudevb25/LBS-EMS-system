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
import { Search, MoreHorizontal, Edit, UserCheck, Trash } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/overlays";
const API_URL = import.meta.env.VITE_API_URL;

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
  photo_path?: string;
  payment_proof?: string;
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
                {student.registration_date
                  ? new Date(student.registration_date).toLocaleDateString()
                  : "—"}
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
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
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
    photo_path: null,
    payment_proof: null,
    registration_date: "",
  });

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/students/`),
      fetch(`${API_URL}/api/centres/`),
      fetch(`${API_URL}/api/courses/`),
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
      .catch(() => setError("Error loading data"))
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name } = target;
    const value =
      target instanceof HTMLInputElement && target.files?.[0]
        ? target.files[0]
        : target.value;

    setFormData((prev: any) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.temporary_student_id)
      errors.temporary_student_id = "Temporary ID is required";
    if (!formData.first_name) errors.first_name = "First name is required";
    if (!formData.last_name) errors.last_name = "Last name is required";
    if (formData.aadhar_number && formData.aadhar_number.length !== 12)
      errors.aadhar_number = "Aadhar number must be 12 digits";
    if (formData.phone_number && !/^\d{10}$/.test(formData.phone_number))
      errors.phone_number = "Phone number must be 10 digits";
    if (!formData.centre_id) errors.centre_id = "Please select a centre";
    if (!formData.course_id) errors.course_id = "Please select a course";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      temporary_student_id: student.temporary_student_id,
      first_name: student.first_name,
      middle_name: student.middle_name || "",
      last_name: student.last_name,
      date_of_birth: student.date_of_birth?.split("T")[0] || "",
      gender: student.gender || "Male",
      email: student.email || "",
      phone_number: student.phone_number || "",
      address: student.address || "",
      city: student.city || "",
      state: student.state || "",
      pincode: student.pincode || "",
      aadhar_number: student.aadhar_number || "",
      guardian_name: student.guardian_name || "",
      guardian_relation: student.guardian_relation || "",
      guardian_phone_number: student.guardian_phone_number || "",
      educational_qualification: student.educational_qualification || "",
      centre_id:
        centres.find((c) => c.centre_name === student.centre_name)?.centre_id ||
        "",
      course_id:
        courses.find((c) => c.course_name === student.course_name)?.course_id ||
        "",
      photo_path: null,
      payment_proof: null,
      registration_date: student.registration_date?.split("T")[0] || "",
    });
    setOpen(true);
  };

  const handleDelete = async (student: Student) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch(
        `${API_URL}/api/students/${student.student_id}/`,
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
    if (!validateForm()) return;

    try {
      const formPayload = new FormData();

      const textFields = [
        "temporary_student_id",
        "first_name",
        "middle_name",
        "last_name",
        "date_of_birth",
        "gender",
        "email",
        "phone_number",
        "address",
        "city",
        "state",
        "pincode",
        "aadhar_number",
        "guardian_name",
        "guardian_relation",
        "guardian_phone_number",
        "educational_qualification",
        "registration_date",
      ];

      textFields.forEach((field) => {
        const value = formData[field];
        if (value) formPayload.append(field, value);
      });

      formPayload.append("centre", formData.centre_id);
      formPayload.append("course", formData.course_id);

      // // Get logged-in user
      // const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      // if (!userData.id) throw new Error("User not logged in");
      // formPayload.append("created_by", userData.id);

      if (formData.photo_path instanceof File)
        formPayload.append("photo_path", formData.photo_path);
      if (formData.payment_proof instanceof File)
        formPayload.append("payment_proof", formData.payment_proof);

      const res = await fetch(`${API_URL}/api/students/`, {
        method: "POST",
        body: formPayload,
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("Detailed error:", errData);
        throw new Error("Failed to create student");
      }

      const newStudent = await res.json();
      setStudents((prev) => [...prev, newStudent]);
      setOpen(false);
      setSelectedStudent(null);
      setFormData({
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
        photo_path: null,
        payment_proof: null,
        registration_date: "",
      });
      setFormErrors({});
    } catch (err: any) {
      console.error("Error creating student:", err);
      alert("Error creating student: " + err.message);
    }
  };

  const filteredStudents = students.filter((student) => {
    const q = searchQuery.toLowerCase();
    return (
      student.first_name.toLowerCase().includes(q) ||
      (student.middle_name ?? "").toLowerCase().includes(q) ||
      student.last_name.toLowerCase().includes(q) ||
      (student.phone_number ?? "").toLowerCase().includes(q)
    );
  });

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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-accent hover:bg-accent">
              <UserCheck className="mr-2 h-4 w-4" />
              Add New Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedStudent ? "Edit Student" : "Add New Student"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-2">
                {/* Repeat Inputs with error messages */}
                {[
                  { name: "temporary_student_id", placeholder: "Temporary ID" },
                  { name: "first_name", placeholder: "First Name" },
                  { name: "middle_name", placeholder: "Middle Name" },
                  { name: "last_name", placeholder: "Last Name" },
                  { name: "email", placeholder: "Email", type: "email" },
                  { name: "phone_number", placeholder: "Phone Number" },
                  { name: "date_of_birth", placeholder: "DOB", type: "date" },
                  { name: "address", placeholder: "Address" },
                  { name: "city", placeholder: "City" },
                  { name: "state", placeholder: "State" },
                  { name: "pincode", placeholder: "Pincode" },
                  { name: "aadhar_number", placeholder: "Aadhar Number" },
                  { name: "guardian_name", placeholder: "Guardian Name" },
                  {
                    name: "guardian_relation",
                    placeholder: "Guardian Relation",
                  },
                  {
                    name: "guardian_phone_number",
                    placeholder: "Guardian Phone",
                  },
                  {
                    name: "educational_qualification",
                    placeholder: "Education",
                  },
                ].map(({ name, placeholder, type }) => (
                  <div key={name}>
                    <Input
                      name={name}
                      placeholder={placeholder}
                      type={type || "text"}
                      value={formData[name]}
                      onChange={handleInputChange}
                    />
                    {formErrors[name] && (
                      <p className="text-red-500 text-sm">{formErrors[name]}</p>
                    )}
                  </div>
                ))}
                <div>
                  <label className="text-sm font-medium">Upload Photo ID</label>
                  <Input
                    name="photo_path"
                    type="file"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Upload Payment Proof
                  </label>
                  <Input
                    name="payment_proof"
                    type="file"
                    onChange={handleInputChange}
                  />
                </div>
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
                {formErrors.centre_id && (
                  <p className="text-red-500 text-sm">{formErrors.centre_id}</p>
                )}
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
                {formErrors.course_id && (
                  <p className="text-red-500 text-sm">{formErrors.course_id}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Save Student
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
              onEdit={(s) => {
                setSelectedStudent(s);
                setFormData({ ...s });
                setOpen(true);
              }}
              onDelete={async (s) => {
                if (!confirm("Are you sure you want to delete this student?"))
                  return;
                try {
                  const res = await fetch(
                    `${API_URL}/api/students/${s.student_id}/`,
                    { method: "DELETE" }
                  );
                  if (!res.ok) throw new Error("Failed to delete student");
                  setStudents((prev) =>
                    prev.filter((st) => st.student_id !== s.student_id)
                  );
                } catch (err: any) {
                  alert("Error deleting student: " + err.message);
                }
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CentreStudents;
