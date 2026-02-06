/// <reference types="vite/client" />
import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/buttons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/layout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/overlays";
import { Input } from "../components/ui/inputs";
import {
  Badge,
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
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash,
  MapPin,
  Calendar,
} from "lucide-react";
import { apiFetch } from "../lib/api";

/* ---------- TYPES ---------- */
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
  expired_centres: number;
  total_students: number;
}

/* ---------- COMPONENT ---------- */
const CentresPage = () => {
  const isAdmin = localStorage.getItem("is_admin") === "true";

  const [centres, setCentres] = useState<Centre[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Centre | null>(null);
  const [form, setForm] = useState<Partial<Centre>>({ is_active: true });

  /* ---------- FETCH ---------- */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [centresData, statsData] = await Promise.all([
        apiFetch("/api/centres/?format=json"),
        apiFetch("/api/centre-stats/"),
      ]);

      setCentres(
        Array.isArray(centresData) ? centresData : (centresData.results ?? []),
      );

      setStats(statsData);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------- FORM ---------- */
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

  const getValidityStatus = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);

    const oneMonthBeforeExpiry = new Date(expiry);
    oneMonthBeforeExpiry.setMonth(oneMonthBeforeExpiry.getMonth() - 1);

    const diffMs = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (today > expiry) {
      return {
        label: "Expired",
        variant: "destructive" as const,
      };
    }

    if (today >= oneMonthBeforeExpiry) {
      return {
        label: `Expiring in ${diffDays} day${diffDays !== 1 ? "s" : ""}`,
        variant: "warning" as const,
      };
    }

    return {
      label: "Active",
      variant: "default" as const,
    };
  };

  /* ---------- SAVE ---------- */
  const saveCentre = async () => {
    try {
      await apiFetch(
        editing ? `/api/centres/${editing.centre_id}/` : "/api/centres/",
        {
          method: editing ? "PUT" : "POST",
          body: JSON.stringify(form),
        },
      );

      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to save centre");
    }
  };

  /* ---------- DELETE ---------- */
  const deleteCentre = async (id: number) => {
    if (!confirm("Delete this centre?")) return;

    try {
      await apiFetch(`/api/centres/${id}/`, { method: "DELETE" });
      fetchData();
    } catch {
      alert("Failed to delete centre");
    }
  };

  /* ---------- FILTER ---------- */
  const filtered = centres.filter(
    (c) =>
      c.centre_name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.centre_code.toLowerCase().includes(search.toLowerCase()),
  );

  /* ---------- UI ---------- */
  if (loading) return <div>Loading centres...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* ---------- HEADER ---------- */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Centre Management</h1>

        {isAdmin && (
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
                className="space-y-4"
              >
                <Input
                  name="centre_code"
                  placeholder="Code"
                  value={form.centre_code || ""}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="centre_name"
                  placeholder="Name"
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
                <Input
                  type="date"
                  name="validity_start_date"
                  value={form.validity_start_date || ""}
                  onChange={handleChange}
                  required
                />
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
        )}
      </div>

      {/* ---------- STATS CARDS ---------- */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Centres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_centres ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all districts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Active Centres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {stats?.active_centres ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {stats?.expiring_soon ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">Within 1 month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Expired
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats?.expired_centres ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">Inactive centres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_students ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              All centres combined
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ---------- TABLE ---------- */}
      <Card>
        <CardHeader>
          <CardTitle>Centre Directory</CardTitle>
        </CardHeader>

        <CardContent>
          <Input
            placeholder="Search centres..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Centre</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Status</TableHead>
                {isAdmin && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>

            <TableBody>
              {centres.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 5 : 4} className="text-center">
                    No centres found.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((c) => (
                <TableRow key={c.centre_id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{c.centre_name}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {c.centre_id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{c.location}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {c.district}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>
                        {c.validity_start_date} to {c.validity_end_date}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    {(() => {
                      const status = getValidityStatus(c.validity_end_date);

                      return (
                        <Badge variant={status.variant}>{status.label}</Badge>
                      );
                    })()}
                  </TableCell>

                  {isAdmin && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
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
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CentresPage;
