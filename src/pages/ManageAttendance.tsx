import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface Event {
  _id: string;
  name: string;
  location: string;
  date: string;
  workingHours: number;
}

const ManageAttendance = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/getevents`,
          { withCredentials: true }
        );
        setEvents(res.data?.events || []);
      } catch (error) {
        toast({
          title: "Failed to load events",
          description: "Please check your connection or try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  const handleEventClick = (eventId: string) => {
    navigate(`/mark-attendance/${eventId}`);
  };

  const handleDeleteEvent = async (eventId: string, eventName: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/admin/deleteevent/${eventId}`,{withCredentials:true}
      );
      setEvents((prev) => prev.filter((event) => event._id !== eventId));
      toast({
        title: "Event Deleted",
        description: `${eventName} has been removed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Failed to delete event",
        description: "Please try again later.",
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
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Attendance
          </h1>
          <p className="text-gray-600">
            Select an event to mark student attendance
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading events...</p>
        ) : events.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Events Created
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first event to start managing attendance
              </p>
              <Button
                onClick={() => navigate("/create-event")}
                className="bg-green-600 hover:bg-green-700"
              >
                Create Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card
                key={event._id}
                className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-gray-900">
                      {event.name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(event._id, event.name);
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Location:</strong> {event.location}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(event.date).toLocaleDateString('en-GB')}
                    </p>
                    <p>
                      <strong>Working Hours:</strong> {event.workingHours} hrs
                    </p>
                  </div>
                  <Button
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleEventClick(event._id)}
                  >
                    Mark Attendance
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAttendance;
