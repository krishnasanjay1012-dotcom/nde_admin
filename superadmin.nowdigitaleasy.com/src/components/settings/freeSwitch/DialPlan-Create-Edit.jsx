import React, { useEffect } from "react";
import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";
import { CommonTextField, CommonSelect, CommonDescriptionField } from "../../common/fields";
import CommonDrawer from "../../common/NDE-Drawer";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import WorkSpaceDropdownList from "../../common/NDE-WorkspaceList";
import { useGateways } from "../../../hooks/freeSwitch/gateway-hooks";
import { useGetCallGroup, useGetDomainUsers, useGetWorkspaceUsersDomain } from "../../../hooks/freeSwitch/groups-hooks";
import CommonToggleSwitch from "../../common/NDE-CommonToggleSwitch";

const typeOptions = [
  { label: "Inbound", value: "inbound" },
  { label: "Outbound", value: "outbound" },
];

const ringbackOptions = [
  { label: "Default", value: "default" },
  { label: "Music", value: "music" },
];

const orderOptions = [
  { label: "100", value: 100 },
  { label: "200", value: 200 },
];

// const gatewayOptions = [
//   { label: "Select Gateway", value: "" },
// ];

const holdMusicOptions = [
  { label: "Select MOH Category", value: "" },
];

const conditionFieldOptions = [
  { label: "Select Field", value: "" },
];


const schema = yup.object().shape({
  workspace_id: yup.string().required("Workspace ID is required"),
  type: yup.string().required("Type is required"),
  country_code: yup.string(),
  destination: yup.string().required("Destination is required"),
  caller_id_name: yup.string(),
  caller_id_number: yup.string(),
  caller_id_name_prefix: yup.string(),
  context: yup.string(),
  enabled: yup.boolean(),
  conditionField: yup.string(),
  conditionExpression: yup.string(),
  conditionAction: yup.string(),
  action: yup.string(),
  user_id: yup.string(),
  callgroup_id: yup.string(),
  gateway_id: yup.string(),
  record: yup.boolean(),
  hold_music: yup.string(),
  distinctive_ring: yup.string(),
  ringback: yup.string(),
  account_code: yup.string(),
  usage_voice: yup.boolean(),
  usage_fax: yup.boolean(),
  usage_text: yup.boolean(),
  usage_emergency: yup.boolean(),
  domain: yup.string(),
  order: yup.number(),
  description: yup.string(),
});

const defaultValues = {
  type: "inbound",
  country_code: "",
  destination: "",
  caller_id_name: "",
  caller_id_number: "",
  caller_id_name_prefix: "",
  context: "public",
  enabled: true,
  conditionField: "",
  conditionExpression: "",
  conditionAction: "",
  action: "",
  user_id: "",
  callgroup_id: "",
  gateway_id: "",
  record: false,
  hold_music: "",
  distinctive_ring: "",
  ringback: "default",
  account_code: "",
  usage_voice: true,
  usage_fax: false,
  usage_text: false,
  usage_emergency: false,
  domain: "",
  order: 100,
  description: "",
};

