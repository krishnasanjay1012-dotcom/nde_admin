import CustomerDropdownList from '../../Sales/Invoices/Components/CustomerDropdownList'
import { Box, Typography } from '@mui/material'
import { Controller } from 'react-hook-form'
import { CommonCheckbox, CommonDatePicker, CommonDescriptionField, CommonRadioButton, CommonSelect, CommonTextField } from '../../common/fields'

const styles = {
    container: {
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        marginBottom: '15px',
        color: '#333',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        backgroundColor: '#f7f8fa',
        borderBottom: '1px solid #e6e6e6',
        fontSize: '16px',
        color: '#333',
    },
    filter: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: '#555',
    },
    svg: {
        width: '16px',
        height: '16px',
        fill: '#555',
    },
    clearBtn: {
        color: '#0066cc',
        fontSize: '14px',
        textDecoration: 'none',
        cursor: 'pointer',
    },
    tableContainer: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '0',
    },
    th: {
        padding: '12px 15px',
        textAlign: 'left',
        backgroundColor: '#f7f8fa',
        fontWeight: '500',
        fontSize: '14px',
        color: '#555',
        borderBottom: '1px solid #e6e6e6',
    },
    td: {
        padding: '12px 15px',
        borderBottom: '1px solid #e6e6e6',
        fontSize: '14px',
        color: '#333',
    },
    noData: {
        textAlign: 'center',
        padding: '40px 0',
        color: '#555',
        fontSize: '14px',
    },
    footerNote: {
        padding: '10px 20px',
        fontSize: '12px',
        color: '#555',
        borderTop: '1px solid #e6e6e6',
    },
    total: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#333',
        borderTop: '1px solid #e6e6e6',
    },
    summaryBox: {
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#f7f8fa',
        borderRadius: '4px',
        float: 'right',
        width: '300px',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        fontSize: '14px',
    },
    excessWarning: {
        color: '#d32f2f',
        fontWeight: '500',
    },
};

