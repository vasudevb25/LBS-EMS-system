// routes.tsx
import { Navigate, RouteObject } from "react-router-dom";
import Login from "../components/Dashboard/Login";
import NotFound from "../pages/NotFound";

// Layout
import { AppLayout } from "../components/Layout/AppLayout";

// Pages
import CentresPage from "../pages/Centres";
import CoursesPage from "../pages/Courses";
import StudentsPage from "../pages/Students";
import ExaminationsPage from "../pages/Examinations";
import NotificationsPageAdmin from "../pages/Notifications_admin";
import NotificationsPageCentre from "../pages/Notifications_centre";
import ReportsPage from "../pages/Reports";
import Index from "../pages/Index";
import StudentProfile from "../pages/StudentProfile";
import CentreProfile from "../pages/CentreProfile";
import { IndianRupee } from "lucide-react";

/* ---------- AUTH GUARD ---------- */
const PrivateRoute = ({
  element,
  adminOnly = false,
}: {
  element: JSX.Element;
  adminOnly?: boolean;
}) => {
  const access = localStorage.getItem("access");
  const isAdmin = localStorage.getItem("is_admin") === "true";

  if (!access) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return element;
};

/* ---------- ROUTES ---------- */
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/app",
    element: <PrivateRoute element={<AppLayout />} />,
    children: [
      { path: "dashboard", element: <Index /> },

      { path: "centres", element: <CentresPage /> },
      { path: "courses", element: <CoursesPage /> },
      { path: "students", element: <StudentsPage /> },
      { path: "examinations", element: <ExaminationsPage /> },
      { path: "students/:id", element: <StudentProfile /> },

      {
        path: "notifications",
        element: <NotificationsRouter />,
      },

      {
        path: "reports",
        element: <PrivateRoute adminOnly element={<ReportsPage />} />,
      },

      { path: "", element: <Navigate to="dashboard" replace /> },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
];

/* ---------- NOTIFICATIONS SWITCH ---------- */
function NotificationsRouter() {
  const access = localStorage.getItem("access");
  const isAdmin = localStorage.getItem("is_admin") === "true";

  if (!access) {
    return <Navigate to="/login" replace />;
  }

  return isAdmin ? <NotificationsPageAdmin /> : <NotificationsPageCentre />;
}
