import React from "react";
import {  Typography, Box } from "@mui/material";
import { Controller } from "react-hook-form";
import { CommonDescriptionField } from "../common/fields";

const Remarks = ({ control }) => {
  const styles = {
    container: {
      padding: "10px",
      width: "100%",
      margin: "0 auto",
    },
    labelContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "8px",
    },
    label: {
      fontSize: "16px",
      fontWeight: "400",
      fontFamily: "Roboto, sans-serif",
      color: "#000000",
    },
    internalUse: {
      fontSize: "14px",
      color: "#666666",
      fontFamily: "Roboto, sans-serif",
    },
    textField: {
      width: "75%",
      fontFamily: "Roboto, sans-serif",
      "& .MuiOutlinedInput-root": {
        backgroundColor: "primary.contrastText",
        borderRadius: "4px",
        fontFamily: "Roboto, sans-serif",
      },
    },
  };

  return (
    <div style={styles.container}>
      <Box style={styles.labelContainer}>
        <Typography variant="body1">Remarks</Typography>
        <Typography variant="body1">(For Internal Use)</Typography>
      </Box>
      <Controller
        name="remarks"
        control={control}
        render={({ field }) => (
          <CommonDescriptionField
            {...field}
            placeholder="Enter Remarks"
            sx={{ mb: 0 }}
            width="600px"
          />
        )}
      />
    </div>
  );
};

export default Remarks;
