import { Box, Button, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomerNameHeader from "../../../components/Sales/Invoices/Components/CustomerNameHeader";
import {
  CommonMailMultiSelect,
  CommonTextField,
} from "../../../components/common/fields";
import ContactPersonModal from "../../../components/common/ContactPerson/ContactPerson";
import AttachmentUploader from "../../../components/Sales/Invoices/Components/AttachmentUploader";
import AttachCustomerStatement from "../../../components/Sales/Invoices/Components/AttachCustomerStatement";
import AttachInvoice from "../../../components/Sales/Invoices/Components/AttachInvoice";
import { toast } from "react-toastify";
import { useInvoiceSendMail } from "../../../hooks/sales/invoice-hooks";
import CommonButton from "../../../components/common/NDE-Button";
import NdeEditor from "../../../components/common/NdeEditor/NdeEditor";
import { useNavigate } from "react-router-dom";

const FormRow = ({ label, children }) => (
  <Box display="flex" alignItems="center" py={1} px={2}>
    <Box width="15%">
      <Typography>{label}</Typography>
    </Box>
    <Box width="85%">{children}</Box>
  </Box>
);

const schema = yup.object({
  emailMeta: yup.object({
    from: yup
      .array()
      .of(
        yup.object({
          name: yup.string(),
          email: yup.string().required("From email is required"),
        }),
      )
      .min(1, "From email is required")
      .max(1, "Only one sender allowed")
      .required(),

    to: yup
      .array()
      .of(
        yup.object({
          name: yup.string(),
          email: yup.string().email().required(),
        }),
      )
      .min(1, "At least one recipient required"),

    cc: yup.array().of(
      yup.object({
        name: yup.string(),
        email: yup.string().email(),
      }),
    ),

    bcc: yup.array().of(
      yup.object({
        name: yup.string(),
        email: yup.string().email(),
      }),
    ),

    subject: yup.string().required("Subject is required"),
  }),

  send_customer_attachment: yup.object({
    send_attachment: yup.boolean(),
    from_date: yup.string().when("send_attachment", {
      is: true,
      then: (s) => s.required("Start date required"),
    }),
    to_date: yup.string().when("send_attachment", {
      is: true,
      then: (s) => s.required("End date required"),
    }),
  }),

  send_invoice_attachment: yup.boolean(),
});

const SendEmail = ({
  invoiceDetails,
  userList,
  workSpaceId,
  invoiceId,
  cancelRoute = "-1",
}) => {
  const [showCc, setShowCc] = useState(true);
  const [showBcc, setShowBcc] = useState(true);
  const [openContact, setOpenContact] = useState(false);
  const [editorHtml, setEditorHtml] = useState("");

  const handleCc = (e) => {
    e.stopPropagation();
    setShowCc(false);
  };
  const handleBcc = (e) => {
    e.stopPropagation();
    setShowBcc(false);
  };

  const handleConactModalOpen = () => setOpenContact(true);
  const handleConactModalClose = () => setOpenContact(false);

  const today = new Date();

  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);

  const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      invoiceId: invoiceId,
      emailMeta: {
        from: [
          {
            name: invoiceDetails?.from_emails?.[0]?.username,
            email: invoiceDetails?.from_emails?.[0]?.hostname,
          },
        ],
        to: [],
        cc: [],
        bcc: [],
        subject: invoiceDetails?.subject ?? "",
        html: invoiceDetails?.body ?? "",
      },
      invoice_name: invoiceDetails?.file_name_without_extension ?? "",
      send_customer_attachment: {
        send_attachment: false,
        from_date: formatDate(startDate),
        to_date: formatDate(today),
        enabled: true,
      },

      send_invoice_attachment: true,
      attachments: [],
      email_config: invoiceDetails?.from_emails?.[0]?._id,
    },
  });

  useEffect(() => {
    if (invoiceDetails?.body) setEditorHtml(invoiceDetails?.body);
  }, [invoiceDetails?.body]);

  const {
    control,
    handleSubmit,

    reset,
  } = methods;

  const objectToFormData = (obj, formData = new FormData(), parentKey = "") => {
    Object.entries(obj).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      const formKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value instanceof File) {
        formData.append(formKey, value);
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item instanceof File) {
            formData.append(`${formKey}`, item);
          } else if (typeof item === "object") {
            formData.append(`${formKey}`, JSON.stringify(item));
          } else {
            formData.append(`${formKey}`, item);
          }
        });
        return;
      }

      if (typeof value === "object") {
        objectToFormData(value, formData, formKey);
        return;
      }

      formData.append(formKey, value);
    });

    return formData;
  };

  const { mutateAsync, isPending } = useInvoiceSendMail();
  const navigate = useNavigate();
  const onSubmit = (data) => {
    const payload = {
      ...data,
      html: editorHtml,
      emailMeta: {
        ...data.emailMeta,
        from: data.emailMeta.from?.[0]?.email,
        to: data.emailMeta.to?.map((u) => u.email) ?? [],
        cc: data.emailMeta.cc?.map((u) => u.email) ?? [],
        bcc: data.emailMeta.bcc?.map((u) => u.email) ?? [],
      },
    };

    delete payload.send_customer_attachment.enabled;

    const formData = objectToFormData(payload);

    mutateAsync(formData, {
      onSuccess: () => {
        reset();
        navigate("/sales/invoices");
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to Sent Email");
      },
    });
  };

  const getFirstError = (errors) => {
    for (const key in errors) {
      const err = errors[key];
      if (err?.message) return err.message;
      if (typeof err === "object") {
        const nested = getFirstError(err);
        if (nested) return nested;
      }
    }
  };

  const onError = (errors) => {
    toast.error(getFirstError(errors) || "Form has errors");
  };

  return (
    <Box height="100%" display={"flex"} flexDirection={"column"}>
      <Box>
        <CustomerNameHeader
          title={"Email To"}
          customer_name={invoiceDetails?.customer_name}
        />
        <Divider sx={{ mt: 1 }} />
      </Box>
      <FormProvider {...methods}>
        <Box
          flex={1}
          overflow={"auto"}
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <Box mx={2} mt={2} border="1px solid #dddfe9" borderRadius={1}>
            <Controller
              name="emailMeta.from"
              control={control}
              render={({ field, fieldState }) => (
                <FormRow label="From">
                  <CommonMailMultiSelect
                    {...field}
                    multiple={false}
                    disabled={true}
                    options={[
                      {
                        name: invoiceDetails?.from_emails?.[0]?.username,
                        email: invoiceDetails?.from_emails?.[0]?.hostname,
                      },
                    ]}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                </FormRow>
              )}
            />
            <Divider />
            <Controller
              name="emailMeta.to"
              control={control}
              render={({ field }) => (
                <FormRow label="To">
                  <CommonMailMultiSelect
                    {...field}
                    multiple
                    options={userList}
                    cc={showCc}
                    bcc={showBcc}
                    handleBcc={handleBcc}
                    handleCc={handleCc}
                    addNewLabel={"Add Contact Person"}
                    onAddNew={handleConactModalOpen}
                  />
                </FormRow>
              )}
            />
            <Divider />
            {!showCc && (
              <>
                <Controller
                  name="emailMeta.cc"
                  control={control}
                  render={({ field }) => (
                    <FormRow label="Cc">
                      <CommonMailMultiSelect
                        {...field}
                        multiple
                        options={userList}
                      />
                    </FormRow>
                  )}
                />
                <Divider />
              </>
            )}
            {!showBcc && (
              <>
                <Controller
                  name="emailMeta.bcc"
                  control={control}
                  render={({ field }) => (
                    <FormRow label="Bcc">
                      <CommonMailMultiSelect
                        {...field}
                        multiple
                        options={userList}
                        addNewLabel={"Add Contact Person"}
                        onAddNew={handleConactModalOpen}
                      />
                    </FormRow>
                  )}
                />{" "}
                <Divider />
              </>
            )}{" "}
            <Controller
              name="emailMeta.subject"
              control={control}
              render={({ field }) => (
                <FormRow label="Subject">
                  <CommonTextField
                    {...field}
                    noLabel={true}
                    fullWidth
                    mt={0}
                    mb={0}
                  />
                </FormRow>
              )}
            />
            <Box borderTop={"1px solid #dddfe9"} borderRadius={1}>
              <NdeEditor
                value={editorHtml}
                onChange={setEditorHtml}
                placeholder="Type your email..."
                minHeight="300px"
                editorTheme={{
                  borderColor: "#E5E7EB",
                  borderRadius: 12,
                  background: "#FFFFFF",

                  mergeTagBg: "#EEF2FF",
                  mergeTagColor: "#4F46E5",
                  mergeTagRadius: 6,
                }}
                toolbar={{
                  type: "full",
                  position: "top",
                  config: {},
                  mergeTags: [],
                  theme: {
                    toolbarBg: "#F9FAFB",
                    toolbarBorderColor: "#E5E7EB",

                    buttonSize: 34,
                    iconSize: 18,
                    buttonRadius: 8,

                    buttonBorderColor: "#E5E7EB",
                    buttonHoverBg: "#F3F4F6",
                    buttonHoverBorderColor: "#D1D5DB",
                  },
                }}
              />
            </Box>
          </Box>
          <Box p={2} display={"flex"} flexDirection={"column"} gap={2}>
            <AttachCustomerStatement
              userId={invoiceDetails?.customer_id}
              workSpaceId={workSpaceId}
              invoiceId={invoiceId}
            />
            <AttachInvoice />
            <Controller
              name="attachments"
              control={methods.control}
              render={({ field }) => (
                <AttachmentUploader
                  files={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </Box>
        </Box>
      </FormProvider>

      <ContactPersonModal
        open={openContact}
        onClose={handleConactModalClose}
        userId={invoiceDetails?.customer_id}
      />
      <Divider />
      <Box px={2} height={50} display={"flex"} alignItems={"center"} gap={1}>
        <CommonButton
          size="small"
          variant="contained"
          onClick={handleSubmit(onSubmit, onError)}
          disabled={isPending}
          startIcon
          label={"Send"}
        />
        <CommonButton
          size="small"
          variant="outlined"
          onClick={() => navigate(cancelRoute)}
          startIcon
          label={"Cancel"}
        />
      </Box>
    </Box>
  );
};

export default SendEmail;
