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
const API_URL = import.meta.env.VITE_API_URL;

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
  // courses_count?: number; // optional if your API doesn't send it yet
  // students?: number;      // optional
}
interface Stats {
  total_centres: number;
  active_centres: number;
  expiring_soon: number;
  total_students: number;
}

const CentreCentres = () => {
  const [centres, setCentres] = useState<Centre[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [studentStats, setStudentStats] = useState<{
    total_students: number;
  } | null>(null);

  const filteredCentres = centres.filter(
    (centre) =>
      centre.centre_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      centre.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      centre.centre_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch centres
        const centreRes = await fetch(`${API_URL}/api/centres/?format=json`);
        if (!centreRes.ok)
          throw new Error(`Centres API error: ${centreRes.status}`);
        const centreData = await centreRes.json();

        // Fetch stats
        const statsRes = await fetch(`${API_URL}/api/centre-stats/`);
        API_URL;
        if (!statsRes.ok)
          throw new Error(`Stats API error: ${statsRes.status}`);
        const statsData = await statsRes.json();

        // Fetch studentsAPI_URL
        const studentsRes = await fetch(`${API_URL}/api/students/`);
        if (!studentsRes.ok) throw new Error(`Students API errAPI_URLtatus}`);
        const studentsData = await studentsRes.json();

        // Count total students
        setStudentStats({ total_students: studentsData.length });

        // Update state
        setCentres(centreData);
        setStats(statsData);
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading centres...</div>;
  if (error) return <div>Error loading centres: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Centre Management
          </h1>
        </div>
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
                value={searchQuery} // bind input to state
                onChange={(e) => setSearchQuery(e.target.value)} // update state
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
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
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
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{/* courses count */}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {/* students count */}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={centre.is_active ? "default" : "secondary"}
                      >
                        {centre.is_active ? "Active" : "Inactive"}
                      </Badge>
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

export default CentreCentres;