const Invoicepayment = ({ control, errors }) => {

    return (
        <Box display="flex" flexDirection="column">
            <Box>
                <CustomerDropdownList
                    control={control}
                    errors={errors}
                />
            </Box>

            <Box display="flex" flexWrap="wrap" gap={2}>
                <Box flexBasis={{ xs: "100%", md: "48%" }} display="flex" flexDirection="column" >
                    <Controller
                        name="amountreceived"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                name={field.name}
                                {...field}
                                label="Amount Received"
                                value={field.value}
                                onChange={field.onChange}
                                type="number"
                                inputProps={{
                                    min: 0,
                                    step: "1",
                                }}
                                mandatory
                                error={!!errors.amountreceived}
                                helperText={errors.amountreceived?.message}
                                startAdornment={
                                    <Controller
                                        name="currency"
                                        control={control}
                                        defaultValue="INR"
                                        render={({ field: currencyField }) => (
                                            <CommonSelect
                                                name={currencyField.name}
                                                value={currencyField.value}
                                                onChange={currencyField.onChange}
                                                options={[
                                                    { label: "INR", value: "INR" },
                                                    { label: "USD", value: "USD" },
                                                    { label: "EUR", value: "EUR" },
                                                    { label: "GBP", value: "GBP" },
                                                ]}
                                                sx={{
                                                    backgroundColor: "#f9f9fb",
                                                    marginLeft: "-14px",
                                                    marginTop: "15px",
                                                    "& .MuiSelect-select": {
                                                        padding: "5px 8px",
                                                        fontSize: "12px",
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                }
                            />
                        )}
                    />

                    {/* Bank Charges */}
                    <Controller
                        name="bankcharge"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                name={field.name}
                                label="Bank Charges (if any)"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    {/* Payment Date */}
                    <Controller
                        name="paymentdate"
                        control={control}
                        render={({ field }) => (
                            <CommonDatePicker
                                {...field}
                                label="Payment Date"
                                width="100%"
                                mandatory
                                error={!!errors.paymentdate}
                                helperText={errors.paymentdate?.message}
                            />
                        )}
                    />

                    <Controller
                        name="payment"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                name={field.name}
                                label="Payment #"
                                value={field.value}
                                onChange={field.onChange}
                                mandatory
                                error={!!errors.payment}
                                helperText={errors.payment?.message}
                            />
                        )}
                    />

                </Box>

                {/* RIGHT COLUMN */}
                <Box flexBasis={{ xs: "100%", md: "48%" }} display="flex" flexDirection="column">

                    {/* Payment Mode */}
                    <Controller
                        name="paymentmode"
                        control={control}
                        render={({ field }) => (
                            <CommonSelect
                                name={field.name}
                                label="Payment Mode"
                                value={field.value}
                                onChange={field.onChange}
                                options={[
                                    { label: "Bank Remittance", value: "bank_remittance" },
                                    { label: "Bank Transfer", value: "bank_transfer" },
                                    { label: "Cash", value: "cash" },
                                    { label: "Check", value: "check" },
                                    { label: "Credit Card", value: "credit_card" },
                                    { label: "Netbanking", value: "netbanking" },
                                    { label: "Razorpay", value: "razorpay" },
                                ]}
                            />
                        )}
                    />

                    {/* Deposit To */}
                    <Controller
                        name="deposit"
                        control={control}
                        render={({ field }) => (
                            <CommonSelect
                                name={field.name}
                                label="Deposit To"
                                value={field.value}
                                onChange={field.onChange}
                                options={[
                                    { label: "KVB", value: "kvb" },
                                    { label: "IOB", value: "iob" },
                                ]}
                            />
                        )}
                    />

                    {/* Reference # */}
                    <Controller
                        name="reference"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                name={field.name}
                                label="Reference #"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    {/* Tax Deducted */}
                    <Box >
                        <Typography >
                            Tax deducted?
                        </Typography>
                    </Box>
                    <Box flexGrow={1}>
                        <CommonRadioButton
                            type="controller"
                            control={control}
                            name="customerType"
                            options={[
                                { value: "No Tax deducted", label: "No Tax deducted" },
                                { value: "tds", label: "Yes, TDS (Income Tax)" },
                            ]}
                            sxRadio={{ color: "#1976d2" }}
                            sxLabel={{ fontSize: "14px" }}
                        />
                    </Box>
                </Box>
            </Box>

            {/* Unpaid Invoices Table - Full Width */}
            <Box sx={styles.container} mt={2}>
                {/* Header */}
                <Box sx={styles.header}>
                    <span>Unpaid Invoices</span>
                    <Box sx={styles.filter}>
                        <svg style={styles.svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14h2V5h12V3zm-7 14H9v-2h3v2zm0-4H9V7h3v6z" />
                        </svg>
                        <span>Filter by Date Range</span>
                    </Box>
                    <a style={styles.clearBtn}>
                        Clear Applied Amount
                    </a>
                </Box>

                {/* Table */}
                <Box sx={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Invoice Number</th>
                                <th style={styles.th}>Invoice Amount</th>
                                <th style={styles.th}>Amount Due</th>
                                <th style={styles.th}>Payment Received On</th>
                                <th style={styles.th}>Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="6" style={styles.noData}>
                                    There are no unpaid invoices associated with this customer.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Box>

                {/* Footer Note */}
                <Box sx={styles.footerNote}>
                    **List contains only SENT invoices
                </Box>

                {/* Total Row */}
                <Box sx={styles.total}>
                    <span>Total</span>
                    <span>₹ 0.00</span>
                </Box>

                {/* Summary Box */}
                <Box sx={styles.summaryBox}>
                    <Box sx={styles.summaryRow}>
                        <span>Amount Received:</span>
                        <span>0.00</span>
                    </Box>
                    <Box sx={styles.summaryRow}>
                        <span>Amount used for Payments:</span>
                        <span>0.00</span>
                    </Box>
                    <Box sx={styles.summaryRow}>
                        <span>Amount Refunded:</span>
                        <span>0.00</span>
                    </Box>
                    <Box sx={{ ...styles.summaryRow, ...styles.excessWarning }}>
                        ⚠️ <span>Amount in Excess:</span>
                        <span>₹ 0.00</span>
                    </Box>
                </Box>
            </Box>

            {/* Notes - Full Width */}
            <Box mb={2} mt={2}>
                <Typography style={{ fontSize: "14px", fontWeight: 500, marginBottom: 1 }}>
                    Notes (Internal use. Not visible to customer)
                </Typography>
                <Controller
                    name="notes"
                    control={control}
                    render={({ field, fieldState }) => (
                        <CommonDescriptionField
                            {...field}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            width="100%"
                            height={50}
                            paddingTop="50px"
                        />
                    )}
                />
            </Box>

            {/* Email Checkbox - Full Width */}
            <Box>
                <Controller
                    name="emailcheckbox"
                    control={control}
                    render={({ field }) => (
                        <CommonCheckbox
                            label={`Email a "Thank you" note for this payment`}
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            sx={{
                                mb: 0,
                                borderTop: '1px solid #ebeaf2',
                                borderBottom: '1px solid #ebeaf2',
                                borderRadius: '6px',
                                backgroundColor: '#fff',
                                margin: '0 10px 10px 0'
                            }}
                            width="100%"
                            height="65px"
                        />
                    )}
                />
            </Box>
        </Box>
    )
}

export default Invoicepayment