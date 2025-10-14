import { Button } from "../components/ui/buttons";
import { useState, useEffect } from "react";
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
import {
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Download,
  UserCheck,
} from "lucide-react";

interface Student {
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

const StudentTable = ({ students }: { students: Student[] }) => (
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
          <TableHead className="w-[70px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
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
            <TableCell>{student.email}</TableCell>
            <TableCell>{student.course_name}</TableCell>
            <TableCell>{student.centre_name}</TableCell>
            <TableCell>{student.phone_number}</TableCell>
            <TableCell>
              {new Date(student.registration_date).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" /> View
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" /> Download Docs
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  // Filter students based on name, location, or ID
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

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/students/?format=json") // replace with your actual endpoint
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch students");
        return res.json();
      })
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching students");
        setLoading(false);
      });
  }, []);

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
          <Button className="bg-gradient-accent hover:bg-accent">
            <UserCheck className="mr-2 h-4 w-4" />
            Add New Student
          </Button>
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
                value={searchQuery} // bind input to state
                onChange={(e) => setSearchQuery(e.target.value)} // update state
              />
            </div>
            <Button variant="outline">Filter by Centre</Button>
            <Button variant="outline">Filter by Course</Button>
          </div>

          {loading ? (
            <div className="text-center py-6">Loading...</div>
          ) : error ? (
            <div className="text-center py-6 text-destructive">{error}</div>
          ) : (
            // Pass filteredStudents instead of all students
            <StudentTable students={filteredStudents} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Students;
