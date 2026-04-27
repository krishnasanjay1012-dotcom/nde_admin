import React, { useEffect, useMemo, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PaymentMadeForm from "./PaymentMadeForm";
import CommonButton from "../../common/NDE-Button";
import CloseIcon from "@mui/icons-material/Close";
import {
  usePaymentModes,
  useTdsTaxAccounts,
} from "../../../hooks/payment/payment-hooks";
import { useNavigate, useParams } from "react-router-dom";
import { useDepositaccounts } from "../../../hooks/Customer/Customer-hooks";
import { 
  usePaymentMadeCreate, 
  useUpdatePaymentMade, 
  useGetPaymentMadeInfo 
} from "../../../hooks/payment-made/payment-made-hooks";
import ExcessivePaymentModal from "../../common/NDE-ExcessPayment";

const ValidationSchema = yup.object().shape({
  vendorId: yup.string().required("Vendor is required"),

  amount: yup
    .number()
    .typeError("Amount Paid must be a valid number")
    .required("Amount Paid is required"),

  payment_date: yup.string().required("Payment Date is required"),


  paymentNo: yup.string().required("Payment # is required"),
});

const PaymentMadeNew = () => {
  const { id } = useParams();
  const isEditMode = !!id;

  const { data: existingData } = useGetPaymentMadeInfo(id);
  const existingPayment = existingData?.data;

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

  const { data } = usePaymentModes();
  const { data: deposite } = useDepositaccounts("payment");
  const { data: tdsTax } = useTdsTaxAccounts();
  const addPaymentMadeMutation = usePaymentMadeCreate();
  const updatePaymentMadeMutation = useUpdatePaymentMade();

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

  useEffect(() => {
    if (isEditMode && existingPayment) {
      const pData = existingPayment;

      if (pData.vendor) {
        setValue("vendorId", pData.vendor._id || pData.vendor);
        setValue("vendorData", pData.vendor);
      }

      if (pData.paymentMade) setValue("amount", pData.paymentMade);
      if (pData.paymentDate) setValue("payment_date", new Date(pData.paymentDate).toISOString().slice(0, 10));
      if (pData.paymentNo) setValue("paymentNo", pData.paymentNo);

      if (pData.reference) setValue("reference", pData.reference);
      if (pData.notes) setValue("notes", pData.notes);

      if (pData.paymentMode) setValue("paymentModes", pData.paymentMode._id || pData.paymentMode);
      if (pData.paidThrough) setValue("depositTo", pData.paidThrough._id || pData.paidThrough);

      if (pData.contact_persons && pData.contact_persons.length > 0) {
        setValue("contact_persons", pData.contact_persons.map(c => c._id || c));
        setValue("sendEmailNotification", true);
      }

      if (pData.attachments) {
        setValue("attachments", pData.attachments);
      }

      if (pData.status) setStatusType(pData.status);
    }
  }, [isEditMode, existingPayment, setValue]);

  const handleFinalSubmit = (formData, advanceAccount = null) => {
    const uploadData = new FormData();

    uploadData.append("vendor", formData?.vendorId);
    uploadData.append("paymentMade", Number(formData?.amount));
    uploadData.append("paymentNo", formData?.paymentNo);
    uploadData.append("paidThrough", formData?.depositTo);
    uploadData.append("paymentMode", formData?.paymentModes);
    uploadData.append("paymentDate", formData?.payment_date);
    
    const paidAt = isEditMode && existingPayment?.paidAt ? existingPayment.paidAt : new Date().toISOString();
    uploadData.append("paidAt", paidAt);

    if(formData?.bills?.length > 0){
      uploadData.append("bills", JSON.stringify(formData?.bills || []));
    }
    uploadData.append("notes", formData?.notes || "");
    uploadData.append("reference", formData?.reference || "");
    uploadData.append("status", statusType);
    if(formData?.contact_persons?.length > 0){
      uploadData.append("contact_persons", JSON.stringify(formData?.contact_persons || []));
    }
    uploadData.append("currency", formData?.vendorData?.currency || "");

    if (excessAmount > 0) {
      uploadData.append("unusedAmount", excessAmount);
      uploadData.append("advanceAccount", advanceAccount?.value || "");
    }

    if (formData.attachments && formData.attachments.length > 0) {
      formData.attachments.forEach((fileItem) => {
        uploadData.append("attachments", fileItem.file || fileItem);
      });
    }

    if (isEditMode) {
      updatePaymentMadeMutation.mutate({ id, data: uploadData }, {
        onSuccess: () => navigate(-1),
        onError: (err) => console.error("Error updating payment made:", err),
      });
    } else {
      addPaymentMadeMutation.mutate(uploadData, {
        onSuccess: () => navigate(-1),
        onError: (err) => console.error("Error saving payment made:", err),
      });
    }
  };

  const onSubmit = (formData) => {
    const amount = Number(formData.amount);
    const totalApplied = (formData.bills || []).reduce(
      (sum, bill) => sum + (Number(bill.amountApplied) || 0),
      0
    );
    const excess = amount - totalApplied;

    if (excess > 0) {
      setExcessAmount(excess);
      setOpenExcessModal(true);
      return;
    }

    handleFinalSubmit(formData);
  };

  useEffect(() => {
    if (depositeOptions.length > 0) {
      setValue("depositTo", depositeOptions[0].value);
    }
  }, [depositeOptions, setValue]);

  useEffect(() => {
    if (paymentOptions.length > 0) {
      setValue("paymentModes", paymentOptions[0].value);
    }
  }, [paymentOptions, setValue]);

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
        <Typography variant="h4">Payment Made</Typography>

        <IconButton onClick={handleClose} color="error">
          <CloseIcon sx={{ color: "error.main" }} />
        </IconButton>
      </Box>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ flex: 1, overflowY: "auto", maxHeight: "calc(100vh - 180px)", mb: 1 }}>
          <PaymentMadeForm
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
            existingPayment={existingPayment}
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
              disabled={!isDirty || addPaymentMadeMutation.isPending}
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
              disabled={!isDirty || addPaymentMadeMutation.isPending}
              startIcon
            />
          )}

          {isEditMode && (
            <CommonButton
              type="submit"
              variant="contained"
              label="Save"
              onClick={() => setStatusType(statusType)}
              disabled={!isDirty || updatePaymentMadeMutation.isPending}
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
        onSave={(account) => {
          setOpenExcessModal(false);
          handleSubmit((data) => handleFinalSubmit(data, account))();
        }}
        amount={excessAmount}
      />
    </Box>
  );
};

export default PaymentMadeNew;
