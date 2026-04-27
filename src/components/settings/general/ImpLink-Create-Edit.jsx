import { useEffect } from "react";
import { Box } from "@mui/material";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonDescriptionField from "../../../components/common/fields/NDE-DescriptionField";
import CommonDialog from "../../../components/common/NDE-Dialog";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  url: yup.string().url("Enter a valid URL").required("Url is required"),
  linkName: yup
    .string()
    .required("Link Name is required")
    .min(3, "Link Name must be at least 3 characters")
    .max(50, "Link Name cannot exceed 50 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description cannot exceed 500 characters"),
});

const ImpLinkDetails = ({ open, setOpen, initialData = null, onSubmitAction }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      url: "",
      linkName: "",
      description: "",
    },
  });

  useEffect(() => {
    reset(initialData || { url: "", linkName: "", description: "" });
  }, [initialData, open, reset]);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    onSubmitAction(data);
    // handleClose();
  };

  return (
    <Box>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title={initialData ? "Edit Imp Link" : "Create Imp Link"}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={initialData ? "Update" : "Submit"}
        cancelLabel="Cancel"
        submitDisabled={!isDirty}
      >
        <Box>
          {/* URL and Link Name fields */}
          {["url", "linkName"].map((fieldName) => (
            <Controller
              key={fieldName}
              name={fieldName}
              control={control}
              render={({ field }) => (
                <CommonTextField
                  label={fieldName
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  {...field}
                  error={!!errors[fieldName]}
                  helperText={errors[fieldName]?.message}
                  mandatory
                  sx={{ mb: 2 }}
                />
              )}
            />
          ))}

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <CommonDescriptionField
                label="Description"
                {...field}
                error={!!errors.description}
                helperText={errors.description?.message}
                mandatory
                sx={{ mb: 2 }}
              />
            )}
          />
        </Box>
      </CommonDialog>
    </Box>
  );
};

export default ImpLinkDetails;
