import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "./socketEvents";

const SOCKET_URL = "https://api.nowdigitaleasy.com/admin";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      path: "/admin/socket.io",
      autoConnect: true,
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("⚠️ Socket disconnected:", reason);
    });

    socketInstance.on(SOCKET_EVENTS.RESPONSE.NOTIFICATIONS, (data) => {
      console.log("📩 Notifications received:", data);
    });

    socketInstance.on(SOCKET_EVENTS.TOTALS.USERS, (count) => {
      console.log("👥 Total users:", count);
    });

    socketInstance.on(SOCKET_EVENTS.TOTALS.ORDERS, (count) => {
      console.log("📦 Total orders:", count);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};
