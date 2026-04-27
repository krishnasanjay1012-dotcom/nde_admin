import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  FormControl,
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const schema = Yup.object().shape({
  masterId: Yup.string().required("Please select a master salesperson"),
});

export default function SelectMasterSalespersonDialog({
  open,
  onClose,
  salespersons = [],
  onContinue,
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      masterId: "",
    },
  });

  useEffect(() => {
    if (!open) {
      reset({ masterId: "" });
    }
  }, [open, reset]);

  const onSubmit = (data) => {
    onContinue(data.masterId);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Select Master Salesperson
        <IconButton onClick={onClose}>
          <CloseIcon sx={{ color: "red" }} />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Please select a master salesperson. Once merged, all associated
          transactions will be transferred to the master salesperson.
          Other salespersons will be made inactive.
        </Typography>

        <FormControl error={!!errors.masterId} component="fieldset">
          <Controller
            name="masterId"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field}>
                {salespersons.map((person) => (
                  <FormControlLabel
                    key={person.id}
                    value={String(person.id)}
                    control={<Radio />}
                    label={person.name}
                  />
                ))}
              </RadioGroup>
            )}
          />

          {errors.masterId && (
            <FormHelperText>{errors.masterId.message}</FormHelperText>
          )}
        </FormControl>
      </DialogContent>

      <Divider />

      {/* Footer */}
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
          sx={{
            backgroundColor: "#22a06b",
            textTransform: "none",
            "&:hover": { backgroundColor: "#1b8a5a" },
          }}
        >
          Continue
        </Button>

        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
