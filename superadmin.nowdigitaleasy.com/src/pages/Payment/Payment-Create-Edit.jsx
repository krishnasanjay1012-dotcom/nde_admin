import React, { useEffect, useMemo, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PaymentForm from "./Payment-Form";
import CommonButton from "../../components/common/NDE-Button";
import CloseIcon from "@mui/icons-material/Close";
import {
  useCreatePayment,
  usePaymentModes,
  useTdsTaxAccounts,
  usePaymentDetailsById,
  useUpdatePayment,
} from "../../hooks/payment/payment-hooks";
import { useNavigate, useParams } from "react-router-dom";
import { useDepositaccounts } from "../../hooks/Customer/Customer-hooks";
import ExcessivePaymentModal from "../../components/common/NDE-ExcessPayment";
import { toast } from "react-toastify";

const ValidationSchema = yup.object().shape({
  customer_id: yup
    .object({
      value: yup.string().required(),
      label: yup.string().required(),
    })
    .nullable()
    .required("Customer is required"),

  amount: yup
    .number()
    .typeError("Amount Received must be a valid number")
    .required("Amount Received is required"),

  bank_charges: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable()
    .test(
      "bank-charges-check",
      "The Bank Charges can't be more than the amount received",
      function (value) {
        const { amount } = this.parent;
        return !value || value <= amount;
      }
    ),

  payment_date: yup.string().required("Payment Date is required"),

  tdsTaxAccount: yup.string().when("taxDeducted", {
    is: "tdsAmount",
    then: (schema) => schema.required("TDS Tax Account is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  PaymentNo: yup.string().required("Payment # is required"),
});

const CreatePayment = () => {
  const [statusType, setStatusType] = useState("paid");
  const [openExcessModal, setOpenExcessModal] = useState(false);
  const [excessAmount, setExcessAmount] = useState(0);

  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    getValues,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(ValidationSchema),
    mode: "onChange",
    defaultValues: {
      payment_date: new Date().toISOString().slice(0, 10),
      taxDeducted: "false",
    },
  });

  const navigate = useNavigate();
  const { paymentId} = useParams();
  const isEditMode = Boolean(paymentId);

  const { data } = usePaymentModes();
  const { data: deposite } = useDepositaccounts("payment");
  const { data: tdsTax } = useTdsTaxAccounts();
  const addPyamentMutation = useCreatePayment();
  const updatePyamentMutation = useUpdatePayment();

  const { data: fetchPaymentDetail, isLoading: isLoadingPayment } = usePaymentDetailsById({ id: paymentId });

  const paymentmode = data?.data || [];
  const tdsTaxmode = tdsTax?.data || [];

  const paymentOptions = useMemo(
    () =>
      paymentmode.map((m) => ({
        label: m.name,
        value: m._id,
      })),
    [paymentmode]
  );

  const tdsTaxOptions = useMemo(
    () =>
      tdsTaxmode.map((m) => ({
        label: m.name,
        value: m._id,
      })),
    [tdsTaxmode]
  );

  const depositeOptions = useMemo(() => {
    if (!deposite?.data) return [];
    const data = deposite.data;

    return Object.entries(data).flatMap(([group, items]) =>
      Array.isArray(items)
        ? items.map((item) => ({
          label: item.name,
          value: item.id,
          group,
        }))
        : []
    );
  }, [deposite]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleFinalSubmit = (data, advanceAccount = null) => {
    const isTaxDeducted = data.taxDeducted === "true";
    const formData = new FormData();

    if (data.invoices && data.invoices.length > 0) {
      formData.append("invoices", JSON.stringify(data.invoices));
    }

    formData.append(
      "workspaceId",
      data?.customer_id?.fullData?.workspaceDetails?._id ||
      data?.customer_id?.fullData?.workspace
    );
    formData.append("user", data?.customer_id?.value);
    formData.append("amount", Number(data.amount));
    formData.append("currency", data.currency);
    formData.append("paymentModes", data.paymentModes);
    formData.append("depositTo", data.depositTo);
    formData.append("displayAttachments", !!data.displayAttachments);
    formData.append("reference", data.reference || "");
    formData.append("notes", data.notes || "");
    if (isTaxDeducted) {
      formData.append("tdsTaxAccount", data.tdsTaxAccount);
    }

    if (data.contact_persons && data.contact_persons.length > 0) {
      formData.append("thankYouContacts", JSON.stringify(data.contact_persons));
    }
    formData.append("thankYouNoteSent", !!data.thankYouNoteSent);
    formData.append("depositAccount", data.depositTo);
    formData.append("taxDeducted", isTaxDeducted);
    formData.append(
      "bank_charges",
      data.bank_charges ? Number(data.bank_charges) : 0
    );
    formData.append("PAN", data?.PAN || "");
    formData.append("payment_date", new Date(data.payment_date).toISOString());
    formData.append("status", statusType);
    formData.append(
      "Payment_Received",
      new Date(data.payment_date).toISOString()
    );
    formData.append("PaymentNo", data.PaymentNo);

    if (excessAmount > 0) {
      formData.append("unusedAmount", excessAmount);
      formData.append("advanceAccount", advanceAccount?.value || "");
    }

    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const mutation = isEditMode ? updatePyamentMutation : addPyamentMutation;
    const mutationPayload = isEditMode ? { id: paymentId, data: formData } : formData;

    mutation.mutate(mutationPayload, {
      onSuccess: () => navigate(-1),
    });
  };

  const onSubmit = (data) => {
    const amount = Number(data.amount);
    const totalApplied = (data.invoices || []).reduce(
      (sum, inv) => sum + (Number(inv.amountApplied) || 0),
      0
    );
    const excess = amount - totalApplied;

    if (excess < 0) {
      toast.error(
        "The amount entered for individual invoice(s) exceeds the total payment the customer has made.",
        { position: "top-center" }
      );
      return;
    }

    if (excess > 0) {
      setExcessAmount(excess);
      setOpenExcessModal(true);
      return;
    }

    handleFinalSubmit(data);
  };

  const [existingAdvanceAccount, setExistingAdvanceAccount] = useState(null);

  useEffect(() => {
    if (isEditMode && fetchPaymentDetail?.data) {
      const pData = fetchPaymentDetail.data;

      if (pData.user) {
        setValue("customer_id", {
          value: pData.user._id,
          label: `${pData.user.name_details?.first_name || pData.user.first_name || ""} ${pData.user.name_details?.last_name || pData.user.last_name || ""}`.trim() || pData.user.email,
          fullData: {
            ...pData.user,
            workspaceDetails: pData.workspaceId
          },
        });
      }

      if (pData.amount) setValue("amount", pData.amount);
      if (pData.currency) setValue("currency", pData.currency);
      if (pData.payment_date) setValue("payment_date", new Date(pData.payment_date).toISOString().slice(0, 10));
      if (pData.PaymentNo) setValue("PaymentNo", pData.PaymentNo);
      
      setValue("taxDeducted", String(pData.taxDeducted ?? false));
      if (pData.tdsTaxAccount) setValue("tdsTaxAccount", pData.tdsTaxAccount._id || pData.tdsTaxAccount);
      
      if (pData.reference) setValue("reference", pData.reference);
      if (pData.notes) setValue("notes", pData.notes);
      if (pData.bank_charges) setValue("bank_charges", pData.bank_charges);
      if (pData.PAN) setValue("PAN", pData.PAN);

      if (pData.paymentModes) setValue("paymentModes", pData.paymentModes._id || pData.paymentModes);
      if (pData.depositTo) setValue("depositTo", pData.depositTo._id || pData.depositTo);
      else if (pData.depositAccount) setValue("depositTo", pData.depositAccount._id || pData.depositAccount);

      if (pData.displayAttachments !== undefined) setValue("displayAttachments", pData.displayAttachments);
      if (pData.status) setStatusType(pData.status);

      if (pData.thankYouNoteSent !== undefined) setValue("thankYouNoteSent", pData.thankYouNoteSent);
      if (pData.thankYouContacts) {
        setValue("contact_persons", pData.thankYouContacts.map(c => c._id || c));
      }

      if (pData.advanceAccount) {
        setExistingAdvanceAccount({
          label: pData.advanceAccount.name || "Default Account",
          value: pData.advanceAccount._id || pData.advanceAccount
        });
      }
    }
  }, [isEditMode, fetchPaymentDetail, setValue]);

  useEffect(() => {
    if (depositeOptions.length > 0 && !isEditMode) {
      setValue("depositTo", depositeOptions[0].value);
    }
  }, [depositeOptions, setValue, isEditMode]);

  useEffect(() => {
    if (paymentOptions.length > 0 && !isEditMode) {
      setValue("paymentModes", paymentOptions[0].value);
    }
  }, [paymentOptions, setValue, isEditMode]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          p: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4">{isEditMode ? "Edit Payment" : "Record Payment"}</Typography>

        <IconButton onClick={handleClose} color="error">
          <CloseIcon sx={{ color: "error.main" }} />
        </IconButton>
      </Box>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ flex: 1, overflowY: "auto", maxHeight: "calc(100vh - 180px)" }}>
          <PaymentForm
            control={control}
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            getValues={getValues}
            paymentOptions={paymentOptions}
            depositeOptions={depositeOptions}
            tdsTaxOptions={tdsTaxOptions}
            isEditMode={isEditMode}
            fetchPaymentDetail={fetchPaymentDetail}
          />
        </Box>

        {/* Footer Buttons */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            p: 1,
            display: "flex",
            gap: 2,
            bgcolor: "background.paper",
          }}
        >
          {!isEditMode && (
            <CommonButton
              type="submit"
              variant="contained"
              label="Save as Draft"
              onClick={() => setStatusType("draft")}
              disabled={!isDirty || addPyamentMutation.isPending}
              startIcon
              sx={{ bgcolor: "grey.3" }}
            />
          )}

          {!isEditMode && (
            <CommonButton
              type="submit"
              variant="contained"
              label="Save as Paid"
              onClick={() => setStatusType("paid")}
              disabled={!isDirty || addPyamentMutation.isPending}
              startIcon
            />
          )}

          {isEditMode && (
            <CommonButton
              type="submit"
              variant="contained"
              label="Save"
              onClick={() => setStatusType(statusType)}
              disabled={!isDirty || updatePyamentMutation.isPending}
              startIcon
            />
          )}

          <CommonButton
            label="Cancel"
            type="button"
            variant="outlined"
            onClick={handleClose}
            startIcon
          />
        </Box>
      </form>

      <ExcessivePaymentModal
        open={openExcessModal}
        onStay={() => setOpenExcessModal(false)}
        initialAccount={existingAdvanceAccount}
        onSave={(account) => {
          setOpenExcessModal(false);
          handleSubmit((data) => handleFinalSubmit(data, account))();
        }}
        amount={excessAmount}
      />
    </Box>
  );
};

export default CreatePayment;