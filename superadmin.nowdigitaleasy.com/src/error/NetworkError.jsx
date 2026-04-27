import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import RefreshIcon from "@mui/icons-material/Refresh";
import { motion } from "framer-motion";
import { useEffect } from "react";

const floatingEmojis = [
  { symbol: "📡", top: "18%", left: "12%" },
  { symbol: "❌", top: "25%", right: "15%" },
  { symbol: "🔌", bottom: "22%", left: "10%" },
  { symbol: "😵", bottom: "12%", right: "18%" },
  { symbol: "🌐", top: "30%", left: "5%" },
];

export default function NetworkError() {
  useEffect(() => {
    const handleOnline = () => {
      // Delay to ensure connection is stable, then go back
      setTimeout(() => {
        window.history.back();
      }, 500);
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      px={{ xs: 2, sm: 4, md: 6 }}
      sx={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
        backgroundSize: "300% 300%",
        animation: "gradientShift 12s ease infinite",
      }}
    >
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes wave {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes pulse {
            0% { transform: scale(0.9); opacity: 0.6; }
            50% { transform: scale(1.3); opacity: 0.2; }
            100% { transform: scale(0.9); opacity: 0.6; }
          }
          .wave {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 200%;
            height: 180px;
            background: rgba(255,255,255,0.2);
            border-radius: 100%;
            animation: wave 8s linear infinite;
          }
        `}
      </style>

      {/* Floating Emojis */}
      {floatingEmojis.map((emoji, index) => (
        <motion.div
          key={index}
          style={{
            position: "absolute",
            fontSize: "2.5rem",
            ...emoji,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 4 + index,
            ease: "easeInOut",
          }}
        >
          {emoji.symbol}
        </motion.div>
      ))}

      {/* WiFi with Pulse Glow */}
      <Box sx={{ position: "relative", mb: 2 }}>
        <motion.div
          className="wifi-pulse"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.3)",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
          }}
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 0.1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <WifiOffIcon sx={{ fontSize: 90, color: "#fff", position: "relative", zIndex: 1 }} />
      </Box>

      {/* Typewriter Heading */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 2, ease: "linear" }}
        style={{ overflow: "hidden", whiteSpace: "nowrap" }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{ color: "#fff", textShadow: "2px 2px 8px rgba(0,0,0,0.35)", mb: 2 }}
        >
          Network Error 🌐❌
        </Typography>
      </motion.div>

      {/* Message */}
      <Typography
        variant="h6"
        sx={{ maxWidth: "600px", mb: 3, color: "rgba(255,255,255,0.9)" }}
        component={motion.div}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        We couldn’t connect to the server. Please check your internet
        connection and try again.
      </Typography>

      <Divider sx={{ width: "60%", mb: 3, borderColor: "rgba(255,255,255,0.5)" }} />

      {/* Retry Button with Shake on Hover */}
      <IconButton
        component={motion.button}
        whileHover={{ scale: 1.08, rotate: [0, -3, 3, -3, 0] }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.reload()}
        sx={{
          border: "2px solid rgba(255,255,255,0.85)",
          borderRadius: 2,
          color: "#fff",
          px: { xs: 3, sm: 4 },
          py: { xs: 1.2, sm: 1.5 },
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          boxShadow: "0 5px 18px rgba(0,0,0,0.35)",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
        }}
      >
        <RefreshIcon sx={{ mr: 1 }} />
        Retry Connection
      </IconButton>

      {/* Helpful tips fade-in */}
      <Box mt={4}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)" }}>
            💡 Tip: Try restarting your router or checking if the server is down.
          </Typography>
        </motion.div>
      </Box>

      {/* Bottom Wave */}
      <div className="wave" />
    </Box>
  );
}
