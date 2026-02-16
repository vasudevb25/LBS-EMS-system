/// <reference types="vite/client" />
const API_URL = import.meta.env.VITE_API_URL;

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
  photo_path?: string;
  payment_proof?: string;
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
  const [viewing, setViewing] = useState<Student | null>(null);

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
  };

  const [formData, setFormData] = useState(initialForm);

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    const fetchData = async () => {
      try {
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

    fetchData();
  }, []);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]: files && files.length > 0 ? files[0] : value,
    }));
  };

  const openEdit = (s: Student) => {
    setEditing(s);

    setFormData({
      ...initialForm,
      temporary_student_id: s.temporary_student_id,
      first_name: s.first_name,
      middle_name: s.middle_name ?? "",
      last_name: s.last_name,
      date_of_birth: s.date_of_birth.split("T")[0],
      gender: s.gender,
      email: s.email ?? "",
      phone_number: s.phone_number ?? "",
      registration_date: s.registration_date.split("T")[0],
      centre:
        centres
          .find((c) => c.centre_name === s.centre_name)
          ?.centre_id?.toString() || "",
      course:
        courses
          .find((c) => c.course_name === s.course_name)
          ?.course_id?.toString() || "",
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

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        payload.append(key, value as any);
      }
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
    setFormData(initialForm);
    window.location.reload();
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

  if (loading) return <div>Loading students...</div>;
  if (error) return <div className="text-destructive">{error}</div>;

  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
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

                  {/* CONTACT DETAILS */}
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

                  {/* COURSE + CENTRE */}
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      name="centre"
                      value={formData.centre}
                      onChange={handleChange}
                      className="border rounded-md w-full p-2"
                      required
                    >
                      <option value="">Select Centre</option>
                      {centres.map((c) => (
                        <option key={c.centre_id} value={c.centre_id}>
                          {c.centre_name}
                        </option>
                      ))}
                    </select>

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
                      <Input
                        type="file"
                        name="photo_path"
                        onChange={handleChange}
                      />
                      <Input
                        type="file"
                        name="payment_proof"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    {editing ? "Update Student" : "Save Student"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* TABLE */}
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
                    {isCentre && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.map((s) => (
                    <TableRow key={s.student_id}>
                      <TableCell>
                        {s.first_name} {s.last_name}
                      </TableCell>
                      <TableCell>{s.email || "—"}</TableCell>
                      <TableCell>{s.course_name}</TableCell>
                      <TableCell>{s.centre_name}</TableCell>
                      <TableCell>{s.phone_number || "—"}</TableCell>
                      <TableCell>
                        {new Date(s.registration_date).toLocaleDateString()}
                      </TableCell>

                      {isCentre && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>

                              <DropdownMenuItem onClick={() => setViewing(s)}>
                                View
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => openEdit(s)}>
                                Edit
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(s)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
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

/* ---------------- HELPER ---------------- */

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}
