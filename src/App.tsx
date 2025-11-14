import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentForm from "./pages/StudentForm";
import StudentDetail from "./pages/StudentDetail";
import Rooms from "./pages/Rooms";
import RoomForm from "./pages/RoomForm";
import RoomDetail from "./pages/RoomDetail";
import Complaints from "./pages/Complaints";
import ComplaintForm from "./pages/ComplaintForm";
import Leaves from "./pages/Leaves";
import LeaveForm from "./pages/LeaveForm";
import Notifications from "./pages/Notifications";
import Hostels from "./pages/Hostels";
import HostelForm from "./pages/HostelForm";
import Staff from "./pages/Staff";
import StaffForm from "./pages/StaffForm";
import MyRoom from "./pages/MyRoom";
import MyComplaints from "./pages/MyComplaints";
import MyLeaves from "./pages/MyLeaves";
import MyFees from "./pages/MyFees";
import Fees from "./pages/Fees";
import FeeForm from "./pages/FeeForm";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            
            {/* Hostel Management - Admin Only */}
            <Route
              path="/hostels"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <Hostels />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hostels/new"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <HostelForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hostels/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <HostelForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hostel/:hostelId/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin', 'warden']}>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute allowedRoles={['admin', 'warden']}>
                  <DashboardLayout>
                    <Students />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/students/new"
              element={
                <ProtectedRoute allowedRoles={['admin', 'warden']}>
                  <DashboardLayout>
                    <StudentForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/students/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'warden']}>
                  <DashboardLayout>
                    <StudentDetail />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms"
              element={
                <ProtectedRoute allowedRoles={['admin', 'warden']}>
                  <DashboardLayout>
                    <Rooms />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <Staff />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/new"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <StaffForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout>
                    <StaffForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/new"
              element={
                <ProtectedRoute allowedRoles={['admin', 'warden']}>
                  <DashboardLayout>
                    <RoomForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['admin', 'warden']}>
                  <DashboardLayout>
                    <RoomForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'warden']}>
                  <DashboardLayout>
                    <RoomDetail />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/complaints"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Complaints />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/complaints/new"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ComplaintForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaves"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Leaves />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaves/new"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <LeaveForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowedRoles={['admin', 'warden']}>
                  <DashboardLayout>
                    <Notifications />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Student personal pages */}
            <Route
              path="/my-room"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DashboardLayout>
                    <MyRoom />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-complaints"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DashboardLayout>
                    <MyComplaints />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-leaves"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DashboardLayout>
                    <MyLeaves />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-fees"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <DashboardLayout>
                    <MyFees />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            {/* Admin / Warden fees management */}
            <Route
              path="/fees"
              element={
                <ProtectedRoute allowedRoles={['admin', 'warden']}>
                  <DashboardLayout>
                    <Fees />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/fees/new"
              element={
                <ProtectedRoute allowedRoles={['admin', 'warden']}>
                  <DashboardLayout>
                    <FeeForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/fees/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['admin', 'warden']}>
                  <DashboardLayout>
                    <FeeForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Profile />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
