import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import dayjs from "dayjs";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useParams } from "react-router-dom";

import CommonDialog from "../../common/NDE-Dialog";
import { CommonTextField } from "../../common/fields";
import CommonDatePicker from "../../common/fields/NDE-DatePicker";
import CommonImagePreview from "../../common/NDE-ImagePreview";
import CommonFileBoxUpload from "../../common/NDE-FileUpload";
import CommonDescriptionField from "../../common/fields/NDE-DescriptionField";
import CommonSelect from "../../common/fields/NDE-Select";

import {
  useAddWalletFund,
  useDepositaccounts,
  useUpdateWalletTransaction,
} from "../../../hooks/Customer/Customer-hooks";


const schema = yup.object().shape({
  walletBalance: yup
    .number()
    .typeError("Wallet Balance must be a number")
    .positive("Amount must be greater than 0")
    .required("Wallet Balance is required"),

  utrId: yup.string().required("Transaction ID / UTR ID is required"),

  description: yup.string().required("Description is required"),

  accountId: yup.string().required("Account is required"),

  date: yup
    .mixed()
    .test(
      "valid-date",
      "Date is required",
      (value) => !!value && dayjs(value).isValid()
    ),
});


const CreateWalletTransaction = ({
  open,
  setOpen,
  selectedWorkspaceId,
  selectedRow,
  setSelectedRow,
}) => {
  const { customerId } = useParams();
  const isEditMode = !!selectedRow;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      walletBalance: "",
      utrId: "",
      description: "",
      accountId: "",
      date: null,
      appscreenshot: [],
    },
  });

  const addFund = useAddWalletFund();
  const updateFund = useUpdateWalletTransaction();
  const { data } = useDepositaccounts("wallet");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);


 const accountOptions = useMemo(() => {
  if (!data?.data) return [];

  return Object.entries(data.data).flatMap(([groupName, accounts]) =>
    accounts.map((item) => ({
      label: item.name,
      value: item.id,
      group: groupName,
    }))
  );
}, [data]);


  useEffect(() => {
    if (open) {
      if (isEditMode && selectedRow) {
        reset({
          walletBalance: selectedRow.amount
            ? selectedRow.amount.replace(/[^\d.]/g, "")
            : "",
          utrId: selectedRow.original?.utrId || "",
          description: selectedRow.original?.description || "",
          accountId: selectedRow.original?.accountId || "",
          date: selectedRow.transactionDate
            ? dayjs(selectedRow.transactionDate, "DD MMM YYYY")
            : null,
          appscreenshot: selectedRow.image ? [selectedRow.image] : [],
        });
      } else {
        reset({
          walletBalance: "",
          utrId: "",
          description: "",
          accountId: "",
          date: null,
          appscreenshot: [],
        });
      }

      setPreviewSrc(null);
    }
  }, [open, selectedRow, isEditMode, reset]);


  const handleClose = () => {
    setOpen(false);
    reset();
    setPreviewSrc(null);
    if (setSelectedRow) setSelectedRow(null);
  };


  const onSubmit = (formValues) => {
    const formData = new FormData();

    formData.append("userId", customerId);
    formData.append("workspaceId", selectedWorkspaceId);
    formData.append("accountId", formValues.accountId);
    formData.append("amount", Number(formValues.walletBalance));
    formData.append("utrId", formValues.utrId);
    formData.append("description", formValues.description);
    formData.append(
      "transactionDate",
      formValues.date ? dayjs(formValues.date).toISOString() : ""
    );

    if (Array.isArray(formValues.appscreenshot)) {
      formValues.appscreenshot.forEach((file) => {
        if (file instanceof File) {
          formData.append("proof", file);
        }
      });
    }

    if (isEditMode) {
      formData.append("_id", selectedRow.id);

      updateFund.mutate(formData, {
        onSuccess: handleClose,
        onError: (err) => console.error("Update Error:", err),
      });
    } else {
      addFund.mutate(formData, {
        onSuccess: handleClose,
        onError: (err) => console.error("Create Error:", err),
      });
    }
  };


  return (
    <Box>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title={isEditMode ? "Edit Wallet Transaction" : "Add Wallet Transaction"}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={isEditMode ? "Update" : "Save"}
        maxWidth="sm"
        submitDisabled={!isDirty || addFund.isPending || updateFund.isPending}
      >
        {/* Account Select */}
        <Controller
          name="accountId"
          control={control}
          render={({ field }) => (
            <CommonSelect
              {...field}
              label="Select Account"
              options={accountOptions}
              onChange={(val) => field.onChange(val)}
              error={!!errors.accountId}
              helperText={errors.accountId?.message}
              searchable
              mandatory
              width="100%"
              disabled={isEditMode}
            />
          )}
        />

        {/* Wallet Balance */}
        <Controller
          name="walletBalance"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="Wallet Balance"
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              error={!!errors.walletBalance}
              helperText={errors.walletBalance?.message}
              mandatory
              width="100%"
              disabled={isEditMode}
            />
          )}
        />

        {/* UTR ID */}
        <Controller
          name="utrId"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="Transaction ID / UTR ID"
              error={!!errors.utrId}
              helperText={errors.utrId?.message}
              mandatory
              width="100%"
              disabled={isEditMode}
            />
          )}
        />

        {/* Date */}
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <CommonDatePicker
              {...field}
              label="Transaction Date"
              value={field.value}
              onChange={(newDate) => field.onChange(newDate)}
              error={!!errors.date}
              helperText={errors.date?.message}
              mandatory
              disabled={isEditMode}
            />
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <CommonDescriptionField
              {...field}
              label="Description"
              error={!!errors.description}
              helperText={errors.description?.message}
              mandatory
              width="100%"
            />
          )}
        />

        {/* Image Upload */}
        <Typography variant="body1" sx={{ mb: 1 }}>
          Upload Transaction Proof
        </Typography>

        <Controller
          name="appscreenshot"
          control={control}
          render={({ field }) => {
            const filesArray = Array.isArray(field.value)
              ? field.value
              : field.value
                ? [field.value]
                : [];

            const handleRemove = (index) => {
              const updated = filesArray.filter((_, i) => i !== index);
              field.onChange(updated);
            };

            return (
              <>
                <CommonFileBoxUpload
                  onChange={(files) =>
                    field.onChange([...filesArray, ...Array.from(files)])
                  }
                  multiple
                  accept="image/*"
                >
                  <Box sx={{ textAlign: "center", p: 2 }}>
                    <CloudUploadIcon sx={{ fontSize: 28, color: "#999" }} />
                    <Typography>
                      Browse and upload screenshot
                    </Typography>
                  </Box>
                </CommonFileBoxUpload>

                {filesArray.length > 0 && (
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                    {filesArray.map((file, idx) => {
                      const fileUrl =
                        typeof file === "string"
                          ? file
                          : URL.createObjectURL(file);

                      return (
                        <Box
                          key={idx}
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            overflow: "hidden",
                            position: "relative",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setPreviewSrc(fileUrl);
                            setPreviewOpen(true);
                          }}
                        >
                          <img
                            src={fileUrl}
                            alt="preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />

                          <Box
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(idx);
                            }}
                            sx={{
                              position: "absolute",
                              top: 2,
                              right: 2,
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              background: "red",
                              color: "#fff",
                              fontSize: 12,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            ×
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </>
            );
          }}
        />
      </CommonDialog>

      <CommonImagePreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        src={previewSrc}
      />
    </Box>
  );
};

export default CreateWalletTransaction;