import { useUpdatePreset, useAddPreset } from '../../../../../hooks/dns/useRecordshooks';;
import { Box, TextField, IconButton, Typography, Chip, CircularProgress } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import Edit from "../../../../../assets/icons/edit.svg";
import { useState, useEffect } from "react";
import CommonTextField from '../../../../common/fields/NDE-TextField';


export default function InlinePresetHeader({ group, zoneId, activeTemplateName, template_id, isNew, onCancel, onSuccess }) {
    const { mutateAsync: updatePreset, isPending: isUpdating } = useUpdatePreset();
    const { mutateAsync: addPreset, isPending: isAdding } = useAddPreset();
    const isPending = isUpdating || isAdding;
    const [isEditing, setIsEditing] = useState(isNew || false);
    const [presetName, setPresetName] = useState(group?.presetName || "");

    useEffect(() => {
        if (!isEditing && !isNew) {
            setPresetName(group?.presetName || "");
        }
    }, [group?.presetName, isEditing, isNew]);

    const handleSave = async () => {
        if (!presetName.trim()) {
            setIsEditing(false);
            if (isNew && onCancel) onCancel();
            return;
        }

        if (!isNew && presetName === group.presetName) {
            setIsEditing(false);
            return;
        }

        try {
            if (isNew) {
                const newpreset = await addPreset({
                    payload: {
                        name: presetName.trim(),
                        description: 'Added inline',
                        zoneId,
                        template_name: activeTemplateName,
                        template_id: template_id
                    }
                });
                if (onSuccess) onSuccess(newpreset?.data);
            } else {
                await updatePreset({ presetId: group.presetId, payload: { name: presetName.trim(), template_id: template_id, template_name: activeTemplateName, zoneId, } });
            }
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to save preset", err);
            toast.error(err?.response?.data?.message || "Failed to save preset");
        }
    };

    const handleCancelClick = () => {
        if (isNew && onCancel) {
            onCancel();
        } else {
            setIsEditing(false);
            setPresetName(group.presetName);
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isEditing ? (
                    <CommonTextField
                        size="small"
                        placeholder="Preset Name"
                        value={presetName}
                        onChange={e => setPresetName(e.target.value)}
                        disabled={isPending}
                        autoFocus
                        onKeyDown={e => {
                            if (e.key === 'Enter') handleSave();
                            if (e.key === 'Escape') handleCancelClick();
                        }}
                    />
                ) : (
                    <Typography variant="h6">{group?.presetName || "Uncategorized"}</Typography>
                )}

                {/* Edit Actions */}
                {group?.presetId && group?.presetId !== 'uncategorized_local' && !isEditing && !isNew && (
                    <IconButton size="small" onClick={() => setIsEditing(true)} sx={{ color: "blue" }}>
                        <EditIcon  sx={{ color: "icon.default" ,fontSize:"16px" }}/>
                    </IconButton>
                )}
                {isEditing && (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton size="small" color="success" onClick={handleSave} disabled={isPending}>
                            {isPending ? <CircularProgress  sx={{ color: "icon.default",fontSize:"18px" }}/> : <CheckIcon  sx={{ color: "icon.default",fontSize:"18px" }}/>}
                        </IconButton>
                        <IconButton size="small" onClick={handleCancelClick} disabled={isPending}>
                            <CloseIcon fontSize="small" sx={{ color: "icon.default",fontSize:"18px" }}/>
                        </IconButton>
                    </Box>
                )}
            </Box>

            {activeTemplateName && !isNew && (
                <Chip
                    label={`Template: ${activeTemplateName}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600, fontSize: 11 }}
                />
            )}
        </Box>
    );
};