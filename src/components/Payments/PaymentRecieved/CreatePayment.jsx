import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Invoicepayment from "./Invoicepayment";
import CustomerAdvance from "./CustomerAdvance";
import CommonTabs from "../../common/NDE-No-Route-Tab";
import CommonDrawer from "../../common/NDE-Drawer";

const ValidationSchema = yup.object().shape({
  customer: yup.string().required("Customer Name is required"),
  amountreceived: yup
    .number()
    .typeError("Amount Received must be a valid number")
    .required("Amount Received is required"),
  paymentdate: yup.string().required("Payment Date is required"),
  payment: yup.string().required("Payment # is required"),
});

const CreatePayment = ({ open, onClose, initialData = {} }) => {
  const today = new Date().toISOString().split("T")[0];

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(ValidationSchema),
    defaultValues: {
      customer: "",
      currency: "INR",
      amountreceived: "",
      bankcharge: "",
      paymentdate: today,
      payment: "",
      paymentmode: "",
      deposit: "",
      reference: "",
      taxeducated: "No Tax deducted",
      notes: "",
      file: null,
      emailforthankyou: false,
      ...initialData,
    },
    mode: "onChange",
  });

  useEffect(() => {
    reset({
      customer: "",
      currency: "INR",
      amountreceived: "",
      bankcharge: "",
      paymentdate: today,
      payment: "",
      paymentmode: "",
      deposit: "",
      reference: "",
      taxeducated: "No Tax deducted",
      notes: "",
      file: null,
      emailforthankyou: false,
      ...initialData,
    });
  }, [initialData, reset]);

  const handleClose = () => {
    reset({
      customer: "",
      currency: "INR",
      amountreceived: "",
      bankcharge: "",
      paymentdate: today,
      payment: "",
      paymentmode: "",
      deposit: "",
      reference: "",
      taxeducated: "No Tax deducted",
      notes: "",
      file: null,
      emailforthankyou: false,
      ...initialData,
    });
    onClose();
  };


  const handleSave = () => {
    handleSubmit((data) => {
      console.log("SUBMITTED DATA:", data);
    })();
  };

  return (
    <CommonDrawer
      open={open}
      onClose={handleClose}
      anchor="right"
      width={600}
      title="Payment Create"
      actions={[
        { label: "Cancel", variant: "outlined", onClick: handleClose },
        {
          label: "Save",
          variant: "contained",
          onClick: handleSave,
          disabled: !isValid,
        },
      ]}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CommonTabs
          tabs={[
            {
              label: "G-Suite Information",
              component: (
                <Invoicepayment
                  control={control}
                  register={register}
                  errors={errors}
                />
              ),
            },
            {
              label: "Customer Advance",
              component: (
                <CustomerAdvance
                  control={control}
                  register={register}
                  errors={errors}
                />
              ),
            },
          ]}
           onTabChange={() => reset()}
        />
      </Box>
    </CommonDrawer>
  );
};

export default CreatePayment;
