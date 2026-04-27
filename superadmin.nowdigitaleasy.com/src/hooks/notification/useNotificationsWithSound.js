import { useEffect, useRef } from "react";
import { useNotifications } from "./useNotifications";
import { useNotificationSound } from "./useNotificationSound";

export const useNotificationsWithSound = () => {
  const { data: notifications, ...queryInfo } = useNotifications();
  const { playSound } = useNotificationSound();
  const prevCountRef = useRef(0);

  useEffect(() => {
    if (!notifications) return;

    if (notifications.length > prevCountRef.current) {
      playSound();

      if (Notification.permission === "granted") {
        const newNotif = notifications[notifications.length - 1];
        new Notification(newNotif.title || "New Notification", { body: newNotif.message });
      }
    }

    prevCountRef.current = notifications.length;
  }, [notifications, playSound]);

  return { notifications, ...queryInfo };
};
