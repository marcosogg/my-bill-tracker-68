import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import Login from "@/pages/Login";
import Index from "@/pages/Index";
import AddBill from "@/pages/AddBill";
import EditBill from "@/pages/EditBill";
import AllBills from "@/pages/AllBills";
import BillDetails from "@/pages/BillDetails";
import PaymentHistory from "@/pages/PaymentHistory";
import Reports from "@/pages/Reports";
import BudgetManagement from "@/pages/BudgetManagement";
import CalendarView from "@/pages/CalendarView";
import Settings from "@/pages/Settings";
import { AppSidebar } from "./AppSidebar";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  );
};

const AppRoutes = () => {
  return (
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
        path="/bills/:id/edit"
        element={
          <ProtectedRoute>
            <AppLayout>
              <EditBill />
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
    </Routes>
  );
};

export default AppRoutes;
