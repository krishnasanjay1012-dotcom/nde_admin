/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from "@mui/material";
import { useEffect, useState, memo, useMemo } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import SwipeRightAltRoundedIcon from '@mui/icons-material/SwipeRightAltRounded';

import CommonButton from "../common/NDE-Button";
import { CommonSelect, CommonTextField } from "../common/fields";
import CommonDrawer from "../common/NDE-Drawer";

import { useCurrencies } from "../../hooks/settings/currency";
import {
  useBillingCycles,
  usePlanBillingCycles,
  usePlanPricings,
  useUpdatePlanPricing,
} from "../../hooks/products/products-hooks";
import CommonToggleSwitch from "../common/NDE-CommonToggleSwitch";
import FlowerLoader from "../common/NDE-loader";
import { toast } from "react-toastify";
import PlanDiscount from "./Plan/Plan-Discount";
import PlanStrikeAmount from "./Plan/Strike-Amount";

const PricingDetailsForm = ({ open, onClose, planId, type }) => {

  const [discountDialogOpen, setDiscountDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(null);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);
  const [selectedBillingCycleId, setSelectedBillingCycleId] = useState(null);

  const { data: currenciesResponse = {} } = useCurrencies();
  const { data: pricings = {}, isLoading } = usePlanPricings(planId, open);
  const pricingData = pricings?.data || [];
  const currencies = currenciesResponse?.data || [];

  const updatePlanPricing = useUpdatePlanPricing();

  const { data: billingCycleResponse = [] } = usePlanBillingCycles({ type, enabled: open });
  const billingCycles = billingCycleResponse || [];

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      pricing_by_currency: [],
    },
  });

  const { control, setValue, getValues, formState: { dirtyFields }, reset } = methods;

  const { fields, append, replace } = useFieldArray({
    control,
    name: "pricing_by_currency",
  });

  const pricing = useWatch({
    control,
    name: "pricing_by_currency",
  });

  const [expanded, setExpanded] = useState({});
  const [activeCurrencyId, setActiveCurrencyId] = useState(null);
  const [removableBillingCycles, setRemovableBillingCycles] = useState([]);

  const defaultCurrency = useMemo(
    () => currencies.find((c) => c.isdefault === true || c.isdefault === "true"),
    [currencies]
  );

  const currencyOptions = useMemo(
    () =>
      currencies.map((c) => ({
        label: c.code,
        value: c._id,
      })),
    [currencies]
  );

  const selectedCurrencyIds = useMemo(
    () => (pricing || []).map((p) => p?.currency_id).filter(Boolean),
    [pricing]
  );

  const billEveryOptions = useMemo(
    () =>
      billingCycles.map((c) => ({
        label: c.label,
        value: c._id,
      })),
    [billingCycles]
  );

  const getBillingOptionsForRow = (cIdx, currentValue) => {
    const selectedBillingIds =
      pricing?.[cIdx]?.price_entries
        ?.map((p) => p.bill_every)
        ?.filter(Boolean) || [];

    return billEveryOptions.filter(
      (opt) => opt.value === currentValue || !selectedBillingIds.includes(opt.value)
    );
  };

  const getCurrencyOptionsForRow = (current) =>
    currencyOptions.filter(
      (opt) => opt.value === current || !selectedCurrencyIds.includes(opt.value)
    );

  const { data: billingPrice = [] } = useBillingCycles(
    {
      plan_id: planId,
      currency_id: activeCurrencyId,
    },
    {
      enabled: !!planId && !!activeCurrencyId,
    }
  );

  // Initialize pricing data
  useEffect(() => {
    if (!pricingData?.length) {
      if (open) {
        replace([]);
      }
      return;
    }

    const mapped = pricingData.map((p) => ({
      currency_id: p.currency_id?._id,
      setup_fee: p.setup_fee ?? "",
      is_active: p.is_active ?? true,
      isNew: false,
      price_entries: [],
    }));

    replace(mapped);

    const first =
      pricingData.find(p => p.currency_id?.isdefault) || pricingData[0];

    setActiveCurrencyId(first.currency_id?._id);
  }, [pricingData, open]);

  // Reset form and state when drawer is closed
  useEffect(() => {
    if (!open) {
      reset({
        pricing_by_currency: [],
      });
      setExpanded({});
      setActiveCurrencyId(null);
      setRemovableBillingCycles([]);
      setSelectedCurrencyId(null);
      setSelectedBillingCycleId(null);
      setDialogMode(null);
    }
  }, [open, reset]);

  // Map billing prices to selected currency
  useEffect(() => {
    if (!billingPrice.length || !activeCurrencyId) return;

    // Use getValues() to avoid stale closure issues with useWatch 'pricing'
    const currentPricing = getValues("pricing_by_currency") || [];
    const idx = currentPricing.findIndex(
      (c) => c.currency_id === activeCurrencyId
    );

    if (idx === -1) return;

    const mappedPrices = billingPrice.map((p) => ({
      _id: p._id,
      bill_every: p.plan_billing_cycle?._id || "",
      plan_billing_cycle: p.plan_billing_cycle
        ? {
          _id: p.plan_billing_cycle._id,
          interval_unit: p.plan_billing_cycle.interval_unit,
          label: p.plan_billing_cycle.label,
        }
        : null,
      register_price: p.register_price ?? "",
      renewal_price: p.renewal_price ?? "",
      transfer_price: p.transfer_price ?? "",
      register_strike_amount: p.register_strike_amount ?? "",
      renewal_strike_amount: p.renewal_strike_amount ?? "",
      transfer_strike_amount: p.transfer_strike_amount ?? "",
      currencySymbol: p.currencySymbol ?? "",
    }));

    setValue(
      `pricing_by_currency.${idx}.price_entries`,
      mappedPrices,
      { shouldDirty: false }
    );
  }, [billingPrice, activeCurrencyId]);

  const handleAddCurrency = () => {
    const available = currencyOptions.find(
      (opt) => !selectedCurrencyIds.includes(opt.value)
    );
    if (!available) return;

    const currencyId =
      fields.length === 0 && defaultCurrency
        ? defaultCurrency._id
        : available.value;

    const idx = fields.length;

    append({
      currency_id: currencyId,
      is_active: true,
      setup_fee: "",
      isNew: true,
      price_entries: [
        {
          bill_every: "",
          register_price: "",
          renewal_price: "",
          transfer_price: "",
        },
      ],
    });

    setExpanded((p) => ({ ...p, [idx]: true }));
    setActiveCurrencyId(currencyId);
  };

  const addPrice = (cIdx) => {
    const entries = pricing?.[cIdx]?.price_entries || [];
    setValue(
      `pricing_by_currency.${cIdx}.price_entries`,
      [
        ...entries,
        { bill_every: "", register_price: "", renewal_price: "", transfer_price: "" },
      ],
      { shouldDirty: true }
    );
  };

  const removePrice = (cIdx, pIdx) => {
    const entries = pricing?.[cIdx]?.price_entries || [];
    if (entries.length === 1) return;

    const removed = entries[pIdx];
    if (removed?._id) {
      setRemovableBillingCycles((p) => [...p, { _id: removed._id }]);
    }

    setValue(
      `pricing_by_currency.${cIdx}.price_entries`,
      entries.filter((_, i) => i !== pIdx),
      { shouldDirty: true }
    );
  };

  const hasAtLeastOneValidBillingCycle = (priceEntries = []) =>
    priceEntries.some((p) =>
      p.bill_every &&
      Number(p.register_price) > 0 &&
      Number(p.renewal_price) > 0 &&
      Number(p.transfer_price) > 0
    );

  const saveSingleCurrency = async (cIdx) => {
    const values = getValues();
    const currency = values.pricing_by_currency[cIdx];

    if (!hasAtLeastOneValidBillingCycle(currency.price_entries)) {
      toast.warn("Please add at least one billing cycle to continue.");
      return;
    }

    const payload = {
      plan_id: planId,
      currency_id: currency.currency_id,
      method: currency.isNew ? "create" : "update",
      setup_fee: Number(currency.setup_fee || 0),
      is_active: currency.is_active,
      pricing: currency.price_entries.map((p) => ({
        _id: p._id,
        plan_billing_cycle: p.bill_every,
        register_price: Number(p.register_price || 0),
        renewal_price: Number(p.renewal_price || 0),
        transfer_price: Number(p.transfer_price || 0),
      })),
      removableBillingCycles,
    };

    updatePlanPricing.mutate(payload, {
      onSuccess: () => {
        // Important fix: replace fields to update Accordion immediately
        replace(getValues().pricing_by_currency);
        reset(getValues()); // reset dirty state
        setRemovableBillingCycles([]);
        setExpanded((prev) => ({ ...prev, [cIdx]: true })); // Keep accordion open
      },
    });

    setValue(`pricing_by_currency.${cIdx}.isNew`, false);
    setRemovableBillingCycles([]);
  };

  const openDiscountDialog = (currencyId, billingCycleId, mode = "discount") => {
    setSelectedCurrencyId(currencyId);
    setSelectedBillingCycleId(billingCycleId);
    setDialogMode(mode);
    setDiscountDialogOpen(true);
  };

  const closeDiscountDialog = () => {
    setDiscountDialogOpen(false);
    setSelectedCurrencyId(null);
    setDialogMode(null);
  };



  return (
    <>
      <CommonDrawer open={open} onClose={onClose} title="Add Plan Prices" width={800}>
        <Box>
          {(() => {
            if (isLoading) {
              return (
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FlowerLoader size={24} />
                </Box>
              );
            }

            if (fields.length === 0) {
              return (
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                    color: "text.secondary",
                  }}
                >
                  <Typography variant="h6" fontWeight={600}>
                    No currency found
                  </Typography>

                  <Typography variant="body2">
                    Add currency to start configuring prices
                  </Typography>

                  <CommonButton
                    label="Add Currency"
                    onClick={handleAddCurrency}
                    sx={{ mt: 1 }}
                  />
                </Box>
              );
            }

            return (
              <>
                {fields.map((item, cIdx) => {
                  const isExpanded = expanded[cIdx];
                  const prices = pricing?.[cIdx]?.price_entries || [];
                  const isCurrencyDirty = !!dirtyFields?.pricing_by_currency?.[cIdx];
                  const isActive = pricing?.[cIdx]?.is_active;

                  return (
                    <Accordion
                      key={item.id}
                      expanded={isExpanded}
                      onChange={(_, expandedState) => {
                        setExpanded((p) => ({ ...p, [cIdx]: expandedState }));
                        if (expandedState) {
                          const currencyId = getValues(`pricing_by_currency.${cIdx}.currency_id`);
                          setActiveCurrencyId(currencyId);
                        }
                      }}
                      disableGutters
                      elevation={0}
                      sx={{
                        border: "1px solid #E9EDF5",
                        borderRadius: "6px",
                        mb: 1,
                        mt: 1,
                        overflow: "hidden",

                        "&::before": { display: "none" },
                        "&:not(.Mui-expanded)": {
                          borderRadius: "6px",
                        },

                        "&.Mui-expanded": {
                          borderRadius: "6px",
                          margin: 0,
                          mb: 2,
                        },
                      }}
                    >
                      <AccordionSummary
                        sx={{
                          px: 2,
                          backgroundColor: "#f9f9fb",
                          "& .MuiAccordionSummary-content": {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            margin: 0,
                          },
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <ExpandMoreIcon
                            sx={{
                              fontSize: 20,
                              transition: "0.25s",
                              transform: isExpanded ? "rotate(180deg)" : "rotate(-90deg)",
                              color: isExpanded ? "primary.main" : "#98A2B3",
                            }}
                          />
                          <Typography fontSize={14} fontWeight={500}>
                            {
                              currencyOptions.find(
                                (c) => c.value === pricing?.[cIdx]?.currency_id
                              )?.label
                            }
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex' }}>
                          <Controller
                            name={`pricing_by_currency.${cIdx}.is_active`}
                            control={control}
                            render={({ field }) => (
                              <CommonToggleSwitch
                                checked={field.value}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  field.onChange(!field.value);
                                  saveSingleCurrency(cIdx);
                                }}
                              />
                            )}
                          />
                        </Box>

                      </AccordionSummary>
                      <Tooltip
                        title={!isActive ? "Enable this currency to edit prices" : ""}
                        placement="top"
                        arrow
                        disableHoverListener={isActive}
                      >
                        <Box>
                          <AccordionDetails
                            sx={{
                              position: "relative",
                              p: 2,
                              opacity: isActive ? 1 : 0.5,
                              pointerEvents: isActive ? "auto" : "none",
                              transition: "opacity 0.2s ease",
                            }}
                          >
                            <Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  alignItems: "flex-start",
                                  flexWrap: { xs: "wrap", md: "nowrap" },
                                }}
                              >
                                <Box sx={{ flex: 1 }}>
                                  <Controller
                                    name={`pricing_by_currency.${cIdx}.currency_id`}
                                    control={control}
                                    render={({ field }) => {
                                      const isExisting = !pricing?.[cIdx]?.isNew;

                                      return (
                                        <CommonSelect
                                          {...field}
                                          label="Currency"
                                          options={getCurrencyOptionsForRow(field.value)}
                                          disabled={isExisting}
                                        />
                                      );
                                    }}
                                  />
                                </Box>

                                <Box sx={{ flex: 1 }}>
                                  <Controller
                                    name={`pricing_by_currency.${cIdx}.setup_fee`}
                                    control={control}
                                    render={({ field }) => (
                                      <CommonTextField
                                        {...field}
                                        label="Setup Fee"
                                        type="number"
                                      />
                                    )}
                                  />
                                </Box>
                              </Box>

                              <TableContainer
                                sx={{
                                  borderRadius: "6px",
                                  overflowX: "auto",
                                }}
                              >
                                <Table size="small">
                                  <TableHead sx={{ bgcolor: "background.default" }}>
                                    <TableRow>
                                      <TableCell>Bill Every</TableCell>
                                      <TableCell>Register</TableCell>
                                      <TableCell>Renewal</TableCell>
                                      <TableCell>Transfer</TableCell>
                                      <TableCell>Discount / Strike Amount</TableCell>
                                      <TableCell />
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {prices.map((_, pIdx) => (
                                      <TableRow key={pIdx}>
                                        <TableCell>
                                          <Controller
                                            name={`pricing_by_currency.${cIdx}.price_entries.${pIdx}.bill_every`}
                                            control={control}
                                            render={({ field }) => {
                                              const isExisting = !!pricing?.[cIdx]?.price_entries?.[pIdx]?._id;

                                              return (
                                                <CommonSelect
                                                  {...field}
                                                  options={getBillingOptionsForRow(cIdx, field.value)}
                                                  mb={0}
                                                  mt={0}
                                                  disabled={isExisting}
                                                />
                                              );
                                            }}
                                          />
                                        </TableCell>

                                        {["register_price", "renewal_price", "transfer_price"].map((key) => (
                                          <TableCell key={key}>
                                            <Controller
                                              name={`pricing_by_currency.${cIdx}.price_entries.${pIdx}.${key}`}
                                              control={control}
                                              rules={{
                                                min: { value: 1, message: "Must be greater than 0" },
                                                required: "Required",
                                              }}
                                              render={({ field, fieldState }) => (
                                                <CommonTextField
                                                  {...field}
                                                  type="number"
                                                  error={!!fieldState.error}
                                                  helperText={fieldState.error?.message}
                                                  inputProps={{ min: 1 }}
                                                  mb={0} mt={0}
                                                />
                                              )}
                                            />
                                          </TableCell>
                                        ))}
                                        <TableCell>
                                          <Tooltip title="Add Discount" arrow>
                                            <IconButton
                                              size="small"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                openDiscountDialog(
                                                  pricing?.[cIdx]?.currency_id,
                                                  pricing?.[cIdx]?.price_entries?.[pIdx]?.bill_every,
                                                  "discount"
                                                );
                                              }}
                                            >
                                              <LocalOfferOutlinedIcon fontSize="small" />
                                            </IconButton>
                                          </Tooltip>

                                          <Tooltip title="Strike Amount" arrow>
                                            <IconButton
                                              size="small"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                openDiscountDialog(
                                                  pricing?.[cIdx]?.currency_id,
                                                  pricing?.[cIdx]?.price_entries?.[pIdx]?.bill_every,
                                                  "strike"
                                                );
                                              }}
                                            >
                                              <SwipeRightAltRoundedIcon fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                          <IconButton
                                            color="error"
                                            disabled={prices.length === 1}
                                            onClick={() => removePrice(cIdx, pIdx)}
                                          >
                                            <CloseIcon fontSize="small" sx={{ color: prices.length === 1 ? "" : 'error.main' }} />
                                          </IconButton>
                                        </TableCell>

                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>

                              <Box mt={1} mb={-1}>
                                <CommonButton
                                  label="Add Price"
                                  variant="text"
                                  onClick={() => addPrice(cIdx)}
                                  startIcon
                                  sx={{ mr: 2 }}
                                />
                                <CommonButton
                                  label="Save Currency"
                                  onClick={() => saveSingleCurrency(cIdx)}
                                  startIcon
                                  disabled={!isCurrencyDirty}
                                />
                              </Box>
                            </Box>
                          </AccordionDetails>
                        </Box>
                      </Tooltip>
                    </Accordion>
                  );
                })}

                <CommonButton
                  label="Add Currency"
                  sx={{ mt: 2 }}
                  disabled={selectedCurrencyIds.length === currencyOptions.length}
                  onClick={handleAddCurrency}
                />
              </>
            );
          })()}
        </Box>
      </CommonDrawer>

      {dialogMode === "discount" && (
        <PlanDiscount
          open={discountDialogOpen}
          onClose={closeDiscountDialog}
          selectedCurrencyId={selectedCurrencyId}
          selectedBillingCycleId={selectedBillingCycleId}
          planId={planId}
        />
      )}

      {dialogMode === "strike" && (
        <PlanStrikeAmount
          open={discountDialogOpen}
          onClose={closeDiscountDialog}
          selectedCurrencyId={selectedCurrencyId}
          selectedBillingCycleId={selectedBillingCycleId}
          planId={planId}
          planPricing={pricing.find(p => p.currency_id === selectedCurrencyId)}
        />
      )}
    </>
  );
};

export default memo(PricingDetailsForm);
