import { Box, Typography } from '@mui/material';

export default function ValueDisplay({ record }) {
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

    if (record.type === 'SOA') {
        return (
            <Box>
                <Typography variant="body2">
                    <strong>Primary NS:</strong> {record.primary ?? '—'}
                </Typography>
                <Typography variant="body2">
                    <strong>Admin:</strong> {record.admin ?? '—'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Serial: {record.serial ?? '—'} | Refresh: {record.refresh ?? '—'}s | Retry: {record.retry ?? '—'}s | Expire: {record.expire ?? '—'}s | Min: {record.minimum ?? '—'}s
                </Typography>
            </Box>
        );
    }

    return <Typography variant="body2">{record.value}</Typography>;
}