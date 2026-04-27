import React from "react";
import { useAddEmailTemplate } from "../../../hooks/settings/email-hooks";
import { Box, Typography } from "@mui/material";
import { CommonTextField } from "../../../components/common/fields";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonDrawer from "../../../components/common/NDE-Drawer";
import NdeEditor from "../../../components/common/NdeEditor/NdeEditor";

const schema = yup.object().shape({
  name: yup.string().trim().required("Template name is required"),
  templateContent: yup
    .string()
    .trim()
    .required("Template content cannot be empty"),
});

const CreateTemplate = ({ open, handleClose }) => {
  const { mutate: addTemplate, isLoading } = useAddEmailTemplate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: "",
      templateContent: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    const payload = {
      userName: data.name,
      template: data.templateContent,
    };

    addTemplate(payload, {
      onSuccess: () => {
        handleClose();
        reset();
      },
      onError: (err) => {
        console.error("Error adding template:", err);
      },
    });
  };

  const handleDialogClose = () => {
    reset();
    handleClose();
  };

  return (
    <Box>
      <CommonDrawer
        open={open}
        onClose={handleDialogClose}
        title="Create Template"
        onSubmit={handleSubmit(onSubmit)}
        anchor="right"
        width={900}
        actions={[
          { label: "Cancel", variant: "outlined", onClick: handleDialogClose },
          {
            label: isLoading ? "Saving..." : "Save",
            onClick: handleSubmit(onSubmit),
          },
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
                label="Template Name"
                placeholder="Enter template name"
                mandatory
                mb={0}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          {/* Template Content */}
          <Typography sx={{ fontSize: 14 }}>Template Content</Typography>

          {errors.templateContent && (
            <Typography sx={{ color: "red", fontSize: 12 }}>
              {errors.templateContent.message}
            </Typography>
          )}

          <Controller
            name="templateContent"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Box borderTop={"1px solid #dddfe9"} borderRadius={1}>
                <NdeEditor
                  value={field.value || ""}
                  onChange={(html) => field.onChange(html)}
                  placeholder="Type your email..."
                  minHeight="300px"
                  editorTheme={{
                    borderColor: "#E5E7EB",
                    borderRadius: 12,
                    background: "#FFFFFF",
                    mergeTagBg: "#EEF2FF",
                    mergeTagColor: "#4F46E5",
                    mergeTagRadius: 6,
                  }}
                  toolbar={{
                    type: "full",
                    position: "top",
                    config: {},
                    mergeTags: [{label:"first Name",value:"{{first}}"}],
                    theme: {
                      toolbarBg: "#F9FAFB",
                      toolbarBorderColor: "#E5E7EB",
                      buttonSize: 34,
                      iconSize: 18,
                      buttonRadius: 8,
                      buttonBorderColor: "#E5E7EB",
                      buttonHoverBg: "#F3F4F6",
                      buttonHoverBorderColor: "#D1D5DB",
                    },
                  }}
                />
              </Box>
            )}
          />
        </Box>
      </CommonDrawer>
    </Box>
  );
};

export default CreateTemplate;