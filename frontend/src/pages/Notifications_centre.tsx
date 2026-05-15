/// <reference types="vite/client" />

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/layout";
import { Tabs, TabsContent, Badge } from "../components/ui/data";
import { apiFetch } from "../lib/api";
import LoaderOverlay from "../components/ui/loadoverlay";

interface Notification {
  id: number;
  subject: string;
  message: string;
  recipient: string;
  target_centre: number | null;
  sent_date: string;
}

const NotificationsPageCentre = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const centreId = Number(localStorage.getItem("centre_id"));

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await apiFetch(
          `/notifications/history/?centre_id=${centreId}`,
        );
        setNotifications(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [centreId]);

  return (
    <div className="relative">
      {loading && <LoaderOverlay />}

      <div className={loading ? "pointer-events-none blur-sm" : ""}>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>

          <Tabs defaultValue="history">
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
                    <p className="text-muted-foreground">
                      No notifications found.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map((note) => (
                        <div key={note.id} className="border p-4 rounded-lg">
                          <h4 className="font-bold">{note.subject}</h4>
                          <p>{note.message}</p>

                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>
                              {new Date(note.sent_date).toLocaleString()}
                            </span>
                            <Badge variant="secondary">
                              {note.recipient === "all_centres"
                                ? "All Centres"
                                : "Centre Specific"}
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
      </div>
    </div>
  );
};

export default NotificationsPageCentre;
