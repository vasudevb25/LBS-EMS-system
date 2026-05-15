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
import LoaderOverlay from "../components/ui/loadoverlay";

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
  fee: number;
}
interface Centre {
  centre_id: number;
  centre_code: string;
}

interface Examination {
  exam_id: number;
  exam_name: string;
  subject_code: string;
  exam_type: "Regular" | "Supplementary";
  exam_date: string;
  exam_start_time: string;
  exam_end_time: string;
  course: number;
  centre: number;
  course_name?: string;
  centre_name?: string;
  exam_fee: string;
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
  const [examinations, setExaminations] = useState<Examination[]>([]);

  const [centre, setCentre] = useState<Centre | null>(null);

  const [examOpen, setExamOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null,
  );
  const [examViewOpen, setExamViewOpen] = useState(false);
  const [studentExams, setStudentExams] = useState<any[]>([]);
  const [examLoading, setExamLoading] = useState(false);

  const [examForm, setExamForm] = useState({
    exam: "",
    date_of_course_registered: "",
    photo: null as File | null,
    exam_fee_receipt: null as File | null,
  });

  const [saveMode, setSaveMode] = useState<"close" | "stay">("close");

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
        ? "/students/"
        : `/students/?centre=${centreId}`;

      const [studentData, courseData, examData, centreData] = await Promise.all(
        [
          apiFetch(studentUrl),
          apiFetch("/courses/"),
          apiFetch("/examinations/"),
          !isAdmin ? apiFetch(`/centres/${centreId}/`) : null,
        ],
      );

