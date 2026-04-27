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
import CustomerDropdownList from "./Components/CustomerDropdownList";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import CommonButton from "../../common/NDE-Button";
import InvoiceHeaderSection from "./New Component/InvoiceHeaderSection";
import FormRow from "./New Component/FormRow";
import TermsAndCondition from "./New Component/TermsAndCondition";
import { useCurrencyByCode } from "../../../hooks/settings/currency";
import { usePriceVariants } from "../../../hooks/products/products-hooks";
import {
  useCreateManualInvoice,
  useInvoiceById,
  useUpdateManualInvoice,
} from "../../../hooks/sales/invoice-hooks";
import ItemTableSection from "./New Component/ItemTableFolder/ItemTableSection";
import { useItemCalculations } from "./New Component/hooks/useItemCalculations";
import { usePaymentTerms } from "../../../hooks/payment-terms/payment-terms-hooks";
import { useGetCustomerInfo } from "../../../hooks/Customer/Customer-hooks";
import AddressSection from "../../common/NDE-Address";

const DEFAULT_LINE_ITEM = {
  mainId: "",
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
  pricingType: "",
  tax: {
    taxName: "",
    percentage: 0,
    amount: 0,
  },
};

const DEFAULT_BATCH_PAYMENT = {
  paymentModes: "699582e56db191cb997f538c",
  depositTo: "699568166db191cb997f536a",
  amount: 0,
};

const schema = yup.object().shape({
  customerId: yup.string().required("Customer is required"),
  invoiceNo: yup.string().required("Invoice number is required"),
  invoiceDate: yup
    .date()
    .required("Invoice Date is required")
    .typeError("Invalid date format"),
  lineItems: yup.array().of(
    yup.object().shape({
      productName: yup.string().required("Product is required"),
      // pricingId: yup.string().required("PlanId is required"),
      pricingType: yup.string().when("pricingId", {
        is: (val) => !!val,
        then: (schema) => schema.required("PricingType is required"),
        otherwise: (schema) => schema.nullable(),
      }),
      quantity: yup
        .number()
        .typeError("Quantity must be a number")
        .positive("Quantity must be positive"),
    }),
  ),
  discountType: yup.string().nullable(),
  discountValue: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    // .typeError("Discount must be a number")
    .test(
      "max-percentage",
      "Discount must be less than 100%",
      function (value) {
        const { discountType } = this.parent;
        if (discountType === "percentage" && value != null) {
          return value <= 100;
        }
        return true;
      },
    ),
  discountAccount: yup.string().when("discountValue", {
    is: (value) => value !== null && value !== "" && value !== 0,
    then: (schema) =>
      schema
        .required("Discount Account is required")
        .typeError("Discount Account must be a string"),
    otherwise: (schema) => schema.nullable(),
  }),
  adjustment: yup
    .number()
    .nullable()
    .transform((val, original) => (original === "" ? null : val))
    .test(
      "adjustment-account-required",
      "Adjustment Account is required",
      function (value) {
        const { adjustmentAccount } = this.parent;

        if (value !== null && value !== "" && Number(value) !== 0) {
          return !!adjustmentAccount;
        }

        return true;
      },
    ),
});

export default function NewInvoiceForm({ edit = false, clone = false }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { invoiceId } = useParams();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchParams] = useSearchParams();
  const [billingAddress, setBillingAddress] = useState({});
  const [customerPaymentterm, setCustomerPaymentterm] = useState(null);

  const { data: selectedInvoiceData } = useInvoiceById(invoiceId);

  const updatedata = selectedInvoiceData?.data || null;

  const userId = searchParams.get("userId") || updatedata?.customerId;

  const [currencyCode, setCurrencyCode] = useState(
    updatedata?.currency?.code || "INR",
  );
  const [currency, setCurrency] = useState(updatedata?.currency || null);
  const currencyId = currency?.currencyId || null;

  const { mutate: fetchCurrencyByCode } = useCurrencyByCode();

  const { data: priceVariantsData, isLoading: isLoadingVariants } =
    usePriceVariants(currencyId);

  const { mutate: createMutation } = useCreateManualInvoice();

  const { mutate: updateMutation } = useUpdateManualInvoice();

  const { data: PaymentTerms } = usePaymentTerms();

  const defaultPaymentTerms = PaymentTerms?.data?.find((pay) => pay.isDefault);

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      customerId: userId,
      invoiceNo: "",
      orderNo: "",
      invoiceDate: new Date().toISOString().slice(0, 10),
      dueDate: "",
      paymentTerm: "",
      salesPersonId: null,
      subject: "",
      lineItems: [{ ...DEFAULT_LINE_ITEM }],
      subTotal: "0.00",
      discountType: "percentage",
      discountValue: 0,
      discountAccount: "",
      isDiscountBeforeTax: true,
      gstTaxId: "",
      isInterState: false,
      taxType: "TDS",
      tdsTaxId: "",
      tcsTaxId: null,
      tdsValue: 0,
      adjustment: 0,
      adjustmentAccount: "",
      batchPayments: [{ ...DEFAULT_BATCH_PAYMENT }],
      paymentGateway: null,
      allowPartialPayments: false,
      isReceivedPayment: false,
      contactPersons: [],
      notes: "",
      terms: "",
      files: [],
    },
  });
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    register,
    reset,
    setError,
    getValues,
    formState: { isDirty },
    clearErrors,
  } = methods;

  useEffect(() => {
    if (updatedata) {
      reset({
        customerId: updatedata?.customerId ?? "",
        invoiceNo: !clone ? updatedata?.invoiceNo : watch("invoiceNo") || "",
        orderNo: updatedata?.orderNo ?? "",
        invoiceDate:
          updatedata?.invoiceDate && !clone
            ? new Date(updatedata.invoiceDate).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
        dueDate:
          updatedata?.invoiceDate && !clone
            ? new Date(updatedata.dueDate).toISOString().slice(0, 10)
            : "",
        paymentTerm:
          (typeof updatedata?.paymentTerm === "object"
            ? updatedata?.paymentTerm?._id || updatedata?.paymentTerm?.id
            : updatedata?.paymentTerm) ??
          customerPaymentterm ??
          defaultPaymentTerms?._id,
        salesPersonId: updatedata?.salesPerson?._id ?? updatedata?.salesPerson?.id ?? null,
        subject: updatedata?.subject ?? "",

        lineItems:
          Array.isArray(updatedata?.lineItems) &&
          updatedata.lineItems.length > 0
            ? updatedata.lineItems.map((item) => ({
                pricingId: item?.pricingId ?? "",
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
                pricingType: item.pricingType ?? "",
                tax: {
                  taxName: item.tax?.taxLabel ?? "",
                  percentage: item.tax?.percentage ?? 0,
                  amount: item.tax?.amount ?? 0,
                },
              }))
            : [{ ...DEFAULT_LINE_ITEM }],

        subTotal: updatedata?.subTotal ?? "0.00",
        discountType: updatedata?.discountType ?? "percentage",
        discountValue: updatedata?.discountValue ?? 0,
        discountAccount: updatedata?.discountAccount ?? "",
        isDiscountBeforeTax: updatedata?.isDiscountBeforeTax ?? true,
        gstTaxId: updatedata?.gstTaxId ?? "",
        isInterState: updatedata?.isInterState ?? false,
        taxType: updatedata?.taxes?.taxType ?? "",
        tdsTaxId: updatedata?.taxes?.taxMasterId ?? "",
        tcsTaxId: updatedata?.tcsTaxId ?? null,
        tdsValue: updatedata?.tdsAmount ?? 0,
        adjustment: updatedata?.adjustment ?? 0,
        adjustmentAccount: updatedata?.adjustmentAccount ?? "",
        allowPartialPayments: updatedata?.allowPartialPayments ?? false,
        paymentGateway: updatedata?.paymentGateway[0],
        isReceivedPayment: updatedata?.isReceivedPayment ?? false,
        batchPayments:
          Array.isArray(updatedata?.invoicePayments) &&
          updatedata.invoicePayments.length > 0
            ? updatedata.invoicePayments.map((item) => ({
                paymentModes: item?.paymentModes,
                depositTo: item?.depositTo,
                amount: item?.amount,
              }))
            : [{ ...DEFAULT_BATCH_PAYMENT }],

        contactPersons: updatedata?.contactPersons ?? [],
        notes: updatedata?.notes ?? "",
        terms: updatedata?.terms ?? "",
        files: Array.isArray(updatedata?.attachments)
          ? updatedata.attachments.map((file) => ({
              name: file.fileName,
              key: file.fileKey,
              size: file.fileSize,
              uploadedAt: file.uploadedAt,
            }))
          : [],
      });
    }
  }, [updatedata?._id]);

  const handleCustomerSelect = useCallback(
    (customer) => {
      if (customer) {
        setValue("customerId", customer._id, { shouldValidate: true });
        const code = customer.currencyCode || null;
        setCurrencyCode(code);

        const billing =
          customer?.workspaceDetails?.billing_address_details ||
          customer?.billing_address_details ||
          null;
        setBillingAddress(billing);
        const paymentTerm = customer?.paymentTermDetails?._id || null;
        setCustomerPaymentterm(paymentTerm);
      }
    },
    [setValue],
  );

  useEffect(() => {
    if (customerPaymentterm) {
      setValue("paymentTerm", customerPaymentterm);
    }
  }, [customerPaymentterm]);

  useEffect(() => {
    if (
      defaultPaymentTerms?._id &&
      !customerPaymentterm &&
      !getValues("paymentTerm")
    ) {
      setValue("paymentTerm", defaultPaymentTerms._id);
    }
  }, [defaultPaymentTerms?._id, customerPaymentterm]);

  const isPartialPayment = watch("allowPartialPayments");
  const calculations = useItemCalculations({ control, setValue, watch });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  const handleRemove = (ind) => {
    if (fields?.length !== 1) {
      remove(ind);
    }
  };

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

  const onSubmit = async (data, actionType) => {
    const totalPaid = data.batchPayments.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0,
    );

    if (isPartialPayment && totalPaid !== Number(calculations.totalAmount)) {
      setError("batchPayments", {
        type: "manual",
        message: "Total payment amount must match invoice total",
      });
      return;
    }

    const lineItems = (data.lineItems || []).map((item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      const taxPercentage = Number(item.tax?.percentage) || 0;
      const lineAmount = qty * price;
      const taxAmount = (lineAmount * taxPercentage) / 100;

      return {
        pricingId: item.pricingId,
        productId: item.actualProductId,
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
        pricingType: item.pricingType,
        tax: {
          taxName: item.tax?.taxName || "",
          percentage: taxPercentage,
          amount: taxAmount,
        },
      };
    });

    const batchPayments = (data.batchPayments || []).map((item) => {
      return {
        paymentModes: item?.paymentModes,
        depositTo: item?.depositTo,
        amount: item?.amount,
      };
    });

    const isTDS = data.taxType === "TDS";
    const isTCS = data.taxType === "TCS";

    const taxFields = {
      ...(isTDS && {
        tdsTaxId: data.tdsTaxId || null,
        tdsValue: Number(data.tdsValue) || 0,
      }),
      ...(isTCS && {
        tcsTaxId: data.tdsTaxId || null,
        tcsValue: Number(data.tdsValue) || 0,
      }),
    };

    const invoiceData = {
      customerId: data.customerId,
      invoiceNo: data.invoiceNo,
      invoiceDate: data.invoiceDate
        ? new Date(data.invoiceDate).toISOString()
        : null,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      orderNo: data.orderNo,
      paymentTerm: data.paymentTerm,

      currency: currency || null,

      subject: data.subject,

      lineItems,

      discountType: data.discountType,
      discountValue: Number(data.discountValue) || 0,
      ...(Number(data.discountValue) > 0 && {
        discountAccount: data.discountAccount,
      }),
      isDiscountBeforeTax: data.isDiscountBeforeTax ?? true,
      gstTaxId: data.gstTaxId || null,
      isInterState: data.isInterState ?? false,
      taxType: data.taxType ?? "",
      ...taxFields,
      adjustment: Number(data.adjustment) || 0,
      ...(Number(data.adjustment) !== 0 && {
        adjustmentAccount: data.adjustmentAccount,
      }),
      paymentGateway: [data.paymentGateway],
      allowPartialPayments: data.allowPartialPayments ?? true,
      isReceivedPayment: data.isReceivedPayment,
      ...(data.isReceivedPayment && { batchPayments }),
      salesPersonId: data.salesPersonId || null,
      contactPersons: data.contactPersons || [],
      notes: data.notes || "",
      terms: data.terms || "",
    };

    let finalPayload = invoiceData;

    // if (edit) {
    //   const dirty = dirtyFields;
    //   const filtered = Object.keys(dirty).reduce((acc, key) => {
    //     if (key === "lineItems") {
    //       acc.lineItems = invoiceData.lineItems;
    //     } else {
    //       acc[key] = invoiceData[key];
    //     }
    //     return acc;
    //   }, {});

    //   filtered.customerId = updatedata?.customerId;

    //   finalPayload = filtered;
    // }

    const formData = new FormData();
    formData.append("invoiceData", JSON.stringify(finalPayload));

    const files = data.files || [];
    for (let file of files) {
      formData.append("attachments", file);
    }

    if (edit) {
      updateMutation(
        { data: formData, id: updatedata?._id },
        {
          onSuccess: () => navigate(-1),
          onError: (err) => console.error("Update Failed:", err),
        },
      );
    } else {
      createMutation(formData, {
        onSuccess: (res) => {
          const id = res?.data?._id;
          if (actionType === "send") {
            navigate(`/sales/invoices/${id}/email`);
          } else {
            navigate(-1);
          }
        },
      });
    }
  };

  const customerSelected = watch("customerId");

  const { data: singleCustomer, refetch: refetchCustomer } = useGetCustomerInfo(
    customerSelected,
    {
      enabled: !!customerSelected,
    },
  );

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
              {edit ? "Edit Invoice" : "New Invoice"}
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
              // px: { xs: 2, sm: 3 },
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "background.muted"
                      : "#f9f9fb",
                  borderRadius: 2,
                  p: { xs: 2, sm: 3 },
                }}
              >
                <FormRow label="Customer Name" mandatory sx={{ mb: 2 }}>
                  <CustomerDropdownList
                    control={control}
                    userId={userId}
                    setValue={setValue}
                    customerForInvoice={true}
                    onCustomerSelect={handleCustomerSelect}
                    errors={methods.formState.errors}
                    customerData={singleCustomer}
                  />
                </FormRow>
                {customerSelected && (
                  <Box sx={{ display: "flex", ml: 20 }}>
                    <AddressSection
                      customerData={singleCustomer}
                      entity="workspace"
                      onSuccess={refetchCustomer}
                    />
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  pointerEvents: customerSelected ? "auto" : "none",
                  opacity: customerSelected ? 1 : 0.5,
                  px: { xs: 2, sm: 3 },
                }}
              >
                <InvoiceHeaderSection
                  control={control}
                  errors={methods.formState.errors}
                  setValue={setValue}
                  edit={edit}
                  watch={watch}
                  PaymentTerms={PaymentTerms}
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
                  edit={edit}
                  errors={methods.formState.errors}
                  billingAddress={billingAddress}
                  setError={setError}
                  clearErrors={clearErrors}
                />

                <TermsAndCondition
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  errors={methods.formState.errors}
                  getValues={getValues}
                />
              </Box>
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
                label={edit ? "Save" : "Save as Draft"}
                variant="contained"
                onClick={handleSubmit((data) => onSubmit(data, "save"))}
                disabled={!isDirty}
                startIcon
                sx={{ bgcolor: edit ? "" : "grey.3" }}
              />

              <CommonButton
                label="Save and Send"
                variant="contained"
                onClick={handleSubmit((data) => onSubmit(data, "send"))}
                disabled={!isDirty}
                startIcon
              />

              <CommonButton
                label="Cancel"
                variant="outlined"
                onClick={() => navigate(-1)}
                startIcon
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
