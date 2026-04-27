import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Box, Typography, MenuItem, Select, FormControl, InputLabel,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Chip, Divider, CircularProgress, Alert, Stack, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PreviewIcon from '@mui/icons-material/Visibility';
import { useTemplates, usePreviewTemplate, useSwitchTemplate } from '../../../../../hooks/dns/useDnshooks';
import CommonButton from "../../../../common/NDE-Button";
import CommonSelect from '../../../../common/fields/NDE-Select';

// Category → colour chip mapping
const CATEGORY_COLORS = {
    DEFAULT: 'default',
    WEB_SERVER: 'primary',
    MAIL_SERVER: 'secondary',
    GOOGLE_WORKSPACE: 'success',
    CDN: 'warning',
    CUSTOM: 'secondary',
};

export default function SwitchTemplateDialog({ open, onClose, zoneId, currentTemplate }) {
    const [selectedTemplate, setSelectedTemplate] = useState(null);   // full template object
    const [previewRecords, setPreviewRecords] = useState([]);
    const [previewDone, setPreviewDone] = useState(false);
    const [missingVars, setMissingVars] = useState([]);

    // ── hooks ─────────────────────────────────────────────────────────────────
    const { data: templatesData, isLoading: loadingTemplates } = useTemplates({ isActive: true });
    const templates = templatesData ?? [];

    const previewMutation = usePreviewTemplate();
    const switchMutation = useSwitchTemplate();

    // ── handlers ──────────────────────────────────────────────────────────────
    const handleTemplateChange = (e) => {
        const tpl = templates.find(t => t._id === e.target.value) ?? null;
        setSelectedTemplate(tpl);
        setPreviewDone(false);
        setPreviewRecords([]);
        setMissingVars([]);
    };

    const handlePreview = async () => {
        if (!selectedTemplate) return;
        try {
            const res = await previewMutation.mutateAsync({
                zoneId,
                templateName: selectedTemplate.name,
            });
            setPreviewRecords(res?.records ?? []);
            setPreviewDone(true);
            setMissingVars([]);
        } catch (err) {
            const missing = err?.response?.data?.missing ?? [];
            if (missing.length > 0) {
                setMissingVars(missing);
                setPreviewDone(false);
            } else {
                toast.error(err?.response?.data?.message ?? 'Preview failed');
            }
        }
    };

    const handleSwitch = async () => {
        if (!selectedTemplate) return;
        try {
            await switchMutation.mutateAsync({
                zoneId,
                payload: {
                    templateName: selectedTemplate.name,
                    tempId: selectedTemplate._id,
                },
            });
            handleClose();
        } catch (err) {
            toast.error(err?.response?.data?.message ?? 'Template switch failed');
        }
    };

    const handleClose = () => {
        setSelectedTemplate(null);
        setPreviewDone(false);
        setPreviewRecords([]);
        setMissingVars([]);
        onClose();
    };

    // ── render ────────────────────────────────────────────────────────────────
    const isSameTemplate = selectedTemplate && selectedTemplate.name === currentTemplate;

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth={previewDone ? "md" : "sm"}
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        transition: "max-width 0.3s ease-in-out"
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <SwapHorizIcon color="primary" />
                            <Typography variant="h6" fontWeight={700}>Switch DNS Template</Typography>
                        </Stack>
                        <IconButton size="small" onClick={handleClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                    {currentTemplate && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Current template: <strong>{currentTemplate}</strong>
                        </Typography>
                    )}
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ pt: 2 }}>

                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        {/* <InputLabel id="tpl-select-label" shrink={false}>Select Template</InputLabel>
                        <Select
                            labelId="tpl-select-label"
                            value={selectedTemplate?._id ?? ''}
                            label="Select Template"
                            onChange={handleTemplateChange}
                            disabled={loadingTemplates}
                            notched={false}
                            renderValue={(selected) => {
                                if (!selected) {
                                    return <Typography color="text.disabled">Select Template</Typography>;
                                }
                                const tpl = templates.find(t => t._id === selected);
                                return tpl?.name || "";
                            }}
                        >
                            {loadingTemplates && (
                                <MenuItem disabled><em>Loading templates…</em></MenuItem>
                            )}
                            {templates.map(tpl => (
                                <MenuItem key={tpl._id} value={tpl._id}>
                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                        <Chip
                                            label={tpl.category}
                                            size="small"
                                            color={CATEGORY_COLORS[tpl.category] ?? 'default'}
                                            sx={{ fontWeight: 700, fontSize: 10 }}
                                        />
                                        <Typography variant="body2" fontWeight={500}>{tpl.name}</Typography>
                                        {tpl.name === currentTemplate && (
                                            <Chip label="current" size="small" variant="outlined" />
                                        )}
                                    </Stack>
                                </MenuItem>
                            ))}
                        </Select> */}
                        <CommonSelect
                            value={selectedTemplate?._id}
                            onChange={handleTemplateChange}
                            options={templates}
                            labelKey="name"
                            valueKey="_id"
                            placeholder="Select Template"
                            renderOption={(tpl) => (
                                <Box display="flex" alignItems="center" gap={1.5}>
                                    <Chip
                                        label={tpl.category}
                                        size="small"
                                        color={CATEGORY_COLORS[tpl.category] ?? "default"}
                                        sx={{ fontWeight: 700, fontSize: 10 }}
                                    />
                                    <Typography fontWeight={500}>{tpl.name}</Typography>
                                    {tpl.name === currentTemplate && (
                                        <Chip label="current" size="small" variant="outlined" />
                                    )}
                                </Box>
                            )}
                            renderValue={(tpl) => (
                                <Typography fontWeight={500}>{tpl?.name}</Typography>
                            )}
                        />
                    </FormControl>

                    {isSameTemplate && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            This is already the active template. Switching will reactivate its records.
                        </Alert>
                    )}

                    {missingVars.length > 0 && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            <Typography variant="body2" fontWeight={600} gutterBottom>
                                Missing required variables:
                            </Typography>
                            <ul style={{ margin: 0, paddingLeft: 16 }}>
                                {missingVars.map(v => (
                                    <li key={v.variable}>
                                        <Typography variant="body2">
                                            <strong>{v.variable}</strong>
                                            {v.description ? ` — ${v.description}` : ''}
                                        </Typography>
                                    </li>
                                ))}
                            </ul>
                        </Alert>
                    )}

                    {previewMutation.isPending && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                            <CircularProgress size={28} />
                        </Box>
                    )}

                    {previewDone && previewRecords.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                Preview — {previewRecords.length} records will be active after switch
                            </Typography>
                            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, maxHeight: 320, overflow: 'auto' }}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                            <TableCell sx={{ fontWeight: 700, width: '30%' }}>Name</TableCell>
                                            <TableCell sx={{ fontWeight: 700, width: '10%' }}>Type</TableCell>
                                            <TableCell sx={{ fontWeight: 700, width: '45%' }}>Value</TableCell>
                                            <TableCell sx={{ fontWeight: 700, width: '15%' }}>TTL</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {previewRecords.map((rec, i) => (
                                            <TableRow key={i} hover>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                                        {rec.name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={rec.type} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                                                        {rec.prio != null
                                                            ? <><strong>Priority {rec.prio}</strong> · {rec.content}</>
                                                            : rec.content}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{rec.ttl}s</Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Alert severity="warning" sx={{ mt: 2 }}>
                                Current active records will be <strong>deactivated</strong> and replaced with the records shown above.
                            </Alert>
                        </Box>
                    )}

                    {previewDone && previewRecords.length === 0 && (
                        <Alert severity="info">No records found for this template.</Alert>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <CommonButton
                        label={'Cancel'}
                        variant="outlined"
                        onClick={handleClose}
                        startIcon={null}
                        disabled={switchMutation.isPending}
                    />

                    {!previewDone && (
                        <CommonButton
                            label={'Preview Records'}
                            variant="contained"
                            startIcon={previewMutation.isPending ? <CircularProgress size={16} sx={{ color: "icon.light" }} /> : <PreviewIcon sx={{ fontSize: "18px", color: "icon.light" }} />}
                            onClick={handlePreview}
                            disabled={!selectedTemplate || previewMutation.isPending}
                        />
                    )}

                    {previewDone && (
                        <CommonButton
                            label={'Re-preview'}
                            startIcon={<PreviewIcon sx={{ fontSize: "18px", color: "icon.light" }} />}
                            onClick={handlePreview}
                            disabled={previewMutation.isPending}
                        />
                    )}

                    {previewDone && (
                        <CommonButton
                            label={switchMutation.isPending ? 'Switching…' : 'Confirm Switch'}
                            variant="contained"
                            startIcon={switchMutation.isPending ? <CircularProgress size={16} sx={{ color: "icon.light" }} /> : <SwapHorizIcon sx={{ fontSize: "18px", color: "icon.light" }} />}
                            onClick={handleSwitch}
                            disabled={switchMutation.isPending || isSameTemplate === false && !selectedTemplate}
                        />
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}
