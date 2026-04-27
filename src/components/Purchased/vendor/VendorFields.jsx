import {
    Typography,
    Box,
    Tooltip,
    IconButton,
    InputAdornment,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Controller } from "react-hook-form";
import { useState } from "react";
import { Email, Visibility, VisibilityOff } from "@mui/icons-material";
import { CommonRadioButton, CommonSelect, CommonTextField } from "../../../components/common/fields";
import { inputAdornmentMap } from "../../../utils/inputAdornments";
import PhoneNumberField from "../../../components/common/fields/NDE-MobileNumberCode";


const FieldRow = ({ label, showInfo, children, isRedlabel = false , maxWidth =300}) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', minWidth: 0, mb: 1 }}>
        <Box sx={{ width: '180px', flexShrink: 1, pt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 400,
                        color: isRedlabel ? "#D92D20" : "",
                        fontSize: '14px',
                    }}
                >
                    {label}{isRedlabel && <span style={{ marginLeft: 2 }}>*</span>}
                </Typography>
                {showInfo && (
                    <Tooltip title={`More info about ${label?.toLowerCase()}`}>
                        <InfoOutlinedIcon sx={{ fontSize: 16, color: "#98A2B3", cursor: 'help' }} />
                    </Tooltip>
                )}
            </Box>
        </Box>

        {/* Input Column */}
        <Box sx={{ flex: 1, minWidth: 0, maxWidth }}>
            {children}
        </Box>
    </Box>
);

const BasicField = ({ field, control, errors, customerId }) => {

    const [showPassword, setShowPassword] = useState(false);


    if (field.type === "password" && customerId) {
        return null;
    }

    switch (field.type) {
        case "text":
            return (
                <FieldRow label={field.label} showInfo={field.showInfo} isRedlabel={field.isRedlabel}>
                    <Controller
                        name={field.name}
                        control={control}
                        render={({ field: controllerField }) => {
                            const startAdornment = inputAdornmentMap[field.startAdornmentType] ?? null;
                            return (
                                <CommonTextField
                                    {...controllerField}
                                    placeholder={field.placeholder}
                                    fullWidth
                                    mb={0}
                                    error={!!errors?.[field.name]}
                                    helperText={errors?.[field.name]?.message}
                                    InputProps={{
                                        startAdornment: startAdornment && (
                                            <InputAdornment position="start" sx={{ mr: 0.5 }}>
                                                {startAdornment}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            );
                        }}
                    />
                </FieldRow>
            );

        case "email":
            return (
                <FieldRow label={field.label} showInfo={field.showInfo} isRedlabel={field.isRedlabel}>
                    <Controller
                        name={field.name}
                        control={control}
                        render={({ field: controllerField }) => (
                            <CommonTextField
                                {...controllerField}
                                placeholder={field.placeholder}
                                fullWidth
                                mb={0}
                                error={!!errors?.[field.name]}
                                helperText={errors?.[field.name]?.message}
                                // disabled={!!customerId}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ mr: 0.5 }}>
                                            <Email sx={{ fontSize: 18, color: "#98A2B3" }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </FieldRow>
            );

        case "password":
            return (
                <FieldRow label={field.label} showInfo={field.showInfo} isRedlabel={field.isRedlabel}>
                    <Controller
                        name={field.name}
                        control={control}
                        render={({ field: controllerField }) => (
                            <CommonTextField
                                {...controllerField}
                                placeholder={field.placeholder}
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                mb={0}
                                error={!!errors?.[field.name]}
                                helperText={errors?.[field.name]?.message}
                                showPasswordChecklist
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                            onClick={() => setShowPassword(prev => !prev)}
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <VisibilityOff sx={{ fontSize: 20, color: "#666" }} />
                                                : <Visibility sx={{ fontSize: 20, color: "#666" }} />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        )}
                    />
                </FieldRow>
            );

        case "select":
            return (
                <FieldRow label={field.label} showInfo={field.showInfo} isRedlabel={field.isRedlabel}>
                    <Controller
                        name={field.name}
                        control={control}
                        render={({ field: controllerField }) => (
                            <CommonSelect
                                {...controllerField}
                                value={controllerField.value ?? ""}
                                options={field.options}
                                placeholder={field.placeholder}
                                fullWidth
                                mb={0}
                                error={!!errors?.[field.name]}
                                helperText={errors?.[field.name]?.message}
                            />
                        )}
                    />
                </FieldRow>
            );
        case "radio": {
            const defaultOption =
                field.options?.find(opt => opt.default)?.value;

            return (
                <FieldRow
                    label={field.label}
                    showInfo={field.showInfo}
                    isRedlabel={field.isRedlabel}
                >
                    <Controller
                        name={field.name}
                        control={control}
                        render={({ field: controllerField }) => (
                            <CommonRadioButton
                                name={controllerField.name}
                                value={controllerField.value ?? defaultOption}
                                onChange={controllerField.onChange}
                                options={field.options}
                                mt={0}
                                mb={0}
                            />
                        )}
                    />
                </FieldRow>
            );
        }
        case "phone":
            return (
                <FieldRow label={field.label} showInfo={field.showInfo} isRedlabel={field.isRedlabel}>
                    <Controller
                        name={field.name}
                        control={control}
                        render={({ field: controllerField }) => (
                            <PhoneNumberField
                                {...controllerField}
                                placeholder={field.placeholder}
                                mb={0}
                                error={!!errors?.[field.name]}
                                helperText={errors?.[field.name]?.message}
                            // disabled={!!customerId}
                            />
                        )}
                    />
                </FieldRow>
            );

        case "group":
            return (
                <FieldRow label={field.label} showInfo={field.showInfo} isRedlabel={field.isRedlabel} maxWidth={514} >
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        {field.fields.map(sub => (
                            <Box key={sub.name} sx={{ flex: sub.flex || 1 }}>
                                <Controller
                                    name={sub.name}
                                    control={control}
                                    render={({ field: ctrl }) =>
                                        sub.type === "select" ? (
                                            <CommonSelect
                                                {...ctrl}
                                                placeholder={sub.placeholder}
                                                options={sub.options || []}
                                                fullWidth
                                                mb={0}
                                                error={!!errors?.[sub.name]}
                                                helperText={errors?.[sub.name]?.message}
                                            />
                                        ) : (
                                            <CommonTextField
                                                {...ctrl}
                                                placeholder={sub.placeholder}
                                                fullWidth
                                                mb={0}
                                                error={!!errors?.[sub.name]}
                                                helperText={errors?.[sub.name]?.message}
                                            />
                                        )
                                    }
                                />
                            </Box>
                        ))}
                    </Box>
                </FieldRow>
            );

        default:
            return null;
    }
};

export default BasicField;
