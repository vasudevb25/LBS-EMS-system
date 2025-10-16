import { useEffect, useState } from "react";
import { Button } from "../../components/ui/buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/layout";
import { Input, Textarea, Label } from "../../components/ui/inputs";
import {
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/data";
import { Send, Users, Clock } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  status: string;
  recipients: number;
  channels: string[];
  sentAt: string;
}

interface Centre {
  centre_id: number;
  centre_name: string;
}

const Notifications: React.FC = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipientType, setRecipientType] = useState("all_students");
  const [CentreId, setCentreId] = useState<number | null>(null);
  const [centres, setCentres] = useState<Centre[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<
    Notification[]
  >([]);

  // Fetch all centres on load
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/centres/")
      .then((res) => res.json())
      .then((data) => setCentres(data))
      .catch((err) => console.error(err));
  }, []);

  const sendNotification = async () => {
    try {
      const payload: any = {
        title,
        message,
        recipients_type: recipientType,
      };
      if (recipientType === "centre_specific" && CentreId) {
        payload.course_id = CentreId;
      }

      const res = await fetch("http://127.0.0.1:8000/api/notifications/send/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.status || "Notification sent successfully!");

      // Optionally, refresh notification history
      // fetchRecentNotifications();
    } catch (err) {
      console.error(err);
      alert("Failed to send notification");
    }
  };

  // const fetchRecentNotifications = async () => {
  //   try {
  //     const res = await fetch(
  //       "http://127.0.0.1:8000/api/notifications/history/"
  //     );
  //     const data = await res.json();
  //     setRecentNotifications(data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  useEffect(() => {
    // fetchRecentNotifications();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Notification Center
          </h1>
          <p className="text-muted-foreground">
            Send announcements, reminders, and alerts via email
          </p>
        </div>
      </div>

      <Tabs defaultValue="compose" className="space-y-4">
        {/* Compose Tab */}
        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compose Notification</CardTitle>
              <CardDescription>
                Send notifications to students, centres, or specific groups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="recipients">Recipients</Label>
                  <Select
                    value={recipientType}
                    onValueChange={(value: string) => setRecipientType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_students">All Students</SelectItem>
                      <SelectItem value="all_centres">All Centres</SelectItem>
                      <SelectItem value="centre_specific">
                        Centre Specific
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {recipientType === "centre_specific" && (
                  <div className="space-y-2">
                    <Label htmlFor="course-centre">Select Centre</Label>
                    <Select
                      value={courseCentreId?.toString() || ""}
                      onValueChange={(value) =>
                        setCourseCentreId(parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select centre" />
                      </SelectTrigger>
                      <SelectContent>
                        {centres.map((centre) => (
                          <SelectItem
                            key={centre.centre_id}
                            value={centre.centre_id.toString()}
                          >
                            {centre.centre_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter subject title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message here..."
                  rows={4}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  className="bg-gradient-primary hover:bg-primary-glow"
                  onClick={sendNotification}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
