import { Box, Typography, TextField, useTheme } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";

import { useIVRFlowStore } from "../../store/ivrFlowStore";

export function CenterPanel({ selectedNode, updateBlockConfig }) {
  const theme = useTheme();

  if (!selectedNode) return null;

  const subBlocks = selectedNode.data?.subBlocks || [];
  const config = selectedNode.data?.config || {};

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minWidth: 0,
        bgcolor: theme.palette.background.paper,
      }}
    >
      {/* Panel header */}
      <Box
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          flexShrink: 0,
        }}
      >
        <TuneIcon
          sx={{ fontSize: "0.95rem", color: theme.palette.primary.main }}
        />
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: theme.palette.text.primary }}
        >
          Configuration
        </Typography>
      </Box>

      {/* Fields */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          bgcolor: theme.palette.background.paper,
        }}
      >
        {/* Node name */}
        <Box sx={{ mb: 2.5 }}>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mb: 0.5,
              fontWeight: 600,
              color: theme.palette.text.secondary,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontSize: 10,
            }}
          >
            Node Label
          </Typography>
          <TextField
            size="small"
            fullWidth
            value={selectedNode.data?.name || ""}
            onChange={(e) =>
              useIVRFlowStore
                .getState()
                .renameBlock(selectedNode.id, e.target.value)
            }
            placeholder="Node name..."
            sx={{
              "& .MuiInputBase-root": { borderRadius: "8px", fontSize: 13 },
            }}
          />
        </Box>

        {/* Dynamic sub-blocks */}
        {subBlocks.length > 0 ? (
          subBlocks.map((field) => (
            <Box key={field.id} sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 0.5,
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontSize: 10,
                }}
              >
                {field.label}
              </Typography>
              <TextField
                size="small"
                fullWidth
                multiline={field.type === "textarea"}
                rows={field.type === "textarea" ? 3 : 1}
                value={config[field.id] || ""}
                onChange={(e) =>
                  updateBlockConfig(selectedNode.id, {
                    [field.id]: e.target.value,
                  })
                }
                placeholder={field.placeholder || ""}
                sx={{
                  "& .MuiInputBase-root": { borderRadius: "8px", fontSize: 13 },
                }}
              />
            </Box>
          ))
        ) : (
          <Box
            sx={{
              mt: 3,
              p: 2.5,
              borderRadius: "10px",
              border: `1px dashed ${theme.palette.divider}`,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              This node has no configurable fields.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
