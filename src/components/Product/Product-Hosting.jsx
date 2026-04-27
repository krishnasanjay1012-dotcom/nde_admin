import React, { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import {
  CommonCheckbox,
  CommonNumberField,
  CommonSelect,
  CommonTextField,
} from "../common/fields";
import { usePlanById, useUpdateHostingConfig } from "../../hooks/products/products-hooks";
import CommonDrawer from "../common/NDE-Drawer";
import ReusableRadioGroup from "../common/fields/NDE-RadioButton";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";


const schema = yup.object().shape({
  module_name: yup
    .string()
    .required("Module Name is required")
    .min(3, "Module Name must be at least 3 characters")
    .max(50, "Module Name cannot exceed 50 characters"),
});

const configOptions = [
  { label: "New Configuration", value: "new" },
  { label: "Use Existing Configuration", value: "existing" },
];

const existingConfigOptions = [
  { label: "Basic Hosting Config", value: "basic" },
  { label: "Pro Hosting Config", value: "pro" },
  { label: "Enterprise Hosting Config", value: "enterprise" },
];

function HostingPlan({ initialData, handleClose, open }) {


  const updateHostingConfig = useUpdateHostingConfig();
  const { data: fetchedPlan, refetch } = usePlanById(initialData?._id, false);
  const [configType, setConfigType] = useState("new");
  const [existingConfig, setExistingConfig] = useState("");


  const [data, setData] = useState(null);
  const [planData, setPlanData] = useState({

    overuse_policy: {
      overuse_not_allowed: false,
      overuse_disk_space: false,
      overuse_disk_space_notify: false,
      overuse_allowed: false,
      overuse_allowed_notify: false
    }
  });

  const { control, handleSubmit, formState: { errors },reset  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { module_name: "" },
  });

  useEffect(() => {
    if (initialData?._id) refetch();
  }, [initialData?._id, refetch]);

  useEffect(() => {
    if (fetchedPlan?.data) setData(fetchedPlan?.data);
  }, [fetchedPlan]);

 useEffect(() => {
  if (data?.hosting_config) {
    const hc = data.hosting_config;

    const normalizeField = (field, defaultType = "", includeType = true, includeUnlimited = true) => ({
      value: hc[field]?.value ?? "",
      ...(includeType && { type: hc[field]?.unit ?? defaultType }),
      ...(includeUnlimited && { unlimited: hc[field]?.unlimited ?? false }),
    });

    const updatedPlanData = {
      module_name: hc.module_name || "plesk",
      description: data.description || "",
      overuse_policy: hc.overuse_policy || {
        overuse_not_allowed: false,
        overuse_disk_space: false,
        overuse_disk_space_notify: false,
        overuse_allowed: false,
        overuse_allowed_notify: false,
      },
      disk_space: normalizeField("disk_space", "GB", true, true),
      disk_space_usage: normalizeField("disk_space_usage", "%", true, false),
      traffic: normalizeField("traffic", "GB", true, true),
      traffic_usage: normalizeField("traffic_usage", "%", true, false),
      domains: normalizeField("domains", "", false, true),
      subdomains: normalizeField("subdomains", "", false, true),
      dom_aliases: normalizeField("dom_aliases", "", false, true),
      mail_boxes: normalizeField("mail_boxes", "", false, true),
      mailbox_sizes: normalizeField("mailbox_sizes", "GB", true, true),
      mail_list: normalizeField("mail_list", "", false, true),
      add_ftp_acc: normalizeField("add_ftp_acc", "", false, true),
      database: normalizeField("database", "", false, true),
      expire_date: normalizeField("expire_date", "days", true, true),
      wordpress_website: normalizeField("wordpress_website", "", false, true),
      wordpress_backup: normalizeField("wordpress_backup", "", false, true),
      wordpress_website_update: normalizeField("wordpress_website_update", "", false, true),
      rank_tracker_crawls: normalizeField("rank_tracker_crawls", "", false, true),
      web_users: normalizeField("web_users", "", false, true),
    };

    setPlanData(updatedPlanData);

    reset({
      module_name: updatedPlanData.module_name,
    });
  }
}, [data, reset]);

  const options = ["MB", "GB", "TB"];
  const optionsPer = ["%", "MB", "GB", "TB"];
  const optionsPerM = ["%", "GB", "MB", "TB"];
  const expiryOption = ["days", "months", "years"];

  const handleChangeOverUse = (field) => {
    setPlanData((prev) => ({
      ...prev,
      overuse_policy: {
        ...prev.overuse_policy,
        overuse_not_allowed: field === "overuse_not_allowed",
        overuse_disk_space: field === "overuse_disk_space",
        overuse_allowed: field === "overuse_allowed",
        overuse_disk_space_notify:
          field === "overuse_not_allowed" || field === "overuse_allowed"
            ? false
            : prev.overuse_policy?.overuse_disk_space_notify || false,
        overuse_allowed_notify:
          field === "overuse_not_allowed" || field === "overuse_disk_space"
            ? false
            : prev.overuse_policy?.overuse_allowed_notify || false,
      },
    }));
  };

  const handleChangeOverNotify = (field) => {
    setPlanData((prev) => ({
      ...prev,
      overuse_policy: {
        ...prev.overuse_policy,
        [field]: !prev.overuse_policy?.[field] || false,
      },
    }));
  };

  const handlePlanData = (section, name, value) => {
    setPlanData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [name]: value },
    }));
  };

  const handlePlanDataBool = (section, name, secondName) => {
    setPlanData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: !prev[section]?.[name] || false,
        [secondName]: !prev[section]?.[name] ? "" : prev[section]?.[secondName] || "",
      },
    }));
  };

  const handleTextField = (name, value) => {
    setPlanData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderResourceInput = (field, label, hasSelect = false, selectOptions = [], showUnlimited = true) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 2.5,
        gap: 2,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          minWidth: "220px",
          fontWeight: 400,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 150,
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, maxWidth: "400px" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
          <CommonNumberField
            value={planData[field]?.value || ""}
            onChange={(e) => handlePlanData(field, "value", e.target.value)}
            disabled={planData[field]?.unlimited}
            height={36}
            mb={0}
            mt={0}
            width={label === "Notify when disk space usage reaches" || label === "Notify when Traffic Limit Reaches" ? 84 : "100%"}

          />
          {hasSelect && (
            <CommonSelect
              value={planData[field]?.type || selectOptions[0]}
              onChange={(e) => handlePlanData(field, "type", e.target.value)}
              options={selectOptions.map((opt) => ({ value: opt, label: opt }))}
              disabled={planData[field]?.unlimited}
              mb={0}
              mt={0}
              height={36}
              width={label === "Notify when disk space usage reaches" || label === "Notify when Traffic Limit Reaches" ? 84 : "100%"}
            />
          )}
        </Box>
        {showUnlimited && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              minWidth: "140px",
              justifyContent: "flex-end",
              gap: 3,
            }}
          >
            <CommonCheckbox
              checked={planData[field]?.unlimited || false}
              onChange={() => handlePlanDataBool(field, "unlimited", "value")}
              size="small"
            />
            <Typography variant="body1" sx={{ fontWeight: 400 }}>
              Unlimited
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  const onSubmit = () => {
    if (!initialData?._id) return;

    if (configType === "existing") {
      updateHostingConfig.mutate(
        {
          planId: initialData._id,
          data: { existing_config_id: existingConfig },
        },
        {
          onSuccess: () => handleClose(),
        }
      );
      return;
    }

    const payload = {
      module_name: planData.module_name,
      overuse_policy: planData.overuse_policy,
    };

    const addIfEntered = (fieldName, includeType = true, includeUnlimited = true) => {
      const field = planData[fieldName];
      if (!field) return;

      if (
        (field.value !== "" && field.value !== undefined && field.value !== null) ||
        (includeUnlimited && field.unlimited)
      ) {
        if (includeType && includeUnlimited) {
          payload[fieldName] = { ...field };
        } else if (includeType && !includeUnlimited) {
          payload[fieldName] = { value: field.value, type: field.type };
        } else if (!includeType && includeUnlimited) {
          payload[fieldName] = { value: field.value, unlimited: field.unlimited };
        } else {
          payload[fieldName] = { value: field.value };
        }
      }
    };

    addIfEntered("disk_space", true, true);
    addIfEntered("traffic", true, true);
    addIfEntered("mailbox_sizes", true, true);
    addIfEntered("expire_date", true, true);

    addIfEntered("disk_space_usage", true, false);
    addIfEntered("traffic_usage", true, false);

    addIfEntered("domains", false, true);
    addIfEntered("subdomains", false, true);
    addIfEntered("dom_aliases", false, true);
    addIfEntered("web_users", false, true);
    addIfEntered("mail_boxes", false, true);
    addIfEntered("mail_list", false, true);
    addIfEntered("add_ftp_acc", false, true);
    addIfEntered("database", false, true);
    addIfEntered("wordpress_website", false, true);
    addIfEntered("wordpress_backup", false, true);
    addIfEntered("wordpress_website_update", false, true);
    addIfEntered("rank_tracker_crawls", false, true);

    updateHostingConfig.mutate(
      {
        planId: initialData._id,
        data: payload,
      },
      {
        onSuccess: () => handleClose(),
      }
    );
  };

  return (
    <CommonDrawer
      open={open}
      anchor="right"
      width={650}
      title={initialData ? "Specification" : "Add Specification"}
      onClose={handleClose}
      actions={[
        { label: "Cancel", variant: "outlined", onClick: handleClose },
        {
          label: initialData ? "Submit" : "Save",
          onClick: handleSubmit(onSubmit),
          disabled: updateHostingConfig?.isPending
        },
      ]}
    >
      <Box sx={{ mb: 1 }}>
        <ReusableRadioGroup
          label="Hosting Configuration"
          name="configType"
          value={configType}
          onChange={(e) => setConfigType(e.target.value)}
          options={configOptions}
        />
        {configType === "existing" && (
          <Box sx={{ mb: 3, maxWidth: 350 }}>
            <CommonSelect
              label="Select Existing Configuration"
              value={existingConfig}
              onChange={(e) => setExistingConfig(e.target.value)}
              options={existingConfigOptions}
            />
          </Box>
        )}
      </Box>
      {configType === "new" && (
        <Box>

          <Box sx={{ mb: 3, mt: -1 }}>
            <Controller
              name="module_name"
              control={control}
              defaultValue={planData.module_name}
              render={({ field }) => (
                <CommonTextField
                  {...field}
                  label="Hosting Plan Name"
                  placeholder="Enter Hosting plan name"
                  error={!!errors.module_name}
                  helperText={errors.module_name?.message}
                  mb={0}
                  width="280px"
                  onChange={(e) => {
                    field.onChange(e);
                    handleTextField("module_name", e.target.value);
                  }}
                />
              )}
            />
          </Box>
          {/* Plan Resources */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: "grey.50", borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
              Plan Resources
            </Typography>
            {renderResourceInput("traffic_usage", "Notify when Traffic Limit Reaches", true, optionsPerM, false)}
            {renderResourceInput("disk_space_usage", "Notify when disk space usage reaches", true, optionsPer, false)}
            {renderResourceInput("disk_space", "Disk Space", true, options)}
            {renderResourceInput("traffic", "Traffic", true, optionsPerM)}
            {renderResourceInput("domains", "Domains")}
            {renderResourceInput("subdomains", "SubDomains")}
            {renderResourceInput("dom_aliases", "Domain Aliases")}
            {renderResourceInput("web_users", "Web Users")}
            {renderResourceInput("mail_boxes", "MailBoxes")}
            {renderResourceInput("mailbox_sizes", "Mail Size", true, options)}
            {renderResourceInput("mail_list", "Mail Lists")}
            {renderResourceInput("add_ftp_acc", "Additional FTP Accounts")}
            {renderResourceInput("database", "Databases")}
            {renderResourceInput("expire_date", "Expiration Date", true, expiryOption)}
            {renderResourceInput("wordpress_website", "WordPress Websites")}
            {renderResourceInput("wordpress_backup", "WordPress Backups", false, [], false)}
            {renderResourceInput("wordpress_website_update", "WordPress websites with smart updates", false, [], false)}
            {renderResourceInput("rank_tracker_crawls", "Rank Tracker crawls")}
          </Paper>
          {/* Overuse Policy */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: "grey.50", borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
              Overuse Policy
            </Typography>
            {[
              {
                field: "overuse_not_allowed",
                title: "OverUse is not allowed",
                description:
                  "Disallow overuse of the resources. A subscription is automatically suspended if the resource usage exceeds the limit value",
                notify: false,
              },
              {
                field: "overuse_disk_space",
                title: "OverUse use of disk space and traffic is disallowed",
                description:
                  "Allow overuse of disk space and traffic. Disallow overuse of other resources",
                notify: "overuse_disk_space_notify",
              },
              {
                field: "overuse_allowed",
                title: "OverUse use is allowed (not recommended)",
                description:
                  "Allow customers to use more resources than initially provided by the plan",
                notify: "overuse_allowed_notify",
              },
            ].map((policy, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "flex-start", gap: 4, mt: 1 }}>
                <CommonCheckbox
                  checked={planData.overuse_policy?.[policy.field] || false}
                  onChange={() => handleChangeOverUse(policy.field)}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 500, fontSize: "0.9375rem", mb: 0.5 }}
                  >
                    {policy.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.8125rem" }}>
                    {policy.description}
                  </Typography>
                  {policy.notify && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 4, mt: 1 }}>
                      <CommonCheckbox
                        checked={planData.overuse_policy?.[policy.notify] || false}
                        onChange={() => handleChangeOverNotify(policy.notify)}
                        disabled={!planData.overuse_policy?.[policy.field]}
                        size="small"
                      />
                      <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
                        Notify me by email in case of overuse
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Paper>
        </Box>
      )}
    </CommonDrawer>
  );
}

export default HostingPlan;