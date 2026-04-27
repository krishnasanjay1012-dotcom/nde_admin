import { useEffect, useMemo } from "react";
import { useWatch } from "react-hook-form";

const normalize = (str = "") => str.trim().toLowerCase().replace(/\s+/g, "");

export function useBillItemCalculations({
  control,
  setValue,
  watch,
  taxSelect,
  source,
  destination,
  isReverse,
}) {
  const watchedItems = useWatch({ control, name: "lineItems" });
  const watchDiscountValue = useWatch({ control, name: "discountValue" });
  const watchDiscountType = useWatch({ control, name: "discountType" });
  const watchAdjustment = useWatch({ control, name: "adjustment" });
  const tdsamountvalue = watch("tdsValue");

  const taxType = watch("taxType");

  const isInclusive = taxSelect === "inclusive";

  const isSameState =
    normalize(source) && normalize(destination)
      ? normalize(source) === normalize(destination)
      : false;

  const subTotal =
    watchedItems?.reduce((sum, row) => {
      const qty = Number(row.quantity) || 0;
      const price = Number(row.price) || 0;
      return sum + qty * price;
    }, 0) || 0;

  const baseAmount = useMemo(() => {
    if (!isInclusive) return subTotal;

    return (watchedItems || []).reduce((sum, row) => {
      const qty = Number(row.quantity) || 0;
      const price = Number(row.price) || 0;
      const taxPct = Number(row.tax?.percentage) || 0;

      if (qty === 0 || price === 0) return sum;

      const lineAmount = qty * price;

      if (taxPct === 0) return sum + lineAmount;

      const lineBase = lineAmount / (1 + taxPct / 100);
      return sum + lineBase;
    }, 0);
  }, [watchedItems, isInclusive, subTotal]);

  const discountBase = isInclusive ? baseAmount : subTotal;

  const discountAmount =
    watchDiscountType === "percentage"
      ? (discountBase * (Number(watchDiscountValue) || 0)) / 100
      : Number(watchDiscountValue) || 0;

  const adjustment = Number(watchAdjustment) || 0;

  const taxBreakdown = useMemo(() => {
    const groups = {};

    // Calculate the taxable base
    const taxableBase = isInclusive
      ? baseAmount - discountAmount // baseAmount is already tax-stripped subtotal
      : subTotal - discountAmount; // exclusive: plain subtotal minus discount

    (watchedItems || []).forEach((row) => {
      const qty = Number(row.quantity) || 0;
      const price = Number(row.price) || 0;
      const taxName = (row.tax?.taxName || "").trim();
      const taxPct = Number(row.tax?.percentage) || 0;

      if (!taxName || taxPct === 0 || qty === 0 || price === 0) return;

      // Each line's proportion of the total subtotal
      const lineAmount = qty * price;
      const lineSubtotal = isInclusive
        ? lineAmount / (1 + taxPct / 100) // strip tax for inclusive
        : lineAmount;

      const totalBase = isInclusive ? baseAmount : subTotal;
      const lineWeight = totalBase > 0 ? lineSubtotal / totalBase : 0;

      // Apply that proportion to the discounted base
      const lineTaxableAmount = taxableBase * lineWeight;
      const lineTaxAmt = (lineTaxableAmount * taxPct) / 100;

      if (isSameState) {
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
  }, [
    watchedItems,
    isInclusive,
    isSameState,
    baseAmount,
    subTotal,
    discountAmount,
  ]);

  const totalTaxAmount = taxBreakdown.reduce((s, t) => s + t.amount, 0);

  const tdstaxcalculation = isInclusive
    ? taxType === "TCS"
      ? baseAmount - discountAmount + adjustment
      : baseAmount - discountAmount
    : taxType === "TCS"
      ? isReverse
        ? subTotal - discountAmount + adjustment
        : subTotal - discountAmount + totalTaxAmount + adjustment
      : subTotal - discountAmount + totalTaxAmount;
  // const totalAmount = isInclusive
  //   ? subTotal - discountAmount - (Number(tdsamountvalue) || 0) + adjustment
  //   : subTotal -
  //     discountAmount -
  //     (Number(tdsamountvalue) || 0) +
  //     adjustment +
  //     totalTaxAmount;

  // const taxDeduction = Number(tdsamountvalue) || 0;

  // const finalDeduction = taxType === "TCS" ? taxDeduction : -taxDeduction;

  // const totalAmount = isInclusive
  //   ? subTotal - discountAmount + finalDeduction + adjustment
  // : subTotal - discountAmount + finalDeduction + adjustment + totalTaxAmount;

  const taxDeduction = Number(tdsamountvalue) || 0;

  const baseCalc = isInclusive
    ? baseAmount - discountAmount
    : isReverse
      ? subTotal - discountAmount
      : subTotal - discountAmount + totalTaxAmount;

  const totalAmount =
    taxType === "TDS"
      ? baseCalc - taxDeduction + adjustment
      : baseCalc + adjustment + taxDeduction;

  console.log(baseCalc, totalAmount, "mmmmodd");

  useEffect(() => {
    setValue("subTotal", subTotal.toFixed(2));
    setValue("total", totalAmount);
  }, [subTotal, totalAmount, setValue]);

  useEffect(() => {
    (watchedItems || []).forEach((row, index) => {
      const qty = Number(row.quantity) || 0;
      const price = Number(row.price) || 0;
      const taxPct = Number(row.tax?.percentage) || 0;

      const lineAmount = qty * price;

      let calculated;

      if (isInclusive) {
        const lineBase =
          taxPct > 0 ? lineAmount / (1 + taxPct / 100) : lineAmount;
        calculated = lineAmount - lineBase;
      } else {
        calculated = (lineAmount * taxPct) / 100;
      }

      if (calculated !== Number(row.tax?.amount || 0)) {
        setValue(`lineItems.${index}.tax.amount`, calculated);
      }
    });
  }, [watchedItems, setValue, isInclusive]);

  return {
    watchedItems,
    subTotal,
    baseAmount,
    discountAmount,
    taxBreakdown,
    totalTaxAmount,
    adjustment,
    totalAmount,
    tdstaxcalculation,
    tdsamountvalue,
    isInclusive,
  };
}
