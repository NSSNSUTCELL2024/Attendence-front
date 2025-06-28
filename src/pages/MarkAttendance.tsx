import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Users, Check } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface Student {
  _id: string;
  studentId: string;
  name: string;
  branch: string;
}

interface Event {
  _id: string;
  name: string;
  location: string;
  date: string;
  workingHours: number;
}

const MarkAttendance = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { toast } = useToast();

  const [event, setEvent] = useState<Event | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({});
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [completedBranches, setCompletedBranches] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const branches = [
    "CSAI", "CSE", "CSDS", "MAC", "IT", "ITNS", "ECE", "EVDT", "EE", "ICE", "ME", "BT",
    "BBA", "BBA-IEV", "B-Design", "MBA", "Certificate Course 2025", "Certificate Course 2024"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, studentRes, attendanceRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/getoneevent/${eventId}`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/createuser`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/attendance?eventId=${eventId}`, { withCredentials: true })
        ]);

        setEvent(eventRes.data);
        setStudents(studentRes.data);

        const attendanceMap: { [key: string]: boolean } = {};
        const branchesSet = new Set<string>();

        studentRes.data.forEach((s: Student) => {
          attendanceMap[s._id] = false;
        });

        attendanceRes.data.forEach((record: any) => {
          attendanceMap[record.studentId] = true;
          const student = studentRes.data.find((s: Student) => s._id === record.studentId);
          if (student) branchesSet.add(student.branch);
        });

        setAttendance(attendanceMap);
        setCompletedBranches(Array.from(branchesSet));
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    };

    fetchData();
  }, [eventId]);

  const filteredStudents = selectedBranch
    ? students.filter((student) =>
        student.branch === selectedBranch &&
        (student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         student.studentId.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    setAttendance((prev) => ({ ...prev, [studentId]: isPresent }));
  };

  const getTotalSelectedStudents = () => {
    return Object.values(attendance).filter(Boolean).length;
  };

  const getSelectedStudentsInBranch = (branch: string) => {
    const branchStudents = students.filter((student) => student.branch === branch);
    return branchStudents.filter((student) => attendance[student._id]).length;
  };

  const handleSaveAllAttendance = async () => {
    const presentStudents = students.filter((student) => attendance[student._id]);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/markattendance`,
        {
          eventId,
          records: presentStudents.map((student) => ({
            studentId: student._id,
            eventId,
            date: new Date().toISOString(),
          })),
        },
        {
          withCredentials: true,
        }
      );

      toast({
        title: "Attendance Saved",
        description: `Marked ${presentStudents.length} students as present for ${event?.name}`,
      });

      navigate("/manage-attendance");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save attendance",
        variant: "destructive",
      });
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/manage-attendance")}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mark Attendance</h1>
          <p className="text-gray-600">
            Event: {event.name} - {new Date(event.date).toLocaleDateString()}
          </p>
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-800 font-medium">
              Total Selected Students: {getTotalSelectedStudents()}
            </p>
          </div>
        </div>

        {/* Branch Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Select Branch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
              {branches.map((branch) => {
                const selectedInBranch = getSelectedStudentsInBranch(branch);
                const totalInBranch = students.filter((student) => student.branch === branch).length;

                return (
                  <Button
                    key={branch}
                    variant={selectedBranch === branch ? "default" : "outline"}
                    onClick={() => setSelectedBranch(branch)}
                    className="text-left justify-start relative"
                  >
                    <div className="flex flex-col items-start w-full">
                      <span className="truncate">{branch}</span>
                      {selectedInBranch > 0 && (
                        <span className="text-xs text-green-600 font-medium">
                          {selectedInBranch}/{totalInBranch} selected
                        </span>
                      )}
                    </div>
                    {selectedInBranch > 0 && (
                      <Check className="w-4 h-4 text-green-600 ml-auto flex-shrink-0" />
                    )}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Student List */}
        {selectedBranch ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                Students - {selectedBranch} ({getSelectedStudentsInBranch(selectedBranch)}/{filteredStudents.length} selected)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="text"
                placeholder="Search by name or student ID"
                className="w-full mb-4 p-2 border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div
                    key={student._id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">ID: {student.studentId}</p>
                    </div>
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        checked={attendance[student._id] || false}
                        onCheckedChange={(checked) =>
                          handleAttendanceChange(student._id, checked as boolean)
                        }
                      />
                      <span className="text-sm font-medium">Present</span>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Please select a branch to view students
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleSaveAllAttendance}
            className="bg-green-600 hover:bg-green-700 px-8 py-2"
            disabled={getTotalSelectedStudents() === 0}
          >
            Save All Attendance ({getTotalSelectedStudents()} students)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
