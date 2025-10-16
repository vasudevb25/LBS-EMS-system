import { Navigate, Outlet } from "react-router-dom";
import { RouteObject } from "react-router-dom";
import Login from "../components/Dashboard/Login";
import NotFound from "../pages/NotFound";

// Single AppLayout
import { AppLayout } from "../components/Layout/AppLayout";

// Admin pages
import AdminCentres from "../pages/Admin/Centres";
import AdminCourses from "../pages/Admin/Courses";
import AdminStudents from "../pages/Admin/Students";
import AdminExaminations from "../pages/Admin/Examinations";
import AdminNotifications from "../pages/Admin/Notifications";
import AdminReports from "../pages/Admin/Reports";

// Centre pages
import CentreCentres from "../pages/Centres/Centres";
import CentreCourses from "../pages/Centres/Courses";
import CentreStudents from "../pages/Centres/Students";
import CentreExaminations from "../pages/Centres/Examinations";
import CentreNotifications from "../pages/Centres/Notifications";

// Shared dashboard
import Index from "../pages/Index";

interface PrivateRouteProps {
  roleAllowed: string | string[];
  element: JSX.Element;
}

const PrivateRoute = ({ roleAllowed, element }: PrivateRouteProps) => {
  const userRole = localStorage.getItem("user_role");
  const roles = Array.isArray(roleAllowed) ? roleAllowed : [roleAllowed];

  if (!userRole) return <Navigate to="/login" replace />;
  if (!roles.includes(userRole)) return <Navigate to="/login" replace />;

  return element;
};

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },

  // ---------- ADMIN ROUTES ----------
  {
    path: "/admin",
    element: (
      <PrivateRoute roleAllowed="Admin" element={<AppLayout role="Admin" />} />
    ),
    children: [
      { path: "dashboard", element: <Index /> },
      { path: "centres", element: <AdminCentres /> },
      { path: "courses", element: <AdminCourses /> },
      { path: "students", element: <AdminStudents /> },
      { path: "examinations", element: <AdminExaminations /> },
      { path: "notifications", element: <AdminNotifications /> },
      { path: "reports", element: <AdminReports /> },
      { path: "", element: <Navigate to="dashboard" replace /> },
    ],
  },

  // ---------- CENTRE ROUTES ----------
  {
    path: "/centre",
    element: (
      <PrivateRoute
        roleAllowed="Centre"
        element={<AppLayout role="Centre" />}
      />
    ),
    children: [
      { path: "dashboard", element: <Index /> },
      { path: "centres", element: <CentreCentres /> },
      { path: "courses", element: <CentreCourses /> },
      { path: "students", element: <CentreStudents /> },
      { path: "examinations", element: <CentreExaminations /> },
      { path: "notification", element: <CentreNotifications /> },
      { path: "", element: <Navigate to="dashboard" replace /> },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
];
