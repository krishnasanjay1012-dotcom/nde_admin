import { Box, Chip, Typography } from "@mui/material";
import React, { useRef } from "react";
import { Controller } from "react-hook-form";
import { CommonCheckbox, CommonDescriptionField } from "../../../common/fields";
import CommonButton from "../../../common/NDE-Button";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import PaymentGatewayModal from "./PaymentGatewayModal";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import SplitPaymentSection from "./SplitPaymentSection";
import { useItemCalculations } from "./hooks/useItemCalculations";
import {
  useGetDepostiToList,
  useGetPaymentModes,
} from "../../../../hooks/sales/invoice-hooks";
import { usePayments } from "../../../../hooks/settings/payment-hooks";

const TermsAndCondition = ({ control, watch, setValue, errors, getValues }) => {
  const MAX_FILES = 10;
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  // const [openPaymentModal, setOpenPaymentModal] = React.useState(false);
  const fileInputRef = useRef(null);

  const files = watch("files") || [];
  const isRazoryPay = watch("paymentGateway");

  const isCustomerHas = watch("customerId");

  const isreceivedPayment = watch("isReceivedPayment");

  const calculations = useItemCalculations({ control, setValue, watch });

  const { data: paymentModes } = useGetPaymentModes();

  const { data: debitNodes } = useGetDepostiToList();

  const { data: PaymentConfigList } = usePayments();

  // const handleFileSelect = (e) => {
  //   const selectedFiles = Array.from(e.target.files || []);
  //   const currentFiles = watch("files") || [];
  //   const totalAllowed = 5 - currentFiles.length;

  //   if (totalAllowed <= 0) {
  //     alert("Maximum 5 files allowed");
  //     return;
  //   }

  //   const newFiles = selectedFiles.slice(0, totalAllowed);
  //   setValue("files", [...currentFiles, ...newFiles]);

  //   // Reset input so same file can be re-selected
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = "";
  //   }
  // };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;
    const currentFiles = watch("files") || [];
    if (currentFiles.length + selectedFiles.length > MAX_FILES) {
      alert(`Maximum ${MAX_FILES} files allowed`);
      e.target.value = null;
      return;
    }
    const validFiles = [];
    selectedFiles.forEach((file) => {
      if (file.size > MAX_SIZE) {
        alert(`${file.name} exceeds 10MB`);
      } else {
        validFiles.push(file);
      }
    });
    setValue("files", [...currentFiles, ...validFiles], {
      shouldValidate: true,
    });
    e.target.value = null;
  };

  const handleRemoveFile = (index) => {
    const currentFiles = watch("files") || [];

    const updated = currentFiles.filter((_, i) => i !== index);

    setValue("files", updated, {
      shouldValidate: true,
    });
  };

  return (
    <>
      <Box display={"flex"} alignItems={"center"} gap={"20px"} mt={3}>
        <Box display={"flex"} flexDirection={"column"} gap={"4px"}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 400,
              color: "#000",
              fontSize: "14px",
            }}
          >
            Terms & Conditions
          </Typography>
          <Controller
            name="terms"
            control={control}
            render={({ field }) => (
              <CommonDescriptionField
                {...field}
                rows={2}
                width="680px"
                mt={0}
                mb={2}
              />
            )}
          />
        </Box>

        <Box display={"flex"} flexDirection={"column"} gap={"4px"}>
          <Typography variant="body1">Attach File(s) to Invoice</Typography>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <CommonButton
            label="Upload File"
            startIcon={<AttachFileIcon sx={{ color: "icon.light" }} />}
            onClick={() => fileInputRef.current?.click()}
            disabled={files.length >= 10}
          />
          <Typography variant="subtitle2" color="text.secondary">
            You can upload a maximum of 10 files, 10MB each
          </Typography>

          {/* Display uploaded files */}
          {files.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                mt: 1,
              }}
            >
              {files.map((file, idx) => (
                <Chip
                  key={idx}
                  label={file.name}
                  size="small"
                  onDelete={() => handleRemoveFile(idx)}
                  deleteIcon={<CloseIcon fontSize="small" />}
                  sx={{
                    maxWidth: 200,
                    "& .MuiChip-label": { fontSize: 12 },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Payment Gateway Section */}
      {/* <Box sx={{ mt: 3, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Typography variant="body1" fontWeight={500} fontSize={15}>
            Want to get paid faster?
          </Typography>
          <FaCcMastercard size={24} color="#EB001B" />
          <FaCcVisa size={24} color="#1A1F71" />
        </Box>
        <Typography variant="body2" color="text.secondary" fontSize={14}>
          Configure payment gateways and receive payments online.
          <Typography
            component="span"
            color="primary"
            sx={{ cursor: "pointer", ml: 0.5, fontWeight: 500 }}
            onClick={() => setOpenPaymentModal(true)}
          >
            Set up Payment Gateway
          </Typography>
        </Typography>
      </Box> */}

      <Box display={"flex"} gap={2} alignItems={"center"}>
        {PaymentConfigList?.data?.map((item) => (
          <Box
            key={item._id}
            sx={{
              mt: 2,
              mb: 2,
              border: "1px solid #ddd",
              width: "170px",
              height: "40px",
              borderRadius: "5px",
              padding: "0px 13px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Controller
              name="paymentGateway"
              control={control}
              render={({ field }) => (
                <CommonCheckbox
                  label={`${item.type} (${item.env})`}
                  checked={field.value === item._id}
                  onChange={(e) => {
                    if (e.target.checked) {
                      field.onChange(item._id);
                    } else {
                      field.onChange(null);
                    }
                  }}
                />
              )}
            />
          </Box>
        ))}
      </Box>

      <Box display={"flex"} flexDirection={"column"} gap={1}>
        {isRazoryPay && (
          <Controller
            name="allowPartialPayments"
            control={control}
            render={({ field }) => (
              <CommonCheckbox
                label="Allow customer to make partial payments for this invoice."
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        )}
        {isCustomerHas && (
          <Controller
            name="isReceivedPayment"
            control={control}
            render={({ field }) => (
              <CommonCheckbox
                label="I have received the payment"
                checked={field.value}
                onChange={(e) => {
                  field.onChange(e.target.checked);
                  if (!e.target.checked) {
                    setValue("batchPayments", [
                      {
                        paymentModes: "699582e56db191cb997f538c",
                        depositTo: "699568166db191cb997f536a",
                        amount: "",
                      },
                    ]);
                  }
                }}
              />
            )}
          />
        )}
      </Box>

      {isreceivedPayment && (
        <SplitPaymentSection
          control={control}
          paymentModeOptions={paymentModes}
          depositToOptions={debitNodes}
          invoiceTotal={calculations?.totalAmount}
          errors={errors}
          setValue={setValue}
          getValues={getValues}
        />
      )}

      {/* <PaymentGatewayModal
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
      /> */}
    </>
  );
};

export default TermsAndCondition;
