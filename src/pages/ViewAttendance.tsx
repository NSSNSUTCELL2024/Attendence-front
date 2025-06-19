"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Student {
  _id: string;
  studentId: string;
  name: string;
  branch: string;
}

const ViewAttendance = () => {
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const branches = [
    "CSAI", "CSE", "CSDS", "MAC", "IT", "ITNS", "ECE", "EVDT", "EE", "ICE", "ME", "BT",
    "BBA", "BBA-IEV", "B-Design", "MBA", "Certificate Course 2025", "Certificate Course 2024"
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/createuser`,
          { withCredentials: true }
        );
        setAllStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = selectedBranch
    ? allStudents.filter((student) => student.branch === selectedBranch)
    : [];

  const handleStudentClick = (studentId: string) => {
    navigate(`/student-report/${studentId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin-dashboard")}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            View Attendance Records
          </h1>
          <p className="text-gray-600">
            Select a branch to view students and their detailed attendance
            reports
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Select Branch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
              {branches.map((branch) => (
                <Button
                  key={branch}
                  variant={selectedBranch === branch ? "default" : "outline"}
                  onClick={() => setSelectedBranch(branch)}
                  className="text-left justify-start"
                >
                  {branch}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card>
            <CardContent className="text-center py-12 text-gray-600 text-lg">
              Loading students...
            </CardContent>
          </Card>
        ) : selectedBranch ? (
          <Card>
            <CardHeader>
              <CardTitle>Students in {selectedBranch}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents.map((student) => (
                  <Card
                    key={student._id}
                    className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {student.studentId}
                          </p>
                        </div>
                      </div>
                      <Button
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => handleStudentClick(student._id)}
                      >
                        View Report
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Please select a branch to view students
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ViewAttendance;
