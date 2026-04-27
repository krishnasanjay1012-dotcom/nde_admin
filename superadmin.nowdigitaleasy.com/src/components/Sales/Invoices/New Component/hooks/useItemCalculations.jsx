// import { useEffect } from "react";
// import { useWatch } from "react-hook-form";

// export function useItemCalculations({ control, setValue, watch }) {
//   const watchedItems = useWatch({ control, name: "lineItems" });
//   const watchDiscountValue = useWatch({ control, name: "discountValue" });
//   const watchDiscountType = useWatch({ control, name: "discountType" });
//   const watchIsDiscountBeforeTax = useWatch({
//     control,
//     name: "isDiscountBeforeTax",
//   });
//   const watchAdjustment = useWatch({ control, name: "adjustment" });
//   const tdsamountvalue = watch("tdsValue");

//   const totalTaxValue =
//     watchedItems?.reduce(
//       (sum, item) => sum + (Number(item?.tax?.percentage) || 0),
//       0,
//     ) || 0;

//   const totalTaxAmount =
//     watchedItems?.reduce(
//       (sum, item) => sum + (Number(item?.tax?.amount) || 0),
//       0,
//     ) || 0;

//   const cgstPercent = totalTaxValue / 2;
//   const sgstPercent = totalTaxValue / 2;
//   const cgstAmount = totalTaxAmount / 2;
//   const sgstAmount = totalTaxAmount / 2;

//   const subTotal =
//     watchedItems?.reduce((sum, row) => {
//       const qty = Number(row.quantity) || 0;
//       const price = Number(row.price) || 0;
//       // const tax = Number(row.tax.amount) || 0;
//       return sum + qty * price;
//     }, 0) || 0;

//   const discountBase = subTotal;
//   const discountAmount =
//     watchDiscountType === "percentage"
//       ? (discountBase * (Number(watchDiscountValue) || 0)) / 100
//       : Number(watchDiscountValue) || 0;

//   const adjustment = Number(watchAdjustment) || 0;

//   const tdstaxcalculation = subTotal - discountAmount + totalTaxAmount;

//   const totalAmount =
//     subTotal -
//     discountAmount -
//     (Number(tdsamountvalue) || 0) +
//     adjustment +
//     totalTaxAmount;

//   // Sync subTotal & total into form
//   useEffect(() => {
//     setValue("subTotal", subTotal.toFixed(2));
//     setValue("total", totalAmount.toFixed(2));
//   }, [subTotal, totalAmount, setValue]);

//   // Auto-calculate per-row tax amount
//   useEffect(() => {
//     watchedItems?.forEach((row, index) => {
//       const qty = Number(row.quantity) || 0;
//       const price = Number(row.price) || 0;
//       const taxPct = Number(row.tax?.percentage) || 0;
//       const calculatedTaxAmt = (qty * price * taxPct) / 100;

//       if (calculatedTaxAmt !== Number(row.tax?.amount || 0)) {
//         setValue(`lineItems.${index}.tax.amount`, calculatedTaxAmt);
//       }
//     });
//   }, [watchedItems, setValue]);

//   return {
//     watchedItems,
//     subTotal,
//     discountAmount,
//     totalTaxValue,
//     totalTaxAmount,
//     cgstPercent,
//     sgstPercent,
//     cgstAmount,
//     sgstAmount,
//     adjustment,
//     totalAmount,
//     tdstaxcalculation,
//     tdsamountvalue,
//   };
// }

import { useEffect, useMemo } from "react";
import { useWatch } from "react-hook-form";

const normalize = (str = "") => str.trim().toLowerCase();

const getLocationFlags = (billingAddress) => {
  const country = normalize(billingAddress?.country);
  const state = normalize(billingAddress?.state);

  const isIndia = country === "india";
  const isTamilNadu = state === "tamilnadu" || state === "tamil nadu";

  return {
    isIndia,
    shouldSplit: isIndia && isTamilNadu,
    shouldShowGST: isIndia && !isTamilNadu,
  };
};

export function useItemCalculations({
  control,
  setValue,
  watch,
  billingAddress,
}) {
  const watchedItems = useWatch({ control, name: "lineItems" });
  const watchDiscountValue = useWatch({ control, name: "discountValue" });
  const watchDiscountType = useWatch({ control, name: "discountType" });
  const watchAdjustment = useWatch({ control, name: "adjustment" });
  const tdsamountvalue = useWatch({ control, name: "tdsValue" });

  const taxType = watch("taxType");

  // ── SubTotal ──────────────────────────────────────────────────────────────
  const subTotal =
    watchedItems?.reduce((sum, row) => {
      const qty = Number(row.quantity) || 0;
      const price = Number(row.price) || 0;
      return sum + qty * price;
    }, 0) || 0;

  // ── Discount ──────────────────────────────────────────────────────────────
  const discountAmount =
    watchDiscountType === "percentage"
      ? (subTotal * (Number(watchDiscountValue) || 0)) / 100
      : Number(watchDiscountValue) || 0;

  const adjustment = Number(watchAdjustment) || 0;

  // ── Tax Breakdown ─────────────────────────────────────────────────────────
  const taxBreakdown = useMemo(() => {
    const { isIndia, shouldSplit } = getLocationFlags(billingAddress);
    const groups = {};

    const taxableBase = subTotal - discountAmount;

    (watchedItems || []).forEach((row) => {
      const qty = Number(row.quantity) || 0;
      const price = Number(row.price) || 0;
      const taxName = (row.tax?.taxName || "").trim();
      const taxPct = Number(row.tax?.percentage) || 0;

      // Skip incomplete rows
      if (!taxName || taxPct === 0 || qty === 0 || price === 0) return;

      // const lineBase = qty * price;
      const lineTaxAmt = (taxableBase * taxPct) / 100;

      console.log(lineTaxAmt, taxableBase, "invoicecal");

      if (!isIndia) {
        // ── Non-India: no GST logic, show tax as-is ──────────────────────
        const key = `${normalize(taxName)}_${taxPct}`;
        if (!groups[key]) {
          groups[key] = {
            label: `${taxName} [${taxPct}%]`,
            percent: taxPct,
            amount: 0,
          };
        }
        groups[key].amount += lineTaxAmt;
      } else if (shouldSplit) {
        const halfPct = taxPct / 2;
        const halfAmt = lineTaxAmt / 2;

        const cgstKey = `CGST_${halfPct}`;
        const sgstKey = `SGST_${halfPct}`;

        if (!groups[cgstKey]) {
          groups[cgstKey] = {
            label: `CGST [${halfPct}%]`,
            percent: halfPct,
            amount: 0,
          };
        }
        groups[cgstKey].amount += halfAmt;

        if (!groups[sgstKey]) {
          groups[sgstKey] = {
            label: `SGST [${halfPct}%]`,
            percent: halfPct,
            amount: 0,
          };
        }
        groups[sgstKey].amount += halfAmt;
      } else {
        const key = `${normalize(taxName)}_${taxPct}`;
        if (!groups[key]) {
          groups[key] = {
            label: `${taxName} [${taxPct}%]`,
            percent: taxPct,
            amount: 0,
          };
        }
        groups[key].amount += lineTaxAmt;
      }
    });

    return Object.values(groups);
  }, [watchedItems, billingAddress, subTotal, discountAmount]);

  const totalTaxAmount = taxBreakdown.reduce((s, t) => s + t.amount, 0);
  const tdstaxcalculation = useMemo(() => {
    const sub = Number(subTotal) || 0;
    const discount = Number(discountAmount) || 0;
    const tax = Number(totalTaxAmount) || 0;

    return taxType === "TCS"
      ? sub - discount + tax + adjustment
      : sub - discount + tax;
  }, [subTotal, discountAmount, totalTaxAmount, adjustment, taxType]);

  console.log(tdstaxcalculation, "tdstaxx");

  // const totalAmount =
  //   subTotal -
  //   discountAmount -
  //   (Number(tdsamountvalue) || 0) +
  //   adjustment +
  //   totalTaxAmount;

  const taxDeduction = Number(tdsamountvalue) || 0;

  const finalDeduction = taxType === "TCS" ? taxDeduction : -taxDeduction;

  const totalAmount =
    subTotal - discountAmount + finalDeduction + adjustment + totalTaxAmount;

  useEffect(() => {
    setValue("subTotal", subTotal.toFixed(2));
    setValue("total", totalAmount.toFixed(2));
  }, [subTotal, totalAmount, setValue]);

  useEffect(() => {
    (watchedItems || []).forEach((row, index) => {
      const qty = Number(row.quantity) || 0;
      const price = Number(row.price) || 0;
      const taxPct = Number(row.tax?.percentage) || 0;
      const calculated = (qty * price * taxPct) / 100;

      if (calculated !== Number(row.tax?.amount || 0)) {
        setValue(`lineItems.${index}.tax.amount`, calculated);
      }
    });
  }, [watchedItems, setValue]);

  return {
    watchedItems,
    subTotal,
    discountAmount,
    taxBreakdown,
    totalTaxAmount,
    adjustment,
    totalAmount,
    tdstaxcalculation,
    tdsamountvalue,
  };
}
