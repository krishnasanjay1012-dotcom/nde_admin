import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { Close as CloseIcon, Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { usePresets, useAddPreset, useUpdatePreset, useDeletePreset } from "../../../../../hooks/dns/useRecordshooks";
import { toast } from 'react-toastify';
import Delete from "../../../../../assets/icons/delete.svg";
import Edit from "../../../../../assets/icons/edit.svg";
import CommonDialog from "../../../../common/NDE-Dialog";
import CommonTextField from "../../../../common/fields/NDE-TextField";
import CommonButton from "../../../../common/NDE-Button";


export default function PresetManagerDialog({ open, onClose, zoneId, template_id }) {
  const { data, isLoading } = usePresets(zoneId, template_id);
  const presets = data || [];

  const addPresetMutation = useAddPreset();
  const updatePresetMutation = useUpdatePreset();
  const deletePresetMutation = useDeletePreset();

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const userId = "507f1f77bcf86cd79909011a"

  const handleCreate = async () => {
    if (!newName.trim()) return toast.error("Preset name is required");
    try {
      await addPresetMutation.mutateAsync({
        payload: { name: newName, description: newDesc, userId, zoneId },
      });
      toast.success("Preset created successfully");
      setNewName("");
      setNewDesc("");
      onClose();
    } catch (err) {
      toast.error("Failed to create preset");
    }
  };

  const handleEditClick = (preset) => {
    setEditingId(preset._id);
    setEditName(preset.name);
    setEditDesc(preset.description || "");
  };

  const handleUpdate = async () => {
    if (!editName.trim()) return toast.error("Preset name is required");
    try {
      await updatePresetMutation.mutateAsync({
        presetId: editingId,
        payload: { name: editName, description: editDesc, zoneId },
      });
      toast.success("Preset updated successfully");
      setEditingId(null);
      onClose();
    } catch (err) {
      toast.error("Failed to update preset");
    }
  };

  const handleDelete = async (presetId) => {
    if (!window.confirm("Delete this preset? Records inside will be uncategorized.")) return;
    try {
      await deletePresetMutation.mutateAsync({ presetId, zoneId });
      toast.success("Preset deleted successfully");
    } catch (err) {
      toast.error("Failed to delete preset");
    }
  };

  return (
    <>
      <CommonDialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        title="Manage Presets"
        hideSubmit={true}
        hideCancle={true}
      >
        {/* Create new preset */}
        <Box sx={{ mb: 3, flexDirection: "column", gap: 1, alignItems: "flex-end" }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Preset</Typography>
          <Box display="flex" gap={1} mb={2}>
            <CommonTextField
              size="small"
              // label="Name"
              placeholder="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              fullWidth
            />
            <CommonTextField
              size="small"
              // label="Description (Optional)"
              placeholder="Description (Optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              fullWidth
            />
          </Box>
          <CommonButton
            label={'Create'}
            variant="contained"
            size="small"
            onClick={handleCreate}
            disabled={addPresetMutation.isPending || !newName.trim()}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* List presets */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress size={24} />
          </Box>
        ) : presets.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center" py={2}>
            No presets found.
          </Typography>
        ) : (
          <List>
            {presets.map((preset) => (
              <ListItem
                key={preset._id}
                disablePadding
                sx={{ mb: 1, border: "1px solid #eee", borderRadius: 1, p: 1 }}
              >
                {editingId === preset._id ? (
                  <Box display="flex" flexDirection="column" gap={1} width="100%">
                    <Box display="flex" gap={1}>
                      <CommonTextField
                        size="small"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        fullWidth
                      />
                      <CommonTextField
                        size="small"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        fullWidth
                      />
                    </Box>
                    <Box display="flex" justifyContent="flex-end" gap={1}>
                      <IconButton size="small" onClick={() => setEditingId(null)}>
                        <CancelIcon sx={{ color: "icon.default", fontSize: "18px" }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={handleUpdate}
                        disabled={updatePresetMutation.isPending}
                      >
                        <SaveIcon sx={{ color: "icon.default", fontSize: "18px" }} />
                      </IconButton>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <ListItemText
                      primary={preset.name}
                      secondary={preset.description || "No description"}
                    />
                    <Box>
                      <IconButton size="small" color="primary" onClick={() => handleEditClick(preset)}>
                        <img src={Edit} style={{ height: 18 }} />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(preset._id)} disabled={deletePresetMutation.isPending}>
                        <img src={Delete} style={{ height: 18 }} />
                      </IconButton>
                    </Box>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </CommonDialog>
    </>
  );
}
