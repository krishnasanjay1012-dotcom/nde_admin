import { Box, Button, Divider, Typography } from "@mui/material";
import { useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { CommonMailMultiSelect, CommonTextField } from "./fields";



const FormRow = ({ label, children }) => (
  <Box display="flex" alignItems="center" py={1} px={2}>
    <Box width="15%">
      <Typography>{label}</Typography>
    </Box>
    <Box width="85%">{children}</Box>
  </Box>
);

const CommonSendEmail = ({
  schema,
  defaultValues,
  userList = [],
  onSubmitAPI,
  EmailEditor,
  AdditionalAttachments,
  disabledFrom = false,
}) => {
  const [showCc, setShowCc] = useState(true);
  const [showBcc, setShowBcc] = useState(true);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { control, handleSubmit, reset } = methods;

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
            formData.append(formKey, item);
          } else if (typeof item === "object") {
            formData.append(formKey, JSON.stringify(item));
          } else {
            formData.append(formKey, item);
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

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        emailMeta: {
          ...data.emailMeta,
          from: data.emailMeta.from?.[0]?.email,
          to: data.emailMeta.to?.map((u) => u.email) ?? [],
          cc: data.emailMeta.cc?.map((u) => u.email) ?? [],
          bcc: data.emailMeta.bcc?.map((u) => u.email) ?? [],
        },
      };

      const formData = objectToFormData(payload);

      await onSubmitAPI(formData);
      toast.success("Email sent successfully");
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send email");
    }
  };

  return (
    <FormProvider {...methods}>
      <Box display="flex" flexDirection="column" height="100%">
        <Box flex={1} overflow="auto">
          <Box mx={2} mt={2} border="1px solid #dddfe9" borderRadius={1}>
            
            {/* FROM */}
            <Controller
              name="emailMeta.from"
              control={control}
              render={({ field }) => (
                <FormRow label="From">
                  <CommonMailMultiSelect
                    {...field}
                    multiple={false}
                    disabled={disabledFrom}
                    options={field.value}
                  />
                </FormRow>
              )}
            />
            <Divider />

            {/* TO */}
            <Controller
              name="emailMeta.to"
              control={control}
              render={({ field }) => (
                <FormRow label="To">
                  <CommonMailMultiSelect
                    {...field}
                    multiple
                    options={userList}
                  />
                </FormRow>
              )}
            />
            <Divider />

            {/* SUBJECT */}
            <Controller
              name="emailMeta.subject"
              control={control}
              render={({ field }) => (
                <FormRow label="Subject">
                  <CommonTextField {...field} fullWidth noLabel />
                </FormRow>
              )}
            />

            {/* EMAIL BODY */}
            <Box borderTop="1px solid #dddfe9">
              <Controller
                name="emailMeta.html"
                control={control}
                render={({ field }) =>
                  EmailEditor ? (
                    <EmailEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  ) : null
                }
              />
            </Box>
          </Box>

          {/* Custom Attachments Section */}
          {AdditionalAttachments && (
            <Box p={2}>
              <AdditionalAttachments control={control} />
            </Box>
          )}
        </Box>

        <Divider />
        <Box px={2} height={50} display="flex" alignItems="center">
          <Button
            size="small"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
          >
            Send
          </Button>

          <Button size="small" onClick={() => reset()}>
            Cancel
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default CommonSendEmail;