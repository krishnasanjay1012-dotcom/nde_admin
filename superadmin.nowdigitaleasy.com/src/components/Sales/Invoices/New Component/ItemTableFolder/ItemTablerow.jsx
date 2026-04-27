import {
  Box,
  IconButton,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import CreatableAutocomplete from "../../../../common/NDE-CreatableAutocomplete";
import {
  CommonDescriptionField,
  CommonSelect,
} from "../../../../common/fields";
import ItemTaxDropdown from "../ItemTaxDropdown";
import FlowerLoader from "../../../../common/NDE-loader";

const EMPTY_TAX = { taxName: "", percentage: 0, amount: 0 };

const isManualProduct = (pricingId, productOptions) => {
  if (!pricingId) return false;
  if (typeof pricingId !== "string") return false;
  return !productOptions.some((o) => o.value === pricingId);
};

export default function ItemTableRow({
  row,
  index,
  control,
  setValue,
  errors,
  watchedItems,
  productOptions,
  isLoadingVariants,
  getPricingOptions,
  remove,
  edit,
  watch,
}) {
  const currentPricingId = watchedItems?.[index]?.pricingId;
  const currentProductName = watchedItems?.[index]?.productName; // ← add this

  // ── Detect whether this row is in manual-entry mode ──────────────────────
  const manualMode =
    isManualProduct(currentPricingId, productOptions) ||
    (!currentPricingId && !!currentProductName);
  // Pricing options are only relevant when a catalogue product is selected
  const pricingOptions = manualMode ? [] : getPricingOptions(currentPricingId);

  // ── Clear the entire row back to defaults ────────────────────────────────
  const clearRow = () => {
    const fields = {
      pricingId: "",
      productId: "",
      productName: "",
      planId: "",
      planName: "",
      billingCycleId: "",
      billingCycleLabel: "",
      duration: "",
      durationUnit: "",
      pricingType: "",
      price: 0,
      quantity: 1,
      unit: "",
      description: "",
      tax: EMPTY_TAX,
    };
    Object.entries(fields).forEach(([key, val]) =>
      setValue(`lineItems.${index}.${key}`, val),
    );
    setValue("adjustment", 0);
  };

  // ── Handle product selection OR manual typing ────────────────────────────
  const handleProductChange = (newValue) => {
    if (!newValue) {
      clearRow();
      return;
    }

    const isFromList =
      typeof newValue === "object" && newValue.value && !newValue._isManual;

    if (isFromList) {
      // ── User selected a product from the dropdown list ──────────────────
      setValue(`lineItems.${index}.pricingId`, newValue.value);
      const meta = {
        actualProductId: newValue.productId,
        productName: newValue.productName,
        planId: newValue.planId,
        planName: newValue.planName,
        billingCycleId: newValue.billingCycleId,
        billingCycleLabel: newValue.billingCycleLabel,
        duration: newValue.duration,
        durationUnit: newValue.durationUnit,
        unit: newValue.unitLabel || "",
        pricingType: "",
        price: 0,
        quantity: 1,
        tax: EMPTY_TAX,
        description: "",
      };
      Object.entries(meta).forEach(([k, v]) =>
        setValue(`lineItems.${index}.${k}`, v),
      );
    } else {
      // ── User manually typed a product name ──────────────────────────────
      const name =
        typeof newValue === "string" ? newValue : (newValue?.label ?? "");

      // Store the typed name as pricingId — isManualProduct() will detect this
      setValue(`lineItems.${index}.pricingId`, "");
      setValue(`lineItems.${index}.productName`, name);

      // Clear catalogue-specific fields; price/quantity stay editable
      const manualMeta = {
        actualProductId: "",
        planId: "",
        planName: "",
        billingCycleId: "",
        billingCycleLabel: "",
        duration: "",
        durationUnit: "",
        unit: "",
        pricingType: "", // no pricing-type dropdown in manual mode
        tax: EMPTY_TAX,
        description: "",
      };
      Object.entries(manualMeta).forEach(([k, v]) =>
        setValue(`lineItems.${index}.${k}`, v),
      );
    }
  };

  // ── Resolve the value shown inside the product autocomplete ──────────────
  const resolvedProductValue = (() => {
    if (!currentPricingId && !currentProductName) return null;

    if (currentPricingId) {
      const matched = productOptions.find((o) => o.value === currentPricingId);
      if (matched) return matched;
    }

    if (currentProductName) {
      return {
        label: currentProductName,
        value: currentProductName,
        _isManual: true,
      };
    }

    return null;
  })();

  // ── Loading placeholder while product options are being fetched ──────────
  if (edit && productOptions?.length === 0) {
    return (
      <TableRow key={row.id}>
        <TableCell sx={{ verticalAlign: "center" }}>
          <FlowerLoader size={10} />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow key={row.id}>
      {/* ── Product + Pricing Type + Description ─────────────────────────── */}
      <TableCell
        sx={{
          borderBottom: "1px solid #e0e0e0",
          borderRight: "1px solid #e0e0e0",
          verticalAlign: "top",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
            {/* Product — select from list OR type freely */}
            <Box sx={{ flex: 1, minWidth: "200px" }}>
              <Controller
                name={`lineItems.${index}.pricingId`}
                control={control}
                render={() => (
                  <CreatableAutocomplete
                    options={productOptions}
                    loading={isLoadingVariants}
                    placeholder="Select or type product…"
                    value={resolvedProductValue}
                    onChange={handleProductChange}
                    filterKeys={[
                      "planName",
                      "dropdownlabel",
                      "billingCycleLabel",
                    ]}
                    height={32}
                    mt={0}
                    mb={0}
                    renderOption={(props, option) => (
                      <li {...props} style={{ padding: 0, display: "block" }}>
                        <Box sx={{ p: 1, borderBottom: "1px solid #f0f0f0" }}>
                          <Typography
                            fontWeight={600}
                            fontSize={13}
                            color="text.secondary"
                          >
                            {option.dropdownlabel || option.label}
                          </Typography>
                          {option.planName && (
                            <Typography
                              variant="caption"
                              fontSize={11}
                              color="text.secondary"
                            >
                              {option.planName} - {option.billingCycleLabel}
                            </Typography>
                          )}
                        </Box>
                      </li>
                    )}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: 13,
                        minHeight: "32px",
                        height: "32px",
                        padding: "0 8px !important",
                      },
                      "& .MuiAutocomplete-input": { padding: "0 !important" },
                    }}
                    error={!!errors?.lineItems?.[index]?.productName}
                    helperText={
                      errors?.lineItems?.[index]?.productName?.message
                    }
                  />
                )}
              />
            </Box>

            {/*
              Pricing Type — only shown when a catalogue product is selected.
              Hidden completely in manual mode (user sets price directly).
            */}
            {!manualMode && (
              <Box sx={{ width: "180px" }}>
                <Controller
                  name={`lineItems.${index}.pricingType`}
                  control={control}
                  render={({ field }) => {
                    const isDisabled = !currentPricingId;
                    return (
                      <CommonSelect
                        {...field}
                        options={pricingOptions}
                        disabled={isDisabled}
                        value={field.value || ""}
                        onChange={(e) => {
                          const selectedType = e.target.value;
                          field.onChange(selectedType);
                          const selectedPricing = pricingOptions.find(
                            (p) => p.value === selectedType,
                          );
                          if (selectedPricing) {
                            setValue(
                              `lineItems.${index}.price`,
                              selectedPricing.price,
                            );
                            setValue(`lineItems.${index}.quantity`, 1);
                            const quantity = watch(
                              `lineItems.${index}.quantity`,
                            );
                            const defaultTax = {
                              taxName: "GST 18",
                              percentage: 18,
                              amount:
                                (selectedPricing.price * quantity * 18) / 100,
                            };
                            setValue(`lineItems.${index}.tax`, defaultTax);
                          }
                        }}
                        placeHolder={
                          isDisabled ? "Select Product First" : "Pricing Type"
                        }
                        height={32}
                        mt={0}
                        mb={0}
                        sx={{ width: "100%" }}
                        error={!!errors?.lineItems?.[index]?.pricingType}
                        helperText={
                          errors?.lineItems?.[index]?.pricingType?.message
                        }
                      />
                    );
                  }}
                />
              </Box>
            )}

            {/* Clear row */}
            <IconButton
              size="small"
              onClick={clearRow}
              sx={{
                height: "32px",
                width: "32px",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                color: "#757575",
                "&:hover": {
                  bgcolor: "#ffebee",
                  color: "#d32f2f",
                  borderColor: "#ef9a9a",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Description */}
          <Controller
            name={`lineItems.${index}.description`}
            control={control}
            render={({ field }) => (
              <CommonDescriptionField
                {...field}
                placeholder="Description"
                rows={2}
                mt={0}
                mb={0}
                sx={{ "& .MuiOutlinedInput-root": { fontSize: 13 } }}
              />
            )}
          />
        </Box>
      </TableCell>

      {/* ── Quantity ──────────────────────────────────────────────────────── */}
      <TableCell
        align="center"
        sx={{
          padding: "5px 8px",
          borderBottom: "1px solid #e0e0e0",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <Controller
          name={`lineItems.${index}.quantity`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              size="small"
              inputProps={{ max: 100, min: 1 }}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || Number(val) >= 1) field.onChange(val);
              }}
              onKeyDown={(e) => {
                if (["-", "e", "E", "+"].includes(e.key)) e.preventDefault();
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: 14,
                  height: "32px",
                  width: "150px",
                  "& input": {
                    textAlign: "right",
                    padding: "0 8px",
                    height: "32px",
                    boxSizing: "border-box",
                  },
                },
                "& input[type=number]::-webkit-inner-spin-button": {
                  display: "none",
                },
                "& input[type=number]::-webkit-outer-spin-button": {
                  display: "none",
                },
              }}
              error={!!errors?.lineItems?.[index]?.quantity}
              helperText={errors?.lineItems?.[index]?.quantity?.message}
            />
          )}
        />
      </TableCell>

      {/* ── Tax ───────────────────────────────────────────────────────────── */}
      <TableCell
        align="left"
        sx={{
          padding: "5px 8px",
          borderBottom: "1px solid #e0e0e0",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <Controller
          name={`lineItems.${index}.tax`}
          control={control}
          render={({ field }) => (
            <ItemTaxDropdown
              {...field}
              value={field.value}
              onChange={(val) => field.onChange(val)}
              setValue={setValue}
              index={index}
              watchedItems={watchedItems}
            />
          )}
        />
      </TableCell>

      {/* ── Price — always editable; auto-filled when pricing type chosen ──── */}
      <TableCell
        align="center"
        sx={{
          borderBottom: "1px solid #e0e0e0",
          borderRight: "1px solid #e0e0e0",
          padding: "5px 8px",
        }}
      >
        <Controller
          name={`lineItems.${index}.price`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: 14,
                  height: "32px",
                  "& input": {
                    textAlign: "right",
                    padding: "0 8px",
                    height: "32px",
                    boxSizing: "border-box",
                  },
                },
                "& input[type=number]::-webkit-inner-spin-button": {
                  display: "none",
                },
                "& input[type=number]::-webkit-outer-spin-button": {
                  display: "none",
                },
              }}
            />
          )}
        />
      </TableCell>

      {/* ── Row Total ─────────────────────────────────────────────────────── */}
      <TableCell
        align="right"
        sx={{
          pr: 2,
          borderBottom: "1px solid #e0e0e0",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <Typography fontSize={14} fontWeight={500}>
          {(() => {
            const total =
              (Number(watchedItems?.[index]?.quantity) || 0) *
              (Number(watchedItems?.[index]?.price) || 0);
            return total.toFixed(2);
          })()}
        </Typography>
      </TableCell>

      {/* ── Remove Row ────────────────────────────────────────────────────── */}
      <TableCell align="center" sx={{ borderBottom: "1px solid #e0e0e0" }}>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => remove(index)}
            sx={{ color: "#d32f2f" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
}
