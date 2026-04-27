import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Stack, Typography, Box, Chip,
    Divider, IconButton, Alert,
} from "@mui/material";
import {
    Close as CloseIcon,
    Settings as SettingsIcon,
} from "@mui/icons-material";
import { yupResolver } from "@hookform/resolvers/yup";
import { TemplateValueSchema, VARIABLE_META } from "../../../utils/TemplateValueSchema";
import { useTemplateValueById } from "../../../hooks/dns/useDnshooks";
import CommonDialog from "../../common/NDE-Dialog";
import CommonTextField from "../../common/fields/NDE-TextField";

const getMeta = (varName) =>
    VARIABLE_META[varName] || {
        label: varName,
        placeholder: `Enter ${varName}`,
        helper: "",
    };

export default function TemplateValuesModal({ open, onClose, template, templateValueId, onApply }) {
    // ── Stable dependencies for React Hook Form ──────────────────────────────
    const variables = useMemo(() => template?.requiredVariables || [], [template]);

    // Pass ID dynamically
    const { data: templateValueRes, refetch } = useTemplateValueById(templateValueId,);
    const templateValueData = templateValueRes?.data || templateValueRes;

    // ── Stable default values (recomputed only when actual data changes) ───────
    // Using useMemo instead of a plain function prevents the infinite render loop:
    // plain function → reset() → re-render → new function ref → effect fires again → loop
    const defaultValues = useMemo(() => {
        const defaultVars = {};

        // 1. Seed all known variable keys with empty string
        Object.keys(VARIABLE_META).forEach((key) => {
            if (key !== "DOMAIN" && key !== "SERIAL") {
                defaultVars[key] = "";
            }
        });

        // 2. Overlay with API-fetched values (only if data exists)
        if (templateValueData?.variables) {
            Object.entries(templateValueData.variables).forEach(([key, val]) => {
                defaultVars[key] = val;
            });
        }

        return { variables: defaultVars };
    }, [templateValueData]); // stable — only recomputes when server data actually changes

    const resolver = useMemo(() => {
        return variables.length === 0 ? undefined : yupResolver(TemplateValueSchema);
    }, [variables]);

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: { variables: {} },
        resolver,
    });

    // Effect 1: trigger a fresh fetch once when the modal opens with a known ID
    useEffect(() => {
        if (open && templateValueId) {
            refetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, templateValueId]); // do NOT add refetch — it's a new ref every render

    // Effect 2: reset form with stable memoized values — can never loop because
    // defaultValues is a useMemo reference that only changes when templateValueData changes
    useEffect(() => {
        if (open) {
            reset(defaultValues);
        }
    }, [open, defaultValues, reset]);

    const onSubmit = async (values) => {
        try {
            await onApply(values, templateValueId);
        } catch (error) {
            console.error("Template value application failed:", error);
        }
    };

    //   if (!template) return null;

    return (
        <>
            <CommonDialog
                open={open}
                onClose={onClose}
                title={"Template Settings"}
                onSubmit={handleSubmit(onSubmit)}
                submitLabel={"Submit"}
                width={550}
            >
                {templateValueData?.length === 0 ? (
                    <Alert severity="info" variant="outlined">
                        This template has no required variables. You can apply it directly.
                    </Alert>
                ) : (
                    <>
                        <Stack spacing={2.5}>
                            <Typography variant="caption" color="text.secondary">
                                These values will replace <code style={{ background: "#f0f0f0", padding: "1px 4px", borderRadius: 3 }}>{"{{VARIABLE}}"}</code> placeholders in the DNS records.
                            </Typography>

                            {Object.keys(VARIABLE_META)
                                .filter((key) => key !== "DOMAIN" && key !== "SERIAL")
                                .map((key, index) => {
                                    const meta = getMeta(key);
                                    return (
                                        <Controller
                                            key={key}
                                            name={`variables.${key}`}
                                            control={control}
                                            // defaultValue=""
                                            render={({ field }) => (
                                                <CommonTextField
                                                  {...field}
                                                  label={meta.label}
                                                  placeholder={meta.placeholder}
                                                  size="small"
                                                  height={40}
                                                  sx={{ m: 0 }}
                                                  fullWidth
                                                  error={!!errors?.variables?.[key]}
                                                  helperText={errors?.variables?.[key]?.message || meta.helper}
                                                  startAdornment={
                                                       <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    fontFamily: "monospace",
                                                                    color: "primary.main",
                                                                    bgcolor: "primary.50",
                                                                    px: 1, 
                                                                    py: 0.25,
                                                                    borderRadius: 0.5,
                                                                    mr: 1,
                                                                    whiteSpace: "nowrap",
                                                                    fontSize: 10,
                                                                }}
                                                            >
                                                                {`{{${key}}}`}
                                                            </Typography>}
                                                />
                                            )}
                                        />
                                    );
                                })}
                        </Stack>
                    </>
                )}
            </CommonDialog>
        </>
    );
}