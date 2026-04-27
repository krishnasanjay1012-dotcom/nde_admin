import React from "react";
import { Box, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import {
  CommonTextField,
  CommonSelect,
  CommonDatePicker,
  CommonDescriptionField,
} from "../../common/fields";
import CustomerDropdownList from "../../Sales/Invoices/Components/CustomerDropdownList";

const CustomerAdvance = ({ control, errors }) => {
  return (
    <Box display="flex" flexDirection="column">
      {/* Customer Dropdown */}
      <CustomerDropdownList
        control={control}
        errors={errors}
        placeofsupply={true}
      />

      <Box display="flex" flexWrap="wrap" gap={2}>
        {/* Amount Received */}
        <Box flexBasis={{ xs: "100%", sm: "48%" }}>
          <Controller
            name="amountreceived"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="Amount Received"
                fullWidth
                type="number"
                inputProps={{ min: 0, step: "1" }}
                mb={0}
                mandatory
                error={!!errors.amountreceived}
                helperText={errors.amountreceived?.message}
                startAdornment={
                  <Box
                    sx={{
                      width: "45px",
                      backgroundColor: "#f9f9fb",
                      borderRight: "1px solid #ddd",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "12px",
                    }}
                  >
                    INR
                  </Box>
                }
              />
            )}
          />
        </Box>

        {/* Bank Charges */}
        <Box flexBasis={{ xs: "100%", sm: "48%" }}>
          <Controller
            name="bankcharge"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="Bank Charges (if any)"
                fullWidth
                mb={0}

              />
            )}
          />
        </Box>

        {/* Tax */}
        <Box flexBasis={{ xs: "100%", sm: "48%" }}>
          <Controller
            name="tax"
            control={control}
            render={({ field }) => (
              <CommonSelect
                {...field}
                label="Tax"
                fullWidth
                mb={0}

                options={[
                  { label: "GST0 [0%]", value: "gst0" },
                  { label: "GST12 [12%]", value: "gst12" },
                ]}
              />
            )}
          />
        </Box>

        {/* Payment Date */}
        <Box flexBasis={{ xs: "100%", sm: "48%" }}>
          <Controller
            name="paymentdate"
            control={control}
            render={({ field }) => (
              <CommonDatePicker
                {...field}
                label="Payment Date"
                fullWidth
                mb={0}

              
                mandatory
                error={!!errors.paymentdate}
                helperText={errors.paymentdate?.message}
              />
            )}
          />
        </Box>

        {/* Payment # */}
        <Box flexBasis={{ xs: "100%", sm: "48%" }}>
          <Controller
            name="payment"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="Payment #"
                fullWidth
                mb={0}

                mandatory
                error={!!errors.payment}
                helperText={errors.payment?.message}
              />
            )}
          />
        </Box>

        {/* Payment Mode */}
        <Box flexBasis={{ xs: "100%", sm: "48%" }}>
          <Controller
            name="paymentmode"
            control={control}
            render={({ field }) => (
              <CommonSelect
                {...field}
                label="Payment Mode"
                fullWidth
                mb={0}
                options={[
                  { label: "Bank Remittance", value: "bank_remittance" },
                  { label: "Cash", value: "cash" },
                  { label: "Cheque", value: "cheque" },
                  { label: "UPI", value: "upi" },
                ]}
              />
            )}
          />
        </Box>
      </Box>

      {/* Description at the Bottom */}
      <Box mt={1}>
        <Controller
          name="descriptionsupply"
          control={control}
          render={({ field }) => (
            <>
              <CommonDescriptionField
                {...field}
                label="Description of Supply"
                fullWidth
                
              />
              <Typography sx={{ fontSize: "11px", fontWeight: 300 }}>
                Will be displayed on the Payment Receipt
              </Typography>
            </>
          )}
        />
      </Box>
    </Box>
  );
};

export default CustomerAdvance;
