import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";
import DataObjectOutlinedIcon from "@mui/icons-material/DataObjectOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SearchIcon from "@mui/icons-material/Search";

export function LeftPanel({
  leftPanelRef,
  upstreamVariables,
  onInsert,
  isOpen,
}) {
  const theme = useTheme();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return upstreamVariables;
    return upstreamVariables.filter(
      (v) =>
        v.label?.toLowerCase().includes(q) ||
        v.token?.toLowerCase().includes(q),
    );
  }, [upstreamVariables, search]);

  return (
    <Box
      ref={leftPanelRef}
      sx={{
        width: 260,
        minWidth: 200,
        maxWidth: 500,
        display: "flex",
        flexDirection: "column",
        borderRight: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 1.5,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          flexShrink: 0,
        }}
      >
        <DataObjectOutlinedIcon
          sx={{ fontSize: "0.95rem", color: theme.palette.primary.main }}
        />
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: theme.palette.text.primary }}
        >
          Variables
        </Typography>
      </Box>

      {/* Search */}
      <Box sx={{ px: 1.5, py: 1, flexShrink: 0 }}>
        <TextField
          size="small"
          placeholder="Search variables..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <SearchIcon
                sx={{
                  fontSize: "0.9rem",
                  color: theme.palette.text.secondary,
                  mr: 0.5,
                }}
              />
            ),
          }}
          sx={{
            "& .MuiInputBase-root": {
              fontSize: 12,
              borderRadius: "8px",
            },
          }}
        />
      </Box>

      {/* Variable list */}
      <Box sx={{ flex: 1, overflow: "auto", pb: 1 }}>
        {filtered.length === 0 ? (
          <Box sx={{ px: 1.5, py: 2, textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{ color: theme.palette.text.secondary }}
            >
              {search ? "No matching variables" : "No upstream variables yet"}
            </Typography>
          </Box>
        ) : (
          filtered.map((v) => (
            <Box
              key={v.token}
              onClick={() => onInsert(v.token)}
              sx={{
                px: 1.5,
                py: 0.6,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 1,
                transition: "background 0.15s",
                "&:hover": { bgcolor: theme.palette.background.hover },
              }}
            >
              <Chip
                label={v.type}
                size="small"
                sx={{
                  height: 16,
                  fontSize: 9,
                  fontWeight: 700,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  borderRadius: "4px",
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                    display: "block",
                  }}
                  noWrap
                >
                  {v.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontFamily: "monospace",
                    fontSize: 10,
                    display: "block",
                  }}
                  noWrap
                >
                  {v.token}
                </Typography>
              </Box>
              <ContentCopyIcon
                sx={{
                  fontSize: "0.75rem",
                  color: theme.palette.text.secondary,
                  flexShrink: 0,
                }}
              />
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
