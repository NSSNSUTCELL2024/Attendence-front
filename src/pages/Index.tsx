
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            NSS NSUT Attendance Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive attendance management system for Tracking Work.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* User Login Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Student Login</CardTitle>
              <CardDescription className="text-gray-600">
                Access your attendance records and event history
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                onClick={() => navigate('/user-login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium transition-colors duration-200"
              >
                Login as Student
              </Button>
            </CardContent>
          </Card>

          {/* Admin Login Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="w-8 h-8 text-indigo-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Admin Login</CardTitle>
              <CardDescription className="text-gray-600">
                Manage events, track attendance, and generate reports
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                onClick={() => navigate('/admin-login')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-lg font-medium transition-colors duration-200"
              >
                Login as Admin
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500">
            Developed By Tech Department of NSS NSUT CELL.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
