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
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
