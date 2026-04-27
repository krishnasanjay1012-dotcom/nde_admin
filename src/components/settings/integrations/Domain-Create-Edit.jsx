import { useEffect } from "react";
import { Box } from "@mui/material";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonDialog from "../../../components/common/NDE-Dialog";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


const schema = yup.object().shape({
  customerId: yup
    .string()
    .matches(/^[0-9]+$/, "Only numbers are allowed")
    .required("Customer ID is required"),
  aliasName: yup.string().required("Alias Name is required"),
  apiKey: yup.string().required("API Key is required"),
  userId: yup
    .string()
    .matches(/^[0-9]+$/, "Only numbers are allowed")
    .required("User ID is required"),
});

const DomainDetails = ({ open, setOpen, initialData, onSubmitAction }) => {


  const { handleSubmit, control, reset, formState: { errors, isDirty } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      customerId: "",
      aliasName: "",
      apiKey: "",
      userId: "",
    },
  });

  // Prefill form on edit
  useEffect(() => {
    if (initialData) {
      const mappedData = {
        customerId: initialData.customerId || "",
        aliasName: initialData.aliasName || "",
        apiKey: initialData.apikey || "",
        userId: initialData.userId || "",
      };
      reset(mappedData);
    } else {
      reset({
        customerId: "",
        aliasName: "",
        apiKey: "",
        userId: "",
      });
    }
  }, [initialData, reset]);


  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    const payload = {
      authuserId: Number(data.userId),
      apiKey: data.apiKey,
      enable: true,
      customerID: Number(data.customerId),
      aliasName: data.aliasName,
    };

    onSubmitAction(payload);
    // handleClose();
  };


  return (
    <Box>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title={initialData ? "Edit Reseller Details" : "Create Reseller Details"}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={initialData ? "Update" : "Submit"}
        cancelLabel="Cancel"
        submitDisabled={!isDirty}
      >
        <Box>
          {["customerId", "aliasName", "apiKey", "userId"].map((fieldName) => (
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
                  type="text"
                  error={!!errors[fieldName]}
                  helperText={errors[fieldName]?.message}
                  mandatory
                  sx={{ mb: 2 }}
                />
              )}
            />
          ))}
        </Box>
      </CommonDialog>
    </Box>
  );
};

export default DomainDetails;
