// centre/CentreNotifications.tsx
/// <reference types="vite/client" />

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/layout";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Badge,
} from "../components/ui/data";
import { apiFetch } from "../lib/api";
const API_URL = import.meta.env.VITE_API_URL;

interface Notification {
  id: number;
  subject: string;
  message: string;
  recipient: string;
  target_centre: number | null; // ID of the centre if centre_specific
  sent_date: string;
}

const NotificationsPageCentre = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const centreId = Number(localStorage.getItem("centre_id")); // or inject later

  const fetchNotifications = async () => {
    try {
      const data = await apiFetch(
        `/api/notifications/history/?centre_id=${centreId}`,
      );
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [centreId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
      </div>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                Messages from admin to your centre
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="text-muted-foreground">No notifications found.</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((note) => (
                    <div key={note.id} className="border p-4 rounded-lg">
                      <h4 className="font-bold">{note.subject}</h4>
                      <p className="text-lg font-bold">{note.message}</p>

                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>{new Date(note.sent_date).toLocaleString()}</span>
                        <Badge variant="secondary">
                          {note.recipient === "all_centres"
                            ? "All Centres"
                            : `Centre ID ${note.target_centre}`}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPageCentre;