      setStudents(studentData);
      setCourses(courseData);
      setExaminations(examData);
      // If we fetched a centre (non-admin), store it so the centre_code can be shown in the form
      setCentre(centreData ?? null);
      setLoading(false);
    };

    fetchData();
  }, [isAdmin, centreId]);

  /* ---------------- APPROVAL ---------------- */

  const approveStudent = async (id: number) => {
    await apiFetch(`/students/${id}/approve/`, { method: "POST" });

    setStudents((prev) =>
      prev.map((s) => (s.student_id === id ? { ...s, status: "Approved" } : s)),
    );
  };

  const rejectStudent = async (id: number) => {
    await apiFetch(`/students/${id}/reject/`, { method: "POST" });

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

    if (!/^\d{10}$/.test(formData.phone_number)) {
      alert("Phone number must be exactly 10 digits");
      return;
    }
    if (!/^\d{12}$/.test(formData.aadhar_number)) {
      alert("Aadhar number must be exactly 12 digits");
      return;
    }

    if (editing) {
      await apiFetch(`/students/${editing.student_id}/`, {
        method: "PUT",
        body: payload,
      });
    } else {
      await apiFetch(`/students/`, {
        method: "POST",
        body: payload,
      });
    }
    if (saveMode === "close") {
      setOpen(false);
      setEditing(null);
    } else {
      // Stay on form, do NOT close
      alert("Saved successfully");
    }
  };

  const deleteStudent = async (id: number) => {
    await apiFetch(`/students/${id}/`, { method: "DELETE" });
    setStudents((prev) => prev.filter((s) => s.student_id !== id));
  };

  /* ---------------- FILTER ---------------- */
  const selectedCourse = courses.find(
    (c) => String(c.course_id) === String(formData.course),
  );
  const filtered = students.filter((s) =>
    `${s.first_name} ${s.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  function registerForExam(student_id: number) {
    setSelectedStudentId(student_id);
    setExamOpen(true);
  }
  const viewExam = async (studentId: number) => {
    setExamLoading(true);
    setExamViewOpen(true);

    const data = await apiFetch("/exam-registrations/");

    const filtered = data.filter((reg: any) => reg.student === studentId);

    setStudentExams(filtered);
    setExamLoading(false);
  };

  return (
    <>
      <div className="relative">
        {loading && <LoaderOverlay />}

        <div className={loading ? "pointer-events-none blur-sm" : ""}>
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
                            <span className="px-3 py-2 bg-100 border border-r-0 rounded-l-md">
                              {centre?.centre_code || "----"}
                            </span>
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
                              type="tel"
                              name="phone_number"
                              placeholder="Phone"
                              value={formData.phone_number}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, ""); // remove non-digits

                                if (value.length <= 10) {
                                  setFormData({
                                    ...formData,
                                    phone_number: value,
                                  });
                                }
                              }}
                              maxLength={10}
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
                              type="tel"
                              name="aadhar_number"
                              placeholder="Aadhar Number"
                              value={formData.aadhar_number}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, ""); // only digits

                                if (value.length <= 12) {
                                  setFormData({
                                    ...formData,
                                    aadhar_number: value,
                                  });
                                }
                              }}
                              maxLength={12}
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

                          {selectedCourse && (
                            <div className="mt-3 p-3 bg-gray-50 border rounded-md ">
                              <p className="text-sm text-muted-foreground">
                                Course Fees
                              </p>
                              <p className="text-lg font-semibold text-indigo-600">
                                ₹{" "}
                                {selectedCourse.fee
                                  ? selectedCourse.fee.toLocaleString()
                                  : "Not Available"}{" "}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* DOCUMENTS */}
                        <div>
                          <h3 className="text-lg font-semibold mb-3">
                            Documents
                          </h3>
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
                              <span className="text-sm font-medium">
                                Aadhar
                              </span>
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

                        <div className="flex gap-4 pt-4">
                          <Button
                            type="submit"
                            className="w-1/2"
                            onClick={() => setSaveMode("close")}
                          >
                            {editing ? "Update & Close" : "Save & Close"}
                          </Button>
                        </div>
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
                      <TableHead>Register For EXAM</TableHead>
                      <TableHead>View EXAM</TableHead>
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
                          {!isAdmin && !(s.status === "Approved") && (
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

                        <TableCell>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => registerForExam(s.student_id)}
                          >
                            Apply for Exam
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => viewExam(s.student_id)}
                          >
                            View Exam
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* VIEW MODAL */}
          <Dialog open={examOpen} onOpenChange={setExamOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Exam Registration</DialogTitle>
              </DialogHeader>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  const payload = new FormData();
                  payload.append("student", String(selectedStudentId));
                  payload.append("exam", examForm.exam);
                  payload.append(
                    "date_of_course_registered",
                    examForm.date_of_course_registered,
                  );

                  if (examForm.photo) payload.append("photo", examForm.photo);
                  if (examForm.exam_fee_receipt)
                    payload.append(
                      "exam_fee_receipt",
                      examForm.exam_fee_receipt,
                    );

                  try {
                    await apiFetch("/exam-registrations/", {
                      method: "POST",
                      body: payload,
                    });
                  } catch (err: any) {
                    alert(err.message && "Already registered for this exam");
                  }

                  setExamOpen(false);
                }}
                className="space-y-6"
              >
                {/* Section: Course Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    Course Registration Date
                  </h3>
                  <Input
                    type="date"
                    required
                    className="w-full"
                    onChange={(e) =>
                      setExamForm({
                        ...examForm,
                        date_of_course_registered: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Section: Exam Selection */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Select Examination</h3>
                  <select
                    required
                    value={examForm.exam}
                    onChange={(e) =>
                      setExamForm({
                        ...examForm,
                        exam: e.target.value,
                      })
                    }
                    className="border rounded-md w-full p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Choose an exam</option>
                    {examinations.map((exam) => (
                      <option key={exam.exam_id} value={exam.exam_id}>
                        {exam.exam_name} | {exam.exam_date}
                      </option>
                    ))}
                  </select>

                  {/* Optional exam preview */}
                  {examForm.exam && (
                    <div className="mt-3 p-3 bg-black-50  text-sm">
                      {
                        examinations.find(
                          (e) => String(e.exam_id) === examForm.exam,
                        )?.exam_type
                      }{" "}
                      Exam
                    </div>
                  )}
                </div>

                {/* Section: Documents */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Upload Documents</h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">
                        Student Photo
                      </label>
                      <Input
                        type="file"
                        required
                        onChange={(e) =>
                          setExamForm({
                            ...examForm,
                            photo: e.target.files?.[0] || null,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium">
                        Exam Fee Receipt
                      </label>
                      <Input
                        type="file"
                        required
                        onChange={(e) =>
                          setExamForm({
                            ...examForm,
                            exam_fee_receipt: e.target.files?.[0] || null,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <Button type="submit" className="w-full text-base py-3">
                  Submit Exam Registration
                </Button>
              </form>
            </DialogContent>
          </Dialog>
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
          <Dialog open={examViewOpen} onOpenChange={setExamViewOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto p-0 rounded-2xl">
              <div className="flex">
                {/* LEFT SIDE – Student Info */}
                {studentExams.length > 0 && (
                  <div className="w-1/3 border-r border-gray-800 p-6 flex flex-col items-center text-center space-y-4">
                    <img
                      src={
                        studentExams[0].photo
                          ? new URL(studentExams[0].photo, API_URL).toString()
                          : ""
                      }
                      alt="Student"
                      className="h-28 w-28 rounded-full object-cover border border-700 shadow-md"
                    />

                    <div>
                      <h2 className="text-xl font-semibold">
                        {studentExams[0].candidate_name}
                      </h2>
                      <p className="text-sm text-400">
                        Course Code: {studentExams[0].course_code}
                      </p>
                      <p className="text-sm text-400">
                        Centre Code:{" "}
                        {studentExams[0].centre_code ??
                          centre?.centre_code ??
                          studentExams[0].centre ??
                          "----"}
                      </p>
                    </div>
                  </div>
                )}
                {/* RIGHT SIDE – Exam List */}
                <div className="w-2/3 p-6 space-y-6">
                  <h2 className="text-2xl font-bold border-b border-gray-800 pb-4">
                    Exam Registrations
                  </h2>

                  {examLoading ? (
                    <div className="text-center py-10 text-400">
                      Loading exams...
                    </div>
                  ) : studentExams.length === 0 ? (
                    <div className="text-center py-10 text-400">
                      No exam registrations found.
                    </div>
                  ) : (
                    studentExams.map((reg) => {
                      const examDetails = examinations.find(
                        (e) => e.exam_id === reg.exam,
                      );

                      return (
                        <div
                          key={reg.id}
                          className="border border-800 rounded-xl p-5 hover:bg-700 transition-all duration-200"
                        >
                          {/* Exam Header */}
                          <div className="flex justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {examDetails?.exam_name || "Exam"}
                              </h3>
                              <p className="text-sm text-400">
                                {examDetails?.exam_type} •{" "}
                                {examDetails?.subject_code}
                              </p>
                            </div>

                            <div className="text-right text-sm text-400">
                              <p>{examDetails?.exam_date}</p>
                              <p>
                                {examDetails?.exam_start_time} -{" "}
                                {examDetails?.exam_end_time}
                              </p>
                            </div>
                          </div>

                          {/* Info Grid */}
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <p className="text-400">Exam Fee</p>
                              <p className="font-medium">
                                ₹ {examDetails?.exam_fee}
                              </p>
                            </div>

                            <div>
                              <p className="text-400">Registered On</p>
                              <p className="font-medium">
                                {new Date(reg.created_at).toLocaleDateString()}
                              </p>
                            </div>

                            <div>
                              <p className="text-400">Course Code</p>
                              <p className="font-medium">{reg.course_code}</p>
                            </div>

                            <div>
                              <p className="text-400">Centre Code</p>
                              <p className="font-medium">
                                {reg.centre_code ??
                                  centre?.centre_code ??
                                  reg.centre ??
                                  "—"}
                              </p>
                            </div>
                          </div>

                          {/* Documents */}
                          <div className="flex gap-6 pt-4 border-t border-800 text-sm">
                            {reg.exam_fee_receipt && (
                              <a
                                href={reg.exam_fee_receipt}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 font-medium hover:underline"
                              >
                                View Receipt
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
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
