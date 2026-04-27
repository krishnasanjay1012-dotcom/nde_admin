import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {
  IVR_NODE_TYPES,
  KEYPRESS_ACTIONS,
  DEMO_USERS,
  DEMO_TEAMS,
} from "../../../catalog";
import ActionIcon from "./ActionIcon";
import SearchablePicker from "./SearchablePicker";

// single row in the keypres
export default function KeypressRow({
  kp,
  onRemove,
  onActionChange,
  onTargetChange,
}) {
  const theme = useTheme();

  const needsSubPicker =
    kp.action === IVR_NODE_TYPES.CONNECT_USER ||
    kp.action === IVR_NODE_TYPES.CONNECT_TEAM;

  const subOptions =
    kp.action === IVR_NODE_TYPES.CONNECT_USER ? DEMO_USERS : DEMO_TEAMS;

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "40px 36px 1fr 24px",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        {/* key number box */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 36,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "6px",
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {kp.key}
          </Typography>
        </Box>

        {/* circular icon — shows selected action type */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {kp.action ? (
            <ActionIcon type={kp.action} size="1.2rem" withBg />
          ) : (
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: alpha(theme.palette.text.secondary, 0.1),
              }}
            />
          )}
        </Box>

        {/* action select dropdown */}
        <FormControl size="small" fullWidth>
          <Select
            value={kp.action}
            displayEmpty
            onChange={(e) => onActionChange(e.target.value)}
            renderValue={(v) =>
              v ? (
                <Typography variant="body1" noWrap>
                  {KEYPRESS_ACTIONS.find((a) => a.value === v)?.label || v}
                </Typography>
              ) : (
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  Select component
                </Typography>
              )
            }
            sx={{ "& .MuiSelect-select": { py: 0.85, px: 1.25 } }}
          >
            {KEYPRESS_ACTIONS.map((a) => (
              <MenuItem key={a.value} value={a.value}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <ActionIcon type={a.value} size="1rem" />
                  <Typography variant="body1">{a.label}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* remove button */}
        <IconButton size="small" onClick={onRemove} sx={{ p: 0.5 }}>
          <CloseIcon
            sx={{ fontSize: "1rem", color: theme.palette.text.secondary }}
          />
        </IconButton>
      </Box>

      {/* sub-picker for user or team */}
      {needsSubPicker && (
        <Box sx={{ mt: 1, pl: "100px" }}>
          <SearchablePicker
            options={subOptions}
            value={kp.targetId}
            onChange={onTargetChange}
            placeholder={
              kp.action === IVR_NODE_TYPES.CONNECT_USER
                ? "Select user"
                : "Select team"
            }
          />
        </Box>
      )}
    </Box>
  );
}
