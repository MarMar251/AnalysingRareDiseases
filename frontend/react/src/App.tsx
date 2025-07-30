import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";

import { AuthProvider } from "./contexts/AuthContext";
import { RequireRole } from "./components/auth/RequireRole";
import { GuestOnly } from "./routes/GuestOnly";
import { UserRole } from "./entities";

import IndexRedirect from "./pages/index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

const AdminArea = React.lazy(() => import("./routes/admin"));
const DoctorArea = React.lazy(() => import("./routes/doctor"));
const NurseArea = React.lazy(() => import("./routes/nurse"));

const App: React.FC = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="p-8">Loading …</div>}>
          <Routes>
            <Route path="/" element={<IndexRedirect />} />

            <Route
              path="/login"
              element={
                <GuestOnly>
                  <Login />
                </GuestOnly>
              }
            />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route
              path="/admin/*"
              element={
                <RequireRole allow={[UserRole.ADMIN]}>
                  <AdminArea />
                </RequireRole>
              }
            />
            <Route
              path="/doctor/*"
              element={
                <RequireRole allow={[UserRole.DOCTOR]}>
                  <DoctorArea />
                </RequireRole>
              }
            />
            <Route
              path="/nurse/*"
              element={
                <RequireRole allow={[UserRole.NURSE]}>
                  <NurseArea />
                </RequireRole>
              }
            />

            <Route
              path="/unauthorized"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">
                      Access Denied
                    </h1>
                    <p className="text-gray-600 mb-4">
                      You don&apos;t have permission to access this resource.
                    </p>
                    <a href="/dashboard" className="text-blue-600 hover:underline">
                      Return to Dashboard
                    </a>
                  </div>
                </div>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  </TooltipProvider>
);

export default App;
