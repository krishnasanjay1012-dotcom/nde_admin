import React, { useState, useRef } from 'react';
import {
    Box,
    Chip,
    Skeleton,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Stack,
    IconButton,
    Pagination,
    TableSortLabel,
    Grid,
    Card,
    CardContent,
    Divider,
    Menu,
    MenuItem,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import CircleIcon from "@mui/icons-material/Circle";
import AddIcon from '@mui/icons-material/Add';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DnsRecordRow from "./DnsRecordRow";
import TableControls from "./TableControl";
import { toast } from 'react-toastify';
import { useZoneRecords, useAddRecord, useUpdateRecord, useDeleteRecord, useBulkRecords, useAddPreset, usePresets, useUpdatePreset } from "../../../../../hooks/dns/useRecordshooks";
import { useTemplates } from "../../../../../hooks/dns/useDnshooks";
import Delete from "../../../../../assets/icons/delete.svg";
import Edit from "../../../../../assets/icons/edit.svg";
import PresetManagerDialog from "./PresetManagerDialog";
import SwitchTemplateDialog from "./SwitchTemplateDialog";
import { buildRecordName, buildContentByType, parseContentFields } from "../utils/constants";
import CommonButton from '../../../../common/NDE-Button';
import InlinePresetHeader from "./InlinePresetHeader";
import { useTheme } from "@mui/material/styles";

/**
 * Reusable DNS Records Table Component
 * @param {Array} records - Initial records data
 * @param {String} domain - Domain name (e.g., 'iaaxin.com')
 * @param {Function} onSaveAll - Callback when saving all records
 * @param {Function} onRecordsChange - Callback when records change
 * @param {Boolean} showHeader - Show/hide header section
 * @param {Object} customStyles - Custom styles
 * */


export default function DnsRecordsTable({
    domain = '',
    onSaveAll,
    ZONE_ID,
    onRecordsChange,
    showHeader = true,
    isModal = false,
    customStyles = {},
    onClose,
}) {
    // Locally-created new records (before any API save)
    const [newRecords, setNewRecords] = useState([]);
    // Which API record IDs are currently in inline-edit mode
    const [editingRows, setEditingRows] = useState(new Set());
    const [active, setActive] = useState(false);
    const [viewType, setViewType] = useState('List view');
    const [isPresetDialogOpen, setIsPresetDialogOpen] = useState(false);
    const [isSwitchTemplateOpen, setIsSwitchTemplateOpen] = useState(false);

    const [presetMenuAnchor, setPresetMenuAnchor] = useState(null);

    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: "",
        recordType: "",
        sortBy: "name",
        sortOrder: "asc"
    });
    const [bulkdata, setBulkData] = useState();
    const rowRefs = useRef({});

    // ── API data ──────────────────────────────────────────────────────────────
    const { data, isLoading, isError } = useZoneRecords(ZONE_ID, {
        ...filters,
        viewMode: viewType === 'Preset view' ? 'grid' : 'list'
    });

    const { data: templatesData } = useTemplates();
    // Logic to find the template_id matching activeTemplateName
    const activeTemplate = templatesData?.find(t => t.name === (data?.zone?.activeTemplate ?? data?.zone?.template));
    const template_id = activeTemplate?._id || null;
    const theme = useTheme();

    // Active template name shown in both view headers
    const activeTemplateName = data?.zone?.activeTemplate ?? data?.zone?.template ?? null;
    const apiRecords = data?.records?.data ?? [];
    // ── Mutations ─────────────────────────────────────────────────────────────
    const addRecord = useAddRecord();
    const updateRecord = useUpdateRecord();
    const deleteRecord = useDeleteRecord();
    const bulkRecords = useBulkRecords();

    // ── Pre-fetch presets for grouping ──
    const { data: presetData } = usePresets(ZONE_ID, template_id);
    const presetsList = presetData || [];

    // Native grouped records mapping for Preset view
    // The backend `viewMode=grid` returns `apiRecords` as an array of Preset Groups natively.
    // We just need to inject `newRecords` (locally added) into a virtual "Uncategorized" group.

    const renderGroups = React.useMemo(() => {
        if (viewType !== 'Preset view') return [];

        const groups = apiRecords.map(group => ({
            ...group,
            records: [...group.records]
        }));

        const newPresetRecords = [];
        const uncategorizedLocal = [];

        newRecords.forEach(nr => {
            if (nr.presetId === 'new_preset_local') {
                newPresetRecords.push(nr);
            } else if (nr.presetId) {
                const targetGroup = groups.find(g => String(g.presetId) === String(nr.presetId));
                if (targetGroup) {
                    targetGroup.records.push(nr);
                } else {
                    newPresetRecords.push(nr);
                }
            } else {
                uncategorizedLocal.push(nr);
            }
        });

        if (newPresetRecords.length > 0) {
            groups.unshift({
                presetId: newPresetRecords[0].presetId,
                presetName: newPresetRecords[0].presetName, // empty name triggers isNew mode dynamically
                records: newPresetRecords
            });
        }

        if (uncategorizedLocal.length > 0) {
            groups.push({
                presetId: uncategorizedLocal[0].presetId,
                presetName: uncategorizedLocal[0].presetName,
                records: uncategorizedLocal
            });
        }

        return groups;
    }, [apiRecords, newRecords, viewType]);

    // Total visible rows (for subtitle count) = api + pending new rows
    const totalCount = data?.records?.stats?.total;
    const pagination = data?.records?.pagination;
    const start =
        pagination ? (pagination.page - 1) * pagination.limit + 1 : 0;
    const end =
        pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : 0;

    const handleRequestSort = (property) => {
        const isAsc = filters.sortBy === property && filters.sortOrder === 'asc';
        setFilters((prev) => ({
            ...prev,
            sortBy: property,
            sortOrder: isAsc ? 'desc' : 'asc',
            page: 1, // Reset to the first page when sorting changes
        }));
    };

    const handleAddRecord = (presetId = null) => {
        const tempId = `new_local_${Date.now()}`;

        // Handle variant inputs for presetId (string for specific preset, or array for default)
        const finalPresetId = presetId === "new_preset_local"
            ? "new_preset_local"
            : Array.isArray(presetId)
                ? presetId[0]
                : (typeof presetId === "string" ? presetId : "");

        setNewRecords(prev => [{
            id: tempId,
            name: '',
            type: 'A',
            content: '',
            ttl: 3600,
            isNew: true,
            presetId: finalPresetId
        }, ...prev]);
        setEditingRows(prev => new Set(prev).add(tempId));

        if (finalPresetId !== "" && viewType === 'Preset view') {
            setViewType('Preset view');
        } else if (presetId === "new_preset_local") {
            setViewType('Preset view');
        }
    };

    const handleEditRecord = (id) => {
        setEditingRows(prev => new Set([...prev, id]));
    };

    const handleCancelEdit = (id, isNew) => {
        if (isNew) {
            setNewRecords(prev => prev.filter(r => r.id !== id));
        }
        setEditingRows(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const handleCancelAll = () => {
        setEditingRows(new Set());
        setNewRecords([]);
    }

    const handleSaveRecord = async (id, isNew, formData) => {
        if (isNew) {
            const payload = {
                name: buildRecordName(formData.host, domain),
                type: formData.type,
                content: buildContentByType(formData.type, formData),
                ttl: Number(formData.ttl) || 3600,
                presetId: formData.presetId || null,
                disabled: false,
                auth: true,
            };

            if (['MX'].includes(formData.type) && formData.priority !== undefined) {
                payload.prio = Number(formData.priority) || 0;
            }

            try {
                await addRecord.mutateAsync({ zoneId: ZONE_ID, payload });
                // On success: remove the local row — the query refetch will show the saved record
                setNewRecords(prev => prev.filter(r => r.id !== id));
                setEditingRows(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
            } catch (err) {
                console.error('Failed to add record:', err);
                // Keep the row open so the user can fix and retry
            }
            return;
        }

        // ── Existing API record: call PUT /zones/:zoneId/records/:recordId ──
        const payload = {
            name: buildRecordName(formData.host, domain),
            type: formData.type,
            content: buildContentByType(formData.type, formData),
            ttl: Number(formData.ttl) || 3600,
            presetId: formData.presetId || null,
            disabled: false,
            auth: true,
        };

        if (['MX'].includes(formData.type) && formData.priority !== undefined) {
            payload.prio = Number(formData.priority) || 0;
        }

        try {
            await updateRecord.mutateAsync({ zoneId: ZONE_ID, recordId: id, payload });
            // On success: exit edit mode — React Query refetch shows updated row
            setEditingRows(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        } catch (err) {
            console.error('Failed to update record:', err);
            // Keep the row open so the user can fix and retry
        }
    };

    const handleDeleteLocalRecord = (id) => {
        setNewRecords(prev => prev.filter(r => r.id !== id));
        setEditingRows(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const handleDeleteApiRecord = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
            await deleteRecord.mutateAsync({ zoneId: ZONE_ID, recordId: id });
            // toast.success("Record deleted successfully");
        } catch (err) {
            console.error('Failed to delete record:', err);
            // toast.error("Failed to delete record");
        }
    };

    const handleFieldChange = (id, field, value) => {
        setNewRecords(prev =>
            prev.map(r => r.id === id ? { ...r, [field]: value } : r)
        );
    };

    const handleSaveAll = async () => {
        if (bulkRecords.isPending) return;

        // Only process rows that are currently mounted and have a valid ref
        const activeIds = Array.from(editingRows).filter(id => rowRefs.current[id]);

        if (activeIds.length === 0) {
            console.log("No active rows to save (all unmounted).");
            setEditingRows(new Set());
            return;
        }

        const promises = activeIds.map(id => {
            const row = rowRefs.current[id];
            return row?.submit(true); // Pass true to indicate bulk mode
        });

        const results = await Promise.all(promises);
        const validRows = results.filter(Boolean); // Filter out rows that failed validation

        if (validRows.length === 0) {
            console.log("No valid rows to save or validation failed.");
            return;
        }

        // Map the validated form data into the backend expected format
        const records = validRows.map(formData => {
            const isDefault = formData.type === 'SOA' || formData.type === 'NS';

            const payload = {
                name: buildRecordName(formData.host, domain),
                type: formData.type,
                ttl: Number(formData.ttl) || 1800,
                content: buildContentByType(formData.type, formData),
                presetId: formData.presetId || null,
                disabled: false,
                isDefault,
            };

            // Include priority for MX and SRV
            if (['MX', 'SRV'].includes(formData.type) && formData.priority !== undefined) {
                payload.prio = Number(formData.priority);
            }

            if (formData.id && typeof formData.id === "string") {
                payload.id = formData.id;
            }

            return payload
        });

        try {
            const payload = {
                records
            }
            // console.log('Final Bulk Save Payload ready for API:', records);
            await bulkRecords.mutateAsync({ zoneId: ZONE_ID, payload });
            // toast.success("Bulk Records  Added successfully");
            setEditingRows(new Set());
            setNewRecords([]);
        } catch (error) {
            console.error('Failed to delete record:', error);
            // toast.error("Failed to delete record");
        }
    };

    const isEditing = (id) => editingRows.has(id);


    const renderSkeletonRow = (i) => (
        <TableRow key={`sk-${i}`}>
            {[25, 10, 35, 15, 15].map((w, j) => (
                <TableCell key={j}>
                    <Skeleton variant="text" width={`${w * 0.8}%`} height={24} />
                </TableCell>
            ))}
        </TableRow>
    );

    /**
     * Pre-parse a stored content string back into individual form fields
     * so the inline-edit inputs are pre-filled correctly per record type.
     */
    // const parseContentFields = (type, content = '', prio) => {
    //     const parts = content.split(' ');
    //     switch (type) {
    //         case 'MX':
    //             return { value: content, priority: prio ?? 10 };
    //         case 'SRV': {
    //             // format: <weight> <priority> <port> <target>
    //             const [weight, priority, port, ...rest] = parts;
    //             return { weight, priority, port, value: rest.join(' ') };
    //         }
    //         case 'CAA': {
    //             // format: <flags> <tag> "<value>"
    //             const [flags, tag, ...rest] = parts;
    //             return { flags, tag, value: rest.join(' ').replace(/"/g, '') };
    //         }
    //         case 'SOA': {
    //             // format: <primary> <admin> <serial> <refresh> <retry> <expire> <minimum>
    //             const [primary, admin, serial, refresh, retry, expire, minimum] = parts;
    //             return { primary, admin, serial, refresh, retry, expire, minimum, value: content };
    //         }
    //         default:
    //             return { value: content };
    //     }
    // };

    const renderApiRow = (rec) => {
        if (isEditing(rec.id)) {
            const extra = parseContentFields(rec.type, rec.content, rec.prio);
            const rowRecord = {
                id: rec.id,
                host: rec.name?.replace(/\.$/, '') ?? '',
                type: rec.type,
                value: extra.value ?? rec.content ?? '',
                ttl: rec.ttl ?? 1800,
                priority: extra.priority ?? rec.prio ?? undefined,
                // SRV
                weight: extra.weight,
                port: extra.port,
                // CAA
                flags: extra.flags,
                tag: extra.tag,
                // SOA
                primary: extra.primary,
                admin: extra.admin,
                serial: extra.serial,
                refresh: extra.refresh,
                retry: extra.retry,
                expire: extra.expire,
                minimum: extra.minimum,
                domain,
                presetId: rec.presetId || "",
            };
            return (
                <DnsRecordRow
                    key={rec.id}
                    zoneId={ZONE_ID}
                    record={rowRecord}
                    isEditing={true}
                    isSaving={updateRecord.isPending}
                    onEdit={() => handleEditRecord(rec.id)}
                    onSave={(formData) => handleSaveRecord(rec.id, false, formData)}
                    bulkvalue={setBulkData}
                    onCancel={() => handleCancelEdit(rec.id, false)}
                    onDelete={() => handleDeleteApiRecord(rec.id)}
                    onFieldChange={handleFieldChange}
                    ref={(el) => (rowRefs.current[rec.id] = el)}
                    template_id={template_id}
                />
            );
        }

        return (
            <TableRow key={rec.id} hover>
                <TableCell>
                    <Typography variant="body1" fontWeight={500}>
                        {rec.name ?? '—'}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Chip
                        label={rec.type}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 700 }}
                    />
                </TableCell>

                <TableCell>
                    <Typography
                        variant="body1"
                        sx={{ wordBreak: 'break-all', color: 'text.secondary' }}
                    >
                        {rec.prio != null ? (
                            <><strong>Priority {rec.prio}</strong> · {rec.content}</>
                        ) : (
                            rec.content ?? '—'
                        )}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography variant="body1">{rec.ttl}s</Typography>
                </TableCell>

                <TableCell align="center">
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditRecord(rec.id)}
                        sx={{ mr: 0.5 }}
                    >
                        <img src={Edit} style={{ height: 15, filter: theme.palette.mode === "dark" ? "invert(1)" : "invert(0)" }} sx={{ color: "icon.default" }} />
                    </IconButton>
                    <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteApiRecord(rec.id)}
                        disabled={deleteRecord.isPending}
                    >
                        <img src={Delete} style={{ height: 20, filter: theme.palette.mode === "dark" ? "invert(1)" : "invert(0)" }} sx={{ color: "icon.default" }} />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    };

    /** Inline-edit row for a locally-added new record */
    const renderNewRow = (rec) => (
        <DnsRecordRow
            key={rec.id}
            zoneId={ZONE_ID}
            record={rec}
            isEditing={true}
            isSaving={addRecord.isPending}
            onEdit={() => { }}
            onSave={(formData) => handleSaveRecord(rec.id, true, formData)}
            bulkvalue={setBulkData}
            onCancel={() => handleCancelEdit(rec.id, true)}
            onDelete={() => handleDeleteLocalRecord(rec.id)}
            onFieldChange={handleFieldChange}
            ref={(el) => (rowRefs.current[rec.id] = el)}
            template_id={template_id}
        />
    );

    return (
        <>
            <Box sx={{ ...customStyles.container }}>
                {/* Title bar */}
                <Box sx={{ my: 1.5, display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Box sx={{ display: 'flex', gap: 3 }}>
                            <Typography variant="h5" fontWeight="bold">
                                DNS Records
                            </Typography>

                            <Stack direction="row" alignItems="center" spacing={1}>
                                <IconButton onClick={() => setActive(!active)} sx={{ p: 0 }}>
                                    <CircleIcon
                                        sx={{
                                            color: active ? "success.main" : "error.main",
                                            fontSize: 16,
                                        }}
                                    />
                                </IconButton>
                                <Typography
                                    variant="body2"
                                    sx={{ color: active ? "success.main" : "error.main", fontWeight: 500 }}
                                >
                                    {active ? "Active" : "Inactive"}
                                </Typography>
                            </Stack>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Manage DNS records for {domain}
                            {!isLoading && !isError && ` • ${totalCount} records`}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <CommonButton
                            label="Switch Template"
                            variant="outlined"
                            startIcon={<SwapHorizIcon sx={{ color: "primary.main", }} />}
                            onClick={() => setIsSwitchTemplateOpen(true)}
                        />
                        <CommonButton
                            label="Manage Presets"
                            variant="outlined"
                            onClick={(e) => setPresetMenuAnchor(e.currentTarget)}
                            startIcon={null}
                        />
                        <Menu
                            anchorEl={presetMenuAnchor}
                            open={Boolean(presetMenuAnchor)}
                            onClose={() => setPresetMenuAnchor(null)}
                            PaperProps={{ sx: { minWidth: 200 } }}
                        >
                            <MenuItem onClick={() => {
                                setPresetMenuAnchor(null);
                                handleAddRecord('new_preset_local');
                            }}>
                                <AddIcon fontSize="small" sx={{ mr: 1, color: "primary.main", }} />
                                <Typography variant="body2" fontWeight="bold" color="primary">Add New Preset</Typography>
                            </MenuItem>
                            {presetsList.length > 0 && <Divider />}
                            {presetsList.map(preset => (
                                <MenuItem key={preset._id} onClick={() => {
                                    setPresetMenuAnchor(null);
                                    setViewType('Preset view');
                                    setTimeout(() => {
                                        document.getElementById(`preset-group-${preset._id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }, 100);
                                }}>
                                    <Typography variant="body2">{preset.name}</Typography>
                                </MenuItem>
                            ))}
                            <Divider />
                            {/* <MenuItem onClick={() => {
                                setPresetMenuAnchor(null);
                                setIsPresetDialogOpen(true);
                            }}>
                                <Typography variant="body2">Open Dialog Editor</Typography>
                            </MenuItem> */}
                        </Menu>
                    </Box>
                </Box>

                {/* Header: Add Record + Save All */}
                {showHeader && (
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <CommonButton
                                label="Add Record"
                                variant="contained"
                                onClick={handleAddRecord}
                                disabled={isLoading}
                            />
                            {editingRows.size > 0 && (
                                <CommonButton
                                    label={`Save All (${editingRows.size})`}
                                    variant="contained"
                                    startIcon={<SaveIcon sx={{ color: "icon.default" }} />}
                                    onClick={handleSaveAll}
                                    loading={bulkRecords.isPending}
                                />
                            )}
                        </Box>
                    </Box>
                )}

                {/* Modal header variant */}
                {isModal && (
                    <Box sx={{ mb: 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h4" component="h1" gutterBottom>
                                DNS Records
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage DNS records for {domain} • {totalCount} records
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton component="span" onClick={onClose} disabled={!onClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                )}

                <TableControls filters={filters} setFilters={setFilters} totalRecords={data?.records?.stats?.total} viewType={viewType} setViewType={setViewType} />

                {/* Shared logic for Preset View */}
                {viewType === 'Preset view' && (
                    <Box sx={{ mt: 3 }}>
                        {isLoading ? (
                            <Grid container spacing={3}>
                                <Grid item xs={12} sx={{ width: "100%" }}>
                                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                        <CardContent>
                                            <Skeleton width="100%" height={32} sx={{ mb: 2 }} />
                                            <TableContainer>
                                                <Table size="small">
                                                    <TableBody>
                                                        {Array.from({ length: 5 }).map((_, i) => renderSkeletonRow(i))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        ) : isError ? (
                            <Box sx={{ py: 4, textAlign: 'center' }}>
                                <Card variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" color="error">
                                            No records found.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        ) : !renderGroups || renderGroups.length === 0 ? (
                            <Box sx={{ py: 4, textAlign: 'center' }}>
                                <Card variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" color="text.secondary">
                                            No records found.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        ) : (
                            <Grid container spacing={3}>
                                {renderGroups?.map((group, idx) => (
                                    <Grid item xs={12} key={group.presetId || idx} id={`preset-group-${group.presetId}`}>
                                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                            <CardContent>
                                                <InlinePresetHeader
                                                    zoneId={ZONE_ID}
                                                    group={group}
                                                    activeTemplateName={activeTemplateName}
                                                    isNew={group.presetId === 'new_preset_local'}
                                                    template_id={template_id}
                                                    onSuccess={(newPreset) => {
                                                        const realId = newPreset?._id || newPreset?.id || newPreset?.data?._id || newPreset?.preset?._id;
                                                        const realName = newPreset?.name || newPreset?.data?.name || newPreset?.preset?.name;

                                                        if (realId) {
                                                            setNewRecords(prev => prev.map(nr => nr.presetId === 'new_preset_local' ? { ...nr, presetId: realId, presetName: realName } : nr));
                                                        }
                                                    }}
                                                    onCancel={() => {
                                                        setNewRecords(prev => prev.map(nr => nr.presetId === 'new_preset_local' ? { ...nr, presetId: '' } : nr));
                                                        setEditingRows(new Set());
                                                        setNewRecords([]);
                                                    }}
                                                />
                                                <Divider sx={{ mb: 2 }} />
                                                {group.records.length === 0 ? (
                                                    <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="body2" color="text.secondary">No records in this preset.</Typography>
                                                        {group.presetId && group.presetId !== 'uncategorized_local' && (
                                                            <CommonButton
                                                                label="Add Record"
                                                                variant="outlined"
                                                                size="small"
                                                                onClick={() => handleAddRecord(group.presetId)}
                                                            />
                                                        )}
                                                    </Box>
                                                ) : (
                                                    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #eee", borderRadius: 2 }}>
                                                        <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
                                                            <TableHead>
                                                                <TableRow sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : '#f9f9fb', }}>
                                                                    <TableCell sx={{ fontWeight: 'bold', width: '25%', }}>Name</TableCell>
                                                                    <TableCell sx={{ fontWeight: 'bold', width: '13%' }}>Type</TableCell>
                                                                    <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>Value</TableCell>
                                                                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>TTL</TableCell>
                                                                    <TableCell sx={{ fontWeight: 'bold', width: '18%' }} align="center">
                                                                        Actions
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {group.records.map(rec => rec.isNew ? renderNewRow(rec) : renderApiRow(rec))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                )}

                {/* Table */}
                {viewType === 'List view' && (
                    <TableContainer component={Paper} sx={customStyles.scroll ?? 0}>
                        <Table stickyHeader>
                            <TableHead>
                                {/* Template name banner row for List view */}
                                {activeTemplateName && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            sx={{
                                                py: 0.75,
                                                px: 2,
                                                top: 0,
                                                zIndex: 11,
                                                position: 'sticky',
                                                borderBottom: '1px solid #dde3f5',
                                                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : '#f0f4ff',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                    Active Template:
                                                </Typography>
                                                <Chip
                                                    label={activeTemplateName}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                    sx={{ fontWeight: 700, fontSize: 12 }}
                                                />
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                                <TableRow sx={{
                                    bgcolor: (theme) =>
                                        theme.palette.mode === 'dark' ? 'background.paper' : '#f9f9fb',
                                }}>
                                    <TableCell sx={{ bgcolor: 'inherit', fontWeight: 'bold', width: '23%', fontSize: 16, top: activeTemplateName ? 41 : 0, zIndex: 10, position: "sticky" }}>
                                        <TableSortLabel
                                            active={filters.sortBy === "name"}
                                            direction={filters.sortBy === "name" ? filters.sortOrder : "asc"}
                                            onClick={() => handleRequestSort("name")}
                                        >
                                            Name
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ bgcolor: 'inherit', fontWeight: 'bold', width: '10%', fontSize: 16, top: activeTemplateName ? 41 : 0, zIndex: 10, position: "sticky" }}>
                                        <TableSortLabel
                                            active={filters.sortBy === "type"}
                                            direction={filters.sortBy === "type" ? filters.sortOrder : "asc"}
                                            onClick={() => handleRequestSort("type")}
                                        >
                                            Type
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ bgcolor: 'inherit', fontWeight: 'bold', width: '35%', fontSize: 16, top: activeTemplateName ? 41 : 0, zIndex: 10, position: "sticky" }}>
                                        <TableSortLabel
                                            active={filters.sortBy === "content"}
                                            direction={filters.sortBy === "content" ? filters.sortOrder : "asc"}
                                            onClick={() => handleRequestSort("content")}
                                        >
                                            Value
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ bgcolor: 'inherit', fontWeight: 'bold', width: '14%', fontSize: 16, top: activeTemplateName ? 41 : 0, zIndex: 10, position: "sticky" }}>
                                        <TableSortLabel
                                            active={filters.sortBy === "ttl"}
                                            direction={filters.sortBy === "ttl" ? filters.sortOrder : "asc"}
                                            onClick={() => handleRequestSort("ttl")}
                                        >
                                            TTL
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ bgcolor: 'inherit', fontWeight: 'bold', width: '18%', fontSize: 16, top: activeTemplateName ? 41 : 0, zIndex: 10, position: "sticky" }} align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {/* Loading state */}
                                {isLoading && Array.from({ length: 5 }).map((_, i) => renderSkeletonRow(i))}

                                {/* Error state */}
                                {isError && !isLoading && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography variant="body1" color="error" sx={{ py: 4 }}>
                                                No records found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* Empty state */}
                                {!isLoading && !isError && apiRecords.length === 0 && newRecords.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                                                No records found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* API records (read-mode or inline-edit) */}
                                {!isLoading && !isError && apiRecords.map((rec) => renderApiRow(rec))}

                                {/* Locally-added new rows (always in inline-edit mode) */}
                                {newRecords.map((rec) => renderNewRow(rec))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {!showHeader && (
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <CommonButton
                            label="Add Record"
                            variant="contained"
                            onClick={() => handleAddRecord(presetsList.map(p => p._id))}
                            disabled={isLoading}
                        />
                        <Box sx={{ display: "flex", gap: 2 }}>
                            {editingRows.size > 0 && (
                                <>
                                    <CommonButton
                                        label="Cancel"
                                        variant="contained"
                                        startIcon={<CancelIcon sx={{ color: "icon.light" }} />}
                                        onClick={handleCancelAll}
                                    />
                                    <CommonButton
                                        label={`Save All (${editingRows.size})`}
                                        variant="contained"
                                        startIcon={<SaveIcon sx={{ color: "icon.light" }} />}
                                        onClick={handleSaveAll}
                                    />
                                </>
                            )}
                        </Box>
                    </Box>
                )}

                {apiRecords.length > 0 && data?.records?.pagination && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: "center", mt: 3, mb: 1, gap: 4, pr: 1 }}>
                        <Typography variant="body3" color="text.secondary" sx={{ fontWeight: 500, letterSpacing: 0.2 }}>
                            <strong>{start}-{end}</strong> of{" "}
                            <strong>{pagination.total}</strong> records
                        </Typography>
                        <Pagination
                            count={data.records.pagination.pages}
                            page={filters.page}
                            onChange={(e, newPage) => setFilters(prev => ({ ...prev, page: newPage }))}
                            color="primary"
                            shape="rounded"
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                )}
            </Box >

            {/* Dialog for Managing Presets */}
            < PresetManagerDialog
                open={isPresetDialogOpen}
                onClose={() => setIsPresetDialogOpen(false)
                }
                zoneId={ZONE_ID}
                template_id={template_id}
            />

            {/* Dialog for Switching Template */}
            < SwitchTemplateDialog
                open={isSwitchTemplateOpen}
                onClose={() => setIsSwitchTemplateOpen(false)}
                zoneId={ZONE_ID}
                currentTemplate={data?.zone?.activeTemplate ?? data?.zone?.template ?? ''}
            />
        </>
    )
}