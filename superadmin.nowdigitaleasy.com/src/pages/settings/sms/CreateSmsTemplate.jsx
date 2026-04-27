import React, { useRef } from "react";
import { Box, Typography, Button, Chip } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonDrawer from "../../../components/common/NDE-Drawer";
import { CommonTextField, CommonSelect } from "../../../components/common/fields";
import { useCreateSmsTemplate } from "../../../hooks/settings/sms-hooks";

const TYPE_OPTIONS = [
  { label: "Transactional", value: "Transactional" },
  { label: "Promotional",   value: "Promotional" },
  { label: "OTP",           value: "OTP" },
];

const STATUS_OPTIONS = [
  { label: "Approved",    value: "Approved" },
  { label: "Pending DLT", value: "Pending DLT" },
  { label: "Rejected",    value: "Rejected" },
];

const VARIABLES = ["var1", "var2", "var3", "var4"];
const MAX_CHARS = 160;

const schema = yup.object().shape({
  name:      yup.string().trim().required("Template name is required"),
  dltId:     yup.string().trim(),
  type:      yup.string().required("Type is required"),
  content:   yup.string().trim().required("Template body is required").max(MAX_CHARS, `Max ${MAX_CHARS} characters`),
  status:    yup.string().required("Status is required"),
});

const CreateSmsTemplate = ({ open, handleClose }) => {
  const { mutate: createTemplate, isLoading } = useCreateSmsTemplate();
  const contentRef = useRef(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: { name: "", dltId: "", type: "", content: "", status: "Pending DLT" },
    resolver: yupResolver(schema),
  });

  const contentValue = watch("content") || "";

  const insertVariable = (varName) => {
    const current = getValues("content") || "";
    setValue("content", `${current}{{#${varName}#}}`, { shouldDirty: true });
  };

  const onSubmit = (data) => {
    const variables = VARIABLES.filter((v) =>
      data.content.includes(`{{#${v}#}}`)
    );
    createTemplate({ ...data, variables }, {
      onSuccess: () => { reset(); handleClose(); },
    });
  };

  const handleDrawerClose = () => { reset(); handleClose(); };

  return (
    <CommonDrawer
      open={open}
      onClose={handleDrawerClose}
      title="Create template"
      anchor="right"
      width={520}
      actions={[
        { label: "Cancel", variant: "outlined", onClick: handleDrawerClose },
        { label: isLoading ? "Saving..." : "Save", onClick: handleSubmit(onSubmit) },
      ]}
      disabled={!isDirty}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

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
              mb={0}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />

        {/* DLT ID + Type (side by side) */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Controller
            name="dltId"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="DLT template ID"
                placeholder="e.g. 1107161234567896"
                mb={0}
                error={!!errors.dltId}
                helperText={errors.dltId?.message}
              />
            )}
          />
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
                width="100%"
                mt={0}
                mb={0}
                clearable={false}
                error={!!errors.type}
                helperText={errors.type?.message}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
        </Box>

        {/* Template Body */}
        <Box>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="Template body"
                placeholder='e.g. Your OTP is {{#var1#}}'
                mandatory
                mb={0}
                multiline
                rows={5}
                error={!!errors.content}
                helperText={errors.content?.message}
                inputRef={contentRef}
              />
            )}
          />
          <Typography
            fontSize={12}
            color="text.secondary"
            textAlign="right"
            mt={0.5}
          >
            {contentValue.length} / {MAX_CHARS}
          </Typography>
        </Box>

        {/* Insert Variable Buttons */}
        <Box>
          <Typography fontSize={13} color="text.secondary" mb={0.5}>
            Insert:
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {VARIABLES.map((v) => (
              <Button
                key={v}
                variant="outlined"
                size="small"
                onClick={() => insertVariable(v)}
                sx={{ borderRadius: 2, fontSize: 12, py: 0.4, px: 1.5 }}
              >
                {v}
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
              width="100%"
              mt={0}
              mb={0}
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

export default CreateSmsTemplate;
