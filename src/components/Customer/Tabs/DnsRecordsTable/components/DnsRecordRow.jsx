import { useEffect, forwardRef, useImperativeHandle } from 'react';
import {
    Box,
    IconButton,
    Typography,
    TableCell,
    TableRow,
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
import { usePresets } from '../../../../../hooks/dns/useRecordshooks';
import CommonTextField from '../../../../common/fields/NDE-TextField';
import CommonSelect from '../../../../common/fields/NDE-Select';
import CommonButton from '../../../../common/NDE-Button';
import ValueDisplay from "./ValueDisplay";

const DnsRecordRow = forwardRef(({
    record,
    isEditing,
    isSaving = false,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    onFieldChange,
    bulkvalue,
    zoneId,
    template_id
}, ref) => {
    const { data: presetData } = usePresets(zoneId, template_id);
    const presets = presetData || [];

    // console.log(record.host && record.domain
    //     ? record.host.replace(`.${record.domain}`, "").replace(record.domain, "")
    //     : "", "--------")
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        resolver: yupResolver(createDnsRecordSchema(record.type)),
        defaultValues: {
            ...record,
            presetId: record.presetId || "",
            host: record.host && record.domain
                ? record.host.replace(`.${record.domain}`, "").replace(record.domain, "")
                : "",
        },
        mode: 'onChange'
    })

    const watchedType = watch('type');
    const watchedPresetId = watch('presetId');

    useEffect(() => {
        if (isEditing && watchedPresetId !== record.presetId) {
            onFieldChange(record.id, 'presetId', watchedPresetId);
        }
    }, [watchedPresetId, isEditing, record.presetId, record.id, onFieldChange]);

    useEffect(() => {
        if (isEditing && watchedType !== record.type) {
            onFieldChange(record.id, 'type', watchedType);
        }
    }, [watchedType, isEditing, record.type, record.id, onFieldChange]);

    useEffect(() => {
        if (isEditing) {
            reset(record);
        }
    }, [isEditing, record, reset]);

    useImperativeHandle(ref, () => ({
        submit: (isBulk = false) => {
            return new Promise((resolve) => {
                handleSubmit(
                    async (data) => {
                        if (!isBulk) {
                            await onSubmit(data);
                        }
                        resolve({ id: record.id, ...data }); // Attach ID for bulk save mapping
                    },
                    (errors) => {
                        resolve(null);
                    }
                )();
            });
        }
    }));


    useEffect(() => {
        if (isEditing && watchedType !== (record.type || 'A')) {

            const newRecord = {
                ...record,
                type: watchedType,
                value: '',
                // SRV / MX
                priority: undefined,
                weight: undefined,
                // CAA
                flags: undefined,
                tag: undefined,
                // HTTPS
                port: undefined,
                scheme: undefined,
                parameters: undefined,
                // SOA
                primary: undefined,
                admin: undefined,
                serial: undefined,
                refresh: undefined,
                retry: undefined,
                expire: undefined,
                minimum: undefined,
            };
            if (bulkvalue) bulkvalue("bulk data");
            reset(newRecord);
            // onFieldChange(record.id, 'type', watchedType);
        }
    }, [watchedType, isEditing]);

    const onSubmit = async (data) => {
        Object.keys(data).forEach(key => {
            if (data[key] !== record[key]) {
                onFieldChange(record.id, key, data[key]);
            }
        });

        // Pass validated formData up so the parent can build the API payload
        await onSave(data);
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
                sx={{ '& > td': { verticalAlign: 'top', pt: 2 } }}
            >
                {/* host Field*/}
                <TableCell>
                    <Controller
                        name="host"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                value={field.value && record.domain ? field.value.replace(`.${record.domain}`, "").replace(record.domain, "") : ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                                inputRef={field.ref}
                                name={field.name}
                                mt={0}
                                mb={0}
                                // {...field}
                                size="small"
                                fullWidth
                                placeholder="@"
                                error={!!errors.host}
                                helperText={errors.host?.message || "e.g., @ or www"}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <Typography variant="body2" color="text.secondary">
                                            .{record.domain}
                                        </Typography>
                                    </InputAdornment>
                                }
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
                            <CommonSelect
                                options={Object.entries(DNS_RECORD_TYPES).map(([type, config]) => ({
                                    value: type,
                                    label: type,
                                }))}
                                mt={0}
                                mb={0}
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={field.onBlur}
                                inputRef={field.ref}
                                name={field.name}
                                {...field}
                                size="small"
                                fullWidth
                                error={!!errors.type}
                                helperText={errors.type?.message}
                            />
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

                {/* TTL and Preset Field */}
                <TableCell>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Controller
                            name="ttl"
                            control={control}
                            render={({ field }) => (
                                <CommonSelect
                                    options={TTL_OPTIONS}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    onBlur={field.onBlur}
                                    inputRef={field.ref}
                                    name={field.name}
                                    mt={0}
                                    mb={0}
                                    {...field}
                                    size="small"
                                    fullWidth
                                    error={!!errors.ttl}
                                    helperText={errors.ttl?.message || "e.g., @ or www"}
                                />
                            )}
                        />
                        <Controller
                            name="presetId"
                            control={control}
                            render={({ field }) => (
                                <CommonSelect
                                    options={presets.map((p) => ({
                                        value: p._id,
                                        label: p.name,
                                    }))}
                                    mt={0}
                                    mb={0}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    onBlur={field.onBlur}
                                    inputRef={field.ref}
                                    name={field.name}
                                    {...field}
                                    size="small"
                                    fullWidth
                                    error={!!errors.presetId}
                                    helperText={errors.presetId?.message || "Preset"}
                                />
                            )}
                        />
                    </Box>
                </TableCell>

                {/* Actions */}
                <TableCell align="center">
                    <CommonButton
                        label={isSaving ? 'Saving…' : (record.isNew ? 'Add' : 'Update')}
                        variant="contained"
                        size="small"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSaving}
                        sx={{ mr: 1 }}
                    />
                    <IconButton
                        size="small"
                        onClick={handleCancel}
                        color="error"
                        disabled={isSaving}
                    >
                        <CloseIcon sx={{ fontSize: '18px', color: "icon.error" }} />
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
                        <EditIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton color="error" size="small" onClick={onDelete}>
                        <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </TableCell>
            </TableRow>
        </>
    )
})

export default DnsRecordRow;

