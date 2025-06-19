import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  BarChart3,
  LogOut,
  Briefcase,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workingHoursVisible, setWorkingHoursVisible] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/verifyadminToken`,
          { withCredentials: true }
        );
        if (!res.data.success) {
          navigate("/admin-login");
        }
      } catch (err) {
        navigate("/admin-login");
      }
    };

    const fetchVisibility = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/student/working-hours`
        );
        setWorkingHoursVisible(res.data.visible);
      } catch (err) {
        console.error("Failed to fetch working hours visibility");
      }
    };

    verifyToken();
    fetchVisibility();
  }, [navigate]);

  const handleLogout = async () => {
    await axios.get(`${import.meta.env.VITE_BACKEND_URL}/logoutadmin`, {
      withCredentials: true,
    });
    navigate("/");
  };

  const toggleWorkingHoursVisibility = async () => {
    const newVisibility = !workingHoursVisible;
    setWorkingHoursVisible(newVisibility);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/setting`,
        { visible: newVisibility },{withCredentials:true}
      );
      toast({
        title: "Working Hours Visibility Updated",
        description: `Working hours are now ${
          newVisibility ? "visible" : "hidden"
        } to users`,
      });
    } catch (err) {
      toast({
        title: "Update Failed",
        description: "Could not update visibility",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Manage events and track attendance
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={toggleWorkingHoursVisibility}
              variant="outline"
              className={`${
                workingHoursVisible
                  ? "bg-green-50 border-green-300 text-green-700"
                  : "bg-red-50 border-red-300 text-red-700"
              }`}
            >
              {workingHoursVisible ? (
                <Eye className="w-4 h-4 mr-2" />
              ) : (
                <EyeOff className="w-4 h-4 mr-2" />
              )}
              Working Hours {workingHoursVisible ? "Visible" : "Hidden"}
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Admin Options */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Create Event */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Create Event</CardTitle>
              <CardDescription className="text-gray-600">
                Add new events with details like name, location, date, and
                working hours
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                onClick={() => navigate("/create-event")}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium"
              >
                Create New Event
              </Button>
            </CardContent>
          </Card>

          {/* Manage Attendance */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">
                Manage Attendance
              </CardTitle>
              <CardDescription className="text-gray-600">
                Mark student attendance for events across different engineering
                branches
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                onClick={() => navigate("/manage-attendance")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
              >
                Manage Attendance
              </Button>
            </CardContent>
          </Card>

          {/* Mark Department Work */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">
                Mark Department Work
              </CardTitle>
              <CardDescription className="text-gray-600">
                Record department-specific work done by different teams
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                onClick={() => navigate("/mark-department-work")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-medium"
              >
                Mark Work
              </Button>
            </CardContent>
          </Card>

          {/* View Attendance */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">View Attendance</CardTitle>
              <CardDescription className="text-gray-600">
                View detailed attendance records and generate student reports
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                onClick={() => navigate("/view-attendance")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-medium"
              >
                View Records
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
