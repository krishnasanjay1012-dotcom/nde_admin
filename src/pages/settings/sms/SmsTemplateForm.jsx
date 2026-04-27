import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonDrawer from "../../../components/common/NDE-Drawer";
import { CommonTextField, CommonSelect, CommonDescriptionField } from "../../../components/common/fields";
import {
  useCreateSmsTemplate,
  useUpdateSmsTemplate,
  useSmsTemplateById,
} from "../../../hooks/settings/sms-hooks";

const TYPE_OPTIONS = [
  { label: "Transactional", value: "Transactional" },
  { label: "Promotional", value: "Promotional" },
  { label: "OTP", value: "OTP" },
];

const STATUS_OPTIONS = [
  { label: "Approved", value: "Approved" },
  { label: "Pending DLT", value: "Pending DLT" },
  { label: "Rejected", value: "Rejected" },
];

const VARIABLES = ["var1", "var2", "var3", "var4"];
const MAX_CHARS = 160;

const schema = yup.object().shape({
  name: yup.string().trim().required("Template name is required"),
  dltId: yup.string().trim(),
  type: yup.string().required("Type is required"),
  content: yup
    .string()
    .trim()
    .required("Template body is required")
    .max(MAX_CHARS, `Max ${MAX_CHARS} characters`),
  status: yup.string().required("Status is required"),
});


const SmsTemplateForm = ({ open, handleClose, selectedRow = null }) => {
  const isEdit = Boolean(selectedRow?.id);

  const { data: fetchedData } = useSmsTemplateById(isEdit ? selectedRow.id : null);
  const { mutate: createTemplate, isLoading: isCreating } = useCreateSmsTemplate();
  const { mutate: updateTemplate, isLoading: isUpdating } = useUpdateSmsTemplate();
  const isLoading = isCreating || isUpdating;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: "", dltId: "", type: "", content: "", status: "Pending DLT",
    },
    resolver: yupResolver(schema),
  });

  const contentValue = watch("content") || "";

  useEffect(() => {
    if (!open) return;
    if (isEdit) {
      const src = fetchedData?.data || selectedRow;
      reset({
        name: src.name || "",
        dltId: src.dltId || src.dltTemplateId || "",
        type: src.type || "",
        content: src.content || src.templateBody || src.template || "",
        status: src.status || "Pending DLT",
      });
    } else {
      reset({ name: "", dltId: "", type: "", content: "", status: "Pending DLT" });
    }
  }, [open, isEdit, fetchedData, selectedRow]);

  const insertVariable = (varName) => {
    const current = getValues("content") || "";
    setValue("content", `${current}{{#${varName}#}}`, { shouldDirty: true });
  };

  const onSubmit = (formData) => {
    const variables = VARIABLES.filter((v) =>
      formData.content.includes(`{{#${v}#}}`)
    );
    const payload = { ...formData, variables };

    if (isEdit) {
      updateTemplate(
        { id: selectedRow.id, data: payload },
        { onSuccess: handleDrawerClose }
      );
    } else {
      createTemplate(payload, { onSuccess: handleDrawerClose });
    }
  };

  const handleDrawerClose = () => {
    reset();
    handleClose();
  };

  return (
    <CommonDrawer
      open={open}
      onClose={handleDrawerClose}
      title={isEdit ? "Edit template" : "Create template"}
      anchor="right"
      width={520}
      actions={[
        { label: "Cancel", variant: "outlined", onClick: handleDrawerClose },
        {
          label: isLoading ? "Saving..." : isEdit ? "Update" : "Save",
          onClick: handleSubmit(onSubmit),
        },
      ]}
      disabled={!isDirty}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          // gap: 2.5,
        }}
      >
        {/* Template Name */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="Template name"
              placeholder="e.g. Account Blocked"
              mandatory
              fullWidth
              disabled={isEdit}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 180 }}>
            <Controller
              name="dltId"
              control={control}
              render={({ field }) => (
                <CommonTextField
                  {...field}
                  label="DLT template ID"
                  placeholder="e.g. 1107161234567896"
                  fullWidth
                  error={!!errors.dltId}
                  helperText={errors.dltId?.message}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 180 }}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  {...field}
                  label="Type"
                  mandatory
                  options={TYPE_OPTIONS}
                  placeholder="Select type"
                  fullWidth
                  clearable={false}
                  error={!!errors.type}
                  helperText={errors.type?.message}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </Box>
        </Box>

        {/* Template Body */}
        <Box>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <CommonDescriptionField
                {...field}
                label="Template body"
                placeholder="e.g. Your account has been blocked. Contact: {{#var1#}}"
                mandatory
                fullWidth
                multiline
                rows={5}
                error={!!errors.content}
                helperText={errors.content?.message}
                mb={0.5}
              />
            )}
          />

          <Typography
            fontSize={12}
            color="text.secondary"
            textAlign="right"
          >
            {contentValue.length} / {MAX_CHARS}
          </Typography>
        </Box>

        <Box>
          <Typography fontSize={13} fontWeight={400} mb={1}>
            Insert Variables
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              mb:2,
              flexWrap: "wrap",
            }}
          >
            {VARIABLES.map((v) => (
              <Button
                key={v}
                variant="outlined"
                size="small"
                onClick={() => insertVariable(v)}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: 12,
                  px: 1.5,
                  py: 0.5,
                }}
              >
                {`{{#${v}#}}`}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Status */}
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <CommonSelect
              {...field}
              label="Status"
              mandatory
              options={STATUS_OPTIONS}
              placeholder="Select status"
              fullWidth
              clearable={false}
              error={!!errors.status}
              helperText={errors.status?.message}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      </Box>
    </CommonDrawer>
  );
};

export default SmsTemplateForm;
