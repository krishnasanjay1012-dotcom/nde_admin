import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
} from "@mui/material";
import { Controller, useFieldArray,useWatch } from "react-hook-form";
import CommonAutocomplete from "../../../components/common/fields/NDE-Autocomplete";
import CommonNumberField from "../../../components/common/fields/NDE-NumberField";
import CommonSelect from "../../../components/common/fields/NDE-Select";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppPrice } from "../../../hooks/application/application-hooks";


const PlanRow = ({ field, index, control, remove, plansOptions }) => {
  const [selectedPlan, setSelectedPlan] = useState(field.plan || null);
  const [currencyPrices, setCurrencyPrices] = useState([]);
  const [selectedPriceAmount, setSelectedPriceAmount] = useState(0);

  const planId = selectedPlan?.fullData?._id || null;
  const productId = selectedPlan?.fullData?.productId || null;

  const { data } = useAppPrice({ plan: planId, product: productId });
  const priceData = data?.data || [];

  const currencyOptions = priceData.map((price) => ({
    value: price.currency_code,
    label: price.currency_code,
    prices: price.prices || [],
  }));

  const quantity = useWatch({
    control,
    name: `plans.${index}.quantity`,
    defaultValue: field.quantity || 1,
  });

  

  return (
    <TableRow>
      {/* Plan Name */}
      <TableCell>
        <Controller
          name={`plans.${index}.plan`}
          control={control}
          render={({ field: controllerField }) => (
            <CommonAutocomplete
              {...controllerField}
              value={controllerField.value || null}
              options={plansOptions}
              placeholder="Select Plan"
              onChange={(val) => {
                controllerField.onChange(val);
                setSelectedPlan(val);
                setCurrencyPrices([]);
                setSelectedPriceAmount(0); 
              }}
              height={44}
              width="150px"
            />
          )}
        />
      </TableCell>

      {/* Currency */}
      <TableCell>
        <Controller
          name={`plans.${index}.currency`}
          control={control}
          render={({ field: controllerField }) => (
            <CommonSelect
              {...controllerField}
              options={currencyOptions}
              placeholder="Select Currency"
              onChange={(selectedValueOrEvent) => {
                const value =
                  selectedValueOrEvent?.target?.value ?? selectedValueOrEvent;

                controllerField.onChange(value);

                const selectedCurrencyOption = currencyOptions.find(
                  (option) => option.value === value
                );

                setCurrencyPrices(selectedCurrencyOption?.prices || []);
              }}
              width="120px"
            />
          )}
        />
      </TableCell>

      {/* Price */}
      <TableCell>
        <Controller
          name={`plans.${index}.price`}
          control={control}
          render={({ field: controllerField }) => (
            <CommonSelect
              {...controllerField}
              options={currencyPrices.map((p) => ({
                value: p.id,
                label: `${p.billing_cycle} - ${p.amount?.register}`,
              }))}
              placeholder="Select Price"
              onChange={(eventOrValue) => {
                const val = eventOrValue?.target?.value ?? eventOrValue;
                const selectedPrice = currencyPrices.find((p) => p.id === val);
                controllerField.onChange(val);
                setSelectedPriceAmount(selectedPrice?.amount?.register || 0);
              }}
              width="150px"
            />
          )}
        />
      </TableCell>

      {/* Quantity */}
      <TableCell>
        <Controller
          name={`plans.${index}.quantity`}
          control={control}
          render={({ field: controllerField }) => (
            <CommonNumberField
              {...controllerField}
              min={1}
              onChange={(e) => controllerField.onChange(Number(e.target.value))}
            />
          )}
        />
      </TableCell>

      {/* Amount */}
      <TableCell>
        Rs. {(selectedPriceAmount * quantity).toFixed(2)}
      </TableCell>

      {/* Remove row */}
      <TableCell>
        <IconButton onClick={() => remove(index)} color="error">
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};



const SubscriptionPlansTable = ({ control, availablePlans }) => {
  const plansOptions = Array.isArray(availablePlans)
    ? availablePlans.map((p) => ({
        value: p._id,
        label: p.planName,
        fullData: p,
      }))
    : [];

  const { fields, append, remove } = useFieldArray({
    control,
    name: "plans",
  });
 
    const selectedProduct = useWatch({
    control,
    name: "product",
  });

  useEffect(() => {
    remove(); 
  }, [selectedProduct, remove]);
  return (
    <Box>
      <Box sx={{ mb: 2, pb: 1, borderBottom: "1px solid #ccc" }}>
        <Typography variant="h6" fontWeight={600}>
          Subscription Plans
        </Typography>
      </Box>

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Plan Name</TableCell>
            <TableCell>Currency</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {fields.map((field, index) => (
            <PlanRow
              key={field.id}
              field={field}
              index={index}
              control={control}
              remove={remove}
              plansOptions={plansOptions}
            />
          ))}

          {/* Add new plan */}
          <TableRow>
            <TableCell colSpan={6}>
              <Button
                type="button"
                variant="contained"
                onClick={() =>
                  append({ plan: null, quantity: 1, price: 0, currency: null })
                }
                disabled={fields.length >= 1}
              >
                + Add Plan
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export default SubscriptionPlansTable;
