import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    Box,
    Typography,
    IconButton,
    Grid,
    Stack,
    Divider,
    InputAdornment,
    TextField,
} from "@mui/material";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import DragIndicatorRoundedIcon from "@mui/icons-material/DragIndicatorRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { Reorder } from "framer-motion";

import CommonTextField from "./fields/NDE-TextField";
import CommonButton from "./NDE-Button";
import { useNavigate, useParams } from "react-router-dom";
import CustomeViewFilter from "./Nde-CustomView-Filter";
import { useAvailableFields, useFilterFields, useGetCustomViewById, useUpdateCustomView } from "../../hooks/Custom-view/custom-view-hooks";
import { toast } from "react-toastify";

const schema = yup.object({
    viewName: yup.string().required("Name is required"),
    isFavorite: yup.boolean(),
    pattern: yup.string(),
    selectedColumns: yup.array().of(
        yup.object({
            id: yup.string().required(),
            label: yup.string().required(),
            required: yup.boolean(),
        })
    ),
}).required();


const convertToMongoQuery = (query) => {
    if (!query) return {};

    const parseRule = (rule) => {
        switch (rule.operator) {
            case "beginsWith":
                return { [rule.field]: { $regex: `^${rule.value}`, $options: "i" } };
            case "endsWith":
                return { [rule.field]: { $regex: `${rule.value}$`, $options: "i" } };
            case "contains":
                return { [rule.field]: { $regex: `${rule.value}`, $options: "i" } };
            case "is":
            case "=":
                return { [rule.field]: rule.value };
            case "is_not":
            case "!=":
                return { [rule.field]: { $ne: rule.value } };
            case "is_in":
                return { [rule.field]: { $in: Array.isArray(rule.value) ? rule.value : [rule.value] } };
            case "is_not_in":
                return { [rule.field]: { $nin: Array.isArray(rule.value) ? rule.value : [rule.value] } };
            case "lt":
                return { [rule.field]: { $lt: rule.value } };
            case "lte":
                return { [rule.field]: { $lte: rule.value } };
            case "gt":
                return { [rule.field]: { $gt: rule.value } };
            case "gte":
                return { [rule.field]: { $gte: rule.value } };
            case "is_empty":
                return { [rule.field]: { $eq: "" } };
            case "is_not_empty":
                return { [rule.field]: { $ne: "" } };
            default:
                return {};
        }
    };

    const parseGroup = (group) => {
        const combinator = group.combinator === "or" ? "$or" : "$and";
        const rules = group.rules.map((r) =>
            r.rules ? parseGroup(r) : parseRule(r)
        );
        return { [combinator]: rules };
    };

    return parseGroup(query);
};



const EditCustomView = () => {
    const navigate = useNavigate();
    const { customId, module } = useParams();

    const moduleName = module?.endsWith("s")
        ? module.slice(0, -1)
        : module;


    const { data: availableFields } = useAvailableFields(moduleName);
    const { data: filterFields } = useFilterFields(moduleName);
    const { data } = useGetCustomViewById(moduleName, customId);
    const { mutate: updateView, isPending } = useUpdateCustomView();


    const [criteria, setCriteria] = useState({
        combinator: 'and',
        rules: [{ field: '', operator: '', value: '' }]
    });


    const availableColumns = useMemo(() => {
        return availableFields?.data?.map((field) => ({
            id: field._id,
            label: field.label,
            required: field.is_mandatory || false,
        })) || [];
    }, [availableFields]);


    const mappedFilterFields = React.useMemo(() => {
        if (!filterFields?.data) return [];

        const unique = new Map();

        filterFields.data.forEach((field) => {
            const key = `${field.name}_${field.valueEditorType}`;

            if (!unique.has(key)) {
                unique.set(key, field);
            }
        });

        return Array.from(unique.values()).map(field => ({
            name: field.name,
            label: field.label,
            type: field.valueEditorType || "text",

            operators:
                field.operators?.map(op => ({
                    value: op.value,
                    label: op.name,
                })) || [],

            options: Array.isArray(field.value)
                ? field.value.map(v => ({
                    value: v.value,
                    label: v.label,
                }))
                : [],

            plans: Array.isArray(field.value)
                ? field.value.flatMap(v =>
                    Array.isArray(v.plans)
                        ? v.plans.map(plan => ({
                            parentValue: v.value,
                            value: plan.value,
                            label: plan.label,
                        }))
                        : []
                )
                : [],
        }));
    }, [filterFields]);


    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            viewName: "",
            isFavorite: false,
            selectedColumns: [],
        },
        mode: "onChange",
    });


    const watchedSelectedColumns = watch("selectedColumns");
    const [colSearch, setColSearch] = useState("");

    const handleAddToSelected = (col) => {
        const currentSelected = watchedSelectedColumns || [];
        if (currentSelected.some(c => c.id === col.id)) return;
        setValue("selectedColumns", [...currentSelected, col]);
    };

    const handleRemoveFromSelected = (col) => {
        if (col.required) return;

        const currentSelected = watchedSelectedColumns || [];
        const newSelected = currentSelected.filter(
            (c) => c.id !== col.id
        );
        setValue("selectedColumns", newSelected);
    };


    const filteredAvailable = availableColumns.filter(
        col => !watchedSelectedColumns?.some(sc => sc.id === col.id)
    );


    const onSubmit = (data) => {

        const hasValidRule = criteria.rules.some(
            (r) => r.field && r.operator && r.value !== ''
        );

        if (!hasValidRule) {
            toast.error("Please add at least one filter criteria!");
            return;
        }
        const mongodbQuery = convertToMongoQuery(criteria);
        const payload = {
            title: data.viewName,
            criteria: criteria,
            selected_fields: data.selectedColumns.map(col => col.id),
            visibility: "only_me",
            is_favorite: data.isFavorite,
            mongodb_query: mongodbQuery,
        };

        updateView(
            {
                module: moduleName,
                viewID: customId,
                data: payload,
            },
            {
                onSuccess: () => {
                    navigate(-1);
                },
                onError: (err) => {
                    console.error("Error updating view:", err);
                },
            }
        );


    };


    useEffect(() => {
        if (!data?.data || !availableColumns?.length) return;

        const view = data.data;

        setValue("viewName", view.title || "");

        setValue("isFavorite", view.is_favorite || false);

        if (view.header_and_sort_columns?.length) {
            const selected = view.header_and_sort_columns
                .sort((a, b) => a.display_order - b.display_order)
                .map((col) => {
                    const match = availableColumns.find(
                        (aCol) => aCol.id === col.field_id._id
                    );

                    return match
                        ? {
                            id: match.id,
                            label: match.label,
                            required: match.required || false,
                        }
                        : null;
                })
                .filter(Boolean);

            setValue("selectedColumns", selected, {
                shouldDirty: false,
            });
        }

        if (view.criteria) {
            setCriteria(view.criteria);
        }

    }, [data, availableColumns, setValue]);



    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Header */}
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    p: 1,
                    mt: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: "background.paper",
                }}
            >
                <Typography variant="h4">Edit Custom View</Typography>
                <CloseRoundedIcon
                    sx={{ cursor: "pointer", color: "error.main", mr: 2 }}
                    onClick={() => navigate(-1)}
                />
            </Box>
            <Divider />

            <form onSubmit={handleSubmit(onSubmit)} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <Box p={2} sx={{ flex: 1, overflowY: "auto" }}>
                    {/* Name & Favorite */}
                    <Grid container spacing={2} alignItems="center" mb={4}>
                        <Grid item xs={12} md={5}>
                            <Controller
                                name="viewName"
                                control={control}
                                render={({ field }) => (
                                    <CommonTextField
                                        {...field}
                                        label="Name"
                                        mb={0}
                                        mandatory
                                        width={"500px"}
                                        error={!!errors.viewName}
                                        helperText={errors.viewName?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item>
                            <Controller
                                name="isFavorite"
                                control={control}
                                render={({ field }) => (
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={1}
                                        mt={1}
                                        sx={{ cursor: "pointer", userSelect: "none" }}
                                        onClick={() => field.onChange(!field.value)}
                                    >
                                        {field.value ? (
                                            <StarRoundedIcon sx={{ color: "#FFD700" }} />
                                        ) : (
                                            <StarBorderRoundedIcon />
                                        )}
                                        <Typography color="body1" fontSize={13} fontWeight={400}>
                                            Mark as Favorite
                                        </Typography>
                                    </Box>
                                )}
                            />
                        </Grid>
                    </Grid>

                    {/* Criteria */}
                    <Typography variant="h6" fontWeight={400} mb={2}>
                        Define the criteria (if any)
                    </Typography>
                    <Box>
                        <CustomeViewFilter mappedFilterFields={mappedFilterFields}
                            query={criteria}
                            onQueryChange={setCriteria}
                        />
                    </Box>

                    {/* Columns Preference */}
                    <Typography variant="h6" fontWeight={400} mb={2} mt={4}>
                        Columns Preference:
                    </Typography>

                    <Box sx={{ width: "700px" }}>
                        <Grid container mb={1} spacing={0}>
                            {/* Headers */}
                            <Grid item sx={{ width: "50%", pl: 2 }}>
                                <Typography variant="subtitle1" color="text.secondary" fontWeight={500} letterSpacing={0.5}>
                                    AVAILABLE COLUMNS
                                </Typography>
                            </Grid>
                            <Grid item sx={{ width: "50%", pl: 2 }}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <CheckCircleOutlineRoundedIcon fontSize="small" color="success" />
                                    <Typography variant="subtitle1" color="text.secondary" fontWeight={500} letterSpacing={0.5}>
                                        SELECTED COLUMNS
                                    </Typography>
                                </Stack>
                            </Grid>
                        </Grid>

                        {/* Columns Lists */}
                        <Grid container sx={{ border: "1px solid #E0E0E0", borderRadius: 2, height: 400, overflow: "hidden" }}>
                            {/* Available Columns */}
                            <Grid item sx={{ width: "50%", borderRight: "1px solid #E0E0E0", display: "flex", flexDirection: "column", height: "100%" }}>
                                <Box sx={{ borderBottom: "1px solid #E0E0E0" }}>
                                    <TextField
                                        placeholder="Search"
                                        value={colSearch}
                                        onChange={(e) => setColSearch(e.target.value)}
                                        size="small"
                                        fullWidth
                                        variant="standard"
                                        InputProps={{
                                            disableUnderline: true,
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ pl: 2 }}>
                                                    <SearchRoundedIcon fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                            sx: { fontSize: 14, height: 48, bgcolor: "white" },
                                        }}
                                    />
                                </Box>
                                <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
                                    <Reorder.Group axis="y" values={filteredAvailable} style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                        {filteredAvailable.map((col) => (
                                            <Reorder.Item
                                                key={col.id}
                                                value={col}
                                                style={{ width: "100%" }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        padding: "1px 15px",
                                                        width: "100%",
                                                        cursor: "grab",
                                                        transition: "all 0.2s",
                                                        "&:hover": {
                                                            bgcolor: "#F0F7FF",
                                                            "& .add-icon": { opacity: 1 },
                                                        },
                                                    }}
                                                >
                                                    <DragIndicatorRoundedIcon fontSize="small" sx={{ color: "text.disabled", mr: 1.5, opacity: 0.5 }} />
                                                    <Typography variant="body1" fontSize={15}>
                                                        {col.label}
                                                    </Typography>
                                                    <IconButton
                                                        size="small"
                                                        className="add-icon"
                                                        onClick={() => handleAddToSelected(col)}
                                                        sx={{ ml: "auto", opacity: 0, color: "#2196F3", transition: "all 0.2s" }}
                                                    >
                                                        <AddCircleRoundedIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Reorder.Item>
                                        ))}
                                    </Reorder.Group>
                                </Box>
                            </Grid>

                            {/* Selected Columns */}
                            <Grid item sx={{ width: "50%", display: "flex", flexDirection: "column", height: "100%" }}>
                                <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
                                    <Controller
                                        name="selectedColumns"
                                        control={control}
                                        render={({ field }) => (
                                            <Reorder.Group
                                                axis="y"
                                                values={field.value || []}
                                                onReorder={field.onChange}
                                                style={{ listStyle: "none", padding: 0, margin: 0 }}
                                            >
                                                {(field.value || []).map((col) => (
                                                    <Reorder.Item
                                                        key={col.id}
                                                        value={col}
                                                        dragListener
                                                        style={{ width: "100%" }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                padding: "2px 15px",
                                                                width: "100%",
                                                                cursor: "grab",
                                                                transition: "all 0.2s",
                                                                "&:hover": { bgcolor: "#F0F7FF", "& .remove-icon": { opacity: 1 } },
                                                            }}
                                                        >
                                                            <DragIndicatorRoundedIcon fontSize="small" sx={{ color: "text.disabled", mr: 1.5, opacity: 0.5 }} />
                                                            {col.label}
                                                            {col.required && (
                                                                <Typography
                                                                    component="span"
                                                                    color="error"
                                                                    ml={0.5}
                                                                >
                                                                    *
                                                                </Typography>
                                                            )}
                                                            {!col.required && (
                                                                <IconButton
                                                                    size="small"
                                                                    className="remove-icon"
                                                                    onClick={() => handleRemoveFromSelected(col)}
                                                                    sx={{
                                                                        ml: "auto",
                                                                        opacity: 0,
                                                                        color: "#F44336",
                                                                        transition: "all 0.2s"
                                                                    }}
                                                                >
                                                                    <RemoveCircleRoundedIcon fontSize="small" />
                                                                </IconButton>
                                                            )}
                                                        </Box>
                                                    </Reorder.Item>
                                                ))}
                                            </Reorder.Group>
                                        )}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                {/* Footer */}
                <Box
                    sx={{
                        position: "sticky",
                        bottom: 0,
                        p: 1,
                        borderTop: "1px solid #D1D1DB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: 1,
                        zIndex: 10,
                        bgcolor: "background.paper",
                        mb: 7,
                    }}
                >
                    <CommonButton type="submit" label="Save" disabled={isPending} startIcon />
                    <CommonButton type="button" label="Cancel" variant="outlined" onClick={() => navigate(-1)} startIcon />
                </Box>
            </form>
        </Box>
    );
};

export default EditCustomView;
