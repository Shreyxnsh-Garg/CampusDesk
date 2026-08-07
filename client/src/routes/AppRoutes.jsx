import { Routes, Route } from "react-router-dom";

import Login from "../pages/Auth/Login";
import VerifyOtp from "../pages/Auth/VerifyOtp";
import Resources from "../pages/Resources/Resources";
import ResourceDetails from "../pages/Resources/ResourceDetails";
import MyBookings from "../pages/Booking/MyBookings";
import Dashboard from "../pages/Student/Dashboard";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import ManageResources from "../pages/Admin/ManageResources";
import AddResource from "../pages/Admin/AddResource";
import EditResource from "../pages/Admin/EditResource";
import BookResource from "../pages/Student/BookResource";
import AdminBookings from "../pages/Admin/AdminBookings";
import MainLayout from "../layouts/MainLayout";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/verify" element={<VerifyOtp />} />
      
      <Route element={<MainLayout />}>
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources/:id"
          element={
            <ProtectedRoute>
              <ResourceDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/resources"
          element={
            <ProtectedRoute>
              <ManageResources />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-resource"
          element={
            <ProtectedRoute>
              <AddResource />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/edit-resource/:id"
          element={
            <ProtectedRoute>
              <EditResource />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-resource/:id"
          element={
            <ProtectedRoute>
              <BookResource />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute>
              <AdminBookings />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;