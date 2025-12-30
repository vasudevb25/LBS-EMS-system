import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/layout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/overlays";

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
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Centre | null>(null);
  const [form, setForm] = useState<Partial<Centre>>({ is_active: true });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [centresRes, statsRes] = await Promise.all([
        fetch(`${process.env.API_URL}/api/centres/?format=json`),
        fetch(`${process.env.API_URL}/api/centre-stats/`),
      ]);
      const [centresData, statsData] = await Promise.all([
        centresRes.json(),
        statsRes.json(),
      ]);
      setCentres(centresData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditing(null);
    setForm({ is_active: true });
    setModalOpen(true);
  };

  const openEditModal = (c: Centre) => {
    setEditing(c);
    setForm(c);
    setModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveCentre = async () => {
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `${process.env.API_URL}/api/centres/${editing.centre_id}/`
      : `${process.env.API_URL}/api/centres/`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        // Try to parse error message from server
        let errorMsg = `HTTP ${res.status} - ${res.statusText}`;
        try {
          const data = await res.json();
          // Django REST Framework usually returns an object with field errors
          if (typeof data === "object" && data !== null) {
            errorMsg = Object.entries(data)
              .map(([field, value]) => `${field}: ${value}`)
              .join("\n");
          } else if (typeof data === "string") {
            errorMsg = data;
          }
        } catch (jsonErr) {
          // fallback if JSON parsing fails
        }
        throw new Error(errorMsg);
      }

      await fetchData();
      setModalOpen(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Unknown error";
      alert("Error saving centre:\n" + message);
      console.error(err);
    }
  };

  const deleteCentre = async (id: number) => {
    if (!confirm("Delete this centre?")) return;
    try {
      const res = await fetch(`${process.env.API_URL}/api/centres/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      fetchData();
    } catch (err) {
      alert("Error deleting centre.");
    }
  };

  if (loading) return <div>Loading centres...</div>;
  if (error) return <div>Error: {error}</div>;

  const filtered = centres.filter(
    (c) =>
      c.centre_name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.centre_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Centre Management</h1>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddModal}>
              <Plus className="mr-2 h-4 w-4" /> Add Centre
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Centre" : "Add Centre"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveCentre();
              }}
              className="space-y-4 mt-2"
            >
              <Input
                name="centre_code"
                placeholder="Centre Code"
                value={form.centre_code || ""}
                onChange={handleChange}
                required
              />
              <Input
                name="centre_name"
                placeholder="Centre Name"
                value={form.centre_name || ""}
                onChange={handleChange}
                required
              />
              <Input
                name="location"
                placeholder="Location"
                value={form.location || ""}
                onChange={handleChange}
              />
              <Input
                name="district"
                placeholder="District"
                value={form.district || ""}
                onChange={handleChange}
              />
              <label className="block text-sm mb-1">Start Date</label>
              <Input
                type="date"
                name="validity_start_date"
                value={form.validity_start_date || ""}
                onChange={handleChange}
                required
              />

              <label className="block text-sm mb-1">End Date</label>
              <Input
                type="date"
                name="validity_end_date"
                value={form.validity_end_date || ""}
                onChange={handleChange}
                required
              />

              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email || ""}
                onChange={handleChange}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active ?? true}
                  onChange={handleChange}
                />
                <label className="text-sm">Active</label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">{editing ? "Update" : "Save"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Centre Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search centres..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="max-h-[500px] overflow-y-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Centre</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.centre_id}>
                    <TableCell>
                      <div className="font-medium">{c.centre_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {c.centre_code}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{c.location}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {c.district}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {c.validity_start_date} - {c.validity_end_date}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.is_active ? "default" : "secondary"}>
                        {c.is_active ? "Active" : "Inactive"}
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
                          <DropdownMenuItem onClick={() => openEditModal(c)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteCentre(c.centre_id)}
                          >
                            <Trash className="mr-2 h-4 w-4" /> Delete
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
    </div>
  );
};

export default AdminCentres;
