import React, { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Box, Typography, TextField, Button, Card, CardContent,
  Grid, MenuItem, IconButton, Stack, Paper, Divider,
  Breadcrumbs, Link, Chip, Tooltip,
} from "@mui/material";
import {
  Save as SaveIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  AutoFixHigh as AutoIcon,
} from "@mui/icons-material";
import { useTemplate, useCreateTemplate, useUpdateTemplate } from "../../../hooks/dns/useDnshooks";
import { toast } from "react-toastify";
import CommonBackButton from "../../../components/common/NDE-BackButton";
import CommonButton from "../../../components/common/NDE-Button";
import Delete from "../../../assets/icons/delete.svg";
import { extractVarNames, buildSOAContent } from "../../../utils/TemplateValueSchema";
import { VARIABLE_OPTIONS, VARIABLE_MAP, TYPE_DEFAULTS, DEFAULT_RECORD, CATEGORY_RECORD_TYPES } from "../../../components/common/data/constants-dns";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonSelect from "../../../components/common/fields/NDE-Select";
import CommonDescriptionField from "../../../components/common/fields/NDE-DescriptionField";

// ─── Component ────────────────────────────────────────────────────────────────

export default function TemplateFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: templateData, isLoading: isTemplateLoading } = useTemplate(id);
  const createMutation = useCreateTemplate();
  const updateMutation = useUpdateTemplate();

  const {
    control, handleSubmit, reset, watch, setValue, getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      category: "DEFAULT",
      description: "",
      isActive: true,
      records: [{ ...DEFAULT_RECORD }],
      requiredVariables: [],          // starts empty — auto-populated
    },
  });

  const selectedCategory = watch("category");
  const allowedTypes = CATEGORY_RECORD_TYPES[selectedCategory] || CATEGORY_RECORD_TYPES.CUSTOM;
  const categoryOptions = Object.keys(CATEGORY_RECORD_TYPES);

  const { fields: recordFields, append: appendRecord, remove: removeRecord } =
    useFieldArray({ control, name: "records" });
  const { fields: variableFields, append: appendVariable, remove: removeVariable, replace: replaceVariables } =
    useFieldArray({ control, name: "requiredVariables" });

  // ── Parse loaded template on edit ──────────────────────────────────────────
  useEffect(() => {
    if (isEdit && templateData) {
      const parsedRecords = (templateData.records || []).map((rec) => {
        if (rec.type === "SOA" && rec.content) {
          const p = rec.content.split(" ");
          return { ...rec, soa_mname: p[0] || "ns1.{{NSDOMAIN}}.", soa_rname: p[1] || "admin.{{NSDOMAIN}}.", soa_serial: p[2] || "{{SERIAL}}" };
        }
        if (rec.type === "MX" && rec.content) {
          const p = rec.content.split(" ");
          if (p.length >= 2) return { ...rec, prio: p[0], content: p.slice(1).join(" ") };
        }
        return rec;
      });

      reset({
        ...templateData,
        records: parsedRecords.length > 0 ? parsedRecords : [{ ...DEFAULT_RECORD }],
        requiredVariables: templateData.requiredVariables || [],
      });
    }
  }, [isEdit, templateData, reset]);

  // ── Auto-sync variables from all current records ───────────────────────────
  /**
   * Scans every record's name + content for {{VAR}} tokens.
   * Merges them into requiredVariables, preserving existing entries,
   * and removes any variable no longer used in any record.
   */
  const syncVariables = useCallback(() => {
    const records = getValues("records") || [];
    const existingVars = getValues("requiredVariables") || [];

    // Collect all vars still actually used across all records
    const usedVarNames = new Set();

    records.forEach((rec) => {
      // Build effective name & content strings for this record
      const nameStr = rec.name || "";
      let contentStr = rec.content || "";

      if (rec.type === "SOA") {
        contentStr = buildSOAContent(
          rec.soa_mname || "ns1.{{NSDOMAIN}}.",
          rec.soa_rname || "admin.{{NSDOMAIN}}.",
          rec.soa_serial || "{{SERIAL}}"
        );
      }

      extractVarNames(nameStr).forEach((v) => usedVarNames.add(v));
      extractVarNames(contentStr).forEach((v) => usedVarNames.add(v));
    });

    // Build the new list:
    //   - keep existing entries that are still used (preserve any custom defaultValue)
    //   - add new entries for vars not yet in the list
    //   - drop entries whose var is no longer used in any record
    const existingMap = Object.fromEntries(existingVars.map((v) => [v.name, v]));
    const nextVars = [];

    usedVarNames.forEach((varName) => {
      if (existingMap[varName]) {
        nextVars.push(existingMap[varName]);          // keep existing
      } else {
        const meta = VARIABLE_MAP[varName];
        nextVars.push({
          name: varName,
          description: meta?.description || "",
          required: true,
          defaultValue: null,
        });
      }
    });

    replaceVariables(nextVars);
  }, [getValues, replaceVariables]);

  // ── Type change handler ────────────────────────────────────────────────────
  const handleTypeChange = (index, newType, fieldOnChange) => {
    fieldOnChange(newType);
    const defaults = TYPE_DEFAULTS[newType];
    if (!defaults) return;

    setValue(`records.${index}.name`, defaults.name);

    if (newType === "SOA") {
      const mname = "ns1.{{NSDOMAIN}}.";
      const rname = "admin.{{NSDOMAIN}}.";
      const serial = "{{SERIAL}}";
      setValue(`records.${index}.soa_mname`, mname);
      setValue(`records.${index}.soa_rname`, rname);
      setValue(`records.${index}.soa_serial`, serial);
      setValue(`records.${index}.content`, buildSOAContent(mname, rname, serial));
    } else if (newType === "MX") {
      setValue(`records.${index}.prio`, defaults.prio ?? "10");
      setValue(`records.${index}.content`, defaults.content);
    } else {
      setValue(`records.${index}.prio`, null);
      setValue(`records.${index}.content`, defaults.content);
    }

    // Sync variables after state updates settle
    setTimeout(syncVariables, 50);
  };

  // ── Build submit payload ───────────────────────────────────────────────────
  const buildPayload = (data) => {
    const formattedRecords = data.records.map((rec) => {
      const { soa_mname, soa_rname, soa_serial, prio, ...cleanRec } = rec;

      let finalContent = cleanRec.content || "";
      let finalPrio = null;

      if (rec.type === "MX") {
        finalPrio = Number(prio) || 10;
        finalContent = cleanRec.content;
      }
      if (rec.type === "SOA") {
        finalContent = buildSOAContent(
          soa_mname || "ns1.{{NSDOMAIN}}.",
          soa_rname || "admin.{{NSDOMAIN}}.",
          soa_serial || "{{SERIAL}}"
        );
      }

      const variablesUsed = new Set();
      extractVarNames(cleanRec.name).forEach((v) => variablesUsed.add(v));
      extractVarNames(finalContent).forEach((v) => variablesUsed.add(v));

      return {
        ...cleanRec,
        content: finalContent,
        ttl: Number(cleanRec.ttl) || 3600,
        prio: finalPrio,
        variablesUsed: Array.from(variablesUsed),
      };
    });

    return {
      name: data.name,
      category: data.category,
      description: data.description || "",
      isActive: data.isActive ?? true,
      requiredVariables: (data.requiredVariables || []).map((v) => ({
        name: (v.name || "").toUpperCase().trim(),
        description: v.description || "",
        required: v.required ?? true,
        defaultValue: v.defaultValue || null,
      })),
      records: formattedRecords,
    };
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    try {
      const payload = buildPayload(data);

      // Validate: every variable used in records must be in requiredVariables
      const declaredVars = new Set(payload.requiredVariables.map((v) => v.name));
      const allUsed = new Set(payload.records.flatMap((r) => r.variablesUsed));
      const missing = [...allUsed].filter((v) => !declaredVars.has(v));
      if (missing.length > 0) {
        toast.error(`Missing variables in Required Variables: ${missing.join(", ")}`);
        return;
      }

      console.log("payload", JSON.stringify(payload, null, 2));

      if (isEdit) {
        await updateMutation.mutateAsync({ id, payload });
        toast.success("Template updated successfully");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Template created successfully");
      }
      navigate("/settings/dns");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (isEdit && isTemplateLoading) {
    return <Typography sx={{ p: 3 }}>Loading template...</Typography>;
  }

  // ── Content cell renderer ──────────────────────────────────────────────────
  const renderContentCell = (index, currentType) => {
    const contentHint = TYPE_DEFAULTS[currentType]?.hint || "Value";

    if (currentType === "SOA") {
      return (
        <Stack >
          <Controller
            name={`records.${index}.soa_mname`}
            control={control}
            render={({ field: f }) => (
              <CommonTextField
                {...f}
                fullWidth
                mt={0}
                mb={1}
                placeholder="ns1.{{NSDOMAIN}}."
                helperText={
                  <Typography component="span" sx={{ fontSize: 11 }}>
                    <Box component="span" sx={{ fontWeight: 600, fontSize: 13, mr: 1 }}>
                      Primary NS
                    </Box>{" "}
                    e.g. {"{{NSDOMAIN}}"}.
                  </Typography>
                }
                FormHelperTextProps={{ sx: { fontSize: 11 } }}
                onChange={(e) => {
                  f.onChange(e.target.value);
                  const rname = getValues(`records.${index}.soa_rname`) || "admin.{{NSDOMAIN}}.";
                  const serial = getValues(`records.${index}.soa_serial`) || "{{SERIAL}}";
                  setValue(`records.${index}.content`, buildSOAContent(e.target.value, rname, serial));
                  setTimeout(syncVariables, 50);
                }}
              />
            )}
          />
          <Controller
            name={`records.${index}.soa_rname`}
            control={control}
            render={({ field: f }) => (
              <CommonTextField
                {...f}
                fullWidth
                mt={0}
                mb={1}
                placeholder="admin.{{NSDOMAIN}}."
                helperText={
                  <Typography component="span" sx={{ fontSize: 11 }}>
                    <Box component="span" sx={{ fontWeight: 600, fontSize: 13, mr: 1 }}>
                      Admin Email
                    </Box>{" "}
                    e.g. admin.{"{{NSDOMAIN}}"}.
                  </Typography>
                }
                FormHelperTextProps={{ sx: { fontSize: 11 } }}
                onChange={(e) => {
                  f.onChange(e.target.value);
                  const mname = getValues(`records.${index}.soa_mname`) || "ns1.{{NSDOMAIN}}.";
                  const serial = getValues(`records.${index}.soa_serial`) || "{{SERIAL}}";
                  setValue(`records.${index}.content`, buildSOAContent(mname, e.target.value, serial));
                  setTimeout(syncVariables, 50);
                }}
              />
            )}
          />
          <Controller
            name={`records.${index}.soa_serial`}
            control={control}
            render={({ field: f }) => (
              <CommonTextField
                {...f}
                fullWidth
                mt={0}
                mb={0}
                placeholder="{{SERIAL}}"
                helperText={
                  <Typography component="span" sx={{ fontSize: 11 }}>
                    <Box component="span" sx={{ fontWeight: 600, fontSize: 13, mr: 1 }}>
                      Serial
                    </Box>{" "}
                    e.g. {"{{SERIAL}}"}
                  </Typography>
                }
                FormHelperTextProps={{ sx: { fontSize: 11 } }}
                onChange={(e) => {
                  f.onChange(e.target.value);
                  const mname = getValues(`records.${index}.soa_mname`) || "ns1.{{NSDOMAIN}}.";
                  const rname = getValues(`records.${index}.soa_rname`) || "admin.{{NSDOMAIN}}.";
                  setValue(`records.${index}.content`, buildSOAContent(mname, rname, e.target.value));
                  setTimeout(syncVariables, 50);
                }}
              />
            )}
          />
          <Controller
            name={`records.${index}.content`}
            control={control}
            render={({ field: f }) => <input type="hidden" {...f} />}
          />
        </Stack>
      );
    }

    if (currentType === "MX") {
      return (
        <Stack spacing={1}>
          <Controller
            name={`records.${index}.prio`}
            control={control}
            render={({ field: f }) => (
              <CommonTextField
                {...f}
                type="number"
                mt={0}
                mb={0}
                fullWidth
                placeholder="10"
                helperText={
                  <Typography component="span" sx={{ fontSize: 11 }}>
                    <Box component="span" sx={{ fontWeight: 600, fontSize: 13, spacing: 1 }}>
                      Priority
                    </Box>
                  </Typography>
                }
                FormHelperTextProps={{ sx: { fontSize: 11 } }}
                inputProps={{ min: 0 }}
              />
            )}
          />
          <Controller
            name={`records.${index}.content`}
            control={control}
            render={({ field: f }) => (
              <CommonTextField
                {...f}
                fullWidth
                mt={0}
                mb={0}
                placeholder="{{MAIL_SERVER}}."
                helperText={
                  <Typography component="span" sx={{ fontSize: 11 }}>
                    <Box component="span" sx={{ fontWeight: 600, fontSize: 13, mr: 1 }}>
                      Mail Server
                    </Box>{" "}
                    e.g. {"{{MAIL_SERVER}}"}.
                  </Typography>
                }
                FormHelperTextProps={{ sx: { fontSize: 11 } }}
                onChange={(e) => { f.onChange(e.target.value); setTimeout(syncVariables, 50); }}
              />
            )}
          />
        </Stack>
      );
    }

    return (
      <Controller
        name={`records.${index}.content`}
        control={control}
        render={({ field: f }) => (
          <CommonTextField
            {...f}
            fullWidth
            mt={0} mb={0}
            placeholder={contentHint}
            helperText={`e.g. ${contentHint}`}
            FormHelperTextProps={{ sx: { fontSize: 9 } }}
            onChange={(e) => { f.onChange(e.target.value); setTimeout(syncVariables, 50); }}
          />
        )}
      />
    );
  };

  // ─── JSX ──────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: 1, height: "100%", overflow: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs sx={{ mb: 1 }}>
          <Link underline="hover" color="inherit" href="#"
            onClick={(e) => { e.preventDefault(); navigate("/settings/dns"); }}
            sx={{ fontSize: 13 }}>
            Templates
          </Link>
          <Typography color="text.primary" sx={{ fontSize: 13 }}>
            {isEdit ? "Edit Template" : "New Template"}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CommonBackButton size="small" buttonSize={35} to="/settings/dns" />
            <Typography variant="h3" fontWeight="bold">
              {isEdit ? `Edit:  ${templateData?.name} Template` : " Create New Template"}
            </Typography>
          </Box>
          <CommonButton
            label={isEdit ? "Update Template" : "Save Template"}
            variant="contained"
            startIcon={<SaveIcon sx={{ color: "icon.light" }} />}
            size="small"
            disabled={createMutation.isPending || updateMutation.isPending}
            onClick={handleSubmit(onSubmit)}
          />
        </Box>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 1.5 }}>

          {/* ── Left panel ─────────────────────────────────────────────── */}
          <Box sx={{ width: { xs: "100%", md: "25%" }, flexShrink: 0 }}>

            {/* Template Info */}
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold" sx={{ mb: 1.5 }}>
                  Template Information
                </Typography>
                <Stack >
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <CommonTextField
                        {...field}
                        label="Template Name"
                        fullWidth
                        size="small"
                        placeholder="Enter Template Name"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    )}
                  />
                  <Box sx={{ width: "100%" }}>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <CommonSelect
                          {...field}
                          label="Category"
                          width="100%"
                          options={categoryOptions.map((cat) => ({ label: cat, value: cat }))}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ width: "100%" }}>
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <CommonSelect
                          {...field}
                          label="Status"
                          width="100%"
                          onChange={(e) => field.onChange(e.target.value === "true")}
                          value={field.value ? "true" : "false"}
                          options={[
                            { label: "Active", value: "true" },
                            { label: "Inactive", value: "false" },
                          ]}
                        />
                      )}
                    />
                  </Box>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <CommonDescriptionField
                        {...field}
                        label="Description"
                        fullWidth
                        size="small"
                        mb={0}
                        rows={2}
                        placeholder="Optional description..."
                      />
                    )}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Required Variables — auto-managed */}
            <Card sx={{ mt: 1.5 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Required Variables
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Auto-extracted from records
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    {/* Manual sync button */}
                    <CommonButton
                      label={"Sync"}
                      size="small"
                      variant="outlined"
                      startIcon={<AutoIcon sx={{ fontSize: 14, color: "icon.primary" }} />}
                      onClick={syncVariables}
                      title="Re-sync variables from records"
                    />
                    <CommonButton
                      label={"Add"}
                      size="small"
                      startIcon={<AddIcon sx={{ color: "icon.light" }} />}
                      onClick={() => {
                        // Add only vars not already present
                        const existing = getValues("requiredVariables") || [];
                        const existingNames = new Set(existing.map((v) => v.name));
                        const nextAvailable = VARIABLE_OPTIONS.find((o) => !existingNames.has(o.name));
                        if (nextAvailable) {
                          appendVariable({
                            name: nextAvailable.name,
                            description: nextAvailable.description,
                            required: true,
                            defaultValue: null,
                          });
                        } else {
                          toast.info("All predefined variables are already added.");
                        }
                      }}
                    />
                  </Stack>
                </Box>

                {variableFields.length === 0 ? (
                  <Box sx={{
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 1.5,
                    textAlign: "center",
                  }}>
                    <Typography variant="caption" color="text.secondary">
                      Variables are auto-detected when you add DNS records.
                    </Typography>
                  </Box>
                ) : (
                  <Box >
                    <Stack spacing={1}>
                      {variableFields.map((field, index) => {
                        // Which names are already taken by OTHER rows
                        const takenNames = new Set(
                          (getValues("requiredVariables") || [])
                            .filter((_, i) => i !== index)
                            .map((v) => v.name)
                        );

                        return (
                          <Paper
                            key={field.id}
                            variant="outlined"
                            sx={{ p: 1.5, pr: 4.5, position: "relative", borderRadius: 1.5 }}
                          >
                            {/* Delete variable */}
                            <IconButton
                              size="small"
                              color="error"
                              sx={{ position: "absolute", top: 6, right: 6 }}
                              onClick={() => removeVariable(index)}
                            >
                              <img src={Delete} style={{ height: 20 }} />
                            </IconButton>

                            <Stack spacing={1}>
                              {/* Variable name dropdown */}
                              <Controller
                                name={`requiredVariables.${index}.name`}
                                control={control}
                                render={({ field: f }) => (
                                  <CommonTextField
                                    {...f}
                                    select
                                    label="Variable"
                                    fullWidth
                                    mt={0} mb={0}
                                    onChange={(e) => {
                                      f.onChange(e.target.value);
                                      // Auto-fill description when variable is picked
                                      const meta = VARIABLE_MAP[e.target.value];
                                      if (meta) {
                                        setValue(`requiredVariables.${index}.description`, meta.description);
                                      }
                                    }}
                                  >
                                    {VARIABLE_OPTIONS.map((opt) => (
                                      <MenuItem
                                        key={opt.name}
                                        value={opt.name}
                                        disabled={takenNames.has(opt.name)}
                                      >
                                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", gap: 2 }}>
                                          <Typography variant="body2" fontFamily="monospace">
                                            {`{{${opt.name}}}`}
                                          </Typography>
                                          <Tooltip title={opt.description} placement="right" arrow>
                                            <Typography
                                              variant="caption"
                                              color="text.secondary"
                                              sx={{
                                                maxWidth: 90,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                display: "inline-block",
                                                cursor: "default",
                                              }}
                                            >
                                              {opt.description}
                                            </Typography>
                                          </Tooltip>
                                        </Box>
                                      </MenuItem>
                                    ))}
                                  </CommonTextField>
                                )}
                              />

                              {/* Auto-filled description (editable) */}
                              <Controller
                                name={`requiredVariables.${index}.description`}
                                control={control}
                                render={({ field: f }) => (
                                  <CommonTextField
                                    {...f}
                                    label="Description"
                                    fullWidth
                                    size="small"
                                    sx={{ m: 0 }}
                                    placeholder="e.g. Server IP address"
                                  />
                                )}
                              />

                              {/* Usage chip — shows which record types use this var */}
                              <Box>
                                {(() => {
                                  const varName = getValues(`requiredVariables.${index}.name`);
                                  const records = getValues("records") || [];
                                  const usedIn = records
                                    .filter((rec) => {
                                      const content = rec.type === "SOA"
                                        ? buildSOAContent(rec.soa_mname || "", rec.soa_rname || "", rec.soa_serial || "")
                                        : rec.content || "";
                                      return (
                                        extractVarNames(rec.name).has(varName) ||
                                        extractVarNames(content).has(varName)
                                      );
                                    })
                                    .map((r) => r.type);

                                  return usedIn.length > 0 ? (
                                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                      <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                                        Used in:
                                      </Typography>
                                      {[...new Set(usedIn)].map((t) => (
                                        <Chip key={t} label={t} size="small" variant="outlined" sx={{ height: 18, fontSize: 10 }} />
                                      ))}
                                    </Stack>
                                  ) : (
                                    <Typography variant="caption" color="warning.main">
                                      ⚠ Not used in any record
                                    </Typography>
                                  );
                                })()}
                              </Box>
                            </Stack>
                          </Paper>
                        );
                      })}
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* ── Right panel: Records ─────────────────────────────────────── */}
          <Box sx={{ width: { xs: "100%", md: "75%" }, flexGrow: 1, minWidth: 0, }}>
            <Card>
              <CardContent sx={{ boxSizing: "border-box" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Records for {selectedCategory}
                  </Typography>
                  <CommonButton
                    label={"Add Record"}
                    size="small"
                    variant={"outlined"}
                    startIcon={<AddIcon sx={{ color: "icon.primary" }} />}
                    onClick={() => {
                      appendRecord({ ...DEFAULT_RECORD });
                      setTimeout(syncVariables, 50);
                    }}
                  />
                </Box>

                <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                  <Box sx={{ p: 1 }}>
                    {/* Column headers */}
                    <Grid container spacing={1} sx={{ mb: 1, px: 1 }}>
                      <Grid item xs={2.5}><Typography variant="caption" fontWeight="bold">Name</Typography></Grid>
                      <Grid item xs={1.5}><Typography variant="caption" fontWeight="bold">Type</Typography></Grid>
                      <Grid item xs={6}><Typography variant="caption" fontWeight="bold">Content / Value</Typography></Grid>
                      <Grid item xs={1}><Typography variant="caption" fontWeight="bold">TTL</Typography></Grid>
                      <Grid item xs={1} />
                    </Grid>
                    <Divider sx={{ mb: 2 }} />

                    <Box>
                      <Stack spacing={2}>
                        {recordFields.map((field, index) => {
                          const currentType = watch(`records.${index}.type`);

                          return (
                            <Grid container spacing={1} key={field.id} alignItems="flex-start">
                              {/* Name */}
                              <Grid item xs={2.5}>
                                <Controller
                                  name={`records.${index}.name`}
                                  control={control}
                                  render={({ field: f }) => (
                                    <CommonTextField
                                      {...f}
                                      fullWidth
                                      size="small"
                                      sx={{ m: 0 }}
                                      placeholder="{{DOMAIN}}"
                                      helperText="e.g. {{DOMAIN}}"
                                      FormHelperTextProps={{ sx: { fontSize: 9 } }}
                                      onChange={(e) => { f.onChange(e.target.value); setTimeout(syncVariables, 50); }}
                                    />
                                  )}
                                />
                              </Grid>

                              {/* Type */}
                              <Grid item xs={1.5}>
                                <Controller
                                  name={`records.${index}.type`}
                                  control={control}
                                  render={({ field: f }) => (
                                    <CommonSelect
                                      {...f}
                                      width="100%"
                                      mt={0} mb={0}
                                      onChange={(e) => handleTypeChange(index, e.target.value, f.onChange)}
                                      options={allowedTypes.map((type) => ({ label: type, value: type }))}
                                    />
                                  )}
                                />
                              </Grid>

                              {/* Content */}
                              <Grid item xs={6}>
                                {renderContentCell(index, currentType)}
                              </Grid>

                              {/* TTL */}
                              <Grid item xs={1}>
                                <Controller
                                  name={`records.${index}.ttl`}
                                  control={control}
                                  render={({ field: f }) => (
                                    <CommonTextField {...f} type="number" fullWidth size="small" sx={{ m: 0 }} />
                                  )}
                                />
                              </Grid>

                              {/* Delete */}
                              <Grid item xs={1}>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    removeRecord(index);
                                    setTimeout(syncVariables, 50);
                                  }}
                                  disabled={recordFields.length === 1}
                                >
                                  <img src={Delete} style={{ height: 20 }} />
                                </IconButton>
                              </Grid>
                            </Grid>
                          );
                        })}
                      </Stack>
                    </Box>
                  </Box>
                </Paper>
              </CardContent>
            </Card>
          </Box>

        </Box>
      </form>
    </Box>
  );
}