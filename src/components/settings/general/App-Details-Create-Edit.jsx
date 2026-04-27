import { useEffect } from "react";
import { Box } from "@mui/material";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonNumberField from "../../../components/common/fields/NDE-NumberField";
import CommonDialog from "../../../components/common/NDE-Dialog";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAddAppDetails, useUpdateAppDetails } from "../../../hooks/applist/applist-hooks";
import FlowerLoader from "../../common/NDE-loader";

const schema = yup.object().shape({
  appName: yup.string()
    .required("App Name is required")
    .min(3, "App Name must be at least 3 characters")
    .max(50, "App Name cannot exceed 50 characters"),
  appUrl: yup
    .string()
    .url("Enter a valid URL")
    .required("App URL is required"),
  appVersion: yup
    .number()
    .typeError("App version must be a number")
    // .positive("Version must be greater than 0")
    .required("App version is required"),
});

const AppDetailsForm = ({ open, setOpen, initialData = null, onSubmitAction }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      appName: "",
      appUrl: "",
      appVersion: "",
    },
  });

  console.log(initialData, 'initialData');

  useEffect(() => {
    reset(
      initialData || {
        appName: "",
        appUrl: "",
        appVersion: "",
      }
    );
  }, [initialData, open, reset]);

  const { mutate: addAppDetail, isPending: adding } = useAddAppDetails();
  const { mutate: updateAppDetail, isPending: updating } = useUpdateAppDetails();

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (formData) => {
    if (initialData?._id) {
      updateAppDetail(formData,
        {
          onSuccess: () => {
            onSubmitAction();
            handleClose();
          },
        }
      );
    } else {
      addAppDetail(formData, {
        onSuccess: () => {
          onSubmitAction();
          handleClose();
        },
      });
    }
  };

  return (
    <Box>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title={initialData ? "Edit App Detail" : "Create App Detail"}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={initialData ? (updating ? <FlowerLoader color="white" size={10} /> : "Update") : adding ? <FlowerLoader color="white" size={10} /> : "Submit"}
        cancelLabel="Cancel"
        submitDisabled={!isDirty}
      >
        <Box>
          <Controller
            name="appName"
            control={control}
            render={({ field }) => (
              <CommonTextField
                label="App Name"
                type="text"
                {...field}
                error={!!errors.appName}
                helperText={errors.appName?.message}
                mandatory={true}
              />
            )}
          />

          <Controller
            name="appUrl"
            control={control}
            render={({ field }) => (
              <CommonTextField
                label="App URL"
                type="text"
                {...field}
                error={!!errors.appUrl}
                helperText={errors.appUrl?.message}
                mandatory={true}
              />
            )}
          />

          <Controller
            name="appVersion"
            control={control}
            render={({ field }) => (
              <CommonNumberField
                label="App Version"
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                error={!!errors.appVersion}
                helperText={errors.appVersion?.message}
                mandatory={true}
                min={0}
                step={1}
              />
            )}
          />
        </Box>
      </CommonDialog>
    </Box>
  );
};

export default AppDetailsForm;
