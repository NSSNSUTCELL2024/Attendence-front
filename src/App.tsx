
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateEvent from "./pages/CreateEvent";
import ManageAttendance from "./pages/ManageAttendance";
import MarkAttendance from "./pages/MarkAttendance";
import MarkDepartmentWork from "./pages/MarkDepartmentWork";
import ViewAttendance from "./pages/ViewAttendance";
import StudentReport from "./pages/StudentReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/manage-attendance" element={<ManageAttendance />} />
          <Route path="/mark-attendance/:eventId" element={<MarkAttendance />} />
          <Route path="/mark-department-work" element={<MarkDepartmentWork />} />
          <Route path="/view-attendance" element={<ViewAttendance />} />
          <Route path="/student-report/:studentId" element={<StudentReport />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
