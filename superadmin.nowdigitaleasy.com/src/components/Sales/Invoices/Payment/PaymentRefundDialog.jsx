import dayjs from "dayjs";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  CommonDatePicker,
  CommonDescriptionField,
  CommonNestedSelect,
  CommonSelect,
  CommonTextField,
} from "../../../common/fields";
import {
  useCreateRefund,
  useGetFromAccList,
  useGetPaymentModes,
  useRefundDetails,
} from "../../../../hooks/sales/invoice-hooks";
import { useParams } from "react-router-dom";
import FlowerLoader from "../../../common/NDE-loader";
import { useEffect } from "react";
import CommonDialog from "../../../common/NDE-Dialog";




const schema = yup.object().shape({
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Payment amount is required"),
  payment_mode: yup.string().required("Payment mode is required"),
  from_account: yup.string().required("From account is required"),
  refunded_at: yup.date().required("Refund date is required"),
  reference: yup.string(),
  description: yup.string(),
});


export default function PaymentRefundDialog({ open, onClose, refundId }) {
  const { invoiceId } = useParams();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      invoice_id: invoiceId,
      amount: 0,
      payment_mode: "",
      from_account: "",
      refunded_at: "",
      reference: "",
      description: "",
      currency: "INR",
      customer_id: "",
      workspace_id: refundId?.workspaceId,
    },
  });

  const { data: refundDetails, isLoading } = useRefundDetails(refundId?._id);
  const { data: paymentMode } = useGetPaymentModes();
  const { data: fromAcc } = useGetFromAccList();
  const fromAccList = fromAcc?.data ?? {};
  const { mutateAsync, isPending } = useCreateRefund(invoiceId);

  const refundDetailsData = refundDetails?.data;


  function formatAmount(currency, amount) {
    const safeCurrency = currency || "INR";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: safeCurrency,
      minimumFractionDigits: 2,
    }).format(amount ?? 0);
  }


  useEffect(() => {
    if (refundDetailsData && fromAcc && paymentMode) {
      const fifteenDaysBefore = dayjs().subtract(15, "day").toDate();

      const defaultFromAccountId = Object.values(fromAcc?.data ?? {})
        .flat()
        .find((acc) => acc?.name?.toLowerCase() === "petty cash")?.id;

      const defaultPaymentModeId = paymentMode?.data?.find(
        (acc) => acc?.code?.toLowerCase() === "cash",
      )?._id;

      reset({
        invoice_id: refundDetailsData?.invoice?._id || invoiceId,
        amount: refundDetailsData.amount || 0,
        payment_mode:
          refundDetailsData.invoicePayments?.[0]?.paymentMethod ||
          defaultPaymentModeId ||
          "",
        from_account:
          refundDetailsData.from_account || defaultFromAccountId || "",
        refunded_at: fifteenDaysBefore,
        reference:
          refundDetailsData.reference ||
          refundDetailsData.invoicePayments?.[0]?.notes ||
          "",
        description:
          refundDetailsData.invoicePayments?.[0]?.notes ||
          refundDetailsData.notes,
        currency: refundDetailsData?.currency?.code || "INR", 
        customer_id: refundDetailsData.user || "",
        workspace_id:
          refundDetailsData.workspaceId || refundId?.workspaceId,
      });
    }
  }, [refundDetailsData, fromAcc, paymentMode, reset]);


  const onSubmit = async (data) => {
    try {
      await mutateAsync({ id: refundDetailsData?._id, data, invoiceId });
      onClose();
    } catch (error) {
      console.error("Refund creation failed", error);
    }
  };


  return (
    <CommonDialog
      open={open}
      onClose={onClose}
      title="Payment Refund"
      onSubmit={handleSubmit(onSubmit)}
      submitLabel="Save"
      cancelLabel="Cancel"
      submitDisabled={!isDirty || isPending}
    >

      {isLoading ? (
        <Box display="flex" justifyContent="center">
          <FlowerLoader />
        </Box>
      ) : (
        <Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ flex: "1 1 48%" }}>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    value={formatAmount(
                      refundDetailsData?.currency?.code,
                      field.value
                    )}
                    disabled
                    fullWidth
                    label={"Payment Amount"}
                    mb={-1}
                    error={!!errors.amount}
                    helperText={errors.amount?.message} />
                )} />
            </Box>

            <Box sx={{ flex: "1 1 48%" }}>
              <Controller
                name="refunded_at"
                control={control}
                render={({ field }) => (
                  <CommonDatePicker
                    {...field}
                    fullWidth
                    label={"Refund On"}
                    mandatory
                    mb={-1}
                    error={!!errors.refunded_at}
                    helperText={errors.refunded_at?.message} />
                )} />
            </Box>

            <Box sx={{ flex: "1 1 48%" }}>
              <Controller
                name="payment_mode"
                control={control}
                render={({ field }) => (
                  <CommonSelect
                    {...field}
                    fullWidth
                    options={paymentMode?.data ?? []}
                    error={!!errors.payment_mode}
                    helperText={errors.payment_mode?.message}
                    mandatory
                    valueKey="_id"
                    label={"Payment Mode"}
                    labelKey="code"
                    mb={0}
                  />
                )} />
            </Box>

            <Box sx={{ flex: "1 1 48%" }}>
              <Controller
                name="reference"
                control={control}
                render={({ field }) => (
                  <CommonTextField {...field} fullWidth label={"Reference#"} mb={0} />
                )} />
            </Box>

            <Box sx={{ flex: "1 1 48%" }}>
              <Controller
                name="from_account"
                control={control}
                render={({ field }) => (
                  <CommonNestedSelect
                    value={field.value}
                    onChange={field.onChange}
                    name={field.name}
                    options={fromAccList}
                    searchable
                    label={"From Account"}
                    mandatory
                    labelKey="name"
                    valueKey="id"
                    error={!!errors.from_account}
                    helperText={errors.from_account?.message} mb={0}
                    />
                )} />
            </Box>

            <Box sx={{ flex: "1 1 48%" }}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <CommonDescriptionField {...field} fullWidth rows={3} label={"Description"} mb={0}/>
                )} />
            </Box>
          </Box>
          <Box mt={1}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>INVOICE#</TableCell>
                    <TableCell>INVOICE DATE</TableCell>
                    <TableCell>REFUND AMOUNT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {refundDetailsData?.invoice?.invoiceNo}
                    </TableCell>
                    <TableCell>
                      {dayjs(
                        refundDetailsData?.invoice?.invoiceDate
                      ).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>
                      {formatAmount(
                        refundDetailsData?.currency?.code,
                        refundDetailsData?.amount
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box><Typography variant="body2" color="text.secondary" mt={2}>
            Note: Once you save this refund, the payment received will be
            dissociated from the related invoice(s), changing the invoice
            status to Unpaid.
          </Typography>
        </Box>
      )}
    </CommonDialog>


  );
}