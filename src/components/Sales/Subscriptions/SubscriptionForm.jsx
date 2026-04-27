import { Box, Typography, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useWatch } from 'react-hook-form';
import CommonCustomerList from '../../common/NDE-Common-Customer';


const FieldRow = ({ label, showInfo, children, isRedlabel = false }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', minWidth: 0, mb: 1 }}>
        <Box sx={{ width: '180px', flexShrink: 1, pt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 400,
                        color: isRedlabel ? '#D92D20' : '',
                        fontSize: '14px',
                    }}
                >
                    {label}
                    {isRedlabel && <span style={{ marginLeft: 2 }}>*</span>}
                </Typography>
                {showInfo && (
                    <Tooltip title={`More info about ${label?.toLowerCase()}`}>
                        <InfoOutlinedIcon sx={{ fontSize: 16, color: '#98A2B3', cursor: 'help' }} />
                    </Tooltip>
                )}
            </Box>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, maxWidth: 300 }}>{children}</Box>
    </Box>
);


const SubscriptionForm = ({ control, errors, setValue, paymentOptions, depositeOptions, tdsTaxOptions, currencyOptions, defaultCurrency, watch }) => {

    const customerId = useWatch({
        control,
        name: "customer_id"
    });
    const customerSelected = !!customerId?.value;

    const taxType = useWatch({
        control,
        name: "taxDeducted"
    });



    return (
        <Box display="flex" flexDirection="column">
            <Box sx={{
                bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                        ? "background.muted"
                        : "#f9f9fb"
                , p: 2, borderRadius: 1, mb: 2
            }}>
                <FieldRow label="Customer" isRedlabel>
                    <CommonCustomerList
                        name="customer_id"
                        control={control}
                        rules={{ required: "Customer is required" }}
                        width="300px"
                        label=''
                    />
                </FieldRow>
            </Box>
        </Box>
    );
};

export default SubscriptionForm;