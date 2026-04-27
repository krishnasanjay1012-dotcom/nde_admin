import { useEffect } from "react";
import { Box } from "@mui/material";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonNumberField from "../../../components/common/fields/NDE-NumberField";
import CommonSelect from "../../../components/common/fields/NDE-Select";
import CommonCheckbox from "../../../components/common/fields/NDE-Checkbox";
import CommonDialog from "../../../components/common/NDE-Dialog";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEnableEmail } from "../../../hooks/settings/email-hooks"; 

const schema = yup.object().shape({
  hostname: yup.string().required("Host Name is required"),
  username: yup.string().required("User Name is required"),
  password: yup.string().required("Password is required"),
  authentication: yup.string().required("Authentication is required"),
  port: yup
    .number()
    .typeError("Port must be a number")
    .required("Port is required")
    .positive("Port must be positive")
    .integer("Port must be an integer"),
  enable: yup.boolean(),
});

const defaultValues = {
  hostname: "",
  username: "",
  password: "",
  authentication: "",
  port: "",
  enable: false,
};

const EmailDetails = ({ open, setOpen, initialData = null, onSubmitAction }) => {
  const { handleSubmit, control, reset, formState: { errors ,isDirty } } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const enableEmailMutation = useEnableEmail();

  useEffect(() => {
    if (initialData) {
      reset({
        hostname: initialData.hostname || "",
        username: initialData.username || "",
        password: initialData.password || "",
        port: initialData.port || "",
        authentication: initialData.authentication || "",
        enable: initialData.enable || false,
      });
    } else {
      reset(defaultValues);
    }
  }, [initialData, open, reset]);

  const handleClose = () => {
    reset(defaultValues);
    setOpen(false);
  };

  const onSubmit = (data) => {
    onSubmitAction(data);
    handleClose();
  };

  const authOptions = [
    { label: "SSL", value: "ssl" },
    { label: "TSL", value: "tsl" },
    { label: "None", value: "none" },
  ];

const handleCheckboxChange = async (checked) => {
  if (initialData?._id) {
    try {
      await enableEmailMutation.mutateAsync({ _id: initialData._id, enable: checked });
      handleClose();
    } catch (error) {
      console.error("Failed to update email status:", error);
    }
  }
};


  return (
    <Box>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title={initialData ? "Edit Email" : "Create New Email"}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={initialData ? "Update" : "Submit"}
        cancelLabel="Cancel"
         submitDisabled={!isDirty}
      >
        {["hostname", "username", "password"].map((fieldName) => (
          <Controller
            key={fieldName}
            name={fieldName}
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label={fieldName
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                error={!!errors[fieldName]}
                helperText={errors[fieldName]?.message}
                mandatory
                sx={{ mb: 2 }}
              />
            )}
          />
        ))}

        <Controller
          name="port"
          control={control}
          render={({ field }) => (
            <CommonNumberField
              {...field}
              label="Port"
              error={!!errors.port}
              helperText={errors.port?.message}
              mandatory
              sx={{ mb: 2 }}
            />
          )}
        />

        <Controller
          name="authentication"
          control={control}
          render={({ field }) => (
            <CommonSelect
              label="Authentication"
              options={authOptions}
              value={field.value}
              onChange={field.onChange}
              error={!!errors.authentication}
              helperText={errors.authentication?.message}
              mandatory
              sx={{ mb: 2 }}
            />
          )}
        />

        <Controller
          name="enable"
          control={control}
          render={({ field }) => (
            <CommonCheckbox
              label="Default Server"
              checked={field.value || false}
              onChange={(e) => {
                field.onChange(e.target.checked);
                handleCheckboxChange(e.target.checked);
              }}
              sx={{ mb: 2 }}
            />
          )}
        />
      </CommonDialog>
    </Box>
  );
};

export default EmailDetails;
