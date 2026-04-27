import { Box, IconButton, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import CommonButton from "../../common/NDE-Button";
import SubscriptionForm from "./SubscriptionForm";


const ValidationSchema = yup.object().shape({
  customer_id: yup
    .object({
      value: yup.string().required(),
      label: yup.string().required(),
    })
    .nullable()
    .required("Customer is required"),
});

const SubscriptionCreateEdit = () => {

  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    getValues,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(ValidationSchema),
    mode: "onChange",
    defaultValues: {
      payment_date: new Date(),
      taxDeducted: "false",
    },
  });

  const navigate = useNavigate();


  const handleClose = () => {
    navigate(-1)
  };


  const onSubmit = (data) => {
  };



  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          p: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4">
          New Subscription
        </Typography>

        <IconButton onClick={handleClose} color="error">
          <CloseIcon sx={{ color: 'error.main' }} />
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto" }}>

        <SubscriptionForm
          control={control}
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
          getValues={getValues}
        />
      </Box>
      <Box sx={{ position: "sticky", bottom: 0, p: 1, display: "flex", gap: 2 }}>
        <CommonButton
          label={"Create"}
          onClick={handleSubmit(onSubmit)}
          disabled={!isDirty}
          startIcon
        />
        <CommonButton label="Cancel" variant="outlined" onClick={handleClose} startIcon />
      </Box>
    </Box>
  );
};

export default SubscriptionCreateEdit;
