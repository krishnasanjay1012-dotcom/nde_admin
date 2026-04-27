import { io } from "socket.io-client";

const SOCKET_URL = "https://api.nowdigitaleasy.com/admin";

export const SOCKET_EVENTS = {
  NOTIFICATIONS: {
    CLIENT: "sendClientNotification",
    ORDER: "sendOrderNotification",
    PAYMENT: "sendPaymentNotification",
  },
  TOTALS: {
    USERS: "totalUsers",
    ORDERS: "totalOrders",
  },
  RESPONSE: {
    NOTIFICATIONS: "getNotification",
  },
};

export const socket = io(SOCKET_URL, {
  path: "/admin/socket.io",
  autoConnect: true, // automatically connects
  reconnection: true, // try to reconnect
  reconnectionAttempts: 5, // max retries
  reconnectionDelay: 2000, // 2s delay before retry
});

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ Socket disconnected:", reason);
});
