import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Stack,
    IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import DnsRecordRow from './DnsRecordRow';
import TableControls from './TableControl';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircleIcon from "@mui/icons-material/Circle";

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
    records: initialRecords = [],
    domain = '',
    onSaveAll,
    onRecordsChange,
    showHeader = true,
    isModal = false,
    customStyles = {},
    onClose,
}) {
    const [records, setRecords] = useState(initialRecords);
    const [editingRows, setEditingRows] = useState(new Set());
    const [active, setActive] = useState(false);

    const notifyChange = (updatedRecords) => {
        setRecords(updatedRecords);
        if (onRecordsChange) {
            onRecordsChange(updatedRecords);
        }
    };

    // Add new record
    const handleAddRecord = () => {
        const newRecord = {
            id: Date.now(),
            host: '',
            type: 'A',
            value: '',
            ttl: 1800,
            domain,
            isNew: true,
        };
        const updatedRecords = [...records, newRecord];
        notifyChange(updatedRecords);
        setEditingRows(new Set([...editingRows, newRecord.id]));
    };

    // Enable editing
    const handleEditRecord = (id) => {
        console.log("record edit", id);
        console.log("new Set([...editingRows, id])", new Set([...editingRows, id]));
        setEditingRows(new Set([...editingRows, id]));
    };

    // Cancel editing
    const handleCancelEdit = (id, isNew) => {
        if (isNew) {
            notifyChange(records.filter(r => r.id !== id));
        }
        const newEditingRows = new Set(editingRows);
        newEditingRows.delete(id);
        setEditingRows(newEditingRows);
    };

    // Save single record
    const handleSaveRecord = (id) => {
        const record = records.find(r => r.id === id);
        console.log('Saving record:', record);

        const newEditingRows = new Set(editingRows);
        newEditingRows.delete(id);
        setEditingRows(newEditingRows);

        notifyChange(records.map(r =>
            r.id === id ? { ...r, isNew: false } : r
        ));
    };

    // Delete record
    const handleDeleteRecord = (id) => {
        notifyChange(records.filter(r => r.id !== id));
        const newEditingRows = new Set(editingRows);
        newEditingRows.delete(id);
        setEditingRows(newEditingRows);
    };

    // Update field
    const handleFieldChange = (id, field, value) => {
        notifyChange(records.map(record =>
            record.id === id ? { ...record, [field]: value } : record
        ));
    };

    // Save all
    const handleSaveAll = () => {
        if (onSaveAll) {
            onSaveAll(records);
        } else {
            console.log('Saving all records:', records);
            alert('All records saved successfully!');
        }
        setEditingRows(new Set());
    };

    const isEditing = (id) => editingRows.has(id);

    return (
        <>
            <Box sx={{ ...customStyles.container }}>
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
                            Manage DNS records for {domain} • {records.length} records
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            variant="contained"
                            // onClick={handleAddRecord}
                            endIcon={<ExpandMoreIcon />}
                            sx={{ backgroundColor: "#5e7aaf", borderRadius: "15px" }}
                        >
                            Apply Preset
                        </Button>
                    </Box>
                </Box>
                {/* Header */}
                {showHeader && (
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddRecord}
                            >
                                Add Record
                            </Button>
                            {editingRows.size > 0 && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSaveAll}
                                >
                                    Save All ({editingRows.size})
                                </Button>
                            )}
                        </Box>
                    </Box>
                )}

                {isModal && (
                    <Box sx={{ mb: 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h4" component="h1" gutterBottom>
                                DNS Records
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage DNS records for iaaxin.com • {records.length} records
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton component="span" onClick={onclose} disabled={!onclose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                )}

                <TableControls />

                {/* Table */}
                <TableContainer component={Paper} elevation={customStyles.TableElevation}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{
                                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : '#f9f9fb',
                            }}>
                                <TableCell sx={{   fontWeight: 'bold', width: '25%' }}>
                                    Host
                                </TableCell>
                                <TableCell sx={{   fontWeight: 'bold', width: '10%' }}>
                                    Type
                                </TableCell>
                                <TableCell sx={{   fontWeight: 'bold', width: '32%' }}>
                                    Value
                                </TableCell>
                                <TableCell sx={{   fontWeight: 'bold', width: '15%' }}>
                                    Time To Live (TTL)
                                </TableCell>
                                <TableCell sx={{   fontWeight: 'bold', width: '18%' }} align="center">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {records.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                                            No DNS records yet. Click "Add Record" to create one.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                records.map((record) => (
                                    <DnsRecordRow
                                        key={record.id}
                                        record={record}
                                        isEditing={isEditing(record.id)}
                                        onEdit={() => handleEditRecord(record.id)}
                                        onSave={() => handleSaveRecord(record.id)}
                                        onCancel={() => handleCancelEdit(record.id, record.isNew)}
                                        onDelete={() => handleDeleteRecord(record.id)}
                                        onFieldChange={handleFieldChange}
                                    />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Footer Actions (if header hidden) */}
                {!showHeader && (
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAddRecord}
                        // sx={{ backgroundColor: "#4752eb" }}
                        >
                            Add Record
                        </Button>
                        {editingRows.size > 0 && (
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<SaveIcon />}
                                onClick={handleSaveAll}
                            >
                                Save All ({editingRows.size})
                            </Button>
                        )}
                    </Box>
                )}
            </Box>
        </>
    )
}