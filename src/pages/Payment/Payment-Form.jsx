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
} from '../../components/common/fields';
import { useEffect, useRef, useState } from 'react';
import CommonPopoverWithArrow from '../../components/common/fields/NDE-PopoverWithArrow';
import { useGetCustomerInfo, useInvoicesByClient } from '../../hooks/Customer/Customer-hooks';
import CommonCustomerList from '../../components/common/NDE-Common-Customer';
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { InputAdornment, IconButton } from "@mui/material";
import ConfigurePaymentDialog from '../../components/Sales/Invoices/Payment/PaymentNumberDialog';
import { useInvoiceNumber } from '../../hooks/payment-terms/payment-terms-hooks';
import UnpaidInvoicesTable from './UnpaidInvoicesTable';
import AttachFileIcon from "@mui/icons-material/AttachFile";

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


const PaymentForm = ({ control, errors, setValue, paymentOptions, depositeOptions, tdsTaxOptions, watch, register, isEditMode, fetchPaymentDetail }) => {

    const fileInputRef = useRef(null);
    const [attachments, setAttachments] = useState([]);
    const [paymentAmounts, setPaymentAmounts] = useState({});
    const [openSettings, setOpenSettings] = useState(false);
    const [dateFilter, setDateFilter] = useState({
        startDate: '',
        endDate: ''
    });
    const [allInvoicesCache, setAllInvoicesCache] = useState({});
    const [reflectAnchorEl, setReflectAnchorEl] = useState(null);
    const [lastProcessedAmount, setLastProcessedAmount] = useState(null);

    const { data: paymentNumber } = useInvoiceNumber("payment");
    const invoiceNumber = paymentNumber?.counters?.[0]?.nextNumber;
    const invoicePrefix = paymentNumber?.counters?.[0]?.prefixString;
    const counterId = paymentNumber?.counters?.[0]?._id;

    const customerId = useWatch({
        control,
        name: "customer_id"
    });


    const { data: singleCustomer } = useGetCustomerInfo(
        customerId?.value,
        {
            enabled: !!customerId?.value,
        },
    );


    const customerData = customerId?.fullData;
    const worsapceId = customerId?.fullData.workspaceDetails?._id;

    const customerSelected = !!customerId?.value;

    const taxType = useWatch({
        control,
        name: "taxDeducted"
    });

    const amountReceived = useWatch({
        control,
        name: "amount"
    }) || "";

    const { data } = useInvoicesByClient({
        filter: "pending",
        workspace_Id: worsapceId,
        searchTerm: "",
        page: 1,
        limit: 10,
        date_filter: dateFilter.startDate && dateFilter.endDate ? "custom" : "",
        customStartDate: dateFilter.startDate,
        customEndDate: dateFilter.endDate,
        isRecordPayment: true
    });

    const invoicesFromApi = data?.data || [];
    const totalPendingAmount = data?.totalPendingAmount || 0;

    useEffect(() => {
        const newCache = { ...allInvoicesCache };
        let changed = false;

        if (invoicesFromApi.length > 0) {
            invoicesFromApi.forEach(inv => {
                if (!newCache[inv._id]) {
                    newCache[inv._id] = inv;
                    changed = true;
                }
            });
        }

        if (isEditMode && fetchPaymentDetail?.data?.invoices) {
            fetchPaymentDetail.data.invoices.forEach(inv => {
                const invoiceData = inv.invoiceId;
                if (invoiceData && invoiceData._id && !newCache[invoiceData._id]) {
                    newCache[invoiceData._id] = {
                        ...invoiceData,
                        invoiceId: invoiceData.invoiceNo || invoiceData.invoiceId
                    };
                    changed = true;
                }
            });
        }

        if (changed) {
            setAllInvoicesCache(newCache);
        }
    }, [invoicesFromApi, isEditMode, fetchPaymentDetail]);

    const displayInvoices = (function () {
        const paidInvoiceIds = Object.keys(paymentAmounts).filter(id => Number(paymentAmounts[id]) > 0);

        const paidInvoices = paidInvoiceIds.map(id => {
            const inv = allInvoicesCache[id];
            if (!inv) return null;

            if (isEditMode) {
                const originalInv = fetchPaymentDetail?.data?.invoices?.find(
                    (i) => (i.invoiceId?._id || i.invoiceId) === id
                );
                const originalApplied = Number(originalInv?.amountApplied) || 0;
                return {
                    ...inv,
                    balance: Number(inv.balance) + originalApplied,
                };
            }
            return inv;
        }).filter(Boolean);

        const otherInvoices = invoicesFromApi.filter(inv => !paidInvoiceIds.includes(String(inv._id)));

        return [...paidInvoices, ...otherInvoices];
    })();

    const [paymentDates, setPaymentDates] = useState({});
    const [withholdingTaxes, setWithholdingTaxes] = useState({});
    const [selectedInvoices, setSelectedInvoices] = useState(new Set());

    useEffect(() => {
        if (isEditMode && fetchPaymentDetail?.data) {
            const pData = fetchPaymentDetail.data;

            if (pData.invoices) {
                const invoiceDetails = pData.invoices;
                const pmAmts = {};
                const pmDates = {};
                const wTaxes = {};
                const sInvoices = new Set();

                invoiceDetails.forEach(inv => {
                    const invId = inv.invoiceId?._id || inv.invoiceId;
                    if (!invId) return;
                    pmAmts[invId] = Number(inv.amountApplied) || 0;
                    if (inv.applyDate) pmDates[invId] = new Date(inv.applyDate).toISOString().split('T')[0];
                    wTaxes[invId] = Number(inv.amountWithHeld) || '';
                    sInvoices.add(invId);
                });

                setPaymentAmounts(pmAmts);
                setPaymentDates(pmDates);
                setWithholdingTaxes(wTaxes);
                setSelectedInvoices(sInvoices);
            }

            if (pData.attachments && pData.attachments.length > 0) {
                setAttachments(pData.attachments.map(att => ({
                    name: att.fileName,
                    isExisting: true,
                    fileKey: att.fileKey,
                })));
            }
        }
    }, [isEditMode, fetchPaymentDetail]);

    const handlePaymentDateChange = (invoiceId, date) => {
        setPaymentDates(prev => ({ ...prev, [invoiceId]: date }));
    };

    const handleSelectInvoice = (invoiceId, selected) => {
        setSelectedInvoices(prev => {
            const newSet = new Set(prev);
            if (selected) {
                newSet.add(invoiceId);
            } else {
                newSet.delete(invoiceId);
            }
            return newSet;
        });
    };

    const handleAmountReceivedUpdate = (totalSelectedAmount) => {
        setValue('amount', totalSelectedAmount);
    };

    const handleWithholdingTaxChange = (invoiceId, value) => {
        const withholdingValue = value === '' ? 0 : Number(value);
        setWithholdingTaxes(prev => ({ ...prev, [invoiceId]: value === '' ? '' : withholdingValue }));

        if (isFullAmount) {
            const invoice = displayInvoices.find(inv => String(inv._id) === String(invoiceId));
            if (invoice) {
                const balance = Number(invoice.balance) || 0;
                const newPayment = Math.max(0, balance - withholdingValue);
                setPaymentAmounts(prev => ({ ...prev, [invoiceId]: newPayment }));
            }
        }
    };

    const handlePaymentChange = (invoiceId, value) => {
        setPaymentAmounts(prev => ({
            ...prev,
            [invoiceId]: value === '' ? '' : Number(value),
        }));
    };

    const handleAttachmentsChange = (e) => {
        const files = Array.from(e.target.files);
        const newAttachments = [
            ...attachments,
            ...files.map((file) => ({
                file,
                name: file.name,
            })),
        ].slice(0, 5); // Limit to 5 files
        setAttachments(newAttachments);
        setValue("attachments", newAttachments.map(a => a.file));
    };

    const handleRemoveAttachment = (index) => {
        const newAttachments = attachments.filter((_, i) => i !== index);
        setAttachments(newAttachments);
        setValue("attachments", newAttachments.map(a => a.file));
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
        const amount = Number(amountReceived || 0);
        let remaining = amount;
        const updatedPayments = {};
        const sInvoices = new Set(selectedInvoices);

        displayInvoices.forEach((inv) => {
            if (remaining <= 0) {
                updatedPayments[inv._id] = 0;
                sInvoices.delete(inv._id);
                return;
            }
            const balance = Number(inv.balance) || 0;
            const withholdingValue = Number(withholdingTaxes[inv._id]) || 0;
            const netDue = Math.max(0, balance - withholdingValue);

            const payment = Math.min(remaining, netDue);
            updatedPayments[inv._id] = payment;
            if (payment > 0) {
                sInvoices.add(inv._id);
            }
            remaining -= payment;
        });

        setPaymentAmounts(updatedPayments);
        setSelectedInvoices(sInvoices);
        setReflectAnchorEl(null);
        setLastProcessedAmount(amount);
    };

    const handleReflectNo = () => {
        setLastProcessedAmount(Number(amountReceived || 0));
        setReflectAnchorEl(null);
    };

    const isFullAmount = watch("isFullAmount") || false;
    const hasInvoices = displayInvoices && displayInvoices?.length > 0;

    const prevCustomerIdRef = useRef(customerId?.value);

    useEffect(() => {
        const currentId = customerId?.value;
        if (currentId && prevCustomerIdRef.current && currentId !== prevCustomerIdRef.current) {
            setPaymentAmounts({});
            setWithholdingTaxes({});
            setPaymentDates({});
            setAttachments([]);
            setSelectedInvoices(new Set());

            setValue("amount", "");
            setValue("bank_charges", "");
            setValue("isFullAmount", false);
            setValue("reference", "");
            setValue("notes", "");
            setValue("taxDeducted", "false");
            setValue("tdsTaxAccount", null);
            setValue("thankYouNoteSent", false);
            setValue("contact_persons", []);
            setValue("payment_date", new Date());
        }
        prevCustomerIdRef.current = currentId;
    }, [customerId?.value, setValue]);

    const tdsTaxAccountValue = watch("tdsTaxAccount");

    useEffect(() => {
        if (taxType === "true" && tdsTaxOptions?.length > 0 && !tdsTaxAccountValue) {
            setValue("tdsTaxAccount", tdsTaxOptions[0].value);
        }
    }, [taxType, setValue, tdsTaxOptions, tdsTaxAccountValue]);

    useEffect(() => {
        if (singleCustomer?.pan_no) {
            setValue("PAN", singleCustomer.pan_no, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    }, [singleCustomer, setValue]);

    useEffect(() => {
        if (!watch("payment_date")) {
            setValue("payment_date", new Date());
        }
    }, []);

    useEffect(() => {
        if (invoicePrefix && invoiceNumber && !isEditMode) {
            setValue("PaymentNo", `${invoicePrefix}${invoiceNumber}`);
        }
    }, [invoicePrefix, invoiceNumber, setValue, isEditMode]);

    useEffect(() => {
        if (customerData?.workspaceDetails?.currency) {
            setValue("currency", customerData.workspaceDetails.currency, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    }, [customerData, setValue]);

    const paymentDate = watch("payment_date");

    useEffect(() => {
        const invoicesPayload = Object.keys(paymentAmounts)
            .filter(id => Number(paymentAmounts[id]) > 0)
            .map(id => ({
                invoiceId: id,
                applyDate: paymentDates[id] || (paymentDate ? (typeof paymentDate === 'string' ? paymentDate.split('T')[0] : new Date(paymentDate).toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]),
                amountApplied: Number(paymentAmounts[id]),
                amountWithHeld: Number(withholdingTaxes[id]) || 0
            }));
        setValue("invoices", invoicesPayload);
    }, [paymentAmounts, paymentDates, withholdingTaxes, setValue, paymentDate]);


    return (
        <Box display="flex" flexDirection="column">
            <Box sx={{
                bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                        ? "background.muted"
                        : "#f9f9fb",
                p: 2, borderRadius: 1, mb: 2
            }}>
                <FieldRow label="Customer" isRedlabel>
                    <CommonCustomerList
                        name="customer_id"
                        control={control}
                        rules={{ required: "Customer is required" }}
                        width="300px"
                        label=''
                        customerData={singleCustomer}
                        disabled={isEditMode}
                    />
                </FieldRow>
                {singleCustomer?.pan_no && (
                    <Typography variant="body1" sx={{ ml: 23, mt: -2 }}>
                        PAN:
                        <Box component="span" sx={{ color: "primary.main", ml: 0.5 }}>
                            {singleCustomer?.pan_no}
                        </Box>
                    </Typography>
                )}
            </Box>
            <Box sx={{ pointerEvents: customerSelected ? 'auto' : 'none', opacity: customerSelected ? 1 : 0.5, mx: 2 }}>
                <Box>
                    {/* Amount Received */}
                    <FieldRow label="Amount Received" isRedlabel>
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
                                        if (!isEditMode && val > 0 && hasInvoices && val !== totalPaymentsApplied && val !== lastProcessedAmount) {
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
                                                    }}
                                                />
                                            )}
                                        />
                                    }
                                />
                            )}
                        />
                        {!isEditMode && hasInvoices && (
                            <Box mt={-1} ml={2}>
                                <CommonCheckbox
                                    label={`Received full amount (₹${totalPendingAmount})`}
                                    checked={isFullAmount}
                                    {...register("isFullAmount")}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setValue("isFullAmount", checked);

                                        if (checked) {
                                            const updatedPayments = {};
                                            displayInvoices.forEach((inv) => {
                                                const withholdingValue = Number(withholdingTaxes[inv._id]) || 0;
                                                const balance = Number(inv.balance) || 0;
                                                updatedPayments[inv._id] = Math.max(0, balance - withholdingValue);
                                            });
                                            setPaymentAmounts(updatedPayments);
                                            setValue("amount", totalPendingAmount);
                                        } else {
                                            setValue("amount", "");
                                            setPaymentAmounts({});
                                            setWithholdingTaxes({});
                                        }
                                    }}
                                />
                            </Box>
                        )}
                    </FieldRow>

                    {/* Bank Charges */}
                    <FieldRow label="Bank Charges (if any)">
                        <Controller
                            name="bank_charges"
                            control={control}
                            render={({ field, fieldState }) => (
                                <CommonTextField 
                                    {...field} 
                                    mt={0} mb={1} 
                                    value={field.value} 
                                    onChange={field.onChange}
                                    type="number"
                                    inputProps={{ min: 0, step: '1' }}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
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
                            name="PaymentNo"
                            control={control}
                            render={({ field }) => (
                                <CommonTextField
                                    {...field}
                                    mt={0} mb={1}
                                    value={field.value}
                                    error={!!errors.PaymentNo}
                                    helperText={errors.PaymentNo?.message}
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

                    {/* Deposit To */}
                    <FieldRow label="Deposit To">
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

                    {/* Reference # */}
                    <FieldRow label="Reference #">
                        <Controller
                            name="reference"
                            control={control}
                            render={({ field }) => <CommonTextField {...field} mt={0} mb={1} />}
                        />
                    </FieldRow>

                    {/* Tax deducted? */}
                    <FieldRow label="Tax deducted?">
                        <Controller
                            name="taxDeducted"
                            control={control}
                            render={({ field }) => (
                                <CommonRadioButton
                                    {...field}
                                    value={String(field.value)}
                                    onChange={(value) => field.onChange(value)}
                                    options={[
                                        { value: "false", label: "No Tax deducted" },
                                        { value: "true", label: "Yes, TDS (Income Tax)" },
                                    ]}
                                    mt={0}
                                    mb={0}
                                />
                            )}
                        />
                    </FieldRow>

                    {taxType === "true" ? (
                        <FieldRow label="TDS Tax Account" isRedlabel>
                            <Controller
                                name="tdsTaxAccount"
                                control={control}
                                rules={{ required: "TDS Tax Account is required" }}
                                render={({ field, fieldState }) => (
                                    <CommonSelect
                                        {...field}
                                        mt={0} mb={1}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        options={tdsTaxOptions || []}
                                    />
                                )}
                            />
                        </FieldRow>
                    ) : null}
                </Box>

                {/* Unpaid Invoices Table */}
                <UnpaidInvoicesTable
                    invoices={displayInvoices}
                    paymentAmounts={paymentAmounts}
                    paymentDates={paymentDates}
                    defaultPaymentDate={paymentDate}
                    withholdingTaxes={withholdingTaxes}
                    selectedInvoices={selectedInvoices}
                    onSelectInvoice={handleSelectInvoice}
                    onPaymentChange={handlePaymentChange}
                    onPaymentDateChange={handlePaymentDateChange}
                    onWithholdingTaxChange={handleWithholdingTaxChange}
                    onClearApplied={handleClearApplied}
                    totalPaymentsApplied={totalPaymentsApplied}
                    isTdsEnabled={taxType === "true"}
                    currencySymbol="₹"
                    onAmountReceivedUpdate={handleAmountReceivedUpdate}
                    isFullAmount={isFullAmount}
                    totalPendingAmount={totalPendingAmount}
                    amountReceived={Number(amountReceived)}
                    dateFilter={dateFilter}
                    onDateFilterChange={setDateFilter}
                    isEditMode={isEditMode}
                />

                {/* Notes */}
                <Box mb={2} mt={2}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 500, mb: 1 }}>
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
                                rows={2}
                                mb={0}
                            />
                        )}
                    />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 400, mb: 1 }}>
                        Attachments
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Box
                            onClick={() => fileInputRef.current?.click()}
                            sx={{
                                border: "1px dashed #ccc",
                                borderRadius: 1, p: 0.9,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                cursor: "pointer",
                                "&:hover": { bgcolor: "#f9f9fb" }
                            }}
                        >
                            <AttachFileIcon fontSize="small" sx={{ transform: 'rotate(45deg)', color: '#667085' }} />
                            <Typography sx={{ fontSize: '12px', fontWeight: 500, color: '#344054' }}>
                                Upload File
                            </Typography>
                        </Box>

                    </Box>

                    {attachments.length > 0 && (
                        <Controller
                            name="displayAttachments"
                            control={control}
                            render={({ field }) => (
                                <CommonCheckbox
                                    label="Display attachments in Customer Portal and emails"
                                    checked={field.value}
                                    {...register("displayAttachments")}
                                    onChange={(e) => {
                                        field.onChange(e.target.checked);
                                        setValue("displayAttachments", e.target.checked);
                                    }}
                                    sx={{ ml: -1, mt: 0 }}
                                />
                            )}
                        />
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        multiple
                        onChange={handleAttachmentsChange}
                    />
                    <Typography variant="caption" sx={{ color: "#667085", display: 'block', mt: 0.5 }} >
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
                </Box>

                {/* Email Checkbox */}
                {singleCustomer?.contact_persons?.length > 0 && (
                    <Box>
                        <Controller
                            name="thankYouNoteSent"
                            control={control}
                            render={({ field }) => (
                                <CommonCheckbox
                                    label={`Email a "Thank you" note for this payment`}
                                    checked={field.value}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        field.onChange(checked);
                                        if (checked && singleCustomer?.contact_persons) {
                                            const validContacts = singleCustomer.contact_persons
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
                        {watch("thankYouNoteSent") &&
                            singleCustomer?.contact_persons?.some(c => c.email || c.name_details?.first_name || c.name_details?.last_name) && (
                                <Box sx={{ ml: 3, mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {singleCustomer.contact_persons
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

export default PaymentForm;