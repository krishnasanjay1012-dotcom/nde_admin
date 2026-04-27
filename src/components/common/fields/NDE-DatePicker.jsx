import { FormLabel, Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const CommonDatePicker = ({
  label,
  value,
  onChange,
  name,
  error,
  helperText,
  mandatory,
  disabled = false,
  width = "100%",
  height = 40,
  radius = 1.7,
  sx = {},
  mt = 0.5,
  mb = 1,
  disablePast,
  minDate: customMinDate,
  maxDate,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (value && dayjs(value).isValid()) {
      const normalized = dayjs(value)
        .hour(12)
        .minute(0)
        .second(0)
        .toISOString();

      if (value !== normalized) {
        onChange?.({
          target: { name, value: normalized },
        });
      }
    }
  }, []);

  const safeValue = value && dayjs(value).isValid() ? dayjs(value) : null;

  const safeMaxDate =
    maxDate && dayjs(maxDate).isValid() ? dayjs(maxDate) : undefined;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width }}>
        <FormLabel>
          {label}
          {mandatory && <span style={{ color: "red" }}> *</span>}
        </FormLabel>

        <DatePicker
          open={open}
          disabled={disabled} // ✅ disable picker
          onOpen={() => {
            if (!disabled) setOpen(true);
          }}
          onClose={() => setOpen(false)}
          format="DD/MM/YYYY"
          value={safeValue}
          minDate={
            customMinDate
              ? dayjs(customMinDate)
              : disablePast
              ? dayjs().startOf("day")
              : undefined
          }
          maxDate={safeMaxDate}
          onChange={(newValue) => {
            if (disabled) return;

            onChange?.({
              target: {
                name,
                value: newValue
                  ? newValue.hour(12).minute(0).second(0).toISOString()
                  : null,
              },
            });
          }}
          components={{
            OpenPickerIcon: (props) => (
              <CalendarTodayIcon {...props} sx={{ color: "#8A8AA3" }} />
            ),
            LeftArrowIcon: (props) => (
              <ArrowBackIosNewIcon {...props} sx={{ color: "#8A8AA3" }} />
            ),
            RightArrowIcon: (props) => (
              <ArrowForwardIosIcon {...props} sx={{ color: "#8A8AA3" }} />
            ),
          }}
          slotProps={{
            textField: {
              disabled,
              onClick: () => {
                if (!disabled) setOpen(true);
              },
              error,
              helperText,
              fullWidth: true,
              sx: {
                cursor: disabled ? "not-allowed" : "pointer",
                mt,
                mb,

                "& .MuiInputAdornment-root": {
                  display: "none",
                },

                "& .MuiOutlinedInput-root": {
                  borderRadius: radius,
                  height: height,
                  paddingRight: 0,
                  backgroundColor: disabled
                    ? "#F5F5F5" 
                    : "#FFFFFF",
                  "& input": {
                    height: "100%",
                    padding: "0 14px",
                    cursor: disabled ? "not-allowed" : "pointer",
                    color: disabled ? "#9E9E9E" : "inherit",
                  },
                },

                "& fieldset": {
                  border: "1px solid #D1D1D1",
                  borderRadius: radius,
                  height: 45,
                  mt: 0.6,
                },

                "&.Mui-disabled fieldset": {
                  borderColor: "#E0E0E0",
                },

                "& .MuiSvgIcon-root": {
                  color: disabled ? "#BDBDBD" : "#8A8AA3",
                },

                ...sx,
              },
              ...props,
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default CommonDatePicker;