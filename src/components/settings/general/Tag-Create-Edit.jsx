import { useEffect } from "react";
import { Box } from "@mui/material";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonDialog from "../../../components/common/NDE-Dialog";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  tag: yup.string().required("Tag is required"),
  code: yup.string().required("Code is required"),
});

const TagDetails = ({ open, setOpen, initialData = null, onSubmitAction }) => {
    
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      tag: "",
      code: "",
    },
  });

  useEffect(() => {
    reset(initialData || {
      tag: "",
      code: "",
    });
  }, [initialData, open, reset]);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    onSubmitAction(data); 
    handleClose();
  };

  return (
    <Box>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title={initialData ? "Edit Tag Details" : "Create Tag Details"}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={initialData ? "Update" : "Submit"}
        cancelLabel="Cancel"
      >
        <Box>
          {["tag", "code"].map((fieldName) => (
            <Controller
              key={fieldName}
              name={fieldName}
              control={control}
              render={({ field }) => (
                <CommonTextField
                  label={fieldName
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  type= "text"
                  {...field}
                  error={!!errors[fieldName]}
                  helperText={errors[fieldName]?.message}
                  mandatory={true}
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

export default TagDetails;
