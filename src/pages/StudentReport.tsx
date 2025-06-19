'use client';

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Briefcase,
  Trash2,
} from "lucide-react";

interface Event {
  _id: string;
  name: string;
  location: string;
  date: string;
  workingHours: number;
}

interface DepartmentWork {
  _id: string;
  date: string;
  department: string;
  workDescription: string;
  workingHours: number;
  studentId: string;
}

interface Student {
  _id: string;
  studentId: string;
  name: string;
  branch: string;
}

const StudentReport = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [student, setStudent] = useState<Student | null>(null);
  const [attendedEvents, setAttendedEvents] = useState<Event[]>([]);
  const [departmentWork, setDepartmentWork] = useState<DepartmentWork[]>([]);
  const [totalWorkingHours, setTotalWorkingHours] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (studentId) fetchStudentReport();
  }, [studentId]);

  const fetchStudentReport = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/student/${studentId}`,
        { withCredentials: true }
      );
      const { student, events, departmentWork } = res.data;

      setStudent(student);
      setAttendedEvents(events);
      setDepartmentWork(departmentWork);

      const eventHours = events.reduce(
        (sum: number, e: Event) => sum + e.workingHours,
        0
      );
      const deptHours = departmentWork.reduce(
        (sum: number, d: DepartmentWork) => sum + d.workingHours,
        0
      );

      setTotalWorkingHours(eventHours + deptHours);
    } catch (error) {
      console.error("Failed to fetch student report:", error);
      toast({ title: "Error", description: "Could not fetch student data." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDepartmentWork = async (workId: string, workDescription: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/admin/deletedepartwork/${workId}`,
        { withCredentials: true }
      );
      toast({ title: "Deleted", description: `"${workDescription}" has been removed.` });
      fetchStudentReport(); // reload updated data
    } catch (error) {
      console.error("Error deleting department work:", error);
      toast({ title: "Error", description: "Failed to delete department work." });
    }
  };

  // ⏳ Show loading spinner
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Loading student data...</p>
        </div>
      </div>
    );
  }

  // ❌ Show "not found" if student still null after loading
  if (!student) {
    return <div className="p-6 text-center text-gray-700">Student not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/view-attendance")}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Students
        </Button>

        {/* Student Info */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">Attendance Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Information</h3>
                <div className="space-y-1 text-gray-600">
                  <p><strong>Name:</strong> {student.name}</p>
                  <p><strong>Student ID:</strong> {student.studentId}</p>
                  <p><strong>Branch:</strong> {student.branch}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity Summary</h3>
                <div className="space-y-1 text-gray-600">
                  <p><strong>Events Attended:</strong> {attendedEvents.length}</p>
                  <p><strong>Department Work:</strong> {departmentWork.length}</p>
                  <p><strong>Total Working Hours:</strong> <span className="text-green-600 font-bold">{totalWorkingHours} hrs</span></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Attended */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Events Attended
            </CardTitle>
          </CardHeader>
          <CardContent>
            {attendedEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No events attended yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Location</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendedEvents.map(event => (
                      <tr key={event._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-700">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">{event.name}</td>
                        <td className="py-3 px-4 text-gray-700">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {event.location}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {event.workingHours} hrs
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Department Work */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Department Work
            </CardTitle>
          </CardHeader>
          <CardContent>
            {departmentWork.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No department work recorded yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Department</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Work</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Hours</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentWork.map(work => (
                      <tr key={work._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-700">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(work.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">{work.department.toUpperCase()}</td>
                        <td className="py-3 px-4 text-gray-700">{work.workDescription}</td>
                        <td className="py-3 px-4 text-gray-700">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {work.workingHours} hrs
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteDepartmentWork(work._id, work.workDescription)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300 bg-gray-50">
                      <td colSpan={4} className="py-3 px-4 font-semibold text-gray-900">
                        Total Working Hours:
                      </td>
                      <td className="py-3 px-4 font-bold text-lg text-green-600">
                        {totalWorkingHours} hrs
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentReport;
