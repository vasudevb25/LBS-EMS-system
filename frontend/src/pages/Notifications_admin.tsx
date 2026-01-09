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

    try {
      const data = await apiFetch("/api/notifications/send/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: recipientType,
          subject: title.trim(),
          message: message.trim(),
          target_centre:
            recipientType === "centre_specific" ? selectedCentreId : null,
        }),
      });

      alert(data.status || "Notification sent successfully");

      setTitle("");
      setMessage("");
      setSelectedCentreId(null);
      setRecipientType("all_centres");
    } catch (err: any) {
      alert(err.message || "Failed to send notification");
    }
  };

  /* ---------------- CLEAR NOTIFICATIONS ---------------- */

  const clearNotifications = async () => {
    if (!confirm("Delete ALL notifications?")) return;

    try {
      const data = await apiFetch("/api/notifications/clear/", {
        method: "DELETE",
      });

      alert(data.status || "Notifications cleared");
    } catch (err: any) {
      alert(err.message || "Failed to clear notifications");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notification Center</h1>

      <Tabs defaultValue="compose">
        <TabsContent value="compose">
          <Card>
            <CardHeader>
              <CardTitle>Compose Notification</CardTitle>
              <CardDescription>
                Send notifications to all centres or one centre.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Label>Recipients</Label>
              <Select
                value={recipientType}
                onValueChange={(v) =>
                  setRecipientType(v as "all_centres" | "centre_specific")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_centres">All Centres</SelectItem>
                  <SelectItem value="centre_specific">
                    Centre Specific
                  </SelectItem>
                </SelectContent>
              </Select>

              {recipientType === "centre_specific" && (
                <>
                  <Label>Select Centre</Label>
                  <Select
                    value={selectedCentreId?.toString() || ""}
                    onValueChange={(v) => setSelectedCentreId(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {centres.map((c) => (
                        <SelectItem
                          key={c.centre_id}
                          value={String(c.centre_id)}
                        >
                          {c.centre_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}

              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />

              <Label>Message</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />

              <div className="flex gap-2">
                <Button onClick={sendNotification}>
                  <Send className="mr-2 h-4 w-4" /> Send
                </Button>

                <Button variant="destructive" onClick={clearNotifications}>
                  <Trash2 className="mr-2 h-4 w-4" /> Clear All
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
