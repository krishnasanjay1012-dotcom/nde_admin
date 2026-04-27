import { useState, useEffect } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const CommonYearDatePicker = ({
  value,
  onChange,
  views = ["year"],
  minDate,
  maxDate,
  iconColor = "#919191",
  height = 44
}) => {
  const [selectedDate, setSelectedDate] = useState(value || new Date());

  useEffect(() => {
    setSelectedDate(value || new Date());
  }, [value]);

  const handleChange = (newValue) => {
    setSelectedDate(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        views={views}
        value={selectedDate}
        onChange={handleChange}
        minDate={minDate}
        maxDate={maxDate}
        slotProps={{
          textField: {
            InputProps: {
              disableUnderline: true,
              sx: {
                borderRadius: "6px",
                height,
                width: 130,
                px: 1,
              },
            },
          },
          openPickerButton: {
            sx: {
              color: iconColor,
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default CommonYearDatePicker;
