import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import CommonDrawer from "../../../components/common/NDE-Drawer";
import { useAppPrice, useUpdatePlanPrice } from "../../../hooks/application/application-hooks";
import { CommonNumberField } from "../../common/fields";
import FlowerLoader from "../../common/NDE-loader";

const PlanPriceDrawer = ({ open, handleClose, plan, product }) => {
  const { data, isLoading } = useAppPrice({ plan, product });
  const updatePlanPriceMutation = useUpdatePlanPrice();
  const [rows, setRows] = useState([]);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: { prices: [] },
  });

  useEffect(() => {
    if (data?.data) {
      const transformed = data.data.map((currency) => ({
        currency_code: currency.currency_code,
        currency_id: currency.currency_id,
        prices: currency.prices.map((p) => ({
          ...p,
          register: p.amount.register,
          renewal: p.amount.renewal,
        })),
      }));
      setRows(transformed);
      reset({ prices: transformed });
    }
  }, [data, reset]);

  const handleCancel = () => {
    reset({ prices: rows });
    handleClose();
  };

  const onSubmit = (formData) => {
    const listOfUpdatedPrices = formData.prices.flatMap((currency) =>
      currency.prices.map((price) => ({
        id: price.id,
        currency_id: currency.currency_id,
        billing_cycle: price.billing_cycle,
        amount: {
            register: Number(price.register),   
            renewal: Number(price.renewal),
        }
      }))
    );

    updatePlanPriceMutation.mutate(
      { prices: listOfUpdatedPrices },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  const isProcessing = isLoading || updatePlanPriceMutation.isLoading;

  return (
    <CommonDrawer
      open={open}
      onClose={handleClose}
      title={"Add Plan Prices"}
      onSubmit={handleSubmit(onSubmit)}
      width={900}
      anchor="right"
      actions={[
        { label: "Cancel", variant: "outlined", onClick: handleCancel },
        {
          label: "Save",
          onClick: handleSubmit(onSubmit),
          disabled: isProcessing,
        },
      ]}
    >
      {isProcessing ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <FlowerLoader />
        </Box>
      ) : (
        <Box>
          {rows.map((currency, currencyIndex) => (
            <Box key={currency.currency_id} mb={4}>
              <Typography variant="h6" gutterBottom>
                {currency.currency_code}
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small" sx={{ border: "1px solid #E0E0E0" }}>
                  <TableHead
                    sx={{
                      backgroundColor: "background.default",
                      fontWeight: 600,
                      fontSize: { xs: "12px", sm: "14px" },
                      color: "text.primary",
                      height: 40,
                    }}
                  >
                    <TableRow>
                      <TableCell>Billing Cycle</TableCell>
                      <TableCell>Register Price</TableCell>
                      <TableCell>Renewal Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currency.prices.map((price, priceIndex) => (
                      <TableRow key={price.id}>
                        <TableCell>{price.billing_cycle}</TableCell>
                        <TableCell>
                          <Controller
                            name={`prices.${currencyIndex}.prices.${priceIndex}.register`}
                            control={control}
                            render={({ field }) => (
                              <CommonNumberField {...field} size="small" fullWidth />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`prices.${currencyIndex}.prices.${priceIndex}.renewal`}
                            control={control}
                            render={({ field }) => (
                              <CommonNumberField {...field} size="small" fullWidth />
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
        </Box>
      )}
    </CommonDrawer>
  );
};

export default PlanPriceDrawer;
