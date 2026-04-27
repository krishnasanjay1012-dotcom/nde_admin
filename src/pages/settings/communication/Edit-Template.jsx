import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  useEmailTemplateById,
  useUpdateEmailTemplate,
} from "../../../hooks/settings/email-hooks";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CommonTextField } from "../../../components/common/fields";
import CommonDrawer from "../../../components/common/NDE-Drawer";
import NdeEditor from "../../../components/common/NdeEditor/NdeEditor";

const schema = yup.object().shape({
  name: yup.string().required("Template name is required"),
  templateContent: yup.string().required("Template content cannot be empty"),
});

const EditTemplateDrawer = ({ open, handleClose, selectedRow }) => {
  const id = selectedRow;

  const { data, isLoading } = useEmailTemplateById(id);
  const { mutate: updateTemplate, isLoading: isUpdating } =
    useUpdateEmailTemplate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      templateContent: "",
    },
  });

  // Populate form when API loads
  useEffect(() => {
    if (data?.data) {
      reset({
        name: data.data.name || "",
        templateContent: data.data.template || "",
      });
    }
  }, [data, reset]);

  const onSubmit = (formData) => {
    const payload = {
      id,
      template: formData.templateContent,
    };

    updateTemplate(payload, {
      onSuccess: () => {
        handleClose();
      },
      onError: (err) => {
        console.error("Error updating template:", err);
      },
    });
  };

  const handleDrawerClose = () => {
    reset();
    handleClose();
  };

  if (isLoading) return null;

  return (
    <CommonDrawer
      open={open}
      onClose={handleDrawerClose}
      title="Edit Template"
      onSubmit={handleSubmit(onSubmit)}
      anchor="right"
      width={900}
      actions={[
        { label: "Cancel", variant: "outlined", onClick: handleDrawerClose },
        {
          label: isUpdating ? "Saving..." : "Save",
          onClick: handleSubmit(onSubmit),
        },
      ]}
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
              disabled
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
                  mergeTags: [],
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
  );
};

export default EditTemplateDrawer;