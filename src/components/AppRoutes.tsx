import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import AddBill from "@/pages/AddBill";
import AllBills from "@/pages/AllBills";
import BillDetails from "@/pages/BillDetails";
import PaymentHistory from "@/pages/PaymentHistory";
import Settings from "@/pages/Settings";
import Reports from "@/pages/Reports";
import BudgetManagement from "@/pages/BudgetManagement";
import CalendarView from "@/pages/CalendarView";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1">
        <div className="container">
          <SidebarTrigger className="mb-4" />
          {children}
        </div>
      </main>
    </div>
  </SidebarProvider>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Index />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/add-bill"
      element={
        <ProtectedRoute>
          <AppLayout>
            <AddBill />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/bills"
      element={
        <ProtectedRoute>
          <AppLayout>
            <AllBills />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/bills/:id"
      element={
        <ProtectedRoute>
          <AppLayout>
            <BillDetails />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/payment-history"
      element={
        <ProtectedRoute>
          <AppLayout>
            <PaymentHistory />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/settings"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Settings />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/reports"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Reports />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/budget"
      element={
        <ProtectedRoute>
          <AppLayout>
            <BudgetManagement />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/calendar"
      element={
        <ProtectedRoute>
          <AppLayout>
            <CalendarView />
          </AppLayout>
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;