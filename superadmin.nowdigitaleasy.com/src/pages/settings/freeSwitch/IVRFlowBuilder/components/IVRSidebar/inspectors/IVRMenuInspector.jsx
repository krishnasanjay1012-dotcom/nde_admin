import { useRef, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Divider,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import AudioFileOutlinedIcon from "@mui/icons-material/AudioFileOutlined";
import { useIVRFlowStore } from "../../../store/ivrFlowStore";
import KeypressRow from "../shared/KeypressRow";

// inspector panel shown when an ivr menu node is selected
export default function IVRMenuInspector({ nodeId, data }) {
  const theme = useTheme();
  const audioInputRef = useRef(null);

  const setComponentName = useIVRFlowStore((s) => s.setComponentName);
  const keypresses = useIVRFlowStore((s) => s.keypresses[nodeId] || []);
  const audioFile = useIVRFlowStore((s) => s.audioFiles[nodeId] || null);
  const addKeypress = useIVRFlowStore((s) => s.addKeypress);
  const removeKeypress = useIVRFlowStore((s) => s.removeKeypress);
  const setKeypressAction = useIVRFlowStore((s) => s.setKeypressAction);
  const setKeypressTarget = useIVRFlowStore((s) => s.setKeypressTarget);
  const setAudioFile = useIVRFlowStore((s) => s.setAudioFile);
  const selectNode = useIVRFlowStore((s) => s.selectNode);

  const handleAudioUpload = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) setAudioFile(nodeId, file);
    },
    [nodeId, setAudioFile],
  );

  return (
    <Box>
      {/* header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Ivr Node Component
        </Typography>
        <IconButton size="small" onClick={() => selectNode(null)}>
          <CloseIcon sx={{ fontSize: "1rem" }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* component name */}
        <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.75 }}>
          Component name
        </Typography>
        <TextField
          size="small"
          fullWidth
          value={data.name || ""}
          onChange={(e) => setComponentName(nodeId, e.target.value)}
          sx={{ mb: 2.5 }}
        />

        <Divider sx={{ mb: 2 }} />

        {/* keypress table header */}
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
          Then
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "40px 1fr",
            gap: 2,
            mb: 1.5,
            px: 0.5,
          }}
        >
          <Typography
            variant="body1"
            sx={{ fontWeight: 600, color: "text.secondary" }}
          >
            Keypress
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: 600, color: "text.secondary" }}
          >
            Action
          </Typography>
        </Box>

        {/* keypress rows */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {keypresses.map((kp) => (
            <KeypressRow
              key={kp.key}
              kp={kp}
              onRemove={() => removeKeypress(nodeId, kp.key)}
              onActionChange={(action) =>
                setKeypressAction(nodeId, kp.key, action)
              }
              onTargetChange={(id, name) =>
                setKeypressTarget(nodeId, kp.key, id, name)
              }
            />
          ))}
        </Box>

        {/* add keypress button */}
        <Button
          startIcon={<AddIcon />}
          onClick={() => addKeypress(nodeId)}
          size="small"
          sx={{
            mt: 1.5,
            textTransform: "none",
            color: "primary.main",
            fontWeight: 500,
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: "primary.main", fontWeight: 500 }}
          >
            Add Keypress
          </Typography>
        </Button>

        <Divider sx={{ my: 2 }} />

        {/* ivr audio*/}
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
          IVR audio message
          <Box component="span" sx={{ color: "error.main", ml: 0.3 }}>
            *
          </Box>
        </Typography>

        {audioFile ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "8px",
              bgcolor: alpha(theme.palette.success.main, 0.06),
            }}
          >
            <AudioFileOutlinedIcon
              sx={{ color: "success.main", fontSize: "1.1rem" }}
            />
            <Typography
              variant="body1"
              sx={{ flex: 1, color: "text.primary" }}
              noWrap
            >
              {audioFile.name}
            </Typography>
            <IconButton size="small" onClick={() => setAudioFile(nodeId, null)}>
              <CloseIcon sx={{ fontSize: "0.85rem" }} />
            </IconButton>
          </Box>
        ) : (
          <Button
            variant="outlined"
            startIcon={<FileUploadOutlinedIcon />}
            onClick={() => audioInputRef.current?.click()}
            fullWidth
            size="small"
            sx={{ textTransform: "none", borderStyle: "dashed", py: 1 }}
          >
            <Typography variant="body1">Upload audio</Typography>
          </Button>
        )}

        {/* hidden */}
        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*"
          style={{ display: "none" }}
          onChange={handleAudioUpload}
        />
      </Box>
    </Box>
  );
}
