import React, { useState } from "react";
import { DateRange } from "react-date-range";
import { addDays, format } from "date-fns";
import "react-date-range/dist/styles.css"; 
import "react-date-range/dist/theme/default.css"; 
import { Box, TextField, Popover, Button } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const FilterDatePicker = ({ dateValue, onDateChange }) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const defaultRange = {
    startDate: addDays(new Date(), -7),
    endDate: new Date(),
    key: "selection",
  };

  const [tempRange, setTempRange] = useState({
    startDate: dateValue.start_date || defaultRange.startDate,
    endDate: dateValue.end_date || defaultRange.endDate,
    key: "selection",
  });

  const [selectedRange, setSelectedRange] = useState(tempRange);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleCancel = () => {
    setTempRange(selectedRange);
    setOpen(false);
  };

  const handleApply = () => {
    setSelectedRange(tempRange);
    setOpen(false);

    // Pass selected date range to parent
    onDateChange &&
      onDateChange({
        start_date: tempRange.startDate,
        end_date: tempRange.endDate,
      });
  };

  const handleSelect = (ranges) => {
    setTempRange(ranges.selection);
  };

  const formattedValue = `${format(
    selectedRange.startDate,
    "MM/dd/yyyy"
  )} - ${format(selectedRange.endDate, "MM/dd/yyyy")}`;

  return (
    <Box>
      <TextField
        value={formattedValue}
        onClick={handleClick}
        InputProps={{
          startAdornment: (
            <CalendarTodayIcon
              style={{ marginRight: 8, cursor: "pointer", color: "#919191", fontSize: 20 }}
            />
          ),
          readOnly: true,
        }}
        fullWidth
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            "& fieldset": { border: "1px solid #D1D1D1" },
            height: 40,
            display: "flex",
            alignItems: "center",
          },
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box p={2}>
          <DateRange
            editableDateInputs={true}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            ranges={[tempRange]}
          />

          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleApply}>
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default FilterDatePicker;
