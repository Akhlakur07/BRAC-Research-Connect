import { createBrowserRouter } from "react-router";
import Home from "../pages/Home/Home";
import RootLayout from "../layouts/RootLayout";
import Register from "../pages/Authentication/Register";
import Login from "../pages/Authentication/Login";
import ThesisProposalForm from "../pages/Thesis/ThesisProposalForm";
import AssignSupervisor from "../pages/Admin/AssignSupervisor";
import AdminRoute from "../Private/AdminRoute";
import Announcement from "../pages/Announcement/Announcement";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import StudentDashboard from "../pages/Dashboard/StudentDashboard";
import SupervisorDashboard from "../pages/Dashboard/SupervisorDashboard";
import ViewAnnouncement from "../pages/Announcement/ViewAnnouncements";
import ManageUsers from "../pages/Admin/ManageUsers";
import CreateGroup from "../pages/StudentGroup/CreateGroup";
import FindGroup from "../pages/StudentGroup/FindGroup";
import CreateFaqs from "../pages/Admin/CreateFaqs";
import AllFaqs from "../pages/FAQs/AllFaqs";
import ViewProposals from "../pages/Thesis/ViewProposals";
import SupervisorGroups from "../pages/SupGroups/SupervisorGroups";
import ViewRecievedProposals from "../pages/Thesis/ViewRecievedProposals";
import Profile from "../pages/Student/Profile";
import SupervisorProfile from "../pages/Supervisor/SupervisorProfile";
import SupervisorsList from "../pages/Supervisor/SupervisorsList";
import SynopsisList from "../pages/Synopsis/SynopsisList";
import Searchpaper from "../pages/Student/Searchpaper";
import Savedpapers from "../pages/Student/Savedpapers";
import Recommended from "../pages/Student/Recommended";
import ScheduleMeetings from "../pages/Meeting/ScheduleMeetings";
import AllThesis from "../pages/Thesis/AllThesis";
import Semester from "../pages/Semester/Semester";
import ThesisProcess from "../pages/Thesis/ThesisProcess";
import Error from "../pages/Error/Error";
import Search from "../pages/Home/Search";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const safeLoader = (path) => async () => {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    loader: safeLoader("/users/"),
    errorElement: <Error></Error>,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/search-feature",
        Component: Search,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/thesis-proposal",
        Component: ThesisProposalForm,
        loader: safeLoader("/users/"),
      },
      {
        path: "view-announcement",
        Component: ViewAnnouncement,
      },
      {
        path: "/profile",
        Component: Profile,
        loader: safeLoader("/users/"),
      },
      {
        path: "/supervisor-profile",
        Component: SupervisorProfile,
        loader: safeLoader("/users/"),
      },
      {
        path: "/supervisors",
        Component: SupervisorsList,
      },
      {
        path: "/synopsis",
        Component: SynopsisList,
      },
      {
        path: "/manage-users",
        element: (
          <AdminRoute>
            <ManageUsers></ManageUsers>
          </AdminRoute>
        ),
      },
      {
        path: "/assign-supervisor",
        element: (
          <AdminRoute>
            <AssignSupervisor></AssignSupervisor>
          </AdminRoute>
        ),
      },
      {
        path: "/announcements",
        Component: Announcement,
        loader: safeLoader("/users/"),
      },
      {
        path: "/admin-dashboard",
        element: (
          <AdminRoute>
            <AdminDashboard></AdminDashboard>
          </AdminRoute>
        ),
      },
      {
        path: "/supervisor-dashboard",
        element: <SupervisorDashboard></SupervisorDashboard>,
        loader: safeLoader("/users/"),
      },
      {
        path: "/student-dashboard",
        Component: StudentDashboard,
        loader: safeLoader("/users/"),
      },
      {
        path: "/find-group/:id",
        Component: FindGroup,
      },
      {
        path: "/create-group/:id",
        Component: CreateGroup,
      },
      {
        path: "/manage-faqs",
        element: (
          <AdminRoute>
            <CreateFaqs></CreateFaqs>
          </AdminRoute>
        ),
      },
      {
        path: "/semester",
        loader: safeLoader("/users/"),
        element: (
          <AdminRoute>
            <Semester></Semester>
          </AdminRoute>
        ),
      },
      {
        path: "/all-faqs",
        element: <AllFaqs></AllFaqs>,
      },
      {
        path: "/view-proposals",
        Component: ViewProposals,
        loader: safeLoader("/users/"),
      },
      {
        path: "/supervisor-groups",
        Component: SupervisorGroups,
        loader: safeLoader("/users/"),
      },
      {
        path: "/view-recieved-proposals",
        Component: ViewRecievedProposals,
        loader: safeLoader("/users/"),
      },
      {
        path: "/search",
        Component: Searchpaper,
        loader: safeLoader("/users/"),
      },
      {
        path: "/saved-papers",
        Component: Savedpapers,
        loader: safeLoader("/users/"),
      },
      {
        path: "/recommended",
        Component: Recommended,
        loader: safeLoader("/users/"),
      },
      {
        path: "/schedule-meetings",
        Component: ScheduleMeetings,
        loader: safeLoader("/users/"),
      },
      {
        path: "/all-thesis",
        Component: AllThesis,
        loader: safeLoader("/theses"),
      },
      {
        path: "/thesis-process",
        Component: ThesisProcess,
      },
    ],
  },
]);

export default router;
