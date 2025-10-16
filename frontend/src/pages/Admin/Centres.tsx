import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/layout";
import { Input } from "../../components/ui/inputs";
import {
  Badge,
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
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash,
  MapPin,
  Calendar,
  BookOpen,
} from "lucide-react";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

// Define the structure of a centre
interface Centre {
  centre_id: number;
  centre_code: string;
  centre_name: string;
  location: string;
  district: string;
  validity_start_date: string;
  validity_end_date: string;
  is_active: boolean;
  created_at: string;
  email?: string;
}
interface Stats {
  total_centres: number;
  active_centres: number;
  expiring_soon: number;
  total_students: number;
}

const AdminCentres = () => {
  const [centres, setCentres] = useState<Centre[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [studentStats, setStudentStats] = useState<{
    total_students: number;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCentre, setEditingCentre] = useState<Centre | null>(null);
  const [formData, setFormData] = useState<Partial<Centre>>({});

  const filteredCentres = centres.filter(
    (centre) =>
      centre.centre_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      centre.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      centre.centre_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const [centreRes, statsRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/centres/?format=json"),
        fetch("http://127.0.0.1:8000/api/centre-stats/"),
      ]);
      if (!centreRes.ok)
        throw new Error(`Centres API error: ${centreRes.status}`);
      if (!statsRes.ok) throw new Error(`Stats API error: ${statsRes.status}`);

      // Fetch students separately
      const studentsRes = await fetch("http://127.0.0.1:8000/api/students/");
      if (!studentsRes.ok)
        throw new Error(`Students API error: ${studentsRes.status}`);
      const studentsData = await studentsRes.json();

      // Count total students
      setStudentStats({ total_students: studentsData.length });

      const [centreData, statsData] = await Promise.all([
        centreRes.json(),
        statsRes.json(),
      ]);
      setCentres(centreData);
      setStats(statsData);
    } catch (err: any) {
      console.error("Failed to fetch data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingCentre(null);
    setFormData({});
    setModalOpen(true);
  };

  const openEditModal = (centre: Centre) => {
    setEditingCentre(centre);
    setFormData({ ...centre });
    setModalOpen(true);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const submitCentre = async () => {
    try {
      const method = editingCentre ? "PUT" : "POST";
      const url = editingCentre
        ? `http://127.0.0.1:8000/api/centres/${editingCentre.centre_id}/`
        : "http://127.0.0.1:8000/api/centres/";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save centre");
      fetchData();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save centre");
    }
  };
  const deleteCentre = async (centre_id: number) => {
    if (!confirm("Are you sure you want to delete this centre?")) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/centres/${centre_id}/`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete centre");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete centre");
    }
  };

  if (loading) return <div>Loading centres...</div>;
  if (error) return <div>Error loading centres: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Centre Management</h1>
        <Button
          className="bg-gradient-primary hover:bg-primary-glow"
          onClick={openAddModal}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Centre
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Centres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_centres}</div>
            <p className="text-xs text-muted-foreground">
              Across all districts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Centres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {stats?.active_centres}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {stats?.expiring_soon}
            </div>
            <p className="text-xs text-muted-foreground">Within 3 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentStats?.total_students ?? "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              All centres combined
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Centre Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search centres by name, location, or ID..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="max-h-[500px] overflow-y-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Centre Details</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCentres.map((centre) => (
                  <TableRow key={centre.centre_id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{centre.centre_name}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {centre.centre_code}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{centre.location}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {centre.district} District
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>
                          {centre.validity_start_date} to{" "}
                          {centre.validity_end_date}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={centre.is_active ? "default" : "secondary"}
                      >
                        {centre.is_active ? "Active" : "Inactive"}
                      </Badge>
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
                          <DropdownMenuItem
                            onClick={() => openEditModal(centre)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit Centre
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteCentre(centre.centre_id)}
                          >
                            <Trash className="mr-2 h-4 w-4" /> Delete Centre
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingCentre ? "Edit Centre" : "Add Centre"}
            </h2>
            <Input
              name="centre_code"
              placeholder="Centre Code"
              value={formData.centre_code || ""}
              onChange={handleChange}
              className="mb-2"
            />
            <Input
              name="centre_name"
              placeholder="Centre Name"
              value={formData.centre_name || ""}
              onChange={handleChange}
              className="mb-2"
            />
            <Input
              name="location"
              placeholder="Location"
              value={formData.location || ""}
              onChange={handleChange}
              className="mb-2"
            />
            <Input
              name="district"
              placeholder="District"
              value={formData.district || ""}
              onChange={handleChange}
              className="mb-2"
            />
            <Input
              name="email"
              placeholder="Email"
              value={formData.email || ""}
              onChange={handleChange}
              className="mb-2"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={submitCentre} className="bg-blue-600 text-white">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCentres;
