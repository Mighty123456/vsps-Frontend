import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Footer from "./components/user/Footer";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Services from "./pages/Services";
import Amenities from "./pages/Amenities";
import Testimonials from "./pages/Testimonials";
import SubmitReview from "./pages/SubmitReview";
import Resources from "./pages/Resources";
import EventCategories from "./pages/EventCategories";
import Booking from "./pages/Booking";
import LiveStreaming from "./pages/LiveStreaming";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/adminpanel/Dashboard";
import BookingManagement from "./pages/adminpanel/BookingManagement";
import ContentManagement from "./pages/adminpanel/ContentManagement";
import LiveStreams from "./pages/adminpanel/LiveStreams";
import Reports from "./pages/adminpanel/Reports";
import VideoManagement from "./pages/adminpanel/VideoManagement";
import AdminHeader from "./components/admin/AdminHeader";
import AdminSidebar from "./components/admin/AdminSidebar"; 
import Header from "./components/user/Header";
import ProfileSettings from './pages/ProfileSettings';
import RecentBookings from './pages/RecentBookings';
import Users from './pages/adminpanel/Users';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setUserRole(decodedToken.role);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserRole(null);
        setIsAuthenticated(false);
        localStorage.clear();
        window.location.href = '/auth';
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, []);

  const isAdminRoute = location.pathname.startsWith("/admin");

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/auth" />;
    }
    return children;
  };

  // Show loading state while checking authentication
  if (isAdminRoute && userRole === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Admin Layout  */}
      {isAdminRoute ? (
        userRole === "admin" ? (
          <div className="flex">
            <AdminSidebar />
            <div className="flex-grow">
              <AdminHeader />
              <main className="p-6">
                <Routes>
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/content-management" element={<ContentManagement />} />
                  <Route path="/admin/video-management" element={<VideoManagement />} />
                  <Route path="/admin/booking-management" element={<BookingManagement />} />
                  <Route path="/admin/live-streams" element={<LiveStreams />} />
                  <Route path="/admin/reports" element={<Reports />} />
                  <Route path="/admin/users" element={<Users />} />
                  <Route path="/admin/*" element={<Navigate to="/admin/dashboard" />} />
                </Routes>
              </main>
            </div>
          </div>
        ) : (
          <Navigate to="/auth" />
        )
      ) : (
        <>
          {userRole !== "admin" ? (
            <>
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/services/amenities" element={<Amenities />} />
                  <Route path="/testimonials" element={<Testimonials />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/events/categories" element={<EventCategories />} />
                  <Route path="/ForgotPassword" element={<ForgotPassword />} />
                  <Route path="/ResetPassword/:token" element={<ResetPassword />} />
                  
                  {/* Booking route - accessible to all users */}
                  <Route path="/booking" element={<Booking />} />
                  
                  {/* Protected Routes */}
                  <Route path="/live-streaming" element={
                    <ProtectedRoute>
                      <LiveStreaming />
                    </ProtectedRoute>
                  } />
                  <Route path="/reviews/submit-review" element={
                    <ProtectedRoute>
                      <SubmitReview />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile-settings" element={
                    <ProtectedRoute>
                      <ProfileSettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/recently-booked" element={
                    <ProtectedRoute>
                      <RecentBookings />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
              <Footer />
            </>
          ) : (
            <Navigate to="/admin/dashboard" />
          )}
        </>
      )}
    </div>
  );
}

export default App;
