// admin/Notifications.tsx
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
  Tabs,
  TabsContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/data";
import { Send } from "lucide-react";

interface Centre {
  centre_id: number;
  centre_name: string;
}

const Notifications = () => {
  const [title, setTitle] = useState(""); // notification title
  const [message, setMessage] = useState(""); // notification message
  const [recipientType, setRecipientType] = useState("all_centres"); // all or specific
  const [selectedCentreId, setSelectedCentreId] = useState<number | null>(null);
  const [centres, setCentres] = useState<Centre[]>([]);

  // Fetch all centres on load
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/centres/")
      .then((res) => res.json())
      .then((data) => setCentres(data))
      .catch((err) => console.error("Error fetching centres:", err));
  }, []);

  // Send Notification
  const sendNotification = async () => {
    if (!title || !message) {
      alert("Please fill in all fields.");
      return;
    }

    const payload = {
      recipient: recipientType,
      subject: title,
      message,
      target_centre:
        recipientType === "centre_specific" ? selectedCentreId : null,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/notifications/send/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.status || "Notification sent successfully!");

      // Reset form
      setTitle("");
      setMessage("");
      setSelectedCentreId(null);
      setRecipientType("all_centres");
    } catch (err) {
      console.error("Failed to send notification:", err);
      alert("Failed to send notification");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Notification Center
          </h1>
          <p className="text-muted-foreground">
            Send announcements, reminders, and alerts to centres
          </p>
        </div>
      </div>

      <Tabs defaultValue="compose" className="space-y-4">
        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compose Notification</CardTitle>
              <CardDescription>
                Send notifications to all centres or a specific centre
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Recipient Selection */}
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
                      <SelectItem value="all_centres">All Centres</SelectItem>
                      <SelectItem value="centre_specific">
                        Centre Specific
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {recipientType === "centre_specific" && (
                  <div className="space-y-2">
                    <Label htmlFor="centre">Select Centre</Label>
                    <Select
                      value={selectedCentreId?.toString() || ""}
                      onValueChange={(value) =>
                        setSelectedCentreId(parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Centre" />
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

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter notification title"
                />
              </div>

              {/* Message */}
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

              {/* Send Button */}
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
