import React, { useEffect } from 'react';
import {
    Button,
    IconButton,
    TextField,
    Select,
    FormControl,
    FormHelperText,
    Typography,
    TableCell,
    TableRow,
    MenuItem,
    InputAdornment,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { DNS_RECORD_TYPES, TTL_OPTIONS } from '../utils/constants';
import { createDnsRecordSchema } from '../utils/dnsValidationSchema';
import ValueFieldWithValidation from './ValueFieldWithValidation';

export default function DnsRecordRow({
    record,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    onFieldChange,
}) {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        resolver: yupResolver(createDnsRecordSchema(record.type)),
        defaultValues: record,
        mode: 'onChange'
    })

    const watchedType = watch('type');

    useEffect(() => {
        if (isEditing) {
            reset(record);
        }
    }, [isEditing, record, reset]);


    useEffect(() => {
        if (isEditing && watchedType !== record.type) {

            const newRecord = {
                ...record,
                type: watchedType,
                value: '', // Clear value
                priority: undefined,
                flags: undefined,
                tag: undefined,
                port: undefined,
                scheme: undefined,
                parameters: undefined,
                weight: undefined,
            };

            reset(newRecord);

            // Notify parent of type change
            onFieldChange(record.id, 'type', watchedType);
        }
    }, [watchedType, isEditing]);

    const onSubmit = (data) => {
        console.log('Valid data:', data);

        Object.keys(data).forEach(key => {
            if (data[key] !== record[key]) {
                onFieldChange(record.id, key, data[key]);
            }
        });

        onSave();
    }

    const handleCancel = () => {
        const formData = watch();
        const hasChanges = Object.keys(formData).some(
            key => formData[key] !== record[key]
        );

        if (hasChanges && !record.isNew) {
            const confirmCancel = window.confirm('Discard changes?');
            if (!confirmCancel) return;
        }

        reset(record);
        onCancel();
    };


    if (isEditing) {
        return (
            <TableRow
                component="tr"
                hover
            >
                {/* host Field*/}
                <TableCell>
                    <Controller
                        name="host"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                size="small"
                                fullWidth
                                placeholder="@"
                                error={!!errors.host}
                                helperText={errors.host?.message}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Typography variant="body2" color="text.secondary">
                                                .{record.domain}
                                            </Typography>
                                        </InputAdornment>
                                    ),
                                }}
                                // sx={{ backgroundColor: 'white' }}
                            />
                        )}
                    />
                </TableCell>

                {/* Type Field*/}
                <TableCell>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <FormControl size="small" fullWidth error={!!errors.type}>
                                <Select
                                    {...field}
                                    // sx={{ backgroundColor: 'white' }}
                                >
                                    {Object.entries(DNS_RECORD_TYPES).map(([type, config]) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.type && (
                                    <FormHelperText>{errors.type.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />
                </TableCell>

                {/* Value - Dynamic Component */}
                <TableCell>
                    <ValueFieldWithValidation
                        control={control}
                        errors={errors}
                        recordType={watchedType}
                        recordId={record.id}
                    />
                </TableCell>

                {/* TTL Field */}
                <TableCell>
                    <Controller
                        name="ttl"
                        control={control}
                        render={({ field }) => (
                            <FormControl size="small" fullWidth error={!!errors.ttl}>
                                <Select
                                    {...field}
                                    // sx={{ backgroundColor: 'white' }}
                                >
                                    {TTL_OPTIONS.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.ttl && (
                                    <FormHelperText>{errors.ttl.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />
                </TableCell>

                {/* Actions */}
                <TableCell align="center">
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleSubmit(onSubmit)}
                        sx={{  minWidth: '45px' }}
                    >
                        {record.isNew ? 'Add' : 'Update'}
                    </Button>
                    <IconButton
                        size="small"
                        onClick={handleCancel}
                        color="error"
                    >
                        <CloseIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
        )
    }

    // View Table 
    return (
        <>
            <TableRow hover>
                <TableCell>
                    <Typography variant="body2">
                        {record.host || '@'}
                        <Typography component="span" variant="body2" color="text.secondary">
                            .{record.domain}
                        </Typography>
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                        {record.type}
                    </Typography>
                </TableCell>
                <TableCell>
                    <ValueDisplay record={record} />
                </TableCell>
                <TableCell>
                    <Typography variant="body2">
                        {TTL_OPTIONS.find(opt => opt.value === record.ttl)?.label || `${record.ttl}s`}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <IconButton color="primary" size="small" onClick={onEdit} sx={{ mr: 1 }}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" size="small" onClick={onDelete}>
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
        </>
    )
}


function ValueDisplay({ record }) {
    if (record.type === 'CAA') {
        return (
            <Typography variant="body2">
                {record.flags ?? ''} {record.tag ?? ''} {record.value ?? ''}
            </Typography>
        );
    }

    if (record.type === 'MX') {
        return (
            <Typography variant="body2">
                {record.priority != null ? `Priority: ${record.priority} | ` : ''}{record.value ?? ''}
            </Typography>
        );
    }
    if (record.type === 'HTTPS') {
        return (
            <Box>
                {record.port && <Typography variant="body2">{record.port}</Typography>}
                {record.scheme && <Typography variant="body2">{record.scheme}</Typography>}
                <Typography variant="body2">{record.value}</Typography>
                {record.parameters && (
                    <Typography variant="body2" color="text.secondary">
                        {record.parameters}
                    </Typography>
                )}
            </Box>
        );
    }

    return <Typography variant="body2">{record.value}</Typography>;
}