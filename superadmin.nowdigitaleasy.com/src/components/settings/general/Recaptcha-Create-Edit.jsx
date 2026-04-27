import { useEffect } from "react";
import { Box } from "@mui/material";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonSelect from "../../../components/common/fields/NDE-Select";
import CommonDialog from "../../../components/common/NDE-Dialog";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useAddRecaptcha,
  useUpdateRecaptchaStatus,
} from "../../../hooks/settings/recaptcha-hooks";
import FlowerLoader from "../../common/NDE-loader";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email")
    .matches(/\.com$/, "Email must end with .com")
    .required("Email is required"),
  site_key: yup.string().required("Site key is required"),
  owner_key: yup.string().required("Owner key is required"),
  status: yup.boolean().required("Status is required"),
});

const RecaptchaForm = ({ open, setOpen, initialData = null, onSubmitAction }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      email: "",
      site_key: "",
      owner_key: "",
      status: true,
    },
  });

  useEffect(() => {
    reset(
      initialData || {
        email: "",
        site_key: "",
        owner_key: "",
        status: true,
      }
    );
  }, [initialData, open, reset]);

  const { mutate: addRecaptcha, isPending: adding } = useAddRecaptcha();
  const { mutate: updateRecaptcha, isPending: updating } = useUpdateRecaptchaStatus();

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (formData) => {
    if (initialData?._id) {
      updateRecaptcha(
        { id: initialData._id, ...formData },
        {
          onSuccess: () => {
            onSubmitAction();
            handleClose();
          },
        }
      );
    } else {
      addRecaptcha(formData, {
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
        title={initialData ? "Edit Recaptcha" : "Create Recaptcha"}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={
          initialData
            ? updating
              ? <FlowerLoader color="white" size={10} />
              : "Update"
            : adding
              ? <FlowerLoader color="white" size={10} />
              : "Submit"
        }
        cancelLabel="Cancel"
        submitDisabled={!isDirty}
      >
        <Box>

          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <CommonTextField
                label="Email"
                type="email"
                {...field}
                error={!!errors.email}
                helperText={errors.email?.message}
                mandatory={true}
                disabled={initialData}

              />
            )}
          />

          {/* Site Key */}
          <Controller
            name="site_key"
            control={control}
            render={({ field }) => (
              <CommonTextField
                label="Site Key"
                type="text"
                {...field}
                error={!!errors.site_key}
                helperText={errors.site_key?.message}
                mandatory={true}
                disabled={initialData}

              />
            )}
          />

          {/* Owner Key */}
          <Controller
            name="owner_key"
            control={control}
            render={({ field }) => (
              <CommonTextField
                label="Owner Key"
                type="text"
                {...field}
                error={!!errors.owner_key}
                helperText={errors.owner_key?.message}
                mandatory={true}
                disabled={initialData}

              />
            )}
          />

          {/* Status Select */}
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <CommonSelect
                label="Status"
                options={[
                  { label: "Active", value: true },
                  { label: "Inactive", value: false },
                ]}
                {...field}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                error={!!errors.status}
                helperText={errors.status?.message}
                mandatory={true}
              />
            )}
          />

        </Box>
      </CommonDialog>
    </Box>
  );
};

export default RecaptchaForm;
