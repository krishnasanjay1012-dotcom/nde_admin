import { useEffect } from "react";
import { Box } from "@mui/material";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonDialog from "../../../components/common/NDE-Dialog";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FlowerLoader from "../../common/NDE-loader";
import { useUpdateS3Config } from "../../../hooks/settings/gsuite";

const schema = yup.object().shape({
  access_token: yup.string().required("Access token is required"),
  secret_access_key: yup.string().required("Secret access key is required"),
  region: yup.string().required("Region is required"),
});

const S3ConfigDetails = ({ open, setOpen, initialData }) => {
  const {
    handleSubmit,
    control,
    formState: { errors ,isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      access_token: "",
      secret_access_key: "",
      region: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        access_token: initialData.access_token || "",
        secret_access_key: initialData.secret_access_key || "",
        region: initialData.region || "",
      });
    }
  }, [initialData, open, reset]);

  const { mutate: updateS3Config, isPending } = useUpdateS3Config();

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (formData) => {
    
    updateS3Config(
      {
        id: initialData._id,
        data: formData,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  if (!initialData) return null;

  return (
    <CommonDialog
      open={open}
      onClose={handleClose}
      title="Edit S3 Configuration"
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={
        isPending ? <FlowerLoader color="white" size={10} /> : "Update"
      }
      cancelLabel="Cancel"
      width={600}
       submitDisabled={!isDirty}
    >
      <Box display="flex" flexDirection="column">
        {/* Access Token */}
        <Controller
          name="access_token"
          control={control}
          render={({ field }) => (
            <CommonTextField
              label="Access Token"
              {...field}
              error={!!errors.access_token}
              helperText={errors.access_token?.message}
              mandatory
            />
          )}
        />

        {/* Secret Access Key */}
        <Controller
          name="secret_access_key"
          control={control}
          render={({ field }) => (
            <CommonTextField
              label="Secret Access Key"
              {...field}
              error={!!errors.secret_access_key}
              helperText={errors.secret_access_key?.message}
              mandatory
              type="password"
            />
          )}
        />

        {/* Region */}
        <Controller
          name="region"
          control={control}
          render={({ field }) => (
            <CommonTextField
              label="Region"
              {...field}
              error={!!errors.region}
              helperText={errors.region?.message}
              mandatory
            />
          )}
        />
      </Box>
    </CommonDialog>
  );
};

export default S3ConfigDetails;
