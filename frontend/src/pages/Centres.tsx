import { Button } from "../components/ui/buttons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/layout";
import { Input } from "../components/ui/inputs";
import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/data";
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
  BookOpen
} from "lucide-react";

// Mock data for demonstration
const centres = [
  {
    id: "LBS001",
    name: "Kochi Digital Hub",
    location: "Kochi",
    district: "Ernakulam",
    validFrom: "2023-01-01",
    validTo: "2025-12-31",
    status: "Active",
    courses: 12,
    students: 234
  },
  {
    id: "LBS002", 
    name: "Thiruvananthapuram Tech Center",
    location: "Thiruvananthapuram",
    district: "Thiruvananthapuram",
    validFrom: "2023-03-15",
    validTo: "2025-12-31",
    status: "Active",
    courses: 8,
    students: 156
  },
  {
    id: "LBS003",
    name: "Calicut Innovation Lab",
    location: "Calicut",
    district: "Kozhikode",
    validFrom: "2023-06-01",
    validTo: "2024-05-31",
    status: "Expiring Soon",
    courses: 6,
    students: 89
  },
];

const Centres = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Centre Management</h1>
          <p className="text-muted-foreground">
            Manage affiliated training centres, course allocation, and validity tracking
          </p>
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
            <div className="text-2xl font-bold">45</div>
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
            <div className="text-2xl font-bold text-success">42</div>
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
            <div className="text-2xl font-bold text-warning">3</div>
            <p className="text-xs text-muted-foreground">
              Within 3 months
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
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
          <CardDescription>
            View and manage all registered training centres
          </CardDescription>
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
                <TableRow key={centre.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{centre.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {centre.id}
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
                      <span>{centre.validFrom} to {centre.validTo}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{centre.courses} courses</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {centre.students} students
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        centre.status === "Active" 
                          ? "default" 
                          : centre.status === "Expiring Soon"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {centre.status}
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