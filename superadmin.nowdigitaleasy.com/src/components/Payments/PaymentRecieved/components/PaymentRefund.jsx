import dayjs from "dayjs";
import {
    Typography,
    Box,
    IconButton,
    Avatar,
    Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    CommonDatePicker,
    CommonDescriptionField,
    CommonSelect,
    CommonTextField,
} from "../../../common/fields";
import {
    useGetPaymentModes,
} from "../../../../hooks/sales/invoice-hooks";
import { useAddRefund, useRefundByID, useUpdateRefund } from "../../../../hooks/payment/refund-hooks";
import CloseIcon from "@mui/icons-material/Close";

import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import CommonButton from "../../../common/NDE-Button";
import { usePaymentDetailsById } from "../../../../hooks/payment/payment-hooks";
import { useDepositaccounts } from "../../../../hooks/Customer/Customer-hooks";
import WaveLoader from "../../../common/NDE-WaveLoader";

const schema = yup.object().shape({
    refund_type: yup.string().required("Refund type is required"),
    amount: yup
        .number()
        .typeError("Amount must be a number")
        .required("Payment amount is required")
        .min(0, "Amount must be greater than or equal to 0"),
    payment_mode: yup.string().required("Payment mode is required"),
    from_account: yup.string().required("From account is required"),
    refunded_at: yup.date().required("Refund date is required"),
    reference: yup.string(),
    description: yup.string(),
});


const FieldRow = ({ label, required, children }) => (
    <Box display='flex' alignItems='center' gap={3}>
        <Typography variant="body1" sx={{ textAlign: "right", color: required ? "error.main" : "text.secondary" }}>
            {label}{required && "*"}
        </Typography>
        <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
);


export default function PaymentRefund() {
    const { paymentId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const refundId = searchParams.get("refundId");
    const isEdit = !!refundId;

    const {
        control,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
        setValue,
        getValues,
        watch,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            refund_type: "excess",
            amount: 0,
            currency: "INR",
            refunded_at: dayjs().toDate(),
            payment_mode: "",
            from_account: "",
            reference: "",
            description: "",
        }
    });

    const refundType = watch("refund_type");

    const { data: refundDetails, isLoading: isLoadingRefund } = useRefundByID(refundId);
    const refundData = refundDetails?.data;

    const { data: paymentDetails, isLoading: isLoadingPayment } = usePaymentDetailsById({ id: paymentId });

    const paymentDetailsData = paymentDetails?.data;
    const isInvoicePayment = (paymentDetailsData?.invoices?.length || 0) > 0;

    useEffect(() => {
        if (isEdit && refundData) {
            reset({
                refund_type: refundData.refund_type || "excess",
                amount: refundData.amount,
                currency: refundData.currency || "INR",
                refunded_at: refundData.refunded_at ? dayjs(refundData.refunded_at).toDate() : dayjs().toDate(),
                payment_mode: refundData.payment_mode?._id || refundData.payment_mode || "",
                from_account: refundData.from_account?._id || refundData.from_account || "",
                reference: refundData.reference || "",
                description: refundData.description || "",
            });
        } else if (!isEdit && paymentDetailsData) {
            const defaultRefundType = paymentDetailsData?.unusedAmount === 0 ? "full" : "excess";
            reset({
                refund_type: defaultRefundType,
                amount: defaultRefundType === "full" ? paymentDetailsData.amount : (paymentDetailsData.unusedAmount || 0),
                currency: paymentDetailsData.currency || "INR",
                refunded_at: dayjs().toDate(),
                payment_mode: getValues("payment_mode") || "",
                from_account: getValues("from_account") || "",
                reference: "",
                description: "",
            });
        }
    }, [paymentDetailsData, refundData, isEdit, reset]);

    useEffect(() => {
        if (refundType === "full" && paymentDetailsData) {
            setValue("amount", paymentDetailsData.amount, { shouldDirty: true });
        } else if (refundType === "excess" && paymentDetailsData) {
            setValue("amount", paymentDetailsData.unusedAmount, { shouldDirty: true });
        }
    }, [refundType, paymentDetailsData, setValue]);

    const { data: paymentMode } = useGetPaymentModes();
    const { data: fromAcc } = useDepositaccounts("payment");

    const fromAccList = useMemo(() => {
        if (!fromAcc?.data) return [];

        return Object.entries(fromAcc.data).flatMap(([groupName, accounts]) =>
            accounts.map((item) => ({
                label: item.name,
                value: item.id,
                group: groupName,
            }))
        );
    }, [fromAcc]);

    useEffect(() => {
        if (paymentMode?.data?.length > 0 && !getValues("payment_mode")) {
            setValue("payment_mode", paymentMode.data[0]._id, { shouldDirty: true, shouldValidate: true });
        }
    }, [paymentMode?.data, setValue, getValues]);

    useEffect(() => {
        if (fromAccList?.length > 0 && !getValues("from_account")) {
            const defaultAcc = fromAccList[0]?.value;
            if (defaultAcc) {
                setValue("from_account", defaultAcc, { shouldDirty: true, shouldValidate: true });
            }
        }
    }, [fromAccList, setValue, getValues]);

    const { mutateAsync: addMutation, isPending: isAdding } = useAddRefund();
    const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateRefund();
    const isPending = isAdding || isUpdating;

    const onSubmit = async (formData) => {
        const payload = {
            invoice_id: paymentDetailsData?.invoice_id?._id,
            amount: Number(formData.amount),
            payment_mode: formData.payment_mode,
            from_account: formData.from_account,
            refunded_at: formData.refunded_at ? dayjs(formData.refunded_at).toISOString() : dayjs().toISOString(),
            reference: formData.reference || "",    
            description: formData.description || "",
            currency: paymentDetailsData?.currency || "INR",
            customer_id: paymentDetailsData?.user?._id,
            workspace_id: paymentDetailsData?.workspaceId?._id,
            payment_id: paymentId,
            ...(isInvoicePayment && {
                refund_type: formData.refund_type,
            }),
        };
        try {
            if (isEdit) {
                await updateMutation({
                    id: refundId,
                    data: payload,
                }, {
                    onSuccess: () => {
                        navigate(`/sales/payments/details/${paymentId}?${searchParams.toString()}`);
                    },
                });
            } else {
                await addMutation({
                    paymentId: paymentId,
                    data: payload,
                }, {
                    onSuccess: () => {
                        navigate(`/sales/payments/details/${paymentId}?${searchParams.toString()}`);
                    },
                });
            }
        } catch (error) {
            console.error("Refund operation failed", error);
        }
    };


    return (
        <Box sx={{ height: "100%", overflow: "hidden" }}>
            {isLoadingPayment || isLoadingRefund ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 10 }}>
                    <WaveLoader />
                </Box>
            ) : (
                <Box display="flex" flexDirection="column" sx={{ height: "100%" }}>
                    <Box
                        sx={{
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            p: 2,
                            bgcolor: "background.paper",
                        }}
                    >
                        <Typography variant="h4">
                            {isEdit ? "Edit Refund" : "Refund"}
                        </Typography>
                        <IconButton onClick={() => navigate(`/sales/payments/details/${paymentId}?${searchParams.toString()}`)} color="error">
                            <CloseIcon sx={{ color: "error.main" }} />
                        </IconButton>
                    </Box>

                    <Box sx={{ flexGrow: 1, overflowY: "auto", px: 2, pb: 4 }}>
                        {/* Customer Info Header */}
                        <Box display="flex" alignItems="center" gap={2} mb={3}>
                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 2,
                                    bgcolor: "background.default",
                                    color: "primary.main",
                                }}
                            >
                                {paymentDetailsData?.user?.first_name?.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.2 }}>
                                    Customer Name
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 500, textTransform: "uppercase" }}>
                                    {((paymentDetailsData?.user?.first_name || "") + " " + (paymentDetailsData?.user?.last_name || "")).trim() || "N/A"}
                                </Typography>
                            </Box>
                        </Box>

                        {isInvoicePayment ? (
                            <>
                                <Box
                                    sx={{
                                        bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "#f9fbfd"),
                                        p: 2,
                                        borderRadius: 2,
                                        mb: 4,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        flexWrap: "wrap",
                                        gap: 4,
                                    }}
                                >
                                    <Box mt={paymentDetailsData?.unusedAmount === 0 ? 0 : 2} width={paymentDetailsData?.unusedAmount === 0 ? "50%" : "auto"}>
                                        {paymentDetailsData?.unusedAmount !== 0 && (
                                            <FieldRow label="Refund Type" required={false}>
                                                <Controller
                                                    name="refund_type"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <CommonSelect
                                                            {...field}
                                                            options={[
                                                                { value: "full", label: "Full Amount Refund" },
                                                                { value: "excess", label: "Excess Amount Refund" },
                                                            ]}
                                                            valueKey="value"
                                                            labelKey="label"
                                                            width="220px"
                                                            mb={1}
                                                            clearable={false}
                                                        />
                                                    )}
                                                />
                                            </FieldRow>
                                        )}

                                        <FieldRow label={refundType === "full" ? "Total Refund Amount" : "Amount"} required={refundType === "full" ? false : true}>
                                            <Controller
                                                name="amount"
                                                control={control}
                                                render={({ field }) => (
                                                    <CommonTextField
                                                        {...field}
                                                        fullWidth
                                                        mb={0}
                                                        disabled={refundType === "full"}
                                                        error={!!errors.amount}
                                                        helperText={errors.amount?.message}
                                                        startAdornment={
                                                            <Controller
                                                                name="currency"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <CommonTextField
                                                                        {...field}
                                                                        value={paymentDetailsData?.currency}
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
                                        </FieldRow>
                                    </Box>

                                    {paymentDetailsData?.unusedAmount !== 0 && (
                                        <Box>
                                            <Box
                                                sx={{
                                                    border: "1.5px dashed #cbd5e1",
                                                    borderRadius: 3,
                                                    p: 3,
                                                    bgcolor: "transparent",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 2,
                                                    minWidth: 280,
                                                }}
                                            >
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="body2" color="text.secondary">Total Amount Received :</Typography>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                                        {paymentDetailsData?.amount}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="body2" color="text.secondary">Amount Applied to Invoices :</Typography>
                                                    <Typography variant="body2">
                                                        {(
                                                            (paymentDetailsData?.amount || 0) - (paymentDetailsData?.unusedAmount || 0),
                                                            paymentDetailsData?.currency
                                                        )}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="body2" color="text.secondary">Previously Refunded Amount :</Typography>
                                                    <Typography variant="body2">
                                                        {0}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1, pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Excess Amount :</Typography>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                                        {paymentDetailsData?.unusedAmount}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>

                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                        <FieldRow label="Refunded On" required={true}>
                                            <Controller name="refunded_at" control={control} render={({ field }) => (
                                                <CommonDatePicker {...field} fullWidth error={!!errors.refunded_at} helperText={errors.refunded_at?.message} mb={0} />
                                            )} />
                                        </FieldRow>
                                        <FieldRow label="Reference#" required={false}>
                                            <Controller name="reference" control={control} render={({ field }) => (<CommonTextField {...field} fullWidth mb={0} />)} />
                                        </FieldRow>
                                        <FieldRow label="Description" required={false}>
                                            <Controller name="description" control={control} render={({ field }) => (<CommonDescriptionField {...field} rows={4} mb={0} />)} />
                                        </FieldRow>
                                    </Box>
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                        <FieldRow label="Payment Mode" required={true}>
                                            <Controller name="payment_mode" control={control} render={({ field }) => (
                                                <CommonSelect {...field} options={paymentMode?.data ?? []} valueKey="_id" labelKey="code" fullWidth mb={0}  clearable={false} />
                                            )} />
                                        </FieldRow>
                                        <FieldRow label="From Account" required={true}>
                                            <Controller name="from_account" control={control} render={({ field }) => (
                                                <CommonSelect {...field} options={fromAccList} searchable fullWidth mb={0}  clearable={false}/>
                                            )} />
                                        </FieldRow>
                                    </Box>
                                </Box>
                            </>
                        ) : (
                            <Box>
                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, mt: 2 }}>
                                    <FieldRow label="Amount" required={true}>
                                        <Controller
                                            name="amount"
                                            control={control}
                                            render={({ field }) => (
                                                <CommonTextField
                                                    {...field}
                                                    fullWidth
                                                    error={!!errors.amount}
                                                    helperText={errors.amount?.message}
                                                    mb={0}
                                                    mt={0}
                                                    startAdornment={
                                                        <Controller
                                                            name="currency"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <CommonTextField
                                                                    {...field}
                                                                    value={paymentDetailsData?.currency}
                                                                    disabled
                                                                    width='60px'
                                                                    sx={{
                                                                        bgcolor: (theme) =>
                                                                            theme.palette.mode === "dark" ? "background.muted" : "#f9f9fb",
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
                                    </FieldRow>

                                    <FieldRow label="Balance :" required={false} >
                                        <Typography variant="body1">
                                            {paymentDetailsData?.unusedAmount}
                                        </Typography>
                                    </FieldRow>
                                </Box>

                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, mt: 4 }}>
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                        <FieldRow label="Refunded On" required={true}>
                                            <Controller name="refunded_at" control={control} render={({ field }) => (
                                                <CommonDatePicker {...field} fullWidth error={!!errors.refunded_at} helperText={errors.refunded_at?.message} mt={0} />
                                            )} />
                                        </FieldRow>
                                        <FieldRow label="Reference#" required={false}>
                                            <Controller name="reference" control={control} render={({ field }) => (<CommonTextField {...field} fullWidth mt={0} mb={0} />)} />
                                        </FieldRow>
                                        <FieldRow label="Description" required={false}>
                                            <Controller name="description" control={control} render={({ field }) => (<CommonDescriptionField {...field} rows={3} mt={0} mb={0} />)} />
                                        </FieldRow>
                                    </Box>
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                        <FieldRow label="Payment Mode" required={true}>
                                            <Controller name="payment_mode" control={control} render={({ field }) => (
                                                <CommonSelect {...field} options={paymentMode?.data ?? []} valueKey="_id" labelKey="code" fullWidth mt={0} mb={0} clearable={false} />
                                            )} />
                                        </FieldRow>
                                        <FieldRow label="From Account" required={true}>
                                            <Controller name="from_account" control={control} render={({ field }) => (
                                                <CommonSelect {...field} options={fromAccList} searchable fullWidth mt={0} mb={0}  clearable={false} />
                                            )} />
                                        </FieldRow>
                                    </Box>
                                </Box>
                            </Box>
                        )}

                        {refundType === "full" && paymentDetailsData?.unusedAmount !== 0 && (
                            <><Divider sx={{ my: 2 }} /><Box mb={2}>
                                <Typography variant="body2" color="text.secondary">
                                    Note: When you refund the full amount, all payments made for the invoice will be disassociated and the amount will be refunded. If you refund only the excess amount, only the excess amount will be refunded.
                                </Typography>
                            </Box></>
                        )}
                    </Box>

                    {/* Footer */}
                    <Box
                        sx={{
                            flexShrink: 0,
                            display: "flex",
                            gap: 2,
                            px: 2,
                        }}
                    >
                        <CommonButton
                            variant="contained"
                            onClick={handleSubmit(onSubmit)}
                            disabled={!isDirty || isPending}
                            label={"Save"}
                            startIcon
                        />
                        <CommonButton variant="outlined" label={"Cancel"} onClick={() => navigate(`/sales/payments/details/${paymentId}?${searchParams.toString()}`)} startIcon />
                    </Box>
                </Box>
            )}
        </Box>
    );
}