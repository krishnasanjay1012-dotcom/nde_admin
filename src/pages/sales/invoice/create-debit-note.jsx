import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import InvoiceHeaderSection from "../../../components/Sales/Invoices/New Component/InvoiceHeaderSection";
import FormRow from "../../../components/Sales/Invoices/New Component/FormRow";
import TermsAndCondition from "../../../components/Sales/Invoices/New Component/TermsAndCondition";
import { useCurrencyByCode } from "../../../hooks/settings/currency";
import { usePriceVariants } from "../../../hooks/products/products-hooks";
import { useCreateManualInvoice } from "../../../hooks/sales/invoice-hooks";
import CustomerDropdownList from "../../../components/Sales/Invoices/Components/CustomerDropdownList";
import CommonButton from "../../../components/common/NDE-Button";
import AdditionalAddressModal from "../../../components/Sales/Invoices/Components/AdditionalAddressModal";
import ItemTableSection from "../../../components/Sales/Invoices/New Component/ItemTableFolder/ItemTableSection";

const DEFAULT_LINE_ITEM = {
  productId: "",
  planId: "",
  billingCycleId: "",
  productName: "",
  planName: "",
  billingCycleLabel: "",
  duration: "",
  durationUnit: "",
  description: "",
  quantity: 1,
  price: 0,
  unit: "",
  tax: {
    taxName: "",
    percentage: 0,
    amount: 0,
  },
};

const schema = yup.object().shape({
  customerId: yup.string().required("Customer is required"),
  invoiceNumber: yup.string().required("Invoice number is required"),
  invoiceDate: yup
    .date()
    .required("Invoice Date is required")
    .typeError("Invalid date format"),
  lineItems: yup.array().of(
    yup.object().shape({
      productId: yup.string().required("Product is required"),
    }),
  ),
});

export default function CreateDebitNote({ updatedata, edit = false }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  // Currency state
  const [currencyCode, setCurrencyCode] = useState(
    updatedata?.currency?.code || null,
  );
  const [currency, setCurrency] = useState(updatedata?.currency || null);
  const currencyId = currency?.currencyId || null;

  // Currency resolution mutation
  const { mutate: fetchCurrencyByCode } = useCurrencyByCode();

  // Pricing variants query (enabled when currencyId is available)
  const { data: priceVariantsData, isLoading: isLoadingVariants } =
    usePriceVariants(currencyId);

  const { mutate: createMutation } = useCreateManualInvoice();
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      customerId: updatedata?.customerId ?? "",
      invoiceNumber: updatedata?.invoiceNumber ?? "",
      orderno: updatedata?.orderno ?? "",
      invoiceDate: updatedata?.invoiceDate
        ? new Date(updatedata.invoiceDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      dueDate: updatedata?.dueDate
        ? new Date(updatedata.dueDate).toISOString().slice(0, 10)
        : "",
      paymentTerms: updatedata?.paymentTerms ?? "698dab4cf170b75201e7049a",
      salesPersonId: updatedata?.salesPersonId ?? null,
      subject: updatedata?.subject ?? "",

      lineItems:
        Array.isArray(updatedata?.lineItems) && updatedata.lineItems.length > 0
          ? updatedata.lineItems.map((item) => ({
              productId: item.productId ?? "",
              planId: item.planId ?? "",
              billingCycleId: item.billingCycleId ?? "",
              productName: item.productName ?? "",
              planName: item.planName ?? "",
              billingCycleLabel: item.billingCycleLabel ?? "",
              duration: item.duration ?? "",
              durationUnit: item.durationUnit ?? "",
              description: item.description ?? "",
              quantity: item.quantity ?? 1,
              price: item.price ?? 0,
              unit: item.unit ?? "",
              tax: {
                taxName: item.tax?.taxName ?? "",
                percentage: item.tax?.percentage ?? 0,
                amount: item.tax?.amount ?? 0,
              },
            }))
          : [{ ...DEFAULT_LINE_ITEM }],

      subTotal: updatedata?.subTotal ?? "0.00",
      discountType: updatedata?.discountType ?? "percentage",
      discountValue: updatedata?.discountValue ?? 0,
      isDiscountBeforeTax: updatedata?.isDiscountBeforeTax ?? true,
      gstTaxId: updatedata?.gstTaxId ?? "",
      isInterState: updatedata?.isInterState ?? false,
      tdsTaxId: updatedata?.tdsTaxId ?? "",
      tcsTaxId: updatedata?.tcsTaxId ?? null,
      tdsValue: updatedata?.tdsValue ?? 0,
      adjustment: updatedata?.adjustment ?? 0,
      batchPayments: updatedata?.batchPayments ?? [],
      allowPartialPayments: updatedata?.allowPartialPayments ?? true,
      contactPersons: updatedata?.contactPersons ?? [],
      notes: updatedata?.notes ?? "",
      termsandconditions: updatedata?.terms_conditions ?? "",
      files: [],
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  const handleRemove = (ind) => {
    if (fields?.length !== 1) {
      remove(ind);
    }
  };

  // Resolve currency when currencyCode changes
  useEffect(() => {
    if (currencyCode) {
      fetchCurrencyByCode(currencyCode, {
        onSuccess: (response) => {
          const currencyData = response?.data || response;
          const resolvedCurrency = {
            currencyId: currencyData?._id || currencyData?.currencyId || "",
            code: currencyData?.code || currencyCode,
            symbol: currencyData?.symbol || "",
            name: currencyData?.name || "",
            decimalPlaces: currencyData?.decimalPlaces ?? 2,
          };
          setCurrency(resolvedCurrency);
        },
        onError: (err) => {
          console.error("Currency resolution failed:", err);
          setCurrency(null);
        },
      });
    }
  }, [currencyCode, fetchCurrencyByCode]);

  // Customer selection callback
  const handleCustomerSelect = useCallback(
    (customer) => {
      if (customer) {
        setValue("customerId", customer._id, { shouldValidate: true });
        const code = customer.currencyCode || null;
        setCurrencyCode(code);
      }
    },
    [setValue],
  );

  // Build final payload and console log on submit
  const onSubmit = async (data) => {
    // Calculate line items with tax amounts
    const lineItems = (data.lineItems || []).map((item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      const taxPercentage = Number(item.tax?.percentage) || 0;
      const lineAmount = qty * price;
      const taxAmount = (lineAmount * taxPercentage) / 100;

      return {
        productId: item.productId,
        planId: item.planId,
        billingCycleId: item.billingCycleId,
        productName: item.productName,
        planName: item.planName,
        billingCycleLabel: item.billingCycleLabel,
        duration: item.duration,
        durationUnit: item.durationUnit,
        description: item.description,
        quantity: qty,
        price: price,
        unit: item.unit,
        tax: {
          taxName: item.tax?.taxName || "",
          percentage: taxPercentage,
          amount: taxAmount,
        },
      };
    });

    const invoiceData = {
      customerId: data.customerId,
      invoiceNumber: data.invoiceNumber,
      invoiceDate: data.invoiceDate
        ? new Date(data.invoiceDate).toISOString()
        : null,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      paymentTerms: data.paymentTerms,

      currency: currency || null,

      lineItems,

      discountType: data.discountType,
      discountValue: Number(data.discountValue) || 0,
      isDiscountBeforeTax: data.isDiscountBeforeTax ?? true,
      gstTaxId: data.gstTaxId || null,
      isInterState: data.isInterState ?? false,
      tdsTaxId: data.tdsTaxId || null,
      tcsTaxId: data.tcsTaxId || null,
      tdsValue: Number(data.tdsValue) || 0,
      adjustment: Number(data.adjustment) || 0,
      batchPayments: data.batchPayments || [],
      allowPartialPayments: data.allowPartialPayments ?? true,
      salesPersonId: data.salesPersonId || null,
      contactPersons: data.contactPersons || [],
      notes: data.notes || "",
      terms: data.termsandconditions || "",
    };

    const formData = new FormData();

    formData.append("invoiceData", JSON.stringify(invoiceData));

    const files = data.files || [];

    for (let file of files) {
      formData.append("attachments", file);
    }

    createMutation(formData, {
      onSuccess: () => {
        navigate(-1);
      },
      onError: (err) => {
        console.error("Failed:", err);
      },
    });
  };

  const onError = (err) => {
    console.log(err, "mainerr");
  };

  return (
    <>
      <FormProvider {...methods}>
        <Box width={"100%"} height={"100%"}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: { xs: 2, sm: 3 },
              py: 1.5,
              borderBottom: "1px solid #eee",
              height: "65px",
            }}
          >
            <Typography variant="h4">
              {`${edit ? "Edit" : "New"} Debit Note`}
            </Typography>{" "}
            <IconButton
              size={isMobile ? "small" : "medium"}
              onClick={() => navigate(-1)}
              color="error"
            >
              <CloseIcon sx={{ color: "error.main" }} />
            </IconButton>
          </Box>

          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              height: "calc(100% - 130px)",
              overflow: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <FormRow label="Customer Name" mandatory sx={{ mt: 1 }}>
                <CustomerDropdownList
                  control={control}
                  userId={userId}
                  setValue={setValue}
                  customerForInvoice={true}
                  onCustomerSelect={handleCustomerSelect}
                />
              </FormRow>

              <InvoiceHeaderSection
                control={control}
                errors={errors}
                setValue={setValue}
              />

              <ItemTableSection
                fields={fields}
                append={append}
                remove={handleRemove}
                priceVariantsData={priceVariantsData}
                isLoadingVariants={isLoadingVariants}
                currencySymbol={currency?.symbol || "₹"}
                watch={watch}
                setValue={setValue}
                register={register}
              />

              <TermsAndCondition
                control={control}
                watch={watch}
                setValue={setValue}
              />
            </Box>
          </Box>

          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: 2,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              height: "65px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
              <CommonButton
                label="Cancel"
                variant="outlined"
                onClick={() => navigate(-1)}
              />

              <CommonButton
                label="Save"
                variant="contained"
                onClick={handleSubmit(onSubmit, onError)}
              />
            </Box>

            <Box sx={{ textAlign: { xs: "center", sm: "right" } }}>
              <Typography fontWeight={500} fontSize={16}>
                Total Amount: {currency?.symbol || "₹"}
                {watch("total") || "0.00"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </FormProvider>
    </>
  );
}
