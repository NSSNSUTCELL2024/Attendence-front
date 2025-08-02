import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, Users, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const MarkDepartmentWork = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedBranch, setSelectedBranch] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [workingHours, setWorkingHours] = useState(0);
  const [department, setDepartment] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [existingWork, setExistingWork] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);

  const branches = [
    "CSAI", "CSE", "CSDS", "MAC", "IT", "ITNS", "ECE", "EVDT", "EE", "ICE", "ME", "BT",
    "BBA", "BBA-IEV", "B-Design", "MBA", "Certificate Course 2025", "Certificate Course 2024"
  ];

  const departments = [
    "Tech", "SM", "Design", "Content", "PR", "Logi", "Miscellaneous",
  ];

  const filteredStudents = selectedBranch
    ? allStudents.filter((s) => s.branch === selectedBranch)
    : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, workRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/createuser`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/departmentwork`, { withCredentials: true }),
        ]);
        setAllStudents(studentsRes.data);
        setExistingWork(workRes.data);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load students or work",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, []);

  const handleStudentToggle = (_id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(_id) ? prev.filter((sid) => sid !== _id) : [...prev, _id]
    );
  };

  const handleSelectAll = () => {
    setSelectedStudents(
      selectedStudents.length === filteredStudents.length
        ? []
        : filteredStudents.map((s) => s._id)
    );
  };

  const handleDeleteWork = async (_id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/deletedepartwork/${_id}`, { withCredentials: true });
      setExistingWork((prev) => prev.filter((work) => work._id !== _id));
      toast({
        title: "Department Work Deleted",
        description: "The work record has been removed",
      });
    } catch {
      toast({
        title: "Failed to Delete",
        description: "Could not delete work",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (
      !workDescription ||
      !department ||
      workingHours === 0 ||
      selectedStudents.length === 0
    ) {
      toast({
        title: "Missing Information",
        description: "Fill all fields and select students",
        variant: "destructive",
      });
      return;
    }

    const currentDate = new Date().toISOString();
    const newWorkEntries = selectedStudents.map((_id) => {
      const student = allStudents.find((s) => s._id === _id);
      return {
        date: currentDate,
        department,
        workDescription,
        workingHours,
        studentId: student?._id || "",
        studentName: student?.name || "",
      };
    });

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/departmentwork`, newWorkEntries, { withCredentials: true });
      const updatedWorks = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/departmentwork`, { withCredentials: true });
      setExistingWork(updatedWorks.data);
      toast({
        title: "Work Recorded",
        description: `Recorded for ${selectedStudents.length} students`,
      });
      setWorkDescription("");
      setWorkingHours(0);
      setDepartment("");
      setSelectedStudents([]);
    } catch {
      toast({
        title: "Submit Failed",
        description: "Could not save work",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin-dashboard")}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mark Department Work
        </h1>
        <p className="text-gray-600 mb-8">
          Record department work for students
        </p>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Work Details */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Work Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Work Description</label>
                <Textarea
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  placeholder="Enter work..."
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Working Hours</label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={workingHours || ""}
                  onChange={(e) =>
                    setWorkingHours(parseFloat(e.target.value) || 0)
                  }
                  placeholder="Enter hours"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Student Selection */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Select Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Branch</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              {selectedBranch && (
                <div>
                  <div className="flex justify-between mb-3 text-sm text-gray-600">
                    <span>{selectedStudents.length} of {filteredStudents.length} selected</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                    >
                      {selectedStudents.length === filteredStudents.length ? "Deselect All" : "Select All"}
                    </Button>
                  </div>

                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {filteredStudents.map((student) => (
                      <div
                        key={student._id}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
                          selectedStudents.includes(student._id)
                            ? "bg-blue-50 border-blue-300"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => handleStudentToggle(student._id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student._id)}
                          onChange={() => handleStudentToggle(student._id)}
                          className="w-4 h-4"
                        />
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.studentId}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSubmit}
            className="px-8 bg-green-600 hover:bg-green-700"
            disabled={
              !workDescription ||
              !department ||
              workingHours === 0 ||
              selectedStudents.length === 0
            }
          >
            Record Work
          </Button>
        </div>

        {/* Existing Work Records */}
        {existingWork.length > 0 && (
          <Card className="mt-8 shadow-lg border-0">
            <CardHeader>
              <CardTitle>Recent Department Work Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {existingWork
                  .slice(-10)
                  .reverse()
                  .map((work) => (
                    <div
                      key={work._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{work.workDescription}</p>
                        <p className="text-sm text-gray-600">
                          {work.studentName} • {work.department} • {work.workingHours} hrs
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(work.date).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteWork(work._id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MarkDepartmentWork;
