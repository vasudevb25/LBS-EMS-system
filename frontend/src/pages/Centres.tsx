import React, { useState, useEffect } from "react";
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
  BookOpen,
} from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

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

const Centres = () => {
  const [centres, setCentres] = useState<Centre[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch centres
        const centreRes = await fetch(
          "http://127.0.0.1:8000/api/centres/?format=json"
        );
        if (!centreRes.ok)
          throw new Error(`Centres API error: ${centreRes.status}`);
        const centreData = await centreRes.json();

        // Fetch stats
        const statsRes = await fetch("http://127.0.0.1:8000/api/centre-stats/");
        if (!statsRes.ok)
          throw new Error(`Stats API error: ${statsRes.status}`);
        const statsData = await statsRes.json();

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
        <Button className="bg-gradient-primary hover:bg-primary-glow">
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
            <div className="text-2xl font-bold">{stats?.total_students}</div>
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
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Centre Details</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {centres.map((centre) => (
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
                        <span className="text-sm">{} courses</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {} students
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={centre.is_active ? "default" : "secondary"}>
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
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Centre
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Allocate Courses
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Centre
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Centres;
