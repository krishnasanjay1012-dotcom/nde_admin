import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  ClickAwayListener,
  InputAdornment,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// a searchable dropdown
export default function SearchablePicker({
  options,
  value,
  onChange,
  placeholder = "Select",
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const lq = q.toLowerCase();
    return lq
      ? options.filter((o) => o.name.toLowerCase().includes(lq))
      : options;
  }, [options, q]);

  const selected = options.find((o) => o.id === value);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: "relative" }}>
        {/* trigger box */}
        <Box
          onClick={() => setOpen((v) => !v)}
          sx={{
            height: 36,
            px: 1.25,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: `1px solid ${open ? theme.palette.primary.main : theme.palette.divider}`,
            borderRadius: "6px",
            cursor: "pointer",
            bgcolor: theme.palette.background.paper,
            transition: "border-color 0.15s",
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: selected ? "text.primary" : "text.secondary" }}
            noWrap
          >
            {selected ? selected.name : placeholder}
          </Typography>
        </Box>

        {/* dropdown panel */}
        {open && (
          <Paper
            elevation={6}
            sx={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              zIndex: 1500,
              borderRadius: "8px",
              overflow: "hidden",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                p: 0.75,
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <TextField
                size="small"
                fullWidth
                autoFocus
                placeholder="Search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{ fontSize: "0.9rem", color: "text.secondary" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <List
              dense
              disablePadding
              sx={{ maxHeight: 200, overflowY: "auto" }}
            >
              {filtered.map((o) => (
                <ListItemButton
                  key={o.id}
                  selected={o.id === value}
                  onClick={() => {
                    onChange(o.id, o.name);
                    setOpen(false);
                    setQ("");
                  }}
                >
                  <ListItemText
                    primary={o.name}
                    primaryTypographyProps={{ variant: "body1" }}
                  />
                </ListItemButton>
              ))}
              {filtered.length === 0 && (
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    No results
                  </Typography>
                </Box>
              )}
            </List>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
}
