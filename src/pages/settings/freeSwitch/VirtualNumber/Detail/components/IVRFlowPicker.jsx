import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { IVR_FLOWS } from "../constants";

export default function IVRFlowPicker({ value, onChange, onNewFlow }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? IVR_FLOWS.filter((f) => f.name.toLowerCase().includes(q)) : IVR_FLOWS;
  }, [search]);

  const selected = IVR_FLOWS.find((f) => f.id === value);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: "relative" }}>
        {/* Trigger */}
        <Box
          onClick={() => setOpen((v) => !v)}
          sx={{
            height: 40,
            px: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: (theme) =>
              `1px solid ${open ? theme.palette.primary.main : theme.palette.divider}`,
            borderRadius: "4px",
            cursor: "pointer",
            bgcolor: "background.paper",
            transition: "border-color 0.18s",
            "&:hover": { borderColor: "text.primary" },
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: selected ? "text.primary" : "text.secondary" }}
          >
            {selected ? selected.name : "Select IVR flow"}
          </Typography>
          <ChevronLeftIcon
            sx={{
              fontSize: "1.1rem",
              color: "text.secondary",
              transform: open ? "rotate(90deg)" : "rotate(-90deg)",
              transition: "transform 0.2s",
            }}
          />
        </Box>

        {/* Dropdown */}
        {open && (
          <Paper
            elevation={4}
            sx={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              width: "100%",
              zIndex: 1300,
              borderRadius: "8px",
              overflow: "hidden",
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            {/* Search */}
            <Box
              sx={{
                p: 1,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <TextField
                size="small"
                fullWidth
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </Box>

            <List dense disablePadding>
              {/* + New Flow */}
              <ListItemButton
                onClick={() => {
                  setOpen(false);
                  onNewFlow?.();
                }}
                sx={{ color: "primary.main", py: 1 }}
              >
                <AddIcon sx={{ fontSize: "1rem", mr: 1 }} />
                <ListItemText
                  primary="New Flow"
                  primaryTypographyProps={{
                    variant: "body1",
                    fontWeight: 600,
                    color: "primary.main",
                  }}
                />
              </ListItemButton>

              <Divider />

              {filtered.map((flow) => (
                <ListItemButton
                  key={flow.id}
                  selected={flow.id === value}
                  onClick={() => {
                    onChange(flow.id);
                    setOpen(false);
                    setSearch("");
                  }}
                  sx={{ py: 0.8 }}
                >
                  <ListItemText
                    primary={flow.name}
                    primaryTypographyProps={{ variant: "body1" }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
}
