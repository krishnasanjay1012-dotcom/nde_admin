import {
  useOutletContext,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import CustomerNameHeader from "../../../components/Sales/Invoices/Components/CustomerNameHeader";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Divider,
  Checkbox,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import AttachmentsPopover from "../../../components/Sales/Invoices/Components/AttachmentPopover";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";

import {
  CommonMultiSelect,
  CommonNestedSelect,
  CommonSelect,
  CommonTextField,
  CustomSearchableSelect,
} from "../../../components/common/fields";
import PaymentModeModal from "../../../components/Sales/Invoices/PaymentModal";
import CustomerDetailsDrawer from "../../../components/CustomerDetailsDrawer/CustomerDetailsDrawer";
import {
  useCreateRecordPayment,
  useGetDepostiToList,
  useGetFromAccList,
  useGetPaymentModes,
} from "../../../hooks/sales/invoice-hooks";
import ConfigurePaymentDialog from "../../../components/Sales/Invoices/Payment/PaymentNumberDialog";
import CommonButton from "../../../components/common/NDE-Button";
const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 5;

const Label = ({ text, required }) => (
  <Typography
    fontSize={14}
    color={required ? "red" : "#000"}
    sx={{ minWidth: 160 }}
  >
    {text}
    {required && " *"}
  </Typography>
);

const FormRow = ({ label, required, children }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      gap: 2,
      mb: 3,
      alignItems: { sm: "center" },
      width: "100%",
      minWidth: 0,
    }}
  >
    <Box sx={{ minWidth: 160, flexShrink: 0 }}>
      <Label text={label} required={required} />
    </Box>

    <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
  </Box>
);

// Yup validation schema
const schema = yup.object({
  amount: yup
    .number()
    .typeError("Enter a valid amount in the Amount Received field")
    .positive("Amount must be greater than 0")
    .required("Amount Received is required"),

  depositTo: yup.string().required("Deposit To is required"),
  paymentModes: yup.string().required("Payment Mode Required"),
  payment_date: yup
    .date()
    .typeError("Payment Date is required")
    .required("Payment Date is required"),

  paymentMode: yup.string(),

  taxDeducted: yup.boolean(),
  AmountWithHeld: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .when("taxDeducted", {
      is: true,
      then: (schema) =>
        schema
          .typeError("Enter valid TDS amount")
          .positive("TDS amount must be greater than 0")
          .required("TDS Amount is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  tdsTaxAccount: yup
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .when("taxDeducted", {
      is: true,
      then: (schema) => schema.required("TDS Tax Account is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export default function CreateRecordPayment() {
  const navigate = useNavigate();
  const location = useLocation();

  const [openSettings, setOpenSettings] = useState(false);

  const handleBack = () => {
    const basePath = location.pathname.replace("/payment", "");
    navigate(`${basePath}${location.search}`);
  };
  const { selectedCustomer } = useOutletContext();
  const { invoiceId } = useParams();
  const customerId = selectedCustomer?.contact?._id;
  const currencyCode = selectedCustomer?.currency?.code ?? selectedCustomer?.contact?.currencyCode;
  const PaymentNo = selectedCustomer?.paymentCounterSettings?.nextNumber;
  const prefixString = selectedCustomer?.paymentCounterSettings?.prefixString;
  const paymentNum = prefixString + PaymentNo;
  const uniqueId = selectedCustomer?.paymentCounterSettings?._id;
  const userMailId = selectedCustomer?.contact?._id;
  const userMail = selectedCustomer?.contact?.email;
  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const customerName = selectedCustomer?.contact
    ? `${capitalize(selectedCustomer?.contact?.first_name)} ${capitalize(selectedCustomer.contact.last_name)}`.trim()
    : "Customer";

  const { data: paymentMode } = useGetPaymentModes();
  const { data: fromAcc } = useGetFromAccList();
  const { data: taxList } = useGetDepostiToList();
  const { mutateAsync, isPending } = useCreateRecordPayment(invoiceId);

  const paymentModeList = paymentMode?.data ?? [];
  const depositToData = fromAcc?.data ?? [];
  const tdsTaxList = taxList?.data ?? [];
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      customer_id: customerId,
      workspace_id: selectedCustomer?.workspaceId,
      invoice_id: invoiceId,

      amount: selectedCustomer?.totalAmount,
      currency: currencyCode,
      bank_charges: 0,

      PAN: "",

      status: "captured",
      paymentGateway: "manual",

      depositTo: "",
      paymentModes: "",

      reference: "",

      taxDeducted: false,
      AmountWithHeld: "",
      tdsTaxAccount: "",

      notes: "",
      attachments: [],
      thankYouNoteSent: true,
      thankYouContacts: [userMailId],

      PaymentNo: paymentNum,
      payment_date: new Date().toISOString().slice(0, 10),
    },

    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key];

      if (value === null || value === undefined) return;

      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (Array.isArray(value)) {
        if (key === "attachments") {
          value.slice(0, 5).forEach((file) => {
            if (file instanceof File) {
              formData.append("attachments", file);
            }
          });
        } else {
          value.forEach((item, index) => {
            if (item !== undefined && item !== null) {
              formData.append(`${key}[${index}]`, item);
            }
          });
        }
      } else if (typeof value === "boolean") {
        formData.append(key, String(value));
      } else {
        formData.append(key, value);
      }
    });

    try {
      await mutateAsync(formData);
      handleBack();
    } catch {
      console.warn("");
    }
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);

  const openPopover = (e) => setAnchorEl(e.currentTarget);
  const closePopover = () => setAnchorEl(null);

  const openPaymentModal = () => setPaymentModal(true);
  const closePaymentMoadl = () => setPaymentModal(false);

  const isSendToUser = watch("sendThankYou");

  const [openDetails, setOpenDetails] = useState(false);
  const handleOpenDetails = () => setOpenDetails(true);
  const handleCloseDetails = () => setOpenDetails(false);

  const isTaxDeducted = watch("taxDeducted");

  const handlePaymentNumberUpdate = (prefix, num) => {
    setValue("PaymentNo", `${prefix}-${num}`);
  };

  useEffect(() => {
    if (paymentModeList.length && Object.keys(depositToData).length) {
      const paymentId = paymentModeList.find(
        (p) => p?.code?.toLowerCase() === "cash",
      )?._id;
      setValue("paymentModes", paymentId);


      const depositToId = Object.values(depositToData).flat().find((d) => d?.name?.toLowerCase() === "petty cash")?.id
      setValue("depositTo", depositToId)
    }

  }, [paymentModeList, depositToData, setValue]);
  const thankYouNoteSent = watch("thankYouNoteSent");
  const thankYouContacts = watch("thankYouContacts") || [];
  console.log(
    "thankYouContacts",
    watch("paymentModes"),
    watch("depositTo"),
    paymentModeList,
    depositToData,
  );
  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <CustomerNameHeader selectedCustomer={selectedCustomer} />
      <Divider sx={{ p: 1 }} />

      <Box flex={1} overflow="auto" pb={1}>
        <Box
          sx={{ backgroundColor: "#f9f9fb", mb: 3 }}
          display={"flex"}
          flexDirection={"row"}
          alignItems={"baseline"}
        >
          <Box width={"60%"} sx={{ px: 2, py: 2 }}>
            <FormRow label="Customer Name" required>
              <CommonTextField disabled value={customerName}  mb={0}/>
            </FormRow>

            <FormRow label="Payment #" required>
              <Controller
                name="PaymentNo"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    error={!!errors.paymentNo}
                    helperText={errors.paymentNo?.message}
                    mb={-2}
                    endAdornment={
                      <SettingsIcon
                        fontSize="small"
                        sx={{ cursor: "pointer" }}
                      />
                    }
                    onEndAdornmentClick={() => setOpenSettings(true)}
                  />
                )}
              />
            </FormRow>
          </Box>
          <Box width={"40%"} display={"flex"} justifyContent={"end"}>
            <Box
              onClick={handleOpenDetails}
              sx={{
                backgroundColor: "#3F4661",
                color: "#fff",
                borderRadius: "10px 0 0 10px",

                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                width: "100%",
                maxWidth: 300,
                "&:hover": {
                  backgroundColor: "#4A5170",
                },
              }}
            >
              <Typography fontWeight={600} color="#fff" ml={1}>
                {customerName}&apos;s Details
              </Typography>

              <IconButton size="small" sx={{ color: "#fff" }}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Box px={3}>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box flex={1}>
              <FormRow label="Amount Received (INR)" required>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <CommonTextField
                      {...field}
                      fullWidth
                      inputProps={{ min: 0, step: "0.01" }}
                      error={!!errors.amount}
                      helperText={errors.amount?.message}
                      mb={0}
                    />
                  )}
                />
              </FormRow>
            </Box>

            <Box flex={1}>
              <FormRow label="Bank Charges (if any)">
                <Controller
                  name="bank_charges"
                  control={control}
                  render={({ field }) => (
                    <CommonTextField
                      {...field}
                      fullWidth
                      error={!!errors.bank_charges}
                      helperText={errors.bank_charges?.message}
                      inputProps={{ min: 0, step: "0.01" }}
                      mb={0}
                    />
                  )}
                />
              </FormRow>
            </Box>
          </Box>

          {/* Tax */}
          <FormRow label="Tax deducted?">
            <Controller
              name="taxDeducted"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  row
                  value={String(field.value)}
                  onChange={(e) => field.onChange(e.target.value === "true")}
                >
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="No Tax deducted"
                  />
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Yes, TDS"
                  />
                </RadioGroup>
              )}
            />
          </FormRow>
          {isTaxDeducted && (
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box flex={1}>
                <FormRow label="Amount Withheld" required>
                  <Controller
                    name="AmountWithHeld"
                    control={control}
                    render={({ field }) => (
                      <CommonTextField
                        {...field}
                        fullWidth
                        inputProps={{ min: 0, step: "0.01" }}
                        error={!!errors.AmountWithHeld}
                        helperText={errors.AmountWithHeld?.message}
                        mt={0}
                        mb={0}
                      />
                    )}
                  />
                </FormRow>
              </Box>

              <Box flex={1}>
                <FormRow label="TDS Tax Account" required>
                  <Controller
                    name="tdsTaxAccount"
                    control={control}
                    render={({ field }) => (
                      <CommonSelect
                        options={tdsTaxList}
                        {...field}
                        fullWidth
                        error={!!errors.tdsTaxAccount}
                        helperText={errors.tdsTaxAccount?.message}
                        labelKey="name"
                        valueKey="_id"
                        mt={0}
                        mb={0}
                      />
                    )}
                  />
                </FormRow>
              </Box>
            </Box>
          )}
          <Divider sx={{ mb: 3 }} />

          {/* Payment Info */}
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box flex={1}>
              <FormRow label="Payment Date" required>
                <Controller
                  name="payment_date"
                  control={control}
                  render={({ field }) => (
                    <CommonTextField
                      {...field}
                      type="date"
                      fullWidth
                      error={!!errors.payment_date}
                      helperText={errors.payment_date?.message}
                      mb={0}
                    />
                  )}
                />
              </FormRow>
            </Box>

            <Box flex={1}>
              <FormRow label="Payment Mode" required>
                <Controller
                  name="paymentModes"
                  control={control}
                  rules={{ required: "Payment Mode is required" }}
                  render={({ field }) => (
                    <CustomSearchableSelect
                      value={field.value}
                      onChange={field.onChange}
                      error={!!errors.paymentModes}
                      helperText={errors.paymentModes?.message}
                      options={paymentModeList}
                      labelKey="code"
                      valueKey="_id"
                      onBottomButtonClick={() => {
                        openPaymentModal();
                      }}
                      buttonLabel={"Configure Payment Mode"}
                      Icon={<AddIcon fontSize="small" />}
                      mb={0}
                    />
                  )}
                />
              </FormRow>
              <PaymentModeModal
                onClose={closePaymentMoadl}
                open={paymentModal}
                paymentModeList={paymentModeList}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 3,
              width: "100%",
              maxWidth: "100%",
            }}
          >
            {" "}
            <Box flex={1} sx={{ minWidth: 0 }}>
              {" "}
              <FormRow label="Deposit To" required>
                <Controller
                  name="depositTo"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <CommonNestedSelect
                      value={field.value}
                      onChange={field.onChange}
                      name={field.name}
                      options={depositToData}
                      searchable
                      labelKey="name"
                      valueKey="id"
                      error={!!errors.depositTo}
                      helperText={errors.depositTo?.message}
                    />
                  )}
                />
              </FormRow>
            </Box>
            <Box flex={1} sx={{ minWidth: 0 }}>
              {" "}
              <FormRow label="Reference #">
                <Controller
                  name="reference"
                  control={control}
                  render={({ field }) => (
                    <CommonTextField
                      {...field}
                      fullWidth
                      error={!!errors.reference}
                      helperText={errors.reference?.message}
                    />
                  )}
                />
              </FormRow>
            </Box>
          </Box>

          <FormRow label="Notes">
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  multiline
                  rows={3}
                  fullWidth
                  error={!!errors.notes}
                  helperText={errors.notes?.message}
                />
              )}
            />
          </FormRow>
          <Divider />
          {/* Attachments */}
          <Box my={3}>
            <Label text="Attachments" />
            <Controller
              name="attachments"
              control={control}
              render={({ field }) => (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      pt: 0.5,
                    }}
                  >
                    <Button
                      component="label"
                      variant="outlined"
                      endIcon={<KeyboardArrowDownIcon />}
                      sx={{ textTransform: "none" }}
                    >
                      Upload File
                      <input
                        type="file"
                        hidden
                        multiple
                        onChange={(e) => {
                          const existingFiles = field.value || [];
                          const selectedFiles = Array.from(
                            e.target.files || [],
                          );

                          const remainingSlots =
                            MAX_FILES - existingFiles.length;

                          if (remainingSlots <= 0) return;

                          const validFiles = selectedFiles.filter(
                            (file) =>
                              file.size <= MAX_FILE_SIZE_MB * 1024 * 1024,
                          );

                          const filesToAdd = validFiles.slice(
                            0,
                            remainingSlots,
                          );

                          field.onChange([...existingFiles, ...filesToAdd]);

                          e.target.value = "";
                        }}
                      />
                    </Button>
                    {field?.value?.length > 0 && (
                      <Box
                        onClick={openPopover}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          backgroundColor: "#4285f4",
                          color: "#fff",
                          height: 35,
                          width: 35,
                          justifyContent: "center",
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        <AttachFileSharpIcon
                          sx={{ fontSize: 16, color: "#fff" }}
                        />
                        <span>{field?.value?.length}</span>
                      </Box>
                    )}
                  </Box>

                  <Typography
                    fontSize={11}
                    sx={{ mt: 0.5, color: "text.secondary" }}
                  >
                    You can upload a maximum of {MAX_FILES} files,{" "}
                    {MAX_FILE_SIZE_MB}MB each
                  </Typography>

                  <AttachmentsPopover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={closePopover}
                    files={field.value}
                    onRemove={(index) => {
                      const updated = [...field.value];
                      updated.splice(index, 1);
                      field.onChange(updated);
                    }}
                  />
                </>
              )}
            />
            <Box mt={2}>
              <Box display="flex" flexDirection="column">
                <Box sx={{ pt: 1, px: 1 }}>
                  <Controller
                    name="thankYouNoteSent"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={field.value}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              field.onChange(checked);

                              if (checked) {
                                setValue("thankYouContacts", [userMailId]);
                              } else {
                                setValue("thankYouContacts", []);
                              }
                            }}
                            sx={{ p: 0 }}
                          />
                        }
                        label='Send a "Thank you" note for this payment'
                      />
                    )}
                  />
                </Box>

                {thankYouNoteSent && (
                  <Box sx={{ pt: 1, px: 3 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={thankYouContacts.includes(userMailId)}
                          onChange={(e) => {
                            const checked = e.target.checked;

                            if (checked) {
                              setValue("thankYouContacts", [userMailId]);
                            } else {
                              setValue("thankYouContacts", []);
                            }
                          }}
                          sx={{ p: 0 }}
                        />
                      }
                      label={userMail}
                    />
                  </Box>
                )}
              </Box>

              {isSendToUser && (
                <Controller
                  name="sharePaymentWith"
                  control={control}
                  render={({ field }) => (
                    <CommonMultiSelect
                      value={field.value}
                      options={[].map((user) => ({
                        value: user.id,
                        label: user.label,
                      }))}
                      onChange={(e) =>
                        field.onChange(
                          Array.isArray(e.target.value) ? e.target.value : [],
                        )
                      }
                    />
                  )}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "#f7f7f7",
          borderTop: "1px solid #e0e0e0",
          px: 3,
          py: 1.5,
          display: "flex",
          gap: 2,
        }}
      >
        <CommonButton
          type="submit"
          variant="contained"
          disabled={!isDirty || isPending}
          label="Save as Draft"
          startIcon
          sx={{ bgcolor: 'grey.3' }}
        />

        <CommonButton
          type="submit"
          variant="contained"
          disabled={!isDirty || isPending}
          label="Save as Paid"
          startIcon
        />
        <CommonButton
          variant="outlined"
          onClick={() => navigate(-1)}
          label="Cancel"
          startIcon
        />
      </Box>
      <CustomerDetailsDrawer
        open={openDetails}
        onClose={handleCloseDetails}
        customerId={customerId}
      />
      <ConfigurePaymentDialog
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        nextNumber={PaymentNo}
        prefix={prefixString}
        uniqueId={uniqueId}
        invoiceId={invoiceId}
        onUpdate={handlePaymentNumberUpdate}
      />
    </Box>
  );
}
