/// <reference types="vite/client" />
const API_URL = import.meta.env.VITE_API_URL;

import { useEffect, useState } from "react";
import { Button } from "../components/ui/buttons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/overlays";
import {
  Search,
  Check,
  X,
  AlertCircle,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
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
  photo_path?: string;
  payment_proof?: string;
  course_name: string;
  centre_name: string;
  registration_date: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface Course {
  course_id: number;
  course_name: string;
}

/* ---------------- PAGE ---------------- */

const StudentsPage = () => {
  const isAdmin = localStorage.getItem("is_admin") === "true";
  const centreId = localStorage.getItem("centre_id");

  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<Student | null>(null);
  const [editing, setEditing] = useState<Student | null>(null);
  const [open, setOpen] = useState(false);

  const initialForm = {
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
    centre: "",
    course: "",
    registration_date: "",
    photo_path: null as File | null,
    payment_proof: null as File | null,
    aadhar: null as File | null,
    eligibility_proof: null as File | null,
  };

  const [formData, setFormData] = useState(initialForm);

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    const fetchData = async () => {
      const studentUrl = isAdmin
        ? "/api/students/"
        : `/api/students/?centre=${centreId}`;

      const [studentData, courseData] = await Promise.all([
        apiFetch(studentUrl),
        apiFetch("/api/courses/"),
      ]);

      setStudents(studentData);
      setCourses(courseData);
      setLoading(false);
    };

    fetchData();
  }, [isAdmin, centreId]);

  /* ---------------- APPROVAL ---------------- */

  const approveStudent = async (id: number) => {
    await apiFetch(`/api/students/${id}/approve/`, { method: "POST" });

    setStudents((prev) =>
      prev.map((s) => (s.student_id === id ? { ...s, status: "Approved" } : s)),
    );
  };

  const rejectStudent = async (id: number) => {
    await apiFetch(`/api/students/${id}/reject/`, { method: "POST" });

    setStudents((prev) =>
      prev.map((s) => (s.student_id === id ? { ...s, status: "Rejected" } : s)),
    );
  };

  /* ---------------- ADD / EDIT ---------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const openEdit = (student: Student) => {
    setEditing(student);
    setFormData({
      ...initialForm,
      temporary_student_id: student.temporary_student_id,
      first_name: student.first_name,
      middle_name: student.middle_name ?? "",
      last_name: student.last_name,
      date_of_birth: student.date_of_birth.split("T")[0],
      gender: student.gender,
      email: student.email ?? "",
      phone_number: student.phone_number ?? "",
      registration_date: student.registration_date.split("T")[0],
      centre: student.centre_name,
      course:
        courses
          .find((c) => c.course_name === student.course_name)
          ?.course_id?.toString() || "",
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        payload.append(key, value as any);
      }
    });

    // Always reset status to Pending for centre edits
    payload.set("status", "Pending");

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
    window.location.reload();
  };

  const deleteStudent = async (id: number) => {
    await apiFetch(`/api/students/${id}/`, { method: "DELETE" });
    setStudents((prev) => prev.filter((s) => s.student_id !== id));
  };

  /* ---------------- FILTER ---------------- */

  const filtered = students.filter((s) =>
    `${s.first_name} ${s.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Students</h1>
            <p className="text-muted-foreground">
              {isAdmin
                ? "Admin approval required"
                : "Manage your centre students"}
            </p>
          </div>

          {!isAdmin && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Add Student</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-hidden p-0">
                <DialogHeader className="px-6 pt-6 pb-2 border-b">
                  <DialogTitle>
                    {editing ? "Edit Student" : "Add Student"}
                  </DialogTitle>
                </DialogHeader>

                <div className="overflow-y-auto max-h-[80vh] px-6 py-4">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* PERSONAL DETAILS */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Personal Details
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          name="temporary_student_id"
                          placeholder="Student ID"
                          value={formData.temporary_student_id}
                          onChange={handleChange}
                          required
                        />
                        <Input
                          name="first_name"
                          placeholder="First Name"
                          value={formData.first_name}
                          onChange={handleChange}
                          required
                        />
                        <Input
                          name="middle_name"
                          placeholder="Middle Name"
                          value={formData.middle_name}
                          onChange={handleChange}
                        />
                        <Input
                          name="last_name"
                          placeholder="Last Name"
                          value={formData.last_name}
                          onChange={handleChange}
                          required
                        />
                        <Input
                          type="date"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleChange}
                          required
                        />

                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="border rounded-md w-full p-2"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* CONTACT */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Contact Details
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        <Input
                          name="phone_number"
                          placeholder="Phone"
                          value={formData.phone_number}
                          onChange={handleChange}
                        />
                        <Input
                          name="address"
                          placeholder="Address"
                          value={formData.address}
                          onChange={handleChange}
                        />
                        <Input
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleChange}
                        />
                        <Input
                          name="state"
                          placeholder="State"
                          value={formData.state}
                          onChange={handleChange}
                        />
                        <Input
                          name="pincode"
                          placeholder="Pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                        />
                        <Input
                          name="aadhar_number"
                          placeholder="Aadhar Number"
                          value={formData.aadhar_number}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* GUARDIAN */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Guardian Details
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          name="guardian_name"
                          placeholder="Guardian Name"
                          value={formData.guardian_name}
                          onChange={handleChange}
                        />
                        <Input
                          name="guardian_relation"
                          placeholder="Relation"
                          value={formData.guardian_relation}
                          onChange={handleChange}
                        />
                        <Input
                          name="guardian_phone_number"
                          placeholder="Guardian Phone"
                          value={formData.guardian_phone_number}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* EDUCATION */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Educational Details
                      </h3>
                      <Input
                        name="educational_qualification"
                        placeholder="Educational Qualification"
                        value={formData.educational_qualification}
                        onChange={handleChange}
                      />
                    </div>

                    {/* COURSE */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Course Allocation
                      </h3>
                      <select
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        className="border rounded-md w-full p-2"
                        required
                      >
                        <option value="">Select Course</option>
                        {courses.map((c) => (
                          <option key={c.course_id} value={c.course_id}>
                            {c.course_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* DOCUMENTS */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Documents</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="block">
                          <span className="text-sm font-medium">Photo</span>
                          <Input
                            type="file"
                            name="photo_path"
                            onChange={handleChange}
                          />
                        </label>

                        <label className="block">
                          <span className="text-sm font-medium">Aadhar</span>
                          <Input
                            type="file"
                            name="aadhar_path"
                            onChange={handleChange}
                          />
                        </label>

                        <label className="block">
                          <span className="text-sm font-medium">
                            Eligibility Proof
                          </span>
                          <Input
                            type="file"
                            name="eligibility_proof"
                            onChange={handleChange}
                          />
                        </label>

                        <label className="block">
                          <span className="text-sm font-medium">
                            Payment Proof
                          </span>
                          <Input
                            type="file"
                            name="payment_proof"
                            onChange={handleChange}
                          />
                        </label>
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      {editing ? "Update Student" : "Save Student"}
                    </Button>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* TABLE */}
        <Card>
          <CardHeader>
            <CardTitle>Student List</CardTitle>
            <CardDescription>Status-based approval system</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-4 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Course</TableHead>
                  {isAdmin && <TableHead>Centre</TableHead>}
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.student_id}>
                    <TableCell>
                      {s.first_name} {s.last_name}
                    </TableCell>
                    <TableCell>{s.course_name}</TableCell>
                    {isAdmin && <TableCell>{s.centre_name}</TableCell>}

                    <TableCell>
                      {s.status === "Pending" && (
                        <span className="flex items-center gap-1 text-yellow-600">
                          <AlertCircle className="h-4 w-4" /> Pending
                        </span>
                      )}
                      {s.status === "Approved" && (
                        <span className="text-green-600">Approved</span>
                      )}
                      {s.status === "Rejected" && (
                        <span className="text-red-600">Rejected</span>
                      )}
                    </TableCell>

                    <TableCell className="flex gap-3 items-center">
                      {/* VIEW */}
                      <Eye
                        className="cursor-pointer text-blue-600"
                        onClick={() => setViewing(s)}
                      />

                      {/* ADMIN APPROVAL */}
                      {isAdmin && s.status === "Pending" && (
                        <>
                          <Check
                            className="text-green-600 cursor-pointer"
                            onClick={() => approveStudent(s.student_id)}
                          />
                          <X
                            className="text-red-600 cursor-pointer"
                            onClick={() => rejectStudent(s.student_id)}
                          />
                        </>
                      )}

                      {/* CENTRE EDIT/DELETE */}
                      {!isAdmin && (
                        <>
                          <Pencil
                            className="cursor-pointer text-indigo-600"
                            onClick={() => openEdit(s)}
                          />
                          <Trash2
                            className="cursor-pointer text-red-600"
                            onClick={() => deleteStudent(s.student_id)}
                          />
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* VIEW MODAL */}
      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>

          {viewing && (
            <div className="space-y-6 text-base">
              {/* Header */}
              <div className="flex items-center gap-4 border-b pb-4">
                <img
                  src={
                    viewing.photo_path
                      ? new URL(viewing.photo_path, API_URL).toString()
                      : ""
                  }
                  alt="Student"
                  className="h-24 w-24 rounded-full object-cover border"
                />

                <div>
                  <h2 className="text-2xl font-bold">
                    {viewing.first_name} {viewing.last_name}
                  </h2>
                  <p className="text-muted-foreground">
                    ID: {viewing.temporary_student_id}
                  </p>
                </div>
              </div>
              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <Detail label="Gender" value={viewing.gender} />
                <Detail label="DOB" value={viewing.date_of_birth} />
                <Detail label="Email" value={viewing.email} />
                <Detail label="Phone" value={viewing.phone_number} />
                <Detail label="Course" value={viewing.course_name} />
                <Detail label="Centre" value={viewing.centre_name} />
                <Detail
                  label="Registered"
                  value={new Date(
                    viewing.registration_date,
                  ).toLocaleDateString()}
                />
              </div>
              {/* Full Profile Link */}
              <div className="pt-4 border-t">
                <a
                  href={`/app/students/${viewing.student_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-medium hover:underline"
                >
                  View Full Profile →
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudentsPage;

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}
