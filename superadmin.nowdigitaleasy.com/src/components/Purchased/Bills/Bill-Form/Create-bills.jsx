import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import CommonButton from "../../../common/NDE-Button";
import CloseIcon from "@mui/icons-material/Close";
import FormRow from "../../../Sales/Invoices/New Component/FormRow";
import CustomerDropdownList from "../../../Sales/Invoices/Components/CustomerDropdownList";
import BillsHeaderSection from "./BillsHeaderSection";
import BillItemTableSection from "./BillItemTableSection";
import BillItemTermsAndConditions from "./BillItemTermsAndConditions";
import CommonVendorList from "../../../common/NDE-Vendor-list";
import {
  useBillsCreate,
  useGetBillsInfo,
  useUpdateBillsById,
} from "../../../../hooks/purchased/bills-hooks";
import { useGetVendorInfo } from "../../../../hooks/Vendor/Vendor-hooks";
import { usePaymentTerms } from "../../../../hooks/payment-terms/payment-terms-hooks";
import AddressSection from "../../../common/NDE-Address";

const DEFAULT_LINE_ITEM = {
  item: "",
  itemId: "",
  itemName: "",
  description: "",
  account: "",
  quantity: 1,
  price: 0,
  unit: "",
  tax: {
    taxLabel: "",
    taxName: "",
    percentage: 0,
    amount: 0,
  },
};

const schema = Yup.object({
  vendorId: Yup.string().required("Vendor is required"),
  source: Yup.string().required("Source is Required"),
  destination: Yup.string().required("Destination is required"),
  billNo: Yup.string().required("Bill Number is required"),
  billDate: Yup.string().required("Bill Date is required"),
  dueDate: Yup.string().required("Due Date is required"),
  lineItems: Yup.array().of(
    Yup.object().shape({
      itemName: Yup.string().required("Item is required"),
      quantity: Yup.number()
        .typeError("Quantity must be a number")
        .positive("Quantity must be positive"),
      price: Yup.number()
        .typeError("Price must be a number")
        .positive("Price must be positive"),
      account: Yup.string().required("Account is required"),
    }),
  ),
  discountType: Yup.string().nullable(),
  discountValue: Yup.number()
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
  discountAccount: Yup.string().when("discountValue", {
    is: (value) => value !== null && value !== "" && value !== 0,
    then: (schema) =>
      schema
        .required("Discount Account is required")
        .typeError("Discount Account must be a string"),
    otherwise: (schema) => schema.nullable(),
  }),
  adjustment: Yup.number()
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

const NewBillsForm = ({ edit = false }) => {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorPaymentterm, setVendorPaymentterm] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const { billId } = useParams();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { mutate: createMutation } = useBillsCreate();
  const { mutate: updateMutation } = useUpdateBillsById();

  const { data: selectedBillData } = useGetBillsInfo(billId);

  const updatedata = selectedBillData?.data || null;

  const [billingAddress, setBillingAddress] = useState({});

  const { data: vendorData, refetch: refetchVendor } = useGetVendorInfo(
    selectedVendor?._id,
    {
      enabled: !!selectedVendor?._id,
    },
  );

  useEffect(() => {
    setBillingAddress(vendorData?.data?.billing_address_details);
    setVendorPaymentterm(vendorData?.data?.payment_term);
  }, [vendorData]);

  const { data: PaymentTerms } = usePaymentTerms();

  const defaultPaymentTerms = PaymentTerms?.data?.find((pay) => pay.isDefault);

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      vendorId: "",
      source: "",
      destination: "",
      billNo: "",
      orderNo: "",
      billDate: new Date().toISOString().slice(0, 10),
      dueDate: "",
      paymentTerm: "",
      isReverseCharge: false,
      payableAccount: "",
      subject: "",
      taxSelect: "exclusive",
      lineItems: [{ ...DEFAULT_LINE_ITEM }],
      subTotal: "0.00",
      discountType: "percentage",
      discountValue: 0,
      discountAccount: "",
      isDiscountBeforeTax: true,
      gstTaxId: "",
      isInterState: false,
      tdsTaxId: "",
      tcsTaxId: null,
      tdsValue: 0,
      adjustment: 0,
      adjustmentAccount: "",
      // paymentGateway: null,
      // allowPartialPayments: false,
      // isReceivedPayment: false,
      // contactPersons: [],
      notes: "",
      files: [],
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    register,
    getValues,
    reset,
    setError,
    formState: { isDirty },
    clearErrors,
  } = methods;

  const isReverse = watch("isReverseCharge");

  useEffect(() => {
    if (!updatedata) return;
    reset({
      vendorId: updatedata?.vendor?._id ?? "",
      billNo: updatedata?.billNo ?? "",
      orderNo: updatedata?.orderNo ?? "",
      source: updatedata?.source ?? "",
      destination: updatedata?.destination ?? "",
      billDate: updatedata?.billDate
        ? new Date(updatedata.billDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),

      dueDate: updatedata?.dueDate
        ? new Date(updatedata.dueDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),

      paymentTerm:
        (typeof updatedata?.paymentTerm === "object"
          ? updatedata?.paymentTerm?._id || updatedata?.paymentTerm?.id
          : updatedata?.paymentTerm) ??
        vendorPaymentterm ??
        defaultPaymentTerms?._id,

      // updatedata?.paymentTerm ??
      // vendorPaymentterm ??
      // defaultPaymentTerms?._id,
      payableAccount: updatedata?.payableAccount ?? "",
      subject: updatedata?.subject ?? "",

      lineItems:
        Array.isArray(updatedata?.items) && updatedata.items.length > 0
          ? updatedata.items.map((item) => ({
              itemName: item?.itemName ?? "",
              itemId: item?.item ?? "",
              description: item?.description ?? "",
              quantity: item?.quantity ?? 1,
              price: item?.price ?? 0,
              account: item?.accountId ?? "",
              tax: {
                taxName: item?.tax?.taxName ?? "",
                percentage: item?.tax?.percentage ?? 0,
                amount: item?.tax?.amount ?? 0,
              },
            }))
          : [{ ...DEFAULT_LINE_ITEM }],

      subTotal: updatedata?.subTotal ?? "0.00",
      discountType: updatedata?.discountType ?? "percentage",
      discountValue: updatedata?.discountValue ?? 0,
      discountAccount: updatedata?.discountAccount ?? "",
      taxSelect: updatedata?.taxSelect ?? "exclusive",
      taxType: updatedata?.taxType ?? "",
      tdsTaxId: updatedata?.tdsTaxId ?? "",
      tcsTaxId: updatedata?.tcsTaxId ?? "",
      tdsValue: updatedata?.tdsAmount ?? 0,

      adjustment: updatedata?.adjustment ?? 0,
      adjustmentAccount: updatedata?.adjustmentAccount ?? "",
      notes: updatedata?.notes ?? "",
    });
  }, [updatedata?._id]);

  useEffect(() => {
    if (vendorPaymentterm) {
      setValue("paymentTerm", vendorPaymentterm);
    }
  }, [vendorPaymentterm]);

  useEffect(() => {
    vendorData?.data?.tds && setValue("tdsTaxId", vendorData.data.tds);
  }, [vendorData]);

  useEffect(() => {
    if (
      defaultPaymentTerms?._id &&
      !vendorPaymentterm &&
      !getValues("paymentTerm")
    ) {
      setValue("paymentTerm", defaultPaymentTerms._id);
    }
  }, [defaultPaymentTerms?._id, vendorPaymentterm]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  const handleRemove = (ind) => {
    if (fields?.length !== 1) {
      remove(ind);
    }
  };

  const onSubmit = async (data, actionType) => {
    const items = (data.lineItems || []).map((item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      const taxPercentage = Number(item.tax?.percentage) || 0;
      const lineAmount = qty * price;
      const taxAmount = (lineAmount * taxPercentage) / 100;

      return {
        itemName: item.itemName,
        item: item.itemId || null,
        description: item.description,
        ...(!isReverse && {
          tax: {
            taxLabel: `${item.tax?.taxName} ${taxPercentage}`,
            taxName: item.tax?.taxName || "",
            percentage: taxPercentage,
            amount: taxAmount,
          },
        }),
        quantity: qty,
        price: price,
        unit: item.unit,
        accountId: item.account,
      };
    });

    const isTDS = data.taxType === "TDS";
    const isTCS = data.taxType === "TCS";

    const taxFields = {
      ...(isTDS && {
        tdsTaxId: data.tdsTaxId || null,
        tdsAmount: Number(data.tdsValue) || 0,
      }),
      ...(isTCS && {
        tcsTaxId: data.tdsTaxId || null,
        tcsAmount: Number(data.tdsValue) || 0,
      }),
    };

    const billsdata = {
      vendor: data.vendorId,
      source: data.source,
      destination: data.destination,
      billNo: data.billNo,
      orderNo: data.orderNo,
      billDate: data.billDate ? new Date(data.billDate).toISOString() : null,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      currency: selectedVendor?.currency,
      billingAddress: vendorData?.data?.billing_address_details,
      paymentTerm: data.paymentTerm,
      payableAccount: data.payableAccount || null,
      subject: data.subject,
      taxSelect: data.taxSelect,
      items,
      discountType: data.discountType,
      discountValue: Number(data.discountValue) || 0,
      ...(Number(data.discountValue) > 0 && {
        discountAccount: data.discountAccount,
      }),
      taxType: data.taxType || null,
      ...taxFields,
      adjustment: Number(data.adjustment) || 0,
      ...(Number(data.adjustment) !== 0 && {
        adjustmentAccount: data.adjustmentAccount,
      }),

      notes: data.notes || "",
      status: actionType,
    };

    let finalPayload = billsdata;

    const formData = new FormData();
    formData.append("billData", JSON.stringify(finalPayload));
    const files = data.files || [];

    files.forEach((file) => {
      formData.append("attachments", file);
    });

    if (edit) {
      updateMutation(
        {
          data: formData,
          billId: updatedata?._id,
        },
        {
          onSuccess: () => navigate(-1),
          onError: (err) => console.error("Update Failed:", err),
        },
      );
    } else {
      createMutation(formData, {
        onSuccess: (res) => {
          const id = res?.data?._id;
          if (actionType === "draft") {
            navigate(-1);
          } else if (actionType === "open") {
            navigate(`/purchased/bills/details/${id}`);
          }
        },
      });
    }
  };

  const vendorSelected = watch("vendorId");
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
              {edit ? "Edit Bill" : "New Bill"}
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
                }}
              >
                <FormRow
                  label="Vendor Name"
                  mandatory
                  sx={{ mt: 2, px: { xs: 2, sm: 3 } }}
                >
                  <CommonVendorList
                    name="vendorId"
                    control={control}
                    setValue={setValue}
                    vendorData={edit ? watch("vendorId") : undefined}
                    rules={{ required: "Vendor is required" }}
                    placeholder="Select Vendor"
                    noLabel={true}
                    onVendorSelect={(vendorObj) => setSelectedVendor(vendorObj)}
                    selectedVendor={vendorData?.data}
                  />
                </FormRow>
                {vendorSelected && (
                  <Box sx={{ display: "flex", ml: 24, mb: 2 }}>
                    <AddressSection
                      customerData={vendorData?.data}
                      entity="vendor"
                      onSuccess={refetchVendor}
                    />
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  pointerEvents: vendorSelected ? "auto" : "none",
                  opacity: vendorSelected ? 1 : 0.5,
                  px: { xs: 2, sm: 3 },
                }}
              >
                <BillsHeaderSection
                  control={control}
                  errors={methods.formState.errors}
                  setValue={setValue}
                  edit={edit}
                  watch={watch}
                  billingAddress={billingAddress}
                  updatedata={updatedata}
                />

                <BillItemTableSection
                  fields={fields}
                  append={append}
                  remove={handleRemove}
                  priceVariantsData={[]}
                  isLoadingVariants={false}
                  watch={watch}
                  setValue={setValue}
                  register={register}
                  edit={edit}
                  errors={methods.formState.errors}
                  billingAddress={billingAddress}
                  setError={setError}
                  clearErrors={clearErrors}
                />
                <BillItemTermsAndConditions
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
              {!edit && (
                <CommonButton
                  label="Save as Draft"
                  variant="contained"
                  onClick={handleSubmit((data) => onSubmit(data, "draft"))}
                  disabled={!isDirty}
                  startIcon
                  sx={{ bgcolor: "grey.3" }}
                />
              )}

              <CommonButton
                label={edit ? "Save" : "Save as Open"}
                variant="contained"
                onClick={handleSubmit(
                  (data) => onSubmit(data, "open"),
                  (errors) => {
                    console.log("Form Errors:", errors);
                  },
                )}
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
                Total Amount:
                {watch("total") || "0.00"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </FormProvider>
    </>
  );
};

export default NewBillsForm;
