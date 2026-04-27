import React, { useEffect, useMemo, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CommonTextField, CommonSelect, CommonDescriptionField } from "../../common/fields";
import CommonDrawer from "../../common/NDE-Drawer";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCustomerList } from "../../../hooks/Customer/Customer-hooks";
import CommonToggleSwitch from "../../common/NDE-CommonToggleSwitch";
import WorkSpaceDropdownList from "../../common/NDE-WorkspaceList";
import { getWorkspaceDomains } from "../../../services/freeSwitch/extension-service";

const recordOptions = [
  { label: "Disabled", value: "disabled" },
  { label: "All", value: "all" },
  { label: "Local", value: "local" },
  { label: "Inbound", value: "inbound" },
  { label: "Outbound", value: "outbound" },
];

const holdMusicOptions = [
  { label: "Music on Hold", value: "", isGroupHeader: true, disabled: true },
  { label: "Default", value: "default" },
  { label: "Others", value: "", isGroupHeader: true, disabled: true },
  { label: "None", value: "none" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Disabled", value: "disabled" },
];

const languageOptions = [
  { label: "English", value: "en" },
];

const missedCallTypeOptions = [
  { label: "Email", value: "email" },
];

const schema = yup.object().shape({
  workspace_id: yup.string().required("Work Space is required"),
  domain_id: yup.string().required("Domain is required"),
  user_id: yup.string().required("User is required"),
  extensionNumber: yup.string().required("Extension Number is required"),
  voicemailPassword: yup.string(),
  effectiveCallerIdName: yup.string(),
  effectiveCallerIdNumber: yup.string(),
  outboundCallerIdName: yup.string(),
  outboundCallerIdNumber: yup.string(),
  directoryVisible: yup.boolean(),
  maxRegistrations: yup.string(),
  voicemailEnabled: yup.boolean(),
  limit: yup.string(),
  destination: yup.string(),
  missedCallType: yup.string(),
  missedCall: yup.string(),
  tollAllow: yup.string(),
  record: yup.string(),
  holdMusic: yup.string(),
  language: yup.string(),
  status: yup.string(),
  description: yup.string(),
});

const defaultValues = {
  workspace_id: "",
  domain_id: "",
  user_id: "",
  extensionNumber: "",
  voicemailPassword: "",
  effectiveCallerIdName: "",
  effectiveCallerIdNumber: "",
  outboundCallerIdName: "",
  outboundCallerIdNumber: "",
  directoryVisible: true,
  maxRegistrations: "1",
  voicemailEnabled: true,
  limit: "",
  destination: "",
  missedCallType: "email",
  missedCall: "",
  tollAllow: "domestic",
  record: "disabled",
  holdMusic: "default",
  language: "en",
  status: "active",
  description: "",
};

const ExtensionDetails = ({ open, setOpen, initialData = null, onSubmitAction }) => {
  const [domainOptions, setDomainOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [showVoicemailPassword, setShowVoicemailPassword] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const selectedWorkspace = watch("workspace_id");

  useEffect(() => {
    const fetchDomainsAndUsers = async () => {
      if (!selectedWorkspace) {
        setDomainOptions([]);
        setUserOptions([]);
        return;
      }
      try {
        const response = await getWorkspaceDomains(selectedWorkspace);

        const domains = response?.data?.domains || [];
        setDomainOptions(
          domains.map((item) => ({
            label: item.domain || item.name || item._id,
            value: item.domain_id || item._id,
          }))
        );

        const users = response?.data?.users || [];
        setUserOptions(
          users.map((item) => {
            const firstName = item.first_name || item.firstName || "";
            const lastName = item.last_name || item.lastName || "";
            const fullName = `${firstName} ${lastName}`.trim();
            return {
              label: fullName || item.email || "Unnamed User",
              value: item.user_id || item._id,
            };
          })
        );
      } catch (err) {
        console.error("Error fetching workspace domains and users:", err);
      }
    };

    fetchDomainsAndUsers();
  }, [selectedWorkspace]);

  useEffect(() => {
    if (initialData) {
      const mappedData = {
        workspace_id: initialData.workspace_id?.$oid || initialData.workspace_id || "",
        domain_id: initialData.domain_id?.$oid || initialData.domain_id || "",
        user_id: initialData.user_id?.$oid || initialData.user_id || "",
        extensionNumber: initialData.extension_number || "",
        voicemailPassword: initialData.password || "",
        effectiveCallerIdName: initialData.caller_id_name || "",
        effectiveCallerIdNumber: initialData.effective_caller_id_number || "",
        outboundCallerIdName: initialData.outbound_caller_id_name || "",
        outboundCallerIdNumber: initialData.outbound_caller_id_number || "",
        directoryVisible: initialData.directory_visible ?? true,
        maxRegistrations: String(initialData.max_registrations || "1"),
        voicemailEnabled: initialData.voicemail_enabled ?? true,
        limit: initialData.limit || "",
        destination: initialData.limit_destination || "",
        missedCall: initialData.missed_call_email || "",
        tollAllow: initialData.toll_allow || "domestic",
        record: initialData.record || "disabled",
        holdMusic: initialData.hold_music || "default",
        language: initialData.language || "en",
        status: initialData.status || "active",
        description: initialData.description || "",
      };
      reset({ ...defaultValues, ...mappedData });
    } else {
      reset(defaultValues);
    }
  }, [initialData, open, reset]);

  const handleClose = () => {
    reset(defaultValues);
    setOpen(false);
  };

  const onSubmit = (data) => {
    const payload = {
      workspace_id: data.workspace_id,
      domain_id: data.domain_id,
      user_id: data.user_id,
      extension_number: data.extensionNumber,
      password: data.voicemailPassword,
      caller_id_name: data.effectiveCallerIdName,
      effective_caller_id_number: data.effectiveCallerIdNumber,
      outbound_caller_id_name: data.outboundCallerIdName,
      outbound_caller_id_number: data.outboundCallerIdNumber,
      directory_visible: Boolean(data.directoryVisible),
      max_registrations: Number(data.maxRegistrations),
      voicemail_enabled: Boolean(data.voicemailEnabled),
      missed_call_email: data.missedCall,
      limit_destination: data.destination,
      toll_allow: data.tollAllow,
      record: data.record,
      hold_music: data.holdMusic,
      language: data.language,
      status: data.status,
      description: data.description,
    };
    onSubmitAction(payload);
  };

  const fieldDefinitions = [
    { label: "Work Space", name: "workspace_id", type: "workspace" },
    { label: "Domain", name: "domain_id", type: "select", options: domainOptions },
    { label: "User", name: "user_id", type: "select", options: userOptions },
    { label: "Extension Number", name: "extensionNumber" },
    { label: "Voicemail Password", name: "voicemailPassword", type: "password" },
    { label: "Effective Caller ID Name", name: "effectiveCallerIdName" },
    { label: "Effective Caller ID Number", name: "effectiveCallerIdNumber" },
    { label: "Outbound Caller ID Name", name: "outboundCallerIdName" },
    { label: "Outbound Caller ID Number", name: "outboundCallerIdNumber" },
    {
      label: "Directory Visible",
      name: "directoryVisible",
      type: "toggle",
      helperText: "Select whether to hide the name from directory.",
    },
    { label: "Max Registrations", name: "maxRegistrations" },
    {
      label: "Voicemail Enabled",
      name: "voicemailEnabled",
      type: "toggle",
      helperText: "Enable/disable voicemail for this extension.",
    },
    { label: "Limit", name: "limit" },
    { label: "Destination Limit", name: "destination" },
    {
      label: "Missed Call",
      name: "missedCall",
      type: "missedCall",
      fullWidth: false,
    },
    { label: "Toll Allow", name: "tollAllow" },
    { label: "Record", name: "record", type: "select", options: recordOptions },
    { label: "Hold Music", name: "holdMusic", type: "select", options: holdMusicOptions },
    { label: "Language", name: "language", type: "select", options: languageOptions },
    { label: "Status", name: "status", type: "select", options: statusOptions },
    { label: "Description", name: "description", type: "description", fullWidth: true },
  ];

  const groupFieldsIntoRows = () => {
    const rows = [];
    let currentRow = [];

    fieldDefinitions.forEach((field) => {
      if (field.fullWidth) {
        if (currentRow.length > 0) {
          rows.push([...currentRow]);
          currentRow = [];
        }
        rows.push([field]);
      } else {
        currentRow.push(field);
        if (currentRow.length === 2) {
          rows.push([...currentRow]);
          currentRow = [];
        }
      }
    });

    if (currentRow.length > 0) {
      rows.push([...currentRow]);
    }

    return rows;
  };

  const renderField = (field) => {
    return (
      <Box key={field.name} sx={{ flex: 1, minWidth: 0 }}>
        <Controller
          name={field.name}
          control={control}
          render={({ field: controllerField }) => {

            // Toggle
            if (field.type === "toggle") {
              return (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box
                    component="span"
                    sx={{
                      color: "text.secondary",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {field.label}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      px: 4,
                      height: "25px",
                    }}
                  >
                    <CommonToggleSwitch
                      checked={!!controllerField.value}
                      onChange={(e) => controllerField.onChange(e.target.checked)}
                    />
                  </Box>
                  {field.helperText && (
                    <Box
                      component="span"
                      sx={{
                        fontSize: "11px",
                        color: "text.disabled",
                      }}
                    >
                      {field.helperText}
                    </Box>
                  )}
                </Box>
              );
            }

            if (field.type === "missedCall") {
              return (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Box
                    component="span"
                    sx={{ fontSize: "12px", color: "text.secondary" }}
                  >
                    {field.label}
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, }}>
                    <Controller
                      name="missedCallType"
                      control={control}
                      render={({ field: typeField }) => (
                        <CommonSelect
                          {...typeField}
                          options={missedCallTypeOptions}
                          value={typeField.value || "email"}
                          onChange={(e) => {
                            const val =
                              e?.target?.value !== undefined ? e.target.value : e;
                            typeField.onChange(val);
                          }}
                          sx={{ minWidth: 110 }}
                        />
                      )}
                    />
                    <CommonTextField
                      {...controllerField}
                      value={controllerField.value || ""}
                      onChange={(e) => controllerField.onChange(e.target.value)}
                      error={!!errors["missedCall"]}
                      sx={{ flex: 1 }}
                    />
                  </Box>
                  <Box
                    component="span"
                    sx={{ fontSize: "11px", color: "text.disabled" }}
                  >
                    Select the notification type, and enter appropriate destination.
                  </Box>
                </Box>
              );
            }

            if (field.type === "workspace") {
              return (
                <WorkSpaceDropdownList
                  control={control}
                  errors={errors}
                  initialWorkspace={initialData?.workspace_id}
                />
              );
            }

            // Select
            if (field.type === "select") {
              return (
                <CommonSelect
                  {...controllerField}
                  label={field.label}
                  options={field.options}
                  value={controllerField.value || ""}
                  onChange={(e) => {
                    const val =
                      e?.target?.value !== undefined ? e.target.value : e;
                    controllerField.onChange(val);
                    if (field.name === "workspace_id") {
                      setValue("domain_id", "");
                      setValue("user_id", "");
                    }
                  }}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message}
                />
              );
            }

            // Description
            if (field.type === "description") {
              return (
                <CommonDescriptionField
                  {...controllerField}
                  label={field.label}
                  value={controllerField.value || ""}
                  onChange={(e) => controllerField.onChange(e.target.value)}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message}
                  rows={3}
                />
              );
            }
            // Password (Voicemail Password)
            if (field.type === "password") {
              return (
                <CommonTextField
                  {...controllerField}
                  label={field.label}
                  type={showVoicemailPassword ? "text" : "password"}
                  value={controllerField.value || ""}
                  onChange={(e) => controllerField.onChange(e.target.value)}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message}
                  endAdornment={
                    <IconButton
                      onClick={() => setShowVoicemailPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showVoicemailPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  }
                />
              );
            }

            return (
              <CommonTextField
                {...controllerField}
                label={field.label}
                value={controllerField.value || ""}
                onChange={(e) => controllerField.onChange(e.target.value)}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
              />
            );
          }}
        />
      </Box>
    );
  };

  const renderRow = (rowFields) => {
    return (
      <Box
        key={`row-${rowFields[0]?.name}`}
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "flex-start",
        }}
      >
        {rowFields.map(renderField)}
        {rowFields.length === 1 && !rowFields[0].fullWidth && (
          <Box sx={{ flex: 1, minWidth: 0, visibility: "hidden" }} />
        )}
      </Box>
    );
  };

  return (
    <Box>
      <CommonDrawer
        open={open}
        onClose={handleClose}
        title={initialData ? "Edit Extension" : "Add Extension"}
        width={550}
        actions={[
          {
            label: "Cancel",
            onClick: handleClose,
            variant: "outlined",
          },
          {
            label: "Save",
            onClick: handleSubmit(onSubmit),
            variant: "contained",
          },
        ]}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {groupFieldsIntoRows().map(renderRow)}
        </Box>
      </CommonDrawer>
    </Box>
  );
};

export default ExtensionDetails;