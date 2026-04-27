import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, useTheme } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { DEMO_DATA } from "../Detail/constants";
import WorkspaceUserSelector from "./components/WorkspaceUserSelector";
import BulkIVRAssignment from "./components/BulkIVRAssignment";

export default function BulkAssign() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const record = DEMO_DATA[id] || { name: `Number ${id}`, number: "—" };
  const [selectedIds, setSelectedIds] = useState([]);

  const handleToggle = useCallback((userId) => {
    setSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter((i) => i !== userId) : [...prev, userId],
    );
  }, []);

  const handleSelectAll = useCallback((ids) => setSelectedIds(ids), []);

  return (
    <Box
      sx={{
        p: theme.spacing(2),
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
        overflow: "hidden",
      }}
    >
      {/* Back link */}
      <Box
        onClick={() => navigate(`/settings/freeSwitch/virtual-number/${id}/general`)}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: theme.spacing(0.5),
          cursor: "pointer",
          color: "primary.main",
          "&:hover": { textDecoration: "underline" },
          width: "fit-content",
        }}
      >
        <ChevronLeftIcon sx={{ fontSize: "1rem" }} />
        <Typography variant="body1" sx={{ fontWeight: 500, color: "primary.main" }}>
          Back to {record.name}
        </Typography>
      </Box>

      {/* Page title */}
      <Box sx={{ display: "flex", alignItems: "center", gap: theme.spacing(1) }}>
        <PeopleAltOutlinedIcon sx={{ color: "primary.main", fontSize: "1.4rem" }} />
        <Box>
          <Typography variant="h4">Bulk Assign Users</Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Select users from a workspace and assign IVR / routing configuration
          </Typography>
        </Box>
      </Box>

      {/* Two-panel layout */}
      <Box
        sx={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: theme.spacing(2.5),
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {/* Left — User Selector */}
        <Box
          sx={{
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: `${theme.shape.borderRadius * 1.5}px`,
            p: theme.spacing(2.5),
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing(1.5),
            overflow: "hidden",
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Select Users
          </Typography>
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <WorkspaceUserSelector
              selectedIds={selectedIds}
              onToggle={handleToggle}
              onSelectAll={handleSelectAll}
            />
          </Box>
        </Box>

        {/* Right — IVR Assignment */}
        <Box sx={{ overflow: "auto" }}>
          <BulkIVRAssignment
            selectedIds={selectedIds}
            numberId={id}
            navigate={navigate}
            phoneNumber={record.number}
          />
        </Box>
      </Box>
    </Box>
  );
}
