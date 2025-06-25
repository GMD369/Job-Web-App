import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Navbar from "./components/navbar.jsx";
import SeekerDashboard from "./pages/seeker/seekerDashboard.jsx";
import EmployerDashboard from "./pages/employer/employerDashboard.jsx";
import AdminDashboard from "./pages/admin/adminDashboard.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";
import PostJob from "./pages/employer/postJob.jsx";
import LandingPage from "./components/landingPage.jsx";
import Home from "./pages/employer/employer.jsx";
import EditJob from "./pages/employer/editJob.jsx";
import AllJobs from "./pages/seeker/allJobs.jsx";
import Profile from "./pages/profileSeeker.jsx";
import SavedJobs from "./pages/seeker/savedJob.jsx";
import Footer from "./components/Footer.jsx";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      
      <Routes>
        {/* ✅ PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ SEEKER ROUTES */}
        <Route
          path="/seeker/dashboard"
          element={
            <ProtectedRoute allowedRoles={["seeker"]}>
              <SeekerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seeker"
          element={
            <ProtectedRoute allowedRoles={["seeker"]}>
              <AllJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["seeker"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute allowedRoles={["seeker"]}>
              <SavedJobs />
            </ProtectedRoute>
          }
        />

        {/* ✅ EMPLOYER ROUTES */}
        <Route
          path="/employer"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/post-job"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/edit-job/:id"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <EditJob />
            </ProtectedRoute>
          }
        />

        {/* ✅ ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
       
      <Footer/>
    </Router>
  );
}

export default App;
