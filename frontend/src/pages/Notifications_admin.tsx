/// <reference types="vite/client" />

import { useEffect, useState } from "react";
import { Button } from "../components/ui/buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/layout";
import { Input, Textarea, Label } from "../components/ui/inputs";
import {
  Tabs,
  TabsContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/data";
import { Send, Trash2 } from "lucide-react";
import { apiFetch } from "../lib/api";

interface Centre {
  centre_id: number;
  centre_name: string;
}

const NotificationsPageAdmin = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipientType, setRecipientType] = useState<
    "all_centres" | "centre_specific"
  >("all_centres");
  const [selectedCentreId, setSelectedCentreId] = useState<number | null>(null);
  const [centres, setCentres] = useState<Centre[]>([]);

  /* ---------------- FETCH CENTRES ---------------- */

  useEffect(() => {
    const loadCentres = async () => {
      try {
        const data = await apiFetch("/api/centres/");
        setCentres(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching centres:", err);
      }
    };

    loadCentres();
  }, []);

  /* ---------------- SEND NOTIFICATION ---------------- */

  const sendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    if (recipientType === "centre_specific" && !selectedCentreId) {
      alert("Please select a centre.");
      return;
    }

    const payload = {
      recipient: recipientType,
      subject: title.trim(),
      message: message.trim(),
      target_centre:
        recipientType === "centre_specific" ? selectedCentreId : null,
    };

    try {
      const data = await apiFetch("/api/notifications/send/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert(data?.status || "Notification sent successfully!");

      setTitle("");
      setMessage("");
      setSelectedCentreId(null);
      setRecipientType("all_centres");
    } catch (err: any) {
      console.error("Failed to send notification:", err);
      alert(err.message || "Failed to send notification");
    }
  };

  /* ---------------- CLEAR NOTIFICATIONS ---------------- */

  const clearNotifications = async () => {
    if (!confirm("Are you sure you want to delete all notifications?")) return;

    try {
      const data = await apiFetch("/api/notifications/clear/", {
        method: "DELETE",
      });

      alert(data?.status || "All notifications deleted.");
    } catch (err: any) {
      console.error("Failed to delete notifications:", err);
      alert(err.message || "Failed to delete notifications");
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Notification Center
        </h1>
        <p className="text-muted-foreground">
          Send announcements, reminders, and alerts to centres.
        </p>
      </div>

      <Tabs defaultValue="compose">
        <TabsContent value="compose">
          <Card>
            <CardHeader>
              <CardTitle>Compose Notification</CardTitle>
              <CardDescription>
                Send notifications to all centres or a specific centre.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Recipient */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Recipients</Label>
                  <Select
                    value={recipientType}
                    onValueChange={(v) =>
                      setRecipientType(v as typeof recipientType)
                    }
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
                    <Label>Select Centre</Label>
                    <Select
                      value={selectedCentreId?.toString() || ""}
                      onValueChange={(v) => setSelectedCentreId(Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Centre" />
                      </SelectTrigger>
                      <SelectContent>
                        {centres.map((c) => (
                          <SelectItem
                            key={c.centre_id}
                            value={c.centre_id.toString()}
                          >
                            {c.centre_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter notification title"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message here..."
                  rows={4}
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button onClick={sendNotification}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Notification
                </Button>

                <Button variant="destructive" onClick={clearNotifications}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPageAdmin;
