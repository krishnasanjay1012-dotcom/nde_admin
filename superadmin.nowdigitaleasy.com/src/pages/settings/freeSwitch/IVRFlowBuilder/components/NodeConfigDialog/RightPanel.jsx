import { useState, useMemo } from "react";
import { Box, Typography, Chip, alpha, useTheme } from "@mui/material";
import OutputOutlinedIcon from "@mui/icons-material/OutputOutlined";

export function RightPanel({ rightPanelRef, selectedNode, executionLogs }) {
  const theme = useTheme();
  const [tab, setTab] = useState("outputs");

  const nodeLog = useMemo(() => {
    if (!selectedNode || !executionLogs.length) return null;
    return (
      [...executionLogs].reverse().find((l) => l.blockId === selectedNode.id) ??
      null
    );
  }, [selectedNode, executionLogs]);

  const outputs = selectedNode?.data?.outputs || {};

  const tabSx = (active) => ({
    px: 1.5,
    py: 0.6,
    cursor: "pointer",
    borderRadius: "6px",
    transition: "all 0.15s",
    bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : "transparent",
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
    "&:hover": {
      bgcolor: active
        ? alpha(theme.palette.primary.main, 0.15)
        : theme.palette.background.hover,
    },
  });

  return (
    <Box
      ref={rightPanelRef}
      sx={{
        width: 260,
        minWidth: 200,
        maxWidth: 500,
        display: "flex",
        flexDirection: "column",
        borderLeft: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* Header with tab switcher */}
      <Box
        sx={{
          px: 1.5,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          flexShrink: 0,
        }}
      >
        <OutputOutlinedIcon
          sx={{
            fontSize: "0.95rem",
            color: theme.palette.primary.main,
            mr: 0.5,
          }}
        />
        <Box sx={tabSx(tab === "outputs")} onClick={() => setTab("outputs")}>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 12 }}>
            Outputs
          </Typography>
        </Box>
        <Box sx={tabSx(tab === "result")} onClick={() => setTab("result")}>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 12 }}>
            Result
          </Typography>
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ flex: 1, overflow: "auto", p: 1.5 }}>
        {tab === "outputs" ? (
          Object.keys(outputs).length === 0 ? (
            <Typography
              variant="caption"
              sx={{ color: theme.palette.text.secondary }}
            >
              No outputs defined for this node.
            </Typography>
          ) : (
            Object.entries(outputs).map(([key, meta]) => (
              <Box
                key={key}
                sx={{
                  mb: 1.5,
                  p: 1.25,
                  borderRadius: "8px",
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.background.paper,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    mb: 0.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      color: theme.palette.primary.main,
                      fontSize: 11,
                    }}
                  >
                    {key}
                  </Typography>
                  <Chip
                    label={meta.type}
                    size="small"
                    sx={{
                      height: 14,
                      fontSize: 9,
                      fontWeight: 700,
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                      borderRadius: "3px",
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {meta.description}
                </Typography>
              </Box>
            ))
          )
        ) : (
          <Box>
            {nodeLog ? (
              <Box
                component="pre"
                sx={{
                  m: 0,
                  fontSize: 11,
                  fontFamily: "monospace",
                  color: theme.palette.text.primary,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                  lineHeight: 1.6,
                }}
              >
                {JSON.stringify(nodeLog.output ?? nodeLog, null, 2)}
              </Box>
            ) : (
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary }}
              >
                No execution result yet.
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
