import { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

const ContactRow = ({ name, email, primary }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 1.5,
      py: 2,
    }}
  >
    <Box sx={{ position: "relative" }}>
      <Avatar
        sx={{
          width: 36,
          height: 36,
          bgcolor: "#020202",
          color: "#6B7280",
          fontWeight: 600,
        }}
      >
        {name[0]}
      </Avatar>

      {primary && (
        <Tooltip title="Primary Contact" placement="bottom">
          <Box
            sx={{
              position: "absolute",
              bottom: -2,
              right: -2,
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: "#22C55E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #fff",
              cursor: "pointer",
            }}
          >
            <StarIcon sx={{ fontSize: 10, color: "#fff" }} />
          </Box>
        </Tooltip>
      )}
    </Box>

    <Box>
      <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{name}</Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          mt: 0.3,
        }}
      >
        <EmailOutlinedIcon sx={{ fontSize: 14, color: "#6B7280" }} />
        <Typography sx={{ fontSize: 13, color: "#6B7280" }}>{email}</Typography>
      </Box>
    </Box>
  </Box>
);

export default function ContactPersonsCard({ contactPerson = [] }) {
  const [open, setOpen] = useState(true);

  return (
    <Box
      sx={{
        border: "1px solid #E6E8F0",
        borderRadius: "12px",
        backgroundColor: "#fff",
        overflow: "hidden",
        mb: 3,
      }}
    >
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontWeight: 600 }}>Contact Persons</Typography>
          <Chip
            label={contactPerson.length}
            size="small"
            sx={{
              height: 18,
              fontSize: 12,
              bgcolor: "#E9ECF3",
              color: "#4B5563",
            }}
          />
        </Box>

        <IconButton size="small" sx={{ padding: 0 }}>
          <ExpandMoreIcon
            sx={{
              transform: open ? "rotate(180deg)" : "rotate(0)",
              transition: "0.2s",
            }}
          />
        </IconButton>
      </Box>

      <Divider />

      <Collapse in={open}>
        <Box px={2}>
          {contactPerson.map((person, index) => (
            <>
              {" "}
              <ContactRow
                name={`${person?.name_details?.salutation ?? ""} ${person?.name_details?.first_name ?? ""} ${person?.name_details?.last_name ?? ""}`}
                email={person?.email}
                primary={person?.primary}
              />
              {index > contactPerson.length - 1 && <Divider />}
            </>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
