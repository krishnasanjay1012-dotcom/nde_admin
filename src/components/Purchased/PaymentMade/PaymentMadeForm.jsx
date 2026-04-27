import { Box, Typography, Tooltip, Chip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Controller, useWatch } from 'react-hook-form';
import {
    CommonCheckbox,
    CommonDatePicker,
    CommonDescriptionField,
    CommonRadioButton,
    CommonSelect,
    CommonTextField,
} from '../../common/fields';
import { useEffect, useRef, useState } from 'react';
import CommonPopoverWithArrow from '../../common/fields/NDE-PopoverWithArrow';
import {useGetUnpaidBillsByVendor } from '../../../hooks/purchased/bills-hooks';
import CommonVendorList from '../../common/NDE-Vendor-list';
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { InputAdornment, IconButton } from "@mui/material";
import ConfigurePaymentDialog from '../../Sales/Invoices/Payment/PaymentNumberDialog';
import { useInvoiceNumber } from '../../../hooks/payment-terms/payment-terms-hooks';
import UnpaidBillTable from './unpaidBill';
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useGetVendorInfo } from '../../../hooks/Vendor/Vendor-hooks';

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

const PaymentMadeForm = ({ control, errors, setValue, paymentOptions, depositeOptions, tdsTaxOptions, watch, register, isEditMode, existingPayment }) => {

    const fileInputRef = useRef(null);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [paymentAmounts, setPaymentAmounts] = useState({});
    const [openSettings, setOpenSettings] = useState(false);
    const [dateFilter, setDateFilter] = useState({
        startDate: '',
        endDate: ''
    });
    const [allBillsCache, setAllBillsCache] = useState({});
    const [reflectAnchorEl, setReflectAnchorEl] = useState(null);
    const [lastProcessedAmount, setLastProcessedAmount] = useState(null);

    const { data: paymentNumber } = useInvoiceNumber("payment");
    const invoiceNumber = paymentNumber?.counters?.[0]?.nextNumber;
    const invoicePrefix = paymentNumber?.counters?.[0]?.prefixString;
    const counterId = paymentNumber?.counters?.[0]?._id;

    const vendorId = useWatch({
        control,
        name: "vendorId"
    });
    const { data: vendor } = useGetVendorInfo(selectedVendor?._id, {
        enabled: !!selectedVendor?._id,
    });

    const vendorData = vendor?.data;

    const vendorSelected = !!vendorId;

    const amountPaid = useWatch({
        control,
        name: "amount"
    }) || "";

    const { data } = useGetUnpaidBillsByVendor(vendorId);

    const billsFromApi = Array.isArray(data?.data) ? data.data : [];
    const totalPendingAmount = data?.totalPendingAmount || 0;

    useEffect(() => {
        if (billsFromApi.length > 0) {
            setAllBillsCache(prev => {
                const newCache = { ...prev };
                billsFromApi.forEach(bill => {
                    newCache[bill.id] = bill;
                });
                return newCache;
            });
        }
    }, [billsFromApi]);

    const displayBills = (function () {
        const paidBillIds = Object.keys(paymentAmounts).filter(id => Number(paymentAmounts[id]) > 0);
        const paidBills = paidBillIds.map(id => allBillsCache[id]).filter(Boolean);
        const otherBills = billsFromApi.filter(bill => !paidBillIds.includes(bill.id));
        return [...paidBills, ...otherBills];
    })();

    const [paymentDates, setPaymentDates] = useState({});
    const [withholdingTaxes, setWithholdingTaxes] = useState({});
    const [selectedBills, setSelectedBills] = useState(new Set());

    const handlePaymentDateChange = (billId, date) => {
        setPaymentDates(prev => ({ ...prev, [billId]: date }));
    };

    const handleSelectBill = (billId, selected) => {
        setSelectedBills(prev => {
            const newSet = new Set(prev);
            if (selected) {
                newSet.add(billId);
            } else {
                newSet.delete(billId);
            }
            return newSet;
        });
    };

    const handleAmountReceivedUpdate = (totalSelectedAmount) => {
        setValue('amount', totalSelectedAmount);
    };

    const handleWithholdingTaxChange = (billId, value) => {
        const withholdingValue = value === '' ? 0 : Number(value);
        setWithholdingTaxes(prev => ({ ...prev, [billId]: value === '' ? '' : withholdingValue }));

        if (isFullAmount) {
            const bill = displayBills.find(b => b.id === billId);
            if (bill) {
                const balance = Number(bill.balance) || 0;
                const newPayment = Math.max(0, balance - withholdingValue);
                setPaymentAmounts(prev => ({ ...prev, [billId]: newPayment }));
            }
        }
    };

    const handlePaymentChange = (billId, value) => {
        setPaymentAmounts(prev => ({
            ...prev,
            [billId]: value === '' ? '' : Number(value),
        }));
    };

    const handleAttachmentsChange = (e) => {
        const files = Array.from(e.target.files);
        setAttachments((prev) => {
            const updated = [
                ...prev,
                ...files.map((file) => ({
                    file,
                    name: file.name,
                })),
            ];
            setValue("attachments", updated, { shouldDirty: true });
            return updated;
        });
    };

    const handleRemoveAttachment = (index) => {
        setAttachments((prev) => {
            const updated = prev.filter((_, i) => i !== index);
            setValue("attachments", updated, { shouldDirty: true });
            return updated;
        });
    };

    const handleClearApplied = () => {
        setPaymentAmounts({});
        setPaymentDates({});
        setWithholdingTaxes({});
    };

    const totalPaymentsApplied = Object.values(paymentAmounts).reduce(
        (sum, val) => sum + (Number(val) || 0),
        0
    );

    const handleReflectYes = () => {
        const amount = Number(amountPaid || 0);
        let remaining = amount;
        const updatedPayments = {};
        const sBills = new Set(selectedBills);

        displayBills.forEach((bill) => {
            if (remaining <= 0) {
                updatedPayments[bill.id] = 0;
                sBills.delete(bill.id);
                return;
            }
            const balance = Number(bill.balance) || 0;
            const withholdingValue = Number(withholdingTaxes[bill.id]) || 0;
            const netDue = Math.max(0, balance - withholdingValue);

            const payment = Math.min(remaining, netDue);
            updatedPayments[bill.id] = payment;
            if (payment > 0) {
                sBills.add(bill.id);
            }
            remaining -= payment;
        });

        setPaymentAmounts(updatedPayments);
        setSelectedBills(sBills);
        setReflectAnchorEl(null);
        setLastProcessedAmount(amount);
    };

    const handleReflectNo = () => {
        setLastProcessedAmount(Number(amountPaid || 0));
        setReflectAnchorEl(null);
    };

    const isFullAmount = watch("isFullAmount") || false;
    const hasBills = displayBills && displayBills?.length > 0;

    useEffect(() => {
        if (!isFullAmount) {
            const currentAmount = Number(amountPaid || 0);
            if (totalPaymentsApplied > currentAmount || (totalPaymentsApplied > 0 && currentAmount === 0)) {
                setValue("amount", totalPaymentsApplied || "");
            }
        }
    }, [totalPaymentsApplied, isFullAmount, setValue, amountPaid]);

    useEffect(() => {
        if (isEditMode) return;
        setPaymentAmounts({});
        setWithholdingTaxes({});
        setValue("amount", "");
        setValue("isFullAmount", false);
        setValue("sendEmailNotification", false);
        setValue("contact_persons", []);
    }, [vendorId, setValue, isEditMode]);


    useEffect(() => {
        if (!watch("payment_date")) {
            setValue("payment_date", new Date());
        }
    }, []);

    useEffect(() => {
        if (invoicePrefix && invoiceNumber) {
            setValue("paymentNo", `${invoicePrefix}${invoiceNumber}`);
        }
    }, [invoicePrefix, invoiceNumber, setValue]);

    useEffect(() => {
        const billsArray = Object.keys(paymentAmounts)
            .filter(id => Number(paymentAmounts[id]) > 0)
            .map(id => ({
                billId: id,
                applyDate: paymentDates[id] || new Date().toISOString().slice(0, 10),
                amountApplied: Number(paymentAmounts[id])
            }));
        setValue("bills", billsArray);
    }, [paymentAmounts, paymentDates, setValue]);

    useEffect(() => {
        if (vendorData?.currencyDetails?.code) {
            setValue("currency", vendorData.currencyDetails?.code);
        }
    }, [vendorData, setValue]);

    return (
        <Box display="flex" flexDirection="column">
            <Box sx={{
                bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                        ? "background.muted"
                        : "#f9f9fb",
                p: 2, borderRadius: 1, mb: 2
            }}>
                <FieldRow label="Vendor Name" isRedlabel>
                    <CommonVendorList
                        name="vendorId"
                        control={control}
                        setValue={setValue}
                        vendorData={watch("vendorId")}
                        rules={{ required: "Vendor is required" }}
                        placeholder="Select Vendor"
                        noLabel={true}
                        selectedVendor={vendorData}
                        onVendorSelect={(vendorObj) => {
                            setSelectedVendor(vendorObj);
                            setValue("vendorData", vendorObj);
                        }}
                    />
                </FieldRow>
            </Box>
            <Box sx={{ pointerEvents: vendorSelected ? 'auto' : 'none', opacity: vendorSelected ? 1 : 0.5, mx: 2 }}>
                <Box>
                    {/* Payment Made */}
                    <FieldRow label="Payment Made" isRedlabel>
                        <Controller
                            name="amount"
                            control={control}
                            render={({ field }) => (
                                <CommonTextField
                                    {...field}
                                    type="number"
                                    inputProps={{ min: 0, step: "1" }}
                                    mt={0}
                                    mb={1}
                                    error={!!errors.amount}
                                    helperText={errors.amount?.message}
                                    disabled={isFullAmount}
                                    onBlur={(e) => {
                                        field.onBlur();
                                        const val = Number(e.target.value);
                                        if (val > 0 && hasBills && val !== totalPaymentsApplied && val !== lastProcessedAmount) {
                                            setReflectAnchorEl(e.currentTarget);
                                        }
                                    }}
                                    startAdornment={
                                        <Controller
                                            name="currency"
                                            control={control}
                                            render={({ field }) => (
                                                <CommonTextField
                                                    {...field}
                                                    disabled
                                                    width='60px'
                                                    sx={{
                                                        bgcolor: (theme) =>
                                                            theme.palette.mode === "dark"
                                                                ? "background.muted"
                                                                : "#f9f9fb",
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
                        {hasBills && (
                            <Box mt={-1} ml={2}>
                                <CommonCheckbox
                                    label={`Pay full amount (₹${totalPendingAmount})`}
                                    checked={isFullAmount}
                                    {...register("isFullAmount")}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setValue("isFullAmount", checked);

                                        if (checked) {
                                            const updatedPayments = {};
                                            displayBills.forEach((bill) => {
                                                updatedPayments[bill.id] = Number(bill.balance) || 0;
                                            });
                                            setPaymentAmounts(updatedPayments);
                                            setValue("amount", totalPendingAmount);
                                        } else {
                                            setValue("amount", "");
                                            setPaymentAmounts({});
                                        }
                                    }}
                                />
                            </Box>
                        )}
                    </FieldRow>

                    {/* Payment Date */}
                    <FieldRow label="Payment Date" isRedlabel={true}>
                        <Controller
                            name="payment_date"
                            control={control}
                            render={({ field }) => (
                                <CommonDatePicker
                                    {...field}
                                    width="100%"
                                    mt={0} mb={1}
                                    error={!!errors.payment_date}
                                    helperText={errors.payment_date?.message}
                                />
                            )}
                        />
                    </FieldRow>

                    {/* Payment # */}
                    <FieldRow label="Payment #" isRedlabel={true}>
                        <Controller
                            name="paymentNo"
                            control={control}
                            render={({ field }) => (
                                <CommonTextField
                                    {...field}
                                    mt={0} mb={1}
                                    value={`${invoicePrefix}${invoiceNumber}`}
                                    error={!!errors.paymentNo}
                                    helperText={errors.paymentNo?.message}
                                    disabled
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                size="small"
                                                onClick={() => setOpenSettings(true)}
                                            >
                                                <SettingsOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            )}
                        />
                    </FieldRow>

                    <FieldRow label="Payment Mode">
                        <Controller
                            name="paymentModes"
                            control={control}
                            render={({ field }) => (
                                <CommonSelect
                                    {...field}
                                    mt={0} mb={1}
                                    options={paymentOptions}
                                />
                            )}
                        />
                    </FieldRow>

                    {/* Paid Through */}
                    <FieldRow label="Paid Through" isRedlabel>
                        <Controller
                            name="depositTo"
                            control={control}
                            render={({ field }) => (
                                <CommonSelect
                                    {...field}
                                    mt={0} mb={1}
                                    options={depositeOptions}
                                />
                            )}
                        />
                    </FieldRow>

                    {/* Reference# */}
                    <FieldRow label="Reference#">
                        <Controller
                            name="reference"
                            control={control}
                            render={({ field }) => <CommonTextField {...field} mt={0} mb={1} />}
                        />
                    </FieldRow>

                </Box>

                {/* Unpaid Bills Table */}
                <UnpaidBillTable
                    bills={displayBills}
                    paymentAmounts={paymentAmounts}
                    paymentDates={paymentDates}
                    onPaymentChange={handlePaymentChange}
                    onPaymentDateChange={handlePaymentDateChange}
                    onClearApplied={handleClearApplied}
                    totalPaymentsApplied={totalPaymentsApplied}
                    currencySymbol="₹"
                    isFullAmount={isFullAmount}
                    totalPendingAmount={totalPendingAmount}
                    amountReceived={Number(amountPaid)}
                    dateFilter={dateFilter}
                    onDateFilterChange={setDateFilter}
                />

                {/* Notes */}
                <Box mb={2} mt={2}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 500, mb: 1 }}>
                        Notes (Internal use. Not visible to vendor)
                    </Typography>
                    <Controller
                        name="notes"
                        control={control}
                        render={({ field, fieldState }) => (
                            <CommonDescriptionField
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                rows={2}
                                mb={0}
                            />
                        )}
                    />
                </Box>
                <Box>
                    <Typography sx={{ fontSize: '14px', fontWeight: 400, mb: 1 }}>
                        Attachments
                    </Typography>
                    <Box
                        onClick={() => fileInputRef.current?.click()}
                        sx={{
                            border: "1px dashed #ccc",
                            borderRadius: 1, p: 0.9,
                            display: "flex",
                            alignItems: "center", gap: 1, cursor: "pointer",
                            width: "fit-content",
                            mt: 1, mb: 1
                        }}
                    >
                        <AttachFileIcon fontSize="small" />
                        <Typography variant="caption">
                            Upload File
                        </Typography>
                    </Box>

                    <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        multiple
                        onChange={handleAttachmentsChange}
                    />
                    <Typography variant="caption" color="textSecondary" >
                        You can upload a maximum of 5 files, 10MB each
                    </Typography>

                    <Box mt={1}>
                        {attachments.map((file, idx) => (
                            <Chip
                                key={idx}
                                label={file.name}
                                onDelete={() => handleRemoveAttachment(idx)}
                                sx={{ mr: 1, mb: 1 }}
                            />
                        ))}
                    </Box>
                    {vendorData?.contact_persons?.length > 0 && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
                        <Controller
                            name="sendEmailNotification"
                            control={control}
                            defaultValue={false}
                            render={({ field }) => (
                                <CommonCheckbox
                                    label="Send a Payment Made email notification."
                                    checked={field.value}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        field.onChange(checked);
                                        if (checked && vendorData?.contact_persons) {
                                            const validContacts = vendorData.contact_persons
                                                .filter(c => c.email || c.name_details?.first_name || c.name_details?.last_name)
                                                .map(c => c._id);
                                            setValue("contact_persons", validContacts);
                                        } else {
                                            setValue("contact_persons", []);
                                        }
                                    }}
                                    sx={{ ml: -1 }}
                                />
                            )}
                        />

                        {watch("sendEmailNotification") && 
                         vendorData?.contact_persons?.some(c => c.email || c.name_details?.first_name || c.name_details?.last_name) && (
                            <Box sx={{ ml: 3, mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {vendorData.contact_persons
                                    .filter(c => c.email || c.name_details?.first_name || c.name_details?.last_name)
                                    .map((contact) => (
                                    <Box key={contact._id} sx={{ display: 'flex', alignItems: 'center', p: '1px 8px', border: '1px solid #D0D5DD', borderRadius: 1, height: 32 }}>
                                        <Controller
                                            name="contact_persons"
                                            control={control}
                                            defaultValue={[]}
                                            render={({ field }) => (
                                                <CommonCheckbox
                                                    label={contact.email || `${contact.name_details?.first_name || ''} ${contact.name_details?.last_name || ''}`.trim()}
                                                    checked={field.value?.includes(contact._id)}
                                                    onChange={(e) => {
                                                        const current = field.value || [];
                                                        const newValue = e.target.checked
                                                            ? [...current, contact._id]
                                                            : current.filter(id => id !== contact._id);
                                                        field.onChange(newValue);
                                                    }}
                                                    mr={0}
                                                    sx={{ ml: -1 }}
                                                />
                                            )}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                    )}
                </Box>
            </Box>

            <ConfigurePaymentDialog
                open={openSettings}
                onClose={() => setOpenSettings(false)}
                nextNumber={invoiceNumber}
                prefix={invoicePrefix}
                uniqueId={counterId}
                invoiceId={""}
                module="Payment"
            />
            <CommonPopoverWithArrow
                open={Boolean(reflectAnchorEl)}
                anchorEl={reflectAnchorEl}
                onClose={handleReflectNo}
                onConfirm={handleReflectYes}
                onCancel={handleReflectNo}
                title="Confirm"
                confirmLabel="Yes"
                cancelLabel="No"
                width={350}
            >
                <Typography variant='body1'>
                    Would you like this amount to be reflected in the Payment field?
                </Typography>
            </CommonPopoverWithArrow>
        </Box>
    );
};

export default PaymentMadeForm;
