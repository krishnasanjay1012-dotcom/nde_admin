import { useEffect, useRef } from "react";

export const useNotificationSound = (notifications = [], onNewNotification) => {
  const prevNotifIds = useRef(new Set());
  const firstLoad = useRef(true);
  const soundRef = useRef(new Audio("/sounds/notification.mp3.wav"));

  useEffect(() => {
    soundRef.current.volume = 1.0;
  }, []);

  useEffect(() => {
    if (!notifications?.length) return;

    if (firstLoad.current) {
      notifications.forEach((n) => prevNotifIds.current.add(n._id));
      firstLoad.current = false;
      return;
    }

    const newNotifs = notifications.filter((n) => !prevNotifIds.current.has(n._id));
    if (newNotifs.length) {
      const lastNewNotif = newNotifs[newNotifs.length - 1];

      soundRef.current.play().catch((err) => console.log("Sound blocked", err));
      if (onNewNotification) onNewNotification(lastNewNotif);
    }

    notifications.forEach((n) => prevNotifIds.current.add(n._id));
  }, [notifications, onNewNotification]);
};
