import React, { useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";

import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CommonTextField } from "../../common/fields";
import { useCreatePaymentMode } from "../../../hooks/sales/invoice-hooks";
import CommonDialog from "../../common/NDE-Dialog";

/* -------- Default Backend Protected Codes -------- */
const defaultMethods = ["cash", "cheque"];

/* ---------------- Validation Schema ---------------- */

const paymentModeSchema = yup.object({
  modes: yup.array().of(
    yup.object({
      name: yup.string().required("Name is required"),
      code: yup.string().required("Code is required"),
      isDefault: yup.boolean(),
    })
  ),
});


export default function PaymentModeModal({
  open,
  onClose,
  paymentModeList = [],
}) {
  const { mutateAsync, isPending } = useCreatePaymentMode();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { modes: [] },
    resolver: yupResolver(paymentModeSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "modes",
  });

  const modes = watch("modes");

  useEffect(() => {
    if (paymentModeList?.length) {
      let defaultFound = false;

      const formatted = paymentModeList.map((item) => {
        if (item.isDefault && !defaultFound) {
          defaultFound = true;
          return item;
        }
        return { ...item, isDefault: false };
      });

      reset({ modes: formatted });
    }
  }, [paymentModeList, reset]);

  const generateCode = (value) => {
    return value
      ?.toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
  };

  const handleSetDefault = (index) => {
    modes.forEach((_, i) => {
      setValue(`modes.${i}.isDefault`, i === index);
    });
  };

  const onSubmit = async (data) => {
    try {
      await mutateAsync(data);
      onClose();
    } catch (error) {
      console.error("Payment mode save failed", error);
    }
  };

  return (
    <CommonDialog
      open={open}
      onClose={onClose}
      title="Payment Mode"
      onSubmit={handleSubmit(onSubmit)}
      submitLabel="Save"
      cancelLabel="Cancel"
      loading={isPending}
      width={520}
      maxWidth={false}
    >
      <Box sx={{ maxHeight: 420, overflowY: "auto" }}>
        {fields.map((field, index) => {
          const name = modes?.[index]?.name || "";
          const code = modes?.[index]?.code || "";
          const isDefault = modes?.[index]?.isDefault;
          const isEmpty = !name.trim();
          const isDeleteable = !defaultMethods.includes(code);

          return (
            <Box
              key={field.id}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                gap: 1,
                "&:hover .mark-default": {
                  visibility: "visible",
                },
              }}
            >
              <CommonTextField
                fullWidth
                size="small"
                placeholder="Payment name"
                {...register(`modes.${index}.name`, {
                  onChange: (e) => {
                    const value = e.target.value;
                    setValue(
                      `modes.${index}.code`,
                      generateCode(value)
                    );
                  },
                })}
                error={!!errors?.modes?.[index]?.name}
                helperText={errors?.modes?.[index]?.name?.message}
                mb={0}
                mt={0}
              />

              <Box
                sx={{
                  width: 180,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {isDefault ? (
                  <Typography
                    fontSize={12}
                    sx={{
                      bgcolor: "green",
                      color: "#fff",
                      px: 1,
                      borderRadius: 0.5,
                    }}
                  >
                    Default
                  </Typography>
                ) : (
                  <Typography
                    fontSize={12}
                    className="mark-default"
                    sx={{
                      color: isEmpty ? "#ccc" : "#1976d2",
                      cursor: isEmpty ? "not-allowed" : "pointer",
                      visibility: "hidden",
                    }}
                    onClick={() => !isEmpty && handleSetDefault(index)}
                  >
                    Mark as Default
                  </Typography>
                )}

                {isDeleteable && (
                  <IconButton
                    size="small"
                    onClick={() => remove(index)}
                    className="mark-default"
                    sx={{ visibility: "hidden" }}
                  >
                    <CancelIcon sx={{ fontSize: 18, color: "red" }} />
                  </IconButton>
                )}
              </Box>
            </Box>
          );
        })}

        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            append({
              _id: undefined,
              name: "",
              code: "",
              isDefault: false,
            })
          }
          sx={{ mt: 1 }}
        >
          Add New
        </Button>
      </Box>
    </CommonDialog>
  );
}