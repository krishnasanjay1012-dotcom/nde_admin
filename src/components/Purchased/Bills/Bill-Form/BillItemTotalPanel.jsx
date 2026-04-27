import {
  Box,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useWatch } from "react-hook-form";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  CommonSelect,
  CommonTextField,
  CustomSearchableSelect,
} from "../../../common/fields";
import CommonButton from "../../../common/NDE-Button";
import { useEffect, useMemo, useRef, useState } from "react";
import ReusableRadioGroup from "../../../common/fields/NDE-RadioButton";
import FormRow from "../../../Sales/Invoices/New Component/FormRow";
import CommonPopoverWithArrow from "../../../common/fields/NDE-PopoverWithArrow";

export default function BillItemTotalPanel({
  control,
  register,
  watch,
  setValue,
  subTotal,
  // baseAmount,
  discountAmount,
  taxBreakdown,
  // totalTaxAmount,
  adjustment,
  totalAmount,
  tdsamountvalue,
  tdstaxcalculation,
  taxData,
  rateMap,
  isTDS,
  onEditTDSClick,
  onOpenManageTds,
  onAddRow,
  isInclusive,
  errors,
  accountOptions,
  isReverse,
  setError,
  clearErrors,
}) {
  const isdiscountValue = watch("discountValue");
  const isAdjustmentValue = watch("adjustment");
  const adjustmentRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpenPopover = () => {
    if (!isAdjustmentValue) return;
    setAnchorEl(adjustmentRef.current);
    setOpen(true);
  };

  const handleUpdate = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleCancel = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const taxType = watch("taxType");

  const expenseOptions = useMemo(() => {
    return accountOptions?.filter((item) => item.group === "expense");
  }, [accountOptions]);
  const selectedTdsId = useWatch({ control, name: "tdsTaxId" });
  // const tdsamountvalue = useWatch({ control, name: "tdsValue" });

  console.log(tdsamountvalue, "tddssss");

  useEffect(() => {
    if (!selectedTdsId) {
      setValue("tdsValue", 0, { shouldDirty: true, shouldValidate: true });
      return;
    }

    const rate = Number(rateMap?.[selectedTdsId]) || 0;
    const base = Number(tdstaxcalculation) || 0;
    const calculated = (rate / 100) * base;

    setValue("tdsValue", calculated, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [selectedTdsId, tdstaxcalculation, rateMap, setValue]);

  useEffect(() => {
    const numericTotal = Number(totalAmount) || 0;
    if (numericTotal < 0) {
      setError("total", {
        type: "manual",
        message:
          "Please ensure that the total amount is greater than or equal to zero.",
      });
    } else {
      clearErrors("total");
    }
  }, [totalAmount]);
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        gap: 4,
        alignItems: "flex-start",
        mt: 2.5,
      }}
    >
      {/* ── Left side: Add Row button ───────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "50%",
        }}
      >
        <CommonButton
          label="Add New Row"
          onClick={onAddRow}
          variant="text"
          color="primary"
          sx={{
            textTransform: "none",
            fontSize: 14,
            fontWeight: 500,
            px: 0,
            mb: 3,
            width: "200px",
          }}
        />
      </Box>

      {/* ── Right side: Summary panel ───────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "background.muted",
          borderRadius: 2,
          width: "544px",
          gap: 2.5,
          padding: "10px 15px",
          ml: "auto",
          mt: 2.5,
        }}
      >
        {/* SubTotal row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
              SubTotal
            </Typography>
            {/* Inclusive: show "(Tax Inclusive)" below SubTotal label */}
            {isInclusive && (
              <Typography sx={{ fontSize: 11, color: "#888", mt: 0.25 }}>
                (Tax Inclusive)
              </Typography>
            )}
          </Box>
          <Typography sx={{ fontSize: 13 }}>{subTotal.toFixed(2)}</Typography>
        </Box>

        {/* Discount row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: isInclusive ? "50px" : "120px",
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 13 }}>Discount</Typography>
                {/* Inclusive: show "(Apply on Base Amount)" below Discount label */}
                {isInclusive && (
                  <Typography sx={{ fontSize: 11, color: "#888", mt: 0.25 }}>
                    (Apply on Base Amount)
                  </Typography>
                )}
              </Box>

              {/* <Controller
                name="discountValue"
                control={control}
                render={({ field }) => (
                  <TextField
                    size="small"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (!/^\d*\.?\d{0,2}$/.test(val)) return;
                      field.onChange(val);
                    }}
                    sx={{
                      width: "120px",
                      "& .MuiInputBase-root": { height: "32px", fontSize: 13 },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Controller
                            name="discountType"
                            control={control}
                            render={({ field: typeField }) => (
                              <Select
                                {...typeField}
                                value={typeField.value || "percentage"}
                                onChange={(e) =>
                                  typeField.onChange(e.target.value)
                                }
                                sx={{
                                  height: "32px",
                                  fontSize: 13,
                                  border: "none",
                                  boxShadow: "none",
                                  "& fieldset": { border: "none" },
                                }}
                              >
                                <MenuItem value="percentage">%</MenuItem>
                                <MenuItem value="amount">₹</MenuItem>
                              </Select>
                            )}
                          />
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors?.discountValue}
                    helperText={errors?.discountValue?.message}
                  />
                )}
              /> */}

              {/* <Controller
                name="discountValue"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (!/^\d*\.?\d{0,2}$/.test(val)) return;
                      field.onChange(val);
                    }}
                    width="120px"
                    height={32}
                    mt={0}
                    mb={0}
                    error={!!errors?.discountValue}
                    helperText={errors?.discountValue?.message}
                    endAdornment={
                      <Controller
                        name="discountType"
                        control={control}
                        render={({ field: typeField }) => (
                          <CommonSelect
                            value={typeField.value || "percentage"}
                            onChange={(e) => typeField.onChange(e.target.value)}
                            options={[
                              { label: "%", value: "percentage" },
                              { label: "₹", value: "value" },
                            ]}
                            labelKey="label"
                            valueKey="value"
                            clearable={false}
                            height={32}
                            mt={0}
                            mb={0}
                            sx={{
                              width: "50px",
                              ml: 6,
                              backgroundColor: "grey.100",
                              "& .MuiSelect-select": {
                                mr: -2,
                              },
                            }}
                          />
                        )}
                      />
                    }
                  />
                )}
              /> */}

              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
                {/* Discount Value Input */}
                <Controller
                  name="discountValue"
                  control={control}
                  render={({ field }) => (
                    <CommonTextField
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (!/^\d*\.?\d{0,2}$/.test(val)) return;
                        field.onChange(val);
                      }}
                      width="80px"
                      height={32}
                      mt={0}
                      mb={0}
                      error={!!errors?.discountValue}
                      helperText={errors?.discountValue?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "6px 0px 0px 6px",
                          "& fieldset": {
                            borderRight: "none",
                          },
                          width: "80px",
                          height: 32,
                          mt: 0,
                          mb: 0,
                        },
                      }}
                    />
                  )}
                />

                {/* Discount Type Select */}
                <Controller
                  name="discountType"
                  control={control}
                  render={({ field: typeField }) => (
                    <CommonSelect
                      value={typeField.value || "percentage"}
                      onChange={(e) => typeField.onChange(e.target.value)}
                      options={[
                        { label: "%", value: "percentage" },
                        { label: "₹", value: "value" },
                      ]}
                      labelKey="label"
                      valueKey="value"
                      width="70px"
                      height={32}
                      mt={0}
                      mb={0}
                      clearable={false}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "0px 6px 6px 0px",
                          width: "70px",
                          height: 32,
                          mt: 0,
                          mb: 0,
                          backgroundColor: "grey.100",
                        },
                      }}
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>

          <Typography sx={{ fontSize: 13 }}>
            {discountAmount ? `-${discountAmount.toFixed(2)}` : "0.00"}
          </Typography>
        </Box>
        {isdiscountValue !== 0 && isdiscountValue !== "" && (
          <FormRow label="Discount Account" mandatory gap={3.75}>
            <Controller
              name={"discountAccount"}
              control={control}
              render={({ field }) => (
                <CommonSelect
                  {...field}
                  options={expenseOptions ?? []}
                  value={field.value || ""}
                  placeHolder="Account"
                  height={32}
                  mt={0}
                  mb={0}
                  width="120px"
                  error={!!errors?.discountAccount}
                  helperText={errors?.discountAccount?.message}
                  searchable
                />
              )}
            />
          </FormRow>
        )}

        {!isReverse &&
          taxBreakdown?.length > 0 &&
          taxBreakdown.map((tax, i) => (
            <Row key={i} label={tax.label} value={tax.amount.toFixed(2)} bold />
          ))}

        {taxType === "TCS" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2.75 }}>
              <Box
                component="button"
                sx={{
                  width: "150px",
                  height: "32px",
                  fontSize: 13,
                  fontWeight: 400,
                  color: "text.primary",
                  backgroundColor: "background.muted",
                  border: "1px dashed #ccc",
                  textAlign: "left",
                  pl: 1,
                  cursor: "pointer",
                }}
                ref={adjustmentRef}
              >
                Adjustment
              </Box>
              <CommonPopoverWithArrow
                open={open}
                anchorEl={anchorEl}
                onClose={handleCancel}
                title="Configure Account"
                confirmLabel="Update"
                cancelLabel="Cancel"
                onConfirm={handleUpdate}
                onCancel={handleCancel}
                width={300}
              >
                <FormRow
                  label="Adjustment Account"
                  flexDirection="column"
                  sx={{ justifyContent: "center" }}
                  mandatory
                  minWidth={250}
                >
                  <Controller
                    name={"adjustmentAccount"}
                    control={control}
                    render={({ field }) => (
                      <CommonSelect
                        {...field}
                        options={expenseOptions ?? []}
                        value={field.value || ""}
                        placeHolder="Account"
                        height={32}
                        mt={0}
                        mb={0}
                        width="250px"
                        error={!!errors?.adjustmentAccount}
                        helperText={errors?.adjustmentAccount?.message}
                        searchable
                      />
                    )}
                  />
                </FormRow>
              </CommonPopoverWithArrow>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  marginTop: isAdjustmentValue ? "25px" : 0,
                }}
              >
                {/* <Controller
                name="adjustment"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(val)) {
                        field.onChange(val);
                      }
                    }}
                    sx={{
                      width: "150px",
                      "& .MuiInputBase-root": { height: "32px", fontSize: 13 },
                      "& input[type=number]::-webkit-inner-spin-button": {
                        display: "none",
                      },
                      "& input[type=number]::-webkit-outer-spin-button": {
                        display: "none",
                      },
                    }}
                  />
                )}
              /> */}
                <Controller
                  name="adjustment"
                  control={control}
                  render={({ field }) => (
                    <CommonTextField
                      {...field}
                      type="text"
                      // onChange={(e) => {
                      //   const val = e.target.value;
                      //   if (/^-?\d*\.?\d{0,2}$/.test(val)) {
                      //     field.onChange(val);
                      //   }
                      // }}
                      onChange={(e) => {
                        const val = e.target.value;
                        // Allow: empty, minus alone, valid negative/positive decimals
                        if (
                          val === "" ||
                          val === "-" ||
                          /^-?\d*\.?\d{0,2}$/.test(val)
                        ) {
                          field.onChange(val);
                        }
                      }}
                      width="150px"
                      height={32}
                      mt={0}
                      mb={0}
                      sx={{
                        "& input[type=number]::-webkit-inner-spin-button": {
                          display: "none",
                        },
                        "& input[type=number]::-webkit-outer-spin-button": {
                          display: "none",
                        },
                      }}
                      error={!!errors?.adjustment}
                      helperText={errors?.adjustment?.message}
                    />
                  )}
                />
                {isAdjustmentValue !== 0 && isAdjustmentValue !== "" && (
                  <Typography
                    onClick={handleOpenPopover}
                    sx={{
                      fontSize: 11,
                      color: "primary.main",
                      cursor: "pointer",
                      pl: 0.5,
                      "&:hover": { color: "primary.dark" },
                    }}
                  >
                    Configure Account
                  </Typography>
                )}
              </Box>
            </Box>
            <Typography
              sx={{ fontSize: 13, color: adjustment >= 0 ? "green" : "red" }}
            >
              {adjustment >= 0
                ? `+${adjustment.toFixed(2)}`
                : adjustment.toFixed(2)}
            </Typography>
          </Box>
        )}

        {/* TDS / TCS row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* <Controller
              name="taxType"
              control={control}
              defaultValue="TDS"
              render={({ field }) => (
                <RadioGroup row {...field} sx={{ display: "contents", gap: 1 }}>
                  {["TDS", "TCS"].map((type) => (
                    <FormControlLabel
                      key={type}
                      sx={{ "& .MuiTypography-root": { fontSize: 13 } }}
                      value={type}
                      control={<Radio />}
                      label={type}
                    />
                  ))}
                </RadioGroup>
              )}
            /> */}

            <Controller
              name="taxType"
              control={control}
              defaultValue="TDS"
              render={({ field }) => (
                <ReusableRadioGroup
                  {...field}
                  row
                  options={[
                    { label: "TDS", value: "TDS" },
                    { label: "TCS", value: "TCS" },
                  ]}
                  // sx={{ display: "contents", gap: 1 }}
                />
              )}
            />

            <Controller
              name="tdsTaxId"
              control={control}
              defaultValue="%"
              render={({ field, fieldState }) => {
                const selectedTax = taxData?.find(
                  (t) => t.value === field.value,
                );

                return (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "150px",
                      marginTop: selectedTax ? "25px" : 0,
                    }}
                  >
                    <CommonSelect
                      {...field}
                      options={taxData}
                      width="150px"
                      mt={0}
                      mb={0}
                      height={35}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      bottomLabel={`Manage ${isTDS ? "TDS" : "TCS"}`}
                      onBottomonClick={onOpenManageTds}
                      onChange={(val) => field.onChange(val)}
                    />

                    {selectedTax?.label && (
                      <Typography
                        sx={{
                          fontSize: 11,
                          mt: 0.5,
                          maxWidth: "150px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={selectedTax.label}
                      >
                        {`${selectedTax.label}%`}
                      </Typography>
                    )}
                  </Box>
                );
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{ fontSize: 13, color: taxType === "TDS" ? "red" : "green" }}
            >
              {taxType === "TDS"
                ? `-${Number(tdsamountvalue || 0).toFixed(2)}`
                : `+${Number(tdsamountvalue || 0).toFixed(2)}`}
            </Typography>
            <IconButton size="small" onClick={onEditTDSClick}>
              <EditIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </Box>

        {/* Adjustment row */}
        {taxType === "TDS" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2.75 }}>
              <Box
                component="button"
                sx={{
                  width: "150px",
                  height: "32px",
                  fontSize: 13,
                  fontWeight: 400,
                  color: "#212529",
                  backgroundColor: "#ffffff",
                  border: "1px dashed #ccc",
                  textAlign: "left",
                  pl: 1,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
                ref={adjustmentRef}
              >
                Adjustment
              </Box>
              <CommonPopoverWithArrow
                open={open}
                anchorEl={anchorEl}
                onClose={handleCancel}
                title="Configure Account"
                confirmLabel="Update"
                cancelLabel="Cancel"
                onConfirm={handleUpdate}
                onCancel={handleCancel}
                width={300}
              >
                <FormRow
                  label="Adjustment Account"
                  flexDirection="column"
                  sx={{ justifyContent: "center" }}
                  mandatory
                  minWidth={250}
                >
                  <Controller
                    name={"adjustmentAccount"}
                    control={control}
                    render={({ field }) => (
                      <CommonSelect
                        {...field}
                        options={expenseOptions ?? []}
                        value={field.value || ""}
                        placeHolder="Account"
                        height={32}
                        mt={0}
                        mb={0}
                        width="250px"
                        error={!!errors?.adjustmentAccount}
                        helperText={errors?.adjustmentAccount?.message}
                        searchable
                      />
                    )}
                  />
                </FormRow>
              </CommonPopoverWithArrow>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  marginTop: isAdjustmentValue ? "25px" : 0,
                }}
              >
                {/* <Controller
                name="adjustment"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(val)) {
                        field.onChange(val);
                      }
                    }}
                    sx={{
                      width: "150px",
                      "& .MuiInputBase-root": { height: "32px", fontSize: 13 },
                      "& input[type=number]::-webkit-inner-spin-button": {
                        display: "none",
                      },
                      "& input[type=number]::-webkit-outer-spin-button": {
                        display: "none",
                      },
                    }}
                  />
                )}
              /> */}
                <Controller
                  name="adjustment"
                  control={control}
                  render={({ field }) => (
                    <CommonTextField
                      {...field}
                      type="text"
                      onChange={(e) => {
                        const val = e.target.value;
                        // Allow: empty, minus alone, valid negative/positive decimals
                        if (
                          val === "" ||
                          val === "-" ||
                          /^-?\d*\.?\d{0,2}$/.test(val)
                        ) {
                          field.onChange(val);
                        }
                      }}
                      width="150px"
                      height={32}
                      mt={0}
                      mb={0}
                      sx={{
                        "& input[type=number]::-webkit-inner-spin-button": {
                          display: "none",
                        },
                        "& input[type=number]::-webkit-outer-spin-button": {
                          display: "none",
                        },
                      }}
                      error={!!errors?.adjustment}
                      helperText={errors?.adjustment?.message}
                    />
                  )}
                />
                {isAdjustmentValue !== 0 && isAdjustmentValue !== "" && (
                  <Typography
                    onClick={handleOpenPopover}
                    sx={{
                      fontSize: 11,
                      color: "primary.main",
                      cursor: "pointer",
                      pl: 0.5,
                      "&:hover": { color: "primary.dark" },
                    }}
                  >
                    Configure Account
                  </Typography>
                )}
              </Box>
            </Box>
            <Typography
              sx={{ fontSize: 13, color: adjustment >= 0 ? "green" : "red" }}
            >
              {adjustment >= 0
                ? `+${adjustment.toFixed(2)}`
                : adjustment.toFixed(2)}
            </Typography>
          </Box>
        )}

        <Divider />

        {/* Total row */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ color: "#666", fontWeight: 600, fontSize: 16 }}>
            Total (₹)
          </Typography>
          <input type="hidden" {...register("total")} />
          <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
            {totalAmount}
          </Typography>
        </Box>
        {errors?.total && (
          <Typography color="error" fontSize={12} mt={0.5}>
            {errors.total.message}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function Row({ label, value, bold }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography sx={{ fontSize: 13, fontWeight: bold ? 700 : 400 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 13 }}>{value}</Typography>
    </Box>
  );
}
