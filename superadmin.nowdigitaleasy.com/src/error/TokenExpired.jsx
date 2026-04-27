import { Box, Typography, IconButton, Divider } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { motion } from "framer-motion";

const floatingEmojis = [
  { symbol: "🔒", top: "15%", left: "12%" },
  { symbol: "⏳", top: "22%", right: "18%" },
  { symbol: "❌", bottom: "25%", left: "10%" },
  { symbol: "😵", bottom: "12%", right: "20%" },
  { symbol: "🚪", top: "30%", left: "5%" },
];

export default function TokenExpired() {
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
        background: "linear-gradient(135deg, #ff512f 0%, #dd2476 100%)",
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
        `}
      </style>

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

      <LockIcon sx={{ fontSize: 90, mb: 2, color: "#fff" }} />

      <Typography
        variant="h3"
        fontWeight={700}
        sx={{ color: "#fff", textShadow: "2px 2px 8px rgba(0,0,0,0.35)", mb: 2 }}
      >
        Session Expired 🔒
      </Typography>

      <Typography
        variant="h6"
        sx={{ maxWidth: "600px", mb: 3, color: "rgba(255,255,255,0.9)" }}
      >
        Your session has expired. Please log in again to continue.
      </Typography>

      <Divider sx={{ width: "60%", mb: 3, borderColor: "rgba(255,255,255,0.5)" }} />

      <IconButton
        component={motion.button}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => (window.location.href = "/login")}
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
        <KeyboardBackspaceIcon sx={{ mr: 1 }} />
        Go to Login
      </IconButton>
    </Box>
  );
}
