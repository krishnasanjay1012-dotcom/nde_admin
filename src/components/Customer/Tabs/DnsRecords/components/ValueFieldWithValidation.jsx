import React from 'react';
import { Box, TextField, Select, FormControl, MenuItem, FormHelperText } from '@mui/material';
import { Controller } from "react-hook-form"
import { DNS_RECORD_TYPES, CAA_TAG_OPTIONS } from '../utils/constants';


export default function ValueFieldWithValidation({
   control, 
    errors, 
    recordType,
    recordId 
}) {
    const recordTypeConfig = DNS_RECORD_TYPES[recordType];

    if (recordType === 'CAA') {
        return (
            <>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* Flags */}
                    <Controller
                        name="flags"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                size="small"
                                type="number"
                                placeholder="0"
                                error={!!errors.flags}
                                sx={{ width: '80px', }}
                                inputProps={{ min: 0, max: 255 }}
                            />
                        )}
                    />

                    {/* Tag */}
                    <Controller
                        name="tag"
                        control={control}
                        render={({ field }) => (
                            <FormControl size="small" sx={{ width: '120px' }} error={!!errors.tag}>
                                <Select
                                    {...field}
                                >
                                    {CAA_TAG_OPTIONS.map(tag => (
                                        <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />

                    {/* Value */}
                    <Controller
                        name="value"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                size="small"
                                fullWidth
                                placeholder="letsencrypt.org"
                                error={!!errors.value}
                                // sx={{ backgroundColor: 'white' }}
                            />
                        )}
                    />
                </Box>
            </>
        )
    }

    if (recordType === 'MX') {
        return (
            <>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {/* Priority */}
                        <Controller
                            name="priority"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    size="small"
                                    type="number"
                                    placeholder="10"
                                    error={!!errors.priority}
                                    sx={{ width: '100px'}}
                                    inputProps={{ min: 0 }}
                                />
                            )}
                        />

                        {/* Value */}
                        <Controller
                            name="value"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    size="small"
                                    fullWidth
                                    placeholder={recordTypeConfig?.placeholder}
                                    error={!!errors.value}
                                    // sx={{ backgroundColor: 'white' }}
                                />
                            )}
                        />
                    </Box>

                    {/* Error Messages */}
                    {(errors.priority || errors.value) && (
                        <Box>
                            {errors.priority && (
                                <FormHelperText error sx={{ mt: 0 }}>
                                    Priority: {errors.priority.message}
                                </FormHelperText>
                            )}
                            {errors.value && (
                                <FormHelperText error sx={{ mt: 0 }}>
                                    Mail Server: {errors.value.message}
                                </FormHelperText>
                            )}
                        </Box>
                    )}
                </Box>
            </>
        )
    }

    if (recordType === 'HTTPS') {
        return (
            <>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Controller
                        name="port"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                size="small"
                                fullWidth
                                placeholder="_port"
                                error={!!errors.port}
                                helperText={errors.port?.message}
                                // sx={{ backgroundColor: 'white' }}
                            />
                        )}
                    />
                    <Controller
                        name="scheme"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                size="small"
                                fullWidth
                                placeholder="_scheme"
                                error={!!errors.scheme}
                                helperText={errors.scheme?.message}
                                // sx={{ backgroundColor: 'white' }}
                            />
                        )}
                    />
                    <Controller
                        name="value"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                size="small"
                                fullWidth
                                placeholder="hostname"
                                error={!!errors.value}
                                helperText={errors.value?.message}
                                // sx={{ backgroundColor: 'white' }}
                            />
                        )}
                    />
                    <Controller
                        name="parameters"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                size="small"
                                fullWidth
                                placeholder="parameters (optional)"
                                error={!!errors.parameters}
                                helperText={errors.parameters?.message}
                                // sx={{ backgroundColor: 'white' }}
                            />
                        )}
                    />
                </Box>
            </>
        )
    }

    if (recordType === 'SRV') {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* <Box sx={{ display: 'flex', gap: 1 }}> */}
                    <Controller
                        name="priority"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                size="small"
                                type="number"
                                placeholder="Priority"
                                error={!!errors.priority}
                                sx={{ width: '90px' }}
                            />
                        )}
                    />
                    <Controller
                        name="weight"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                size="small"
                                type="number"
                                placeholder="Weight"
                                error={!!errors.weight}
                                sx={{ width: '90px' }}
                            />
                        )}
                    />
                    <Controller
                        name="port"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                size="small"
                                type="number"
                                placeholder="Port"
                                error={!!errors.port}
                                sx={{ width: '80px' }}
                            />
                        )}
                    />
                    <Controller
                        name="value"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                size="small"
                                fullWidth
                                placeholder="target.example.com"
                                error={!!errors.value}
                                // sx={{ backgroundColor: 'white' }}
                            />
                        )}
                    />
                {/* </Box> */}

                {/* Error Messages */}
                {(errors.priority || errors.weight || errors.port || errors.value) && (
                    <Box>
                        {errors.priority && <FormHelperText error>Priority: {errors.priority.message}</FormHelperText>}
                        {errors.weight && <FormHelperText error>Weight: {errors.weight.message}</FormHelperText>}
                        {errors.port && <FormHelperText error>Port: {errors.port.message}</FormHelperText>}
                        {errors.value && <FormHelperText error>Target: {errors.value.message}</FormHelperText>}
                    </Box>
                )}
            </Box>
        );
    }

    return (
        <>
            <Controller
                name="value"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        size="small"
                        fullWidth
                        placeholder={recordTypeConfig?.placeholder}
                        error={!!errors.value}
                        helperText={errors.value?.message}
                        // sx={{ backgroundColor: 'white' }}
                        multiline={recordType === 'TXT'}
                        rows={recordType === 'TXT' ? 2 : 1}
                    />
                )}
            />
        </>
    )
}