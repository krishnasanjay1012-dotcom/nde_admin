import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Avatar,
  Chip,
  Divider,
  useTheme,
  Skeleton,
} from "@mui/material";
import { useWorkspaceUsers } from "../../hooks/useWorkspaceUsers";

const ALL_WS = "";

export default function WorkspaceUserSelector({
  selectedIds,
  onToggle,
  onSelectAll,
}) {
  const theme = useTheme();
  const [workspaceId, setWorkspaceId] = useState(ALL_WS);

  const { workspaces, users, isLoading } = useWorkspaceUsers(
    workspaceId || null,
  );

  const allSelected =
    users.length > 0 && users.every((u) => selectedIds.includes(u.id));
  const someSelected = users.some((u) => selectedIds.includes(u.id));

  function getInitials(name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: theme.spacing(1.5),
      }}
    >
      {/* Workspace Dropdown */}
      <FormControl size="small" fullWidth>
        <Select
          value={workspaceId}
          onChange={(e) => {
            setWorkspaceId(e.target.value);
            onSelectAll([]);
          }}
          displayEmpty
        >
          <MenuItem value={ALL_WS}>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Select Workspace
            </Typography>
          </MenuItem>
          {workspaces.map((ws) => (
            <MenuItem key={ws.id} value={ws.id}>
              <Typography variant="body1">{ws.name}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Select All row */}
      {workspaceId && users.length > 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: theme.spacing(0.5),
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              onClick={() =>
                onSelectAll(allSelected ? [] : users.map((u) => u.id))
              }
            >
              <Checkbox
                size="small"
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                sx={{ p: theme.spacing(0.5) }}
              />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Select All
              </Typography>
            </Box>
            <Chip
              label={`${selectedIds.length} selected`}
              size="small"
              sx={{
                bgcolor: selectedIds.length
                  ? theme.palette.primary.extraLight
                  : theme.palette.background.default,
                color: selectedIds.length
                  ? theme.palette.primary.main
                  : theme.palette.text.disabled,
                fontWeight: 600,
                borderRadius: `${theme.shape.borderRadius}px`,
              }}
            />
          </Box>
          <Divider />
        </>
      )}

      {/* User List */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          borderRadius: `${theme.shape.borderRadius * 1.5}px`,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        {!workspaceId ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              p: theme.spacing(4),
            }}
          >
            <Typography
              variant="body1"
              sx={{ color: "text.disabled", textAlign: "center" }}
            >
              Select a workspace to see its users
            </Typography>
          </Box>
        ) : isLoading ? (
          <List disablePadding>
            {Array.from({ length: 5 }).map((_, i) => (
              <ListItem key={i} divider sx={{ gap: theme.spacing(1.5) }}>
                <Skeleton
                  variant="rectangular"
                  width={theme.spacing(3)}
                  height={theme.spacing(3)}
                  sx={{ borderRadius: theme.shape.borderRadius }}
                />
                <Skeleton
                  variant="circular"
                  width={theme.spacing(4)}
                  height={theme.spacing(4)}
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="60%" height={theme.spacing(2.5)} />
                  <Skeleton width="40%" height={theme.spacing(2)} />
                </Box>
              </ListItem>
            ))}
          </List>
        ) : users.length === 0 ? (
          <Box sx={{ p: theme.spacing(3), textAlign: "center" }}>
            <Typography variant="body1" sx={{ color: "text.disabled" }}>
              No users in this workspace
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {users.map((user, idx) => {
              const isSelected = selectedIds.includes(user.id);
              return (
                <ListItem
                  key={user.id}
                  disablePadding
                  divider={idx < users.length - 1}
                >
                  <ListItemButton
                    onClick={() => onToggle(user.id)}
                    sx={{
                      px: theme.spacing(1.5),
                      py: theme.spacing(1),
                      bgcolor: isSelected
                        ? theme.palette.primary.extraLight
                        : "transparent",
                      "&:hover": {
                        bgcolor: isSelected
                          ? theme.palette.primary.extraLight
                          : theme.palette.background.hover,
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: theme.spacing(4.5) }}>
                      <Checkbox
                        size="small"
                        checked={isSelected}
                        disableRipple
                        sx={{ p: 0 }}
                      />
                    </ListItemIcon>
                    <Avatar
                      sx={{
                        width: theme.spacing(4),
                        height: theme.spacing(4),
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        fontSize: theme.typography.caption.fontSize,
                        fontWeight: 600,
                        mr: theme.spacing(1.5),
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(user.name)}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {user.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body1"
                          sx={{ color: "text.secondary" }}
                        >
                          {user.email} · {user.role}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );
}