const DialPlanDetails = ({ open, setOpen, initialData = null, onSubmitAction }) => {
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

  const selectedType = watch("type");
  const selectedWorkspace = watch("workspace_id");
  const selectedDomain = watch("domain");
  const { data: workspaceData, isLoading: isWorkspaceLoading } = useGetWorkspaceUsersDomain(selectedWorkspace);
  const { data: domainData, isLoading: isDomainLoading } = useGetDomainUsers(selectedWorkspace, selectedDomain);
  const { data: callGroupData, isLoading: isCallGroupLoading } = useGetCallGroup();
  const { data: gatewayData, isLoading: isGatewayLoading } = useGateways();

  const gatewayOptions = React.useMemo(() => {
    return gatewayData?.data?.map((gateway) => ({
      label: gateway.name || gateway._id,
      value: gateway._id,
    })) || [];
  }, [gatewayData]);

  const dynamicDomainOptions = React.useMemo(() => {
    return workspaceData?.data?.domains?.map((domain) => ({
      label: domain.domain || domain.name || domain._id,
      value: domain._id,
    })) || [];
  }, [workspaceData]);

  const dynamicActionOptions = React.useMemo(() => {

    return domainData?.data?.users?.map((user) => ({
      label: `${user.extension_number || "No Ext"} - ${user.first_name || ""} ${user.last_name || ""}`.trim(),
      value: user._id,
    })) || [];
  }, [domainData]);

  const dynamicGroupOptions = React.useMemo(() => {

    const workspaceGroups = workspaceData?.data?.groups?.map((group) => ({
      label: group.group_name,
      value: group._id,
    })) || [];

    const callGroups = callGroupData?.data?.map((group) => ({
      label: group.group_name || group.name || group._id,
      value: group._id,
    })) || [];

    return [...workspaceGroups, ...callGroups];
  }, [workspaceData, callGroupData]);

  useEffect(() => {
    if (selectedWorkspace) {
    }
  }, [selectedWorkspace]);

  useEffect(() => {
    if (initialData) {
      const mappedData = {
        ...defaultValues,
        ...initialData,
        user_id: initialData.user_id?._id || initialData.user_id || "",
        callgroup_id: initialData.callgroup_id?._id || initialData.callgroup_id || "",
        gateway_id: initialData.gateway_id?._id || initialData.gateway_id || "",
        conditionField: initialData.conditions?.[0]?.field || "",
        conditionExpression: initialData.conditions?.[0]?.expression || "",
        conditionAction: initialData.conditions?.[0]?.action || "",
        action: initialData.actions?.[0]?.application || "",
        domain: initialData.domain_id || "",
      };
      reset(mappedData);
    } else {
      reset(defaultValues);
    }
  }, [initialData, open, reset]);

  const handleClose = () => {
    reset(defaultValues);
    setOpen(false);
  };

  const onSubmit = (data) => {
    const selectedAction = dynamicActionOptions.find((o) => o.value === data.action);
    const selectedConditionAction = dynamicActionOptions.find((o) => o.value === data.conditionAction);

    const payload = {
      ...data,
      _id: data._id,
      workspace_id: data.workspace_id || "683ee6815e5806b8356034a3",
      domain_id: data.domain,
      order: Number(data.order),
      conditions: [
        {
          field: data.conditionField,
          expression: data.conditionExpression,
          action: selectedConditionAction?.label.split(" - ")[0] || data.conditionAction,
          action_id: selectedConditionAction?.value,
        },
      ],
      actions: [
        {
          application: selectedAction?.label.split(" - ")[0] || data.action,
          action_id: selectedAction?.value,
          data: "",
        },
      ],
      action_id: selectedAction?.value,
    };

    delete payload.conditionField;
    delete payload.conditionExpression;
    delete payload.conditionAction;
    delete payload.action;

    onSubmitAction(payload);
  };

  const inboundFieldDefinitions = [
    { label: "Domain", name: "domain", type: "select", options: dynamicDomainOptions, helperText: "Select the Domain", loading: isWorkspaceLoading },
    { label: "Country Code", name: "country_code" },
    { label: "Destination", name: "destination" },
    { label: "Caller ID Name", name: "caller_id_name" },
    { label: "Caller ID Number", name: "caller_id_number" },
    { label: "Context", name: "context" },
    { label: "Enabled", name: "enabled", type: "toggle", helperText: "Set the current status of this destination." },
    { label: "Conditions", name: "conditions", type: "conditions", fullWidth: true },
    { label: "Actions", name: "actions", type: "actions", fullWidth: true },
    { label: "User", name: "user_id", type: "select", options: dynamicActionOptions, helperText: "Assign this destination to a user." },
    { label: "Group", name: "callgroup_id", type: "select", options: dynamicGroupOptions, helperText: "Assign the destination to a group.", loading: isWorkspaceLoading || isCallGroupLoading },
    { label: "Caller ID Name Prefix", name: "caller_id_name_prefix", helperText: "Set a prefix on the caller ID name." },
    { label: "Record", name: "record", type: "toggle", helperText: "Save the recording." },
    { label: "Hold Music", name: "hold_music", type: "select", options: holdMusicOptions, helperText: "Select the MOH Category here." },
    { label: "Distinctive Ring", name: "distinctive_ring", helperText: "Select a sound for a distinctive ring." },
    { label: "Ringback", name: "ringback", type: "select", options: ringbackOptions, helperText: "Defines what the caller will hear while the destination is being called." },
    { label: "Account Code", name: "account_code", helperText: "Enter account code." },
    { label: "Order", name: "order", type: "select", options: orderOptions, helperText: "Select the order." },
    { label: "Usage", name: "usage", type: "usage", fullWidth: true },
    { label: "Description", name: "description", type: "description", fullWidth: true },
  ];

  const outboundFieldDefinitions = [
    { label: "Workspace ID", name: "workspace_id", helperText: "Enter the workspace ID." },
    { label: "Domain", name: "domain", type: "select", options: dynamicDomainOptions, helperText: "Select the Domain", loading: isWorkspaceLoading },
    { label: "Country Code", name: "country_code" },
    { label: "Destination", name: "destination" },
    { label: "Context", name: "context" },
    { label: "Gateway", name: "gateway_id", type: "select", options: gatewayOptions, helperText: "Assign this destination to a gateway." },
    { label: "Ringback", name: "ringback", type: "select", options: ringbackOptions, helperText: "Defines what the caller will hear while the destination is being called." },
    { label: "Usage", name: "usage", type: "usage", fullWidth: true },
    { label: "Order", name: "order", type: "select", options: orderOptions, helperText: "Select the order." },
    { label: "Enabled", name: "enabled", type: "toggle", helperText: "Set the current status of this destination." },
    { label: "Description", name: "description", type: "description", fullWidth: true },
  ];

  const groupFieldsIntoRows = (definitions) => {
    const rows = [];
    let currentRow = [];

    definitions.forEach((field) => {
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
      if (currentRow.length === 1) {
        rows.push([...currentRow]);
      } else {
        rows.push([...currentRow]);
      }
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
            if (field.type === "conditions") {
              return (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1 }}>
                    {field.label}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                    <Controller
                      name="conditionField"
                      control={control}
                      render={({ field: fieldProp }) => (
                        <Box sx={{ flex: 1, minWidth: "120px" }}>
                          <CommonSelect {...fieldProp} options={conditionFieldOptions} />
                        </Box>
                      )}
                    />
                    <Controller
                      name="conditionExpression"
                      control={control}
                      render={({ field: fieldProp }) => (
                        <Box sx={{ flex: 1, minWidth: "120px" }}>
                          <CommonTextField {...fieldProp} />
                        </Box>
                      )}
                    />
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Controller
                      name="conditionAction"
                      control={control}
                      render={({ field: fieldProp }) => (
                        <Box sx={{ flex: 1 }}>
                          <CommonSelect {...fieldProp} options={dynamicActionOptions} loading={isDomainLoading} />
                        </Box>
                      )}
                    />
                    <Box
                      sx={{
                        width: 30,
                        height: 40,
                        bgcolor: "primary.main",
                        borderRadius: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        color: "white",
                        mt: 1,
                      }}
                    >
                      <Box sx={{ width: 0, height: 0, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderRight: "10px solid white" }} />
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ color: "text.disabled", display: "block", mt: 0.5 }}>
                    If the condition matches perform the action.
                  </Typography>
                </Box>
              );
            }

            if (field.type === "actions") {
              return (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1 }}>
                    {field.label}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Controller
                      name="action"
                      control={control}
                      render={({ field: fieldProp }) => (
                        <Box sx={{ flex: 1 }}>
                          <CommonSelect {...fieldProp} options={dynamicActionOptions} loading={isDomainLoading} />
                        </Box>
                      )}
                    />
                    <Box
                      sx={{
                        width: 30,
                        height: 40,
                        bgcolor: "primary.main",
                        borderRadius: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        color: "white",
                        mt: 1,
                      }}
                    >
                      <Box sx={{ width: 0, height: 0, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderRight: "10px solid white" }} />
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ color: "text.disabled", display: "block", mt: 0.5 }}>
                    Add additional actions.
                  </Typography>
                </Box>
              );
            }

            if (field.type === "usage") {
              return (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1 }}>
                    {field.label}
                  </Typography>
                  <FormGroup sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                    {[
                      { key: "usage_voice", label: "Voice" },
                      { key: "usage_fax", label: "Fax" },
                      { key: "usage_text", label: "Text" },
                      { key: "usage_emergency", label: "Emergency" },
                    ].map((usage) => (
                      <Controller
                        key={usage.key}
                        name={usage.key}
                        control={control}
                        render={({ field: usageField }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!usageField.value}
                                onChange={(e) => usageField.onChange(e.target.checked)}
                              />
                            }
                            label={<Typography variant="body2">{usage.label}</Typography>}
                          />
                        )}
                      />
                    ))}
                  </FormGroup>
                  <Typography variant="caption" sx={{ color: "text.disabled" }}>
                    Set how the Destination will be used.
                  </Typography>
                </Box>
              );
            }

            if (field.type === "toggle") {
              return (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 2 }}>
                    {field.label}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", px: 4, height: "25px" }}>
                    <CommonToggleSwitch
                      checked={!!controllerField.value}
                      onChange={(e) => controllerField.onChange(e.target.checked)}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: "text.disabled", display: "block" }}>
                    {field.helperText}
                  </Typography>
                </Box>
              );
            }

            if (field.type === "select") {
              return (
                <CommonSelect
                  {...controllerField}
                  label={field.label}
                  options={field.options}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message || field.helperText}
                  loading={field.loading}
                />
              );
            }

            if (field.type === "description") {
              return (
                <CommonDescriptionField
                  {...controllerField}
                  label={field.label}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message || "Enter a description for this destination (optional)."}
                  rows={3}
                />
              );
            }

            return (
              <CommonTextField
                {...controllerField}
                label={field.label}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message || field.helperText}
              />
            );
          }}
        />
      </Box>
    );
  };

  const renderRow = (rowFields) => {
    const isSingleField = rowFields.length === 1 && !rowFields[0].fullWidth;
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
        {isSingleField && <Box sx={{ flex: 1, minWidth: 0, visibility: "hidden" }} />}
      </Box>
    );
  };

  return (
    <CommonDrawer
      open={open}
      onClose={handleClose}
      title={initialData ? "Edit Dial Plan" : "Add Dial Plan"}
      width={580}
      actions={[
        { label: "Cancel", onClick: handleClose, variant: "outlined" },
        { label: "Save", onClick: handleSubmit(onSubmit), variant: "contained" },
      ]}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <WorkSpaceDropdownList
          control={control}
          errors={errors}
          name="workspace_id"
          setValue={setValue}
          workspace_id={selectedWorkspace} 
        />

        <Box>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <CommonSelect
                {...field}
                label="Type"
                options={typeOptions}
                error={!!errors.type}
                helperText={errors.type?.message || "Select the type."}
              />
            )}
          />
        </Box>

        {selectedType === "inbound" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {groupFieldsIntoRows(inboundFieldDefinitions).map(renderRow)}
          </Box>
        )}

        {selectedType === "outbound" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {groupFieldsIntoRows(outboundFieldDefinitions).map(renderRow)}
          </Box>
        )}
      </Box>
    </CommonDrawer>
  );
};

export default DialPlanDetails;
