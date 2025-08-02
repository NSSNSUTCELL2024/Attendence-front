import { useState, useEffect } from "react";
import axios from "axios";
import {
  ArrowLeft,
  User,
  Calendar,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [departmentWork, setDepartmentWork] = useState<any[]>([]);
  const [workingHoursVisible, setWorkingHoursVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const verifyRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/verifystudentToken`,
          { withCredentials: true }
        );

        if (!verifyRes.data.success) return navigate("/user-login");

        const student = verifyRes.data.student;
        setCurrentUser(student);

        const apiRes = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/loggedinuserrecord`,
          { id: student.id }
        );

        setAttendanceData(apiRes.data.events || []);
        setDepartmentWork(apiRes.data.departmentWork || []);

        const visibilityRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/checkvisibility`
        );
        setWorkingHoursVisible(visibilityRes.data.visible);
      } catch (err) {
        navigate("/user-login");
      }
    };

    fetchData();
  }, [navigate]);

  const getTotalWorkingHours = () => {
    if (!workingHoursVisible) return null;
    const eventHours = attendanceData.reduce((sum, rec) => sum + (rec.workingHours || 0), 0);
    const deptHours = departmentWork.reduce((sum, rec) => sum + (rec.workingHours || 0), 0);
    return eventHours + deptHours;
  };

  const handleLogout = async () => {
    await axios.get(`${import.meta.env.VITE_BACKEND_URL}/logoutstudent`, {
      withCredentials: true,
    });
    navigate("/");
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const totalWorkingHours = getTotalWorkingHours();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {currentUser.name}!
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              Student ID: {currentUser.studentId} | Branch: {currentUser.branch}
            </p>
            {workingHoursVisible && totalWorkingHours !== null && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Total Hours: {totalWorkingHours}
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Attendance */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Your Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              {attendanceData.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No events marked for you yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {attendanceData.map((record: any) => (
                    <div
                      key={record._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{record.name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(record.date).toLocaleDateString('en-GB')}
                        </p>
                        {workingHoursVisible && (
                          <p className="text-xs text-blue-600 font-medium">
                            {record.workingHours || 0} hours
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Present</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Department Work */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Department Work History</CardTitle>
            </CardHeader>
            <CardContent>
              {departmentWork.length === 0 ? (
                <div className="text-center py-8">
                  <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No department work assigned yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {departmentWork.map((work: any) => (
                    <div key={work._id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">{work.workDescription}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(work.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-purple-600 mt-1">
                        Department: {work.department?.toUpperCase('en-GB')}
                      </p>
                      {workingHoursVisible && (
                        <p className="text-xs text-blue-600 font-medium">
                          {work.workingHours || 0} hours
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
