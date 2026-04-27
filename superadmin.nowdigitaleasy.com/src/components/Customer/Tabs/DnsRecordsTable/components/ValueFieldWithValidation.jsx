import { Box, FormHelperText } from '@mui/material';
import { Controller } from "react-hook-form"
import { DNS_RECORD_TYPES, CAA_TAG_OPTIONS } from '../utils/constants';
import { removeTrailingDot } from "../utils/dnsValidationSchema"
import CommonTextField from '../../../../common/fields/NDE-TextField';
import CommonSelect from '../../../../common/fields/NDE-Select';

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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {/* Flags */}
                    <Controller
                        name="flags"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                {...field}
                                size="small"
                                type="number"
                                placeholder="0"
                                mt={0}
                                mb={0}
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
                            <CommonSelect
                                options={CAA_TAG_OPTIONS}
                                {...field}
                                size="small"
                                fullWidth
                                mt={0}
                                mb={0}
                                sx={{ width: '120px' }}
                                placeholder="Tag"
                                error={!!errors.tag}
                                helperText={errors.tag?.message}
                            />
                        )}
                    />

                    {/* Value */}
                    <Controller
                        name="value"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                {...field}
                                size="small"
                                mt={0}
                                mb={0}
                                fullWidth
                                placeholder="letsencrypt.org"
                                error={!!errors.value}
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
                                <CommonTextField
                                    {...field}
                                    size="small"
                                    type="number"
                                    mt={0}
                                    mb={0}
                                    placeholder="10"
                                    width="100px"
                                    error={!!errors.priority}
                                    inputProps={{ min: 0 }}
                                />
                            )}
                        />

                        {/* Value */}
                        <Controller
                            name="value"
                            control={control}
                            render={({ field }) => (
                                <CommonTextField
                                    {...field}
                                    size="small"
                                    fullWidth
                                    mt={0}
                                    mb={0}
                                    placeholder={recordTypeConfig?.placeholder}
                                    error={!!errors.value}
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
                            <CommonTextField
                                {...field}
                                size="small"
                                fullWidth
                                mt={0}
                                mb={0}
                                placeholder="_port"
                                error={!!errors.port}
                                helperText={errors.port?.message}
                            />
                        )}
                    />
                    <Controller
                        name="scheme"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                {...field}
                                size="small"
                                fullWidth
                                mt={0}
                                mb={0}
                                placeholder="_scheme"
                                error={!!errors.scheme}
                                helperText={errors.scheme?.message}
                            />
                        )}
                    />
                    <Controller
                        name="value"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                {...field}
                                size="small"
                                fullWidth
                                mt={0}
                                mb={0}
                                placeholder="hostname"
                                error={!!errors.value}
                                helperText={errors.value?.message}
                            />
                        )}
                    />
                    <Controller
                        name="parameters"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                {...field}
                                size="small"
                                fullWidth
                                mt={0}
                                mb={0}
                                placeholder="parameters (optional)"
                                error={!!errors.parameters}
                                helperText={errors.parameters?.message}
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
                        <CommonTextField
                            {...field}
                            size="small"
                            type="number"
                            mt={0}
                            mb={0}
                            placeholder="Priority"
                            error={!!errors.priority}
                            width='120px'
                        />
                    )}
                />
                <Controller
                    name="weight"
                    control={control}
                    render={({ field }) => (
                        <CommonTextField
                            {...field}
                            size="small"
                            type="number"
                            mt={0}
                            mb={0}
                            placeholder="Weight"
                            error={!!errors.weight}
                            width='120px'
                        />
                    )}
                />
                <Controller
                    name="port"
                    control={control}
                    render={({ field }) => (
                        <CommonTextField
                            {...field}
                            size="small"
                            type="number"
                            mt={0}
                            mb={0}
                            placeholder="Port"
                            error={!!errors.port}
                            width='120px'
                        />
                    )}
                />
                <Controller
                    name="value"
                    control={control}
                    render={({ field }) => (
                        <CommonTextField
                            {...field}
                            size="small"
                            fullWidth
                            mt={0}
                            mb={0}
                            placeholder="target.example.com"
                            error={!!errors.value}
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

    if (recordType === 'SOA') {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Controller
                        name="primary"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                {...field}
                                size="small"
                                fullWidth
                                mt={0}
                                mb={0}
                                placeholder="Primary NS"
                                error={!!errors.primary}
                                helperText={errors.primary?.message}
                            />
                        )}
                    />
                    <Controller
                        name="admin"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                {...field}
                                size="small"
                                fullWidth
                                mt={0}
                                mb={0}
                                placeholder="Admin Email"
                                error={!!errors.admin}
                                helperText={errors.admin?.message}
                            />
                        )}
                    />
                </Box>

                <Controller
                    name="serial"
                    control={control}
                    render={({ field }) => (
                        <CommonTextField
                            {...field}
                            size="small"
                            type="number"
                            mt={0}
                            mb={0}
                            placeholder="Serial"
                            error={!!errors.serial}
                            helperText={errors.serial?.message || 'Format: YYYYMMDDnn'}
                            inputProps={{ min: 0 }}
                        />
                    )}
                />

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Controller
                        name="refresh"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                {...field}
                                size="small"
                                type="number"
                                mt={0}
                                mb={0}
                                placeholder="Refresh"
                                // error={!!errors.refresh}
                                // helperText={errors.refresh?.message}
                                inputProps={{ min: 0 }}
                            />
                        )}
                    />
                    <Controller
                        name="retry"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                {...field}
                                size="small"
                                type="number"
                                mt={0}
                                mb={0}
                                placeholder="Retry"
                                // error={!!errors.retry}
                                // helperText={errors.retry?.message}
                                inputProps={{ min: 0 }}
                            />
                        )}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Controller
                        name="expire"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                {...field}
                                size="small"
                                type="number"
                                mt={0}
                                mb={0}
                                placeholder="Expire"
                                // error={!!errors.expire}
                                // helperText={errors.expire?.message}
                                inputProps={{ min: 0 }}
                            />
                        )}
                    />
                    <Controller
                        name="minimum"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                {...field}
                                size="small"
                                type="number"
                                mt={0}
                                mb={0}
                                placeholder="Min TTL"
                                // error={!!errors.minimum}
                                // helperText={errors.minimum?.message}
                                inputProps={{ min: 0 }}
                            />
                        )}
                    />
                </Box>

                {/* Error Messages */}
                {(errors.refresh || errors.retry || errors.expire || errors.minimum) && (
                    <Box>
                        {errors.refresh && <FormHelperText error sx={{ mt: 0 }}>Refresh: {errors.refresh.message}</FormHelperText>}
                        {errors.retry && <FormHelperText error sx={{ mt: 0 }}>Retry: {errors.retry.message}</FormHelperText>}
                        {errors.expire && <FormHelperText error sx={{ mt: 0 }}>Expire: {errors.expire.message}</FormHelperText>}
                        {errors.minimum && <FormHelperText error sx={{ mt: 0 }}>Min TTL: {errors.minimum.message}</FormHelperText>}
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
                    <CommonTextField
                        {...field}
                        size="small"
                        fullWidth
                        mt={0}
                        mb={0}
                        placeholder={recordTypeConfig?.placeholder}
                        error={!!errors.value}
                        helperText={errors.value?.message}
                        multiline={recordType === 'TXT'}
                        rows={recordType === 'TXT' ? 2 : 1}
                    />
                )}
            />
        </>
    )
}