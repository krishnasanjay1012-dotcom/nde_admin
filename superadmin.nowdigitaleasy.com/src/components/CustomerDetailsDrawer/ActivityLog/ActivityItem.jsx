import { Box, Typography, Avatar } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";

const activityIconMap = {
  payment: <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />,
  invoice: <ReceiptLongOutlinedIcon sx={{ fontSize: 18 }} />,
  edit: <EditNoteOutlinedIcon sx={{ fontSize: 18 }} />,
};

const ActivityItem = ({ commentedBy, formattedDateTime, message, type }) => (
  <Box sx={{ display: "flex", gap: 2, position: "relative" }}>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: "#F1F5F9",
          color: "#3B82F6",
        }}
      >
        {activityIconMap[type]}
      </Avatar>

      <Box
        sx={{
          width: "2px",
          flex: 1,
          bgcolor: "#E5E7EB",
          mt: 0.5,
        }}
      />
    </Box>

    <Box sx={{ flex: 1, pb: 3 }}>
      <Typography
        sx={{
          fontSize: 13,
          color: "#6B7280",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          component="span"
          sx={{
            color: "#111827",
            fontWeight: 600,
            maxWidth: 120,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "inline-block",
            verticalAlign: "bottom",
          }}
        >
          {commentedBy}
        </Box>
        &nbsp;•&nbsp; {formattedDateTime}
      </Typography>

      <Box
        sx={{
          mt: 1,
          p: 1.5,
          bgcolor: "#fff",
          borderRadius: "8px",
          boxShadow: 2,
          fontSize: 14,
        }}
      >
        {message}
      </Box>
    </Box>
  </Box>
);

export default ActivityItem;
