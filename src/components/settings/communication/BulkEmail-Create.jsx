import React, { useState } from "react";
import {
  Box,
  Autocomplete,
  TextField,
  Chip,
  FormLabel,
} from "@mui/material";
import CommonTextField from "../../common/fields/NDE-TextField";
import CommonDialog from "../../common/NDE-Dialog";
import CommonAutocomplete from "../../common/fields/NDE-Autocomplete";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useEmailConfig,
  useEmailGroups,
  useSendNewsletter,
} from "../../../hooks/settings/email-hooks";
import { useCustomerList } from "../../../hooks/Customer/Customer-hooks";

// CKEditor imports
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// Validation Schema
const schema = yup.object().shape({
  from: yup.string().required("From is required"),
  to: yup.array().min(1, "At least one recipient is required"),
  subject: yup.string().required("Subject is required"),
  campaignName: yup.string().required("Campaign Name is required"),
});

// Initial Form Values
const initialFormData = {
  from: "",
  to: [],
  subject: "",
  campaignName: "",
};

const BulkEmailDetails = ({ open, setOpen }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialFormData,
  });

  const { mutate: sendNewsletter } = useSendNewsletter();
  const { data: emailConfigs } = useEmailConfig();
  const { data: emailGroups } = useEmailGroups();
  const { data: customerList } = useCustomerList({ page: 1, limit: 100 });

  const [template, setTemplate] = useState("");

  const handleClose = () => {
    reset(initialFormData);
    setTemplate("");
    setOpen(false);
  };

  const onSubmit = (data) => {
    if (!template) {
      alert("Template cannot be empty");
      return;
    }

    const selectedValues = data.to.map((opt) => opt.value);
    const isAllSelected = selectedValues.includes("All");

    const payload = {
      allEnable: isAllSelected,
      EnabledGroup: isAllSelected
        ? []
        : selectedValues.filter((v) =>
          emailGroups?.some((g) => g.groupName === v)
        ),
      userArray: isAllSelected
        ? []
        : selectedValues.filter((v) =>
          customerList?.data?.some((c) => c.email === v)
        ),
      template: template,
      from: data.from,
      campaignName: data.campaignName,
      subject: data.subject,
    };

    sendNewsletter(payload);
    handleClose();
  };

  const fromOptions = emailConfigs?.data?.map(item => ({
    label: item.username,
    value: item.username
  })) || [];

  const groupOptions = Array.isArray(emailGroups?.data)
    ? emailGroups.data.map((item) => ({
      label: item.groupName,
      value: item.groupName,
    }))
    : [];

  console.log(fromOptions, 'fromOptions');


  const customerOptions =
    customerList?.data?.map((item) => ({ label: item.email, value: item.email })) ||
    [];
  const toOptions = [{ label: "All", value: "All" }, ...groupOptions, ...customerOptions];

  const textFields = [
    { name: "subject", label: "Subject" },
    { name: "campaignName", label: "Campaign Name" },
  ];

  const toValue = watch("to") || [];

  const handleToChange = (event, selectedOptions) => {
    const isAllSelected = selectedOptions.some((opt) => opt.value === "All");
    if (isAllSelected) {
      // Select only "All" in the form
      setValue("to", [{ label: "All", value: "All" }]);
    } else {
      setValue("to", selectedOptions);
    }
  };

  return (
    <Box>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title="Mail Template"
        onSubmit={handleSubmit(onSubmit)}
        submitLabel="Send"
        cancelLabel="Cancel"
      >
        {/* From Field */}
        <Controller
          name="from"
          control={control}
          render={({ field }) => (
            <CommonAutocomplete
              label="From"
              value={field.value || ""}
              onChange={field.onChange}
              error={!!errors.from}
              helperText={errors.from?.message}
              options={fromOptions}
              mandatory
              sx={{ mb: 2 }}
            />
          )}
        />

        {/* To Field */}
        <FormLabel>
          To <span style={{ color: "red" }}> *</span>
        </FormLabel>
        <Autocomplete
          multiple
          disableCloseOnSelect
          options={toOptions}
          value={toValue}
          getOptionLabel={(option) => option.label}
          onChange={handleToChange}
          renderTags={(selected, getTagProps) => (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                overflowX: "auto",
                maxWidth: "100%",
                py: 0.5,
                "&::-webkit-scrollbar": { height: "6px" },
                "&::-webkit-scrollbar-thumb": { backgroundColor: "#888", borderRadius: "3px" },
                "&::-webkit-scrollbar-track": { backgroundColor: "#f1f1f1" },
              }}
            >
              {selected.map((opt, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={opt.value}
                  label={opt.label}
                  sx={{ bgcolor: "#1976d2", color: "primary.contrastText", fontWeight: 500, height: 32 }}
                />
              ))}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              error={!!errors.to}
              helperText={errors.to?.message}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": { borderRadius: "10px", "& fieldset": { border: "1px solid #D1D1D1" } },
                "& .MuiAutocomplete-popupIndicator": { color: "#8A8AA3" },
                "& .MuiAutocomplete-clearIndicator": { color: "#8A8AA3" },
              }}
            />
          )}
        />

        {/* Text Fields */}
        {textFields.map(({ name, label }) => (
          <Controller
            key={name}
            name={name}
            control={control}
            render={({ field }) => (
              <CommonTextField
                label={label}
                value={field.value || ""}
                onChange={field.onChange}
                error={!!errors[name]}
                helperText={errors[name]?.message}
                mandatory
                sx={{ mb: 2 }}
              />
            )}
          />
        ))}

        {/* CKEditor */}
        {/* <FormLabel>
          Email Template <span style={{ color: "red" }}> *</span>
        </FormLabel>
        <CKEditor
          editor={ClassicEditor}
          config={{
            toolbar: [
              "heading",
              "bold",
              "italic",
              "bulletedList",
              "numberedList",
              "blockQuote",
              "fontColor",
              "fontBackgroundColor",
              "code",
              "uploadImage",
              "link",
              "sourceEditing",
            ],
            ckfinder: {
              uploadUrl: "https://app.5am5pm.com:3000/super_admin/ckeditoruploads",
            },
          }}
          data={template}
          onChange={(event, editor) => setTemplate(editor.getData())}
        /> */}
      </CommonDialog>
    </Box>
  );
};

export default BulkEmailDetails;
