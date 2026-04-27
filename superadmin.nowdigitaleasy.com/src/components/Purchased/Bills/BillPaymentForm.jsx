import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Typography,
  Divider,
  IconButton,
  Chip,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";

import {
  CommonTextField,
  CommonSelect,
  CommonDescriptionField,
  CommonDatePicker,
  CommonCheckbox,
} from "../../../components/common/fields";
import CommonButton from "../../../components/common/NDE-Button";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import { useAccountTree } from "../../../hooks/account/account-hooks";
import {
  useGetBillsInfo,
  useBillPaymentById,
  useCreateBillPayment,
  useUpdateBillPayment,
} from "../../../hooks/purchased/bills-hooks";
import { usePaymentModes } from "../../../hooks/payment/payment-hooks";
import ConfigurePaymentDialog from "../../Sales/Invoices/Payment/PaymentNumberDialog";
import { useInvoiceNumber } from "../../../hooks/payment-terms/payment-terms-hooks";
import { useGetVendorInfo } from "../../../hooks/Vendor/Vendor-hooks";

const schema = yup.object().shape({
  paymentMode: yup.string().required("Payment mode is required"),
  paymentDate: yup.date().required("Payment date is required"),
  paymentNo: yup.string().required("Payment number is required"),
  paidThrough: yup.string().required("Paid through is required"),
  reference: yup.string(),
  notes: yup.string().max(250, "Notes cannot exceed 250 characters"),
  paymentMade: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .positive("Amount must be greater than zero"),
});

const Field = ({ label, required, subLabel, children }) => (
  <Box display="flex" flexDirection="column" width="100%">
    <Typography
      variant="body1"
      color={required ? "error" : "text.primary"}
    >
      {label}
      {subLabel && (
        <Typography
          component="span"
          variant="body1"
          color="text.secondary"
          sx={{ ml: 0.5 }}
        >
          {subLabel}
        </Typography>
      )}
    </Typography>
    {children}
  </Box>
);

const defaultValues = {
  paymentMade: "",
  paymentMode: "",
  paymentDate: dayjs(),
  paymentNo: "",
  paidThrough: "",
  reference: "",
  notes: "",
  paidAt: "",
  sendEmailNotification: false,
  contact_persons: [],
};

const BillPaymentForm = () => {
  const navigate = useNavigate();
  const { billId, paymentId } = useParams();
  const isEdit = Boolean(paymentId);
  const [openSettings, setOpenSettings] = useState(false);
  const [statusType, setStatusType] = useState("draft");

  const { data: paymentNumber } = useInvoiceNumber("bill_payment");
  const invoiceNumber = paymentNumber?.counters?.[0]?.nextNumber;
  const invoicePrefix = paymentNumber?.counters?.[0]?.prefixString;
  const counterId = paymentNumber?.counters?.[0]?._id;

  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const { data: billData } = useGetBillsInfo(billId);
  const bill = billData?.data;

  const { data: vendorData } = useGetVendorInfo(bill?.vendor?._id, {
    enabled: !!bill?.vendor?._id,
  });
  const vendor = vendorData?.data;

  const { data } = usePaymentModes();
  const paymentModes = data?.data || [];

  const paymentModeOptions = useMemo(
    () =>
      paymentModes.map((m) => ({
        label: m.name,
        value: m._id,
      })),
    [paymentModes]
  );

  const { data: paymentData } = useBillPaymentById(paymentId, {
    enabled: isEdit,
  });
  const payment = paymentData?.data;

  const { data: accountTree = {} } = useAccountTree();


  const flattenAccounts = (accounts, group) => {
    return accounts.flatMap((account) => {
      const current = {
        label: account.accountName,
        value: account._id,
        group,
        parentAccountId: account.parentAccountId,
      };

      if (account.children && account.children.length > 0) {
        return [current, ...flattenAccounts(account.children, group)];
      }
      return [current];
    });
  };

  const parentAccountOptions = useMemo(() => {
    if (!accountTree) return [];
    return Object.entries(accountTree).flatMap(([group, accounts]) =>
      Array.isArray(accounts) ? flattenAccounts(accounts, group) : []
    );
  }, [accountTree]);

  const { mutate: createPayment ,isPending: isCreatingPayment} = useCreateBillPayment();
  const { mutate: updatePayment, isPending: isUpdatingPayment} = useUpdateBillPayment();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (payment && isEdit) {
      setValue("paymentMode", payment.paymentMode || "");
      setValue("paymentDate", dayjs(payment.paymentDate));
      setValue("paymentMade", payment.paymentMade || "");
      setValue("paidAt", dayjs(payment.paidAt));
      setValue("paymentNo", payment.paymentNo || "");
      setValue("paidThrough", payment.paidThrough?._id || "");
      setValue("reference", payment.reference || "");
      setValue("notes", payment.notes || "");
      setAttachments(payment.attachments || []);
      if (payment.contact_persons && payment.contact_persons.length > 0) {
        setValue("contact_persons", payment.contact_persons.map(c => c._id || c));
        setValue("sendEmailNotification", true);
      }
    }
  }, [payment, isEdit, setValue]);

  const handleAttachmentsChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [
      ...prev,
      ...files.map((file) => ({
        file,
        name: file.name,
      })),
    ]);
  };

  const handleRemoveAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };


  useEffect(() => {
    if (bill && !isEdit) {
      setValue("paymentMade", bill.balance || "");
    }
  }, [bill, isEdit]);


  useEffect(() => {
    if (invoicePrefix && invoiceNumber) {
      setValue("paymentNo", `${invoicePrefix}${invoiceNumber}`);
    }
  }, [invoicePrefix, invoiceNumber, setValue]);

  useEffect(() => {
    if (!isEdit && paymentModeOptions.length > 0) {
      setValue("paymentMode", paymentModeOptions[0].value);
    }
  }, [paymentModeOptions, isEdit, setValue]);

  useEffect(() => {
    if (!isEdit && parentAccountOptions.length > 0) {
      const cashAccount = parentAccountOptions.find(
        (acc) => acc.label.toLowerCase() === "cash"
      );
      if (cashAccount) {
        setValue("paidThrough", cashAccount.value);
      }
    }
  }, [parentAccountOptions, isEdit, setValue]);


  const onSubmit = (data) => {
    const formData = new FormData();

    const bills = [
      {
        billId: billId,
        applyDate: dayjs(data.paymentDate).format("YYYY-MM-DD"),
        amountApplied: Number(data.paymentMade)
      }
    ];

    formData.append("bills", JSON.stringify(bills));
    formData.append("vendor", bill?.vendor?._id);

    formData.append("paymentMade", data.paymentMade);
    formData.append("paymentNo", data.paymentNo);
    formData.append("currency", bill?.currency?._id);
    formData.append("status", statusType);
    formData.append("paymentMode", data.paymentMode);
    formData.append("paidThrough", data.paidThrough);
    formData.append("paymentDate", dayjs(data.paymentDate).format("YYYY-MM-DD"));
    if (data.paidAt) {
      formData.append("paidAt", dayjs(data.paidAt).toISOString());
    }
    formData.append("reference", data.reference || "");
    formData.append("notes", data.notes || "");

    if (data.contact_persons && data.contact_persons.length > 0) {
      formData.append("contact_persons", JSON.stringify(data.contact_persons));
    }

    attachments.forEach((att) => {
      if (att.file) formData.append("attachments", att.file);
    });

    if (isEdit) {
      updatePayment(
        { id: paymentId, data: formData,
          onSuccess: () => {
            navigate(-1);
          },
         },
      );
    } else {
      createPayment(formData, {
        onSuccess: () => {
          navigate(-1);
        },
      });
    }
  };


  return (
    <Box display="flex" flexDirection="column" height="100%">
      {/* Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1
        }}
      >
        <Typography variant="h4">
          {isEdit ? "Edit Bill Payment" : `Payment for ${bill?.billNo}`}
        </Typography>
        <IconButton onClick={() => navigate(-1)} color="error">
          <CloseIcon sx={{ color: "error.main" }} />
        </IconButton>
      </Box>
      <Divider />
      {/* Form */}
      <Box maxWidth={900} sx={{ overflow: "auto", mx: 2, mt: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Payment Made */}
          <Box mb={2} width="300px">
            <Field
              label="Payment Made *"
              required
              subLabel={`(${bill?.currency?.code})`}
            >
              <Controller
                name="paymentMade"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.paymentMade}
                    helperText={errors.paymentMade?.message}
                    mb={0}
                  />
                )}
              />
            </Field>
          </Box>

          {/* Payment Mode */}
          <Box mb={2} width="300px">
            <Field label="Payment Mode *" required>
              <Controller
                name="paymentMode"
                control={control}
                render={({ field }) => (
                  <CommonSelect {...field} options={paymentModeOptions} mb={0}
                    error={!!errors.paymentMode}
                    helperText={errors.paymentMode?.message}
                  />
                )}
              />
            </Field>
          </Box>

          {/* Row 1 */}
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={2}>
            <Field label="Payment Date *" required>
              <Controller
                name="paymentDate"
                control={control}
                render={({ field }) => (
                  <CommonDatePicker
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.paymentDate}
                    helperText={errors.paymentDate?.message}
                  />
                )}
              />
            </Field>

            <Field label="Payment # *" required>
              <Controller
                name="paymentNo"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    error={!!errors.paymentNo}
                    helperText={errors.paymentNo?.message}
                    disabled
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setOpenSettings(true)}
                        >
                          <SettingsOutlinedIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
            </Field>
          </Box>

          {/* Row 2 */}
          <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={2} mb={2}>
            <Field label="Payment Made on">

              <Controller
                name="paidAt"
                control={control}
                render={({ field }) => (
                  <CommonDatePicker
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                     minDate={watch("paymentDate")}
                  />
                )}
              />
            </Field>

            <Field label="Paid Through *" required>
              <Controller
                name="paidThrough"
                control={control}
                render={({ field }) => (
                  <CommonSelect
                    {...field}
                    options={parentAccountOptions}
                    searchable
                    error={!!errors.paidThrough}
                    helperText={errors.paidThrough?.message}
                  />
                )}
              />
            </Field>

            <Field label="Reference #">
              <Controller
                name="reference"
                control={control}
                render={({ field }) => (
                  <CommonTextField {...field} />
                )}
              />
            </Field>
          </Box>

          {/* Notes */}
          <Box mb={2}>
            <Field label="Notes">
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <CommonDescriptionField {...field} rows={3} mb={0}
                   error={!!errors.notes}
                   helperText={errors.notes?.message}
                   />
                )}
              />
            </Field>
          </Box>

          {/* Attachments */}
          <Box mb={2}>
            <Field label="Attachments">
              <Box>
                <Box
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    border: "1px dashed #ccc",
                    borderRadius: 1, p: 0.9,
                    display: "flex",
                    alignItems: "center", gap: 1, cursor: "pointer",
                    width: "fit-content",
                    mt: 1, mb: 1
                  }}
                >
                  <AttachFileIcon fontSize="small" />
                  <Typography variant="caption">
                    Upload File
                  </Typography>
                </Box>

                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  multiple
                  onChange={handleAttachmentsChange}
                />
                <Typography variant="caption" color="textSecondary" >
                  You can upload a maximum of 5 files, 10MB each
                </Typography>

                <Box mt={1}>
                  {attachments.map((file, idx) => (
                    <Chip
                      key={idx}
                      label={file.name}
                      onDelete={() => handleRemoveAttachment(idx)}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Box>
            </Field>
          </Box>

          {/* Email Notification & Contact Persons */}
          {vendor?.contact_persons?.length > 0 && (
            <Box sx={{ mt: 2, mb: 2, pt: 2, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
              <Controller
                name="sendEmailNotification"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <CommonCheckbox
                    label="Send a Payment Made email notification."
                    checked={field.value}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      field.onChange(checked);
                      if (checked && vendor?.contact_persons) {
                        const validContacts = vendor.contact_persons
                          .filter(c => c.email || c.name_details?.first_name || c.name_details?.last_name)
                          .map(c => c._id);
                        setValue("contact_persons", validContacts);
                      } else {
                        setValue("contact_persons", []);
                      }
                    }}
                    sx={{ ml: -1 }}
                  />
                )}
              />

              {watch("sendEmailNotification") &&
                vendor?.contact_persons?.some(c => c.email || c.name_details?.first_name || c.name_details?.last_name) && (
                  <Box sx={{ ml: 3, mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {vendor.contact_persons
                      .filter(c => c.email || c.name_details?.first_name || c.name_details?.last_name)
                      .map((contact) => (
                        <Box key={contact._id} sx={{ display: 'flex', alignItems: 'center', p: '1px 8px', border: '1px solid #D0D5DD', borderRadius: 1, height: 32 }}>
                          <Controller
                            name="contact_persons"
                            control={control}
                            defaultValue={[]}
                            render={({ field }) => (
                              <CommonCheckbox
                                label={contact.email || `${contact.name_details?.first_name || ''} ${contact.name_details?.last_name || ''}`.trim()}
                                checked={field.value?.includes(contact._id)}
                                onChange={(e) => {
                                  const current = field.value || [];
                                  const newValue = e.target.checked
                                    ? [...current, contact._id]
                                    : current.filter(id => id !== contact._id);
                                  field.onChange(newValue);
                                }}
                                mr={0}
                                sx={{ ml: -1 }}
                              />
                            )}
                          />
                        </Box>
                      ))}
                  </Box>
                )}
            </Box>
          )}

          {/* Actions */}
          <Box display="flex" gap={2}
            p={1}
            position="sticky"
            bottom={0}
            sx={{ bgcolor: 'background.paper' }}
          >
            <CommonButton
              type="submit"
              variant="contained"
              disabled={!isDirty || isCreatingPayment || isUpdatingPayment}
              label="Save as Draft"
              onClick={() => setStatusType("draft")}
              startIcon
              sx={{ bgcolor: 'grey.3' }}
            />
            <CommonButton
              type="submit"
              variant="contained"
              disabled={!isDirty || isCreatingPayment || isUpdatingPayment}
              label="Save as Paid"
              onClick={() => setStatusType("paid")}
              startIcon
            />
            <CommonButton
              type="button"
              variant="outlined"
              onClick={() => navigate(-1)}
              label="Cancel"
              startIcon
            />
          </Box>
        </form>
      </Box>
      <ConfigurePaymentDialog
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        nextNumber={invoiceNumber}
        prefix={invoicePrefix}
        uniqueId={counterId}
        invoiceId={""}
        module="Payment"
        handleToOpenConfirmation={() => navigate("/settings/configuration/transaction-series")}
      />
    </Box>
  );
};

export default BillPaymentForm;