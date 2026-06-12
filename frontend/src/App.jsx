import { BriefcaseBusiness, Building2, LayoutDashboard, LogIn, LogOut, UserPlus } from "lucide-react";
import { Link, NavLink, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./state/AuthContext";
import AuthPage from "./pages/AuthPage.jsx";
import CompanyPage from "./pages/CompanyPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import JobDetailPage from "./pages/JobDetailPage.jsx";
import JobsPage from "./pages/JobsPage.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <main className="mx-auto max-w-6xl px-4 py-8">Loading...</main>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const navClass = ({ isActive }) =>
    `focus-ring inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-medium ${
      isActive ? "bg-teal text-white" : "text-ink hover:bg-white"
    }`;

  return (
    <header className="border-b border-line bg-mist">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link className="focus-ring flex items-center gap-2 rounded text-lg font-semibold" to="/">
          <BriefcaseBusiness className="h-6 w-6 text-coral" />
          Dev Job Board
        </Link>
        <nav className="flex flex-wrap items-center gap-1">
          <NavLink className={navClass} to="/">
            <BriefcaseBusiness className="h-4 w-4" />
            Jobs
          </NavLink>
          <NavLink className={navClass} to="/companies">
            <Building2 className="h-4 w-4" />
            Company
          </NavLink>
          {isAuthenticated && (
            <NavLink className={navClass} to="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>
          )}
          {isAuthenticated ? (
            <button className="focus-ring inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-medium hover:bg-white" onClick={logout}>
              <LogOut className="h-4 w-4" />
              {user?.username}
            </button>
          ) : (
            <>
              <NavLink className={navClass} to="/login">
                <LogIn className="h-4 w-4" />
                Login
              </NavLink>
              <NavLink className={navClass} to="/register">
                <UserPlus className="h-4 w-4" />
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/companies" element={<CompanyPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
