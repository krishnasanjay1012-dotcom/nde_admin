import { Box, Divider, IconButton, Typography } from "@mui/material";
import { useState, useRef } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import NdeEditor from "./NdeEditor/NdeEditor";
import CommonemailMultiSelect from "./fields/NDE-CommonMailMultiSelect";
import { CommonMailMultiSelect, CommonTextField } from "./fields";
import CommonButton from "./NDE-Button";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ContactPersonModal from "./ContactPerson/ContactPerson";

const schema = yup.object({
    emailMeta: yup.object({
        from: yup
            .array()
            .of(
                yup.object({
                    name: yup.string(),
                    email: yup.string().required("From email is required"),
                })
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
                })
            )
            .min(1, "At least one recipient required"),

        cc: yup.array().of(
            yup.object({
                name: yup.string(),
                email: yup.string().email(),
            })
        ),

        bcc: yup.array().of(
            yup.object({
                name: yup.string(),
                email: yup.string().email(),
            })
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
    attachments: yup.array(),
});

const getDefaultValues = ({ fromEmail, subject = "", html = "", extra = {} }) => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);

    const formatDate = (date) => {
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    };

    return {
        emailMeta: {
            from: fromEmail ? [fromEmail] : [],
            to: [],
            cc: [],
            bcc: [],
            subject,
            html,
        },

        send_customer_attachment: {
            send_attachment: false,
            from_date: formatDate(startDate),
            to_date: formatDate(today),
            enabled: true,
        },

        send_invoice_attachment: true,
        attachments: [],

        ...extra,
    };
};

const FormRow = ({ label, children }) => (
    <Box display="flex" alignItems="center" py={1} px={2}>
        <Box width="10%">
            <Typography>{label}</Typography>
        </Box>
        <Box width="85%">{children}</Box>
    </Box>
);

const CommonSendEmail = ({
    fromEmail,
    subject,
    html,
    extraValues,
    userList = [],
    onSubmit,
    isLoading = false,
    extraComponents,
    onCancel,
    disabledFrom = false,
    vendorName
}) => {
    const [showCc, setShowCc] = useState(true);
    const [showBcc, setShowBcc] = useState(true);
    const [editorHtml, setEditorHtml] = useState(html || "");

    const fileInputRef = useRef(null);

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: getDefaultValues({
            fromEmail,
            subject,
            html,
            extra: extraValues,
        }),
    });

    const { control, handleSubmit, setValue, watch } = methods;
    const [openContact, setOpenContact] = useState(false);

    const attachments = watch("attachments") || [];
    const handleConactModalOpen = () => setOpenContact(true);
    const handleConactModalClose = () => setOpenContact(false);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        const formatted = files.map((file) => ({
            file,
            name: file.name,
        }));

        setValue("attachments", [...attachments, ...formatted]);
    };

    const handleRemoveFile = (index) => {
        const updated = [...attachments];
        updated.splice(index, 1);
        setValue("attachments", updated);
    };

    const handleCc = (e) => {
        e.stopPropagation();
        setShowCc(false);
    };

    const handleBcc = (e) => {
        e.stopPropagation();
        setShowBcc(false);
    };

    const handleFormSubmit = (data) => {
        const formData = new FormData();

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

        delete payload?.send_customer_attachment?.enabled;

        formData.append("data", JSON.stringify(payload));

        data.attachments?.forEach((att) => {
            formData.append("attachments", att.file);
        });

        onSubmit(formData);
    };

    return (
        <Box sx={{ maxHeight: "calc(100vh - 70px)", display: "flex", flexDirection: "column" }}>

            {/* HEADER */}
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1
                }}
            >
                <Typography variant="h4">
                    Send Email Statement for {vendorName}
                </Typography>

                <IconButton color="error" onClick={onCancel}>
                    <CloseIcon sx={{ color: "error.main" }} />
                </IconButton>
            </Box>

            <Divider />

            <FormProvider {...methods}>
                <Box overflow="auto">

                    <Box mx={2} mt={2} border="1px solid #dddfe9" borderRadius={1}>

                        {/* FROM */}
                        <Controller
                            name="emailMeta.from"
                            control={control}
                            render={({ field, fieldState }) => (
                                <FormRow label="From">
                                    <CommonemailMultiSelect
                                        {...field}
                                        multiple={false}
                                        disabled={disabledFrom}
                                        options={field.value || []}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}

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
                                        cc={showCc}
                                        bcc={showBcc}
                                        handleCc={handleCc}
                                        handleBcc={handleBcc}
                                        addNewLabel={"Add Contact Person"}
                                        onAddNew={handleConactModalOpen}
                                    />
                                </FormRow>
                            )}
                        />
                        <Divider />

                        {/* CC */}
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

                        {/* BCC */}
                        {!showBcc && (
                            <>
                                <Controller
                                    name="emailMeta.bcc"
                                    control={control}
                                    render={({ field }) => (
                                        <FormRow label="Bcc">
                                            <CommonMailMultiSelect
                                                {...field}
                                                multiple options={userList}
                                            />
                                        </FormRow>
                                    )}
                                />
                                <Divider />
                            </>
                        )}

                        {/* SUBJECT */}
                        <Controller
                            name="emailMeta.subject"
                            control={control}
                            render={({ field }) => (
                                <FormRow label="Subject">
                                    <CommonTextField {...field} fullWidth noLabel mt={0} mb={0} />
                                </FormRow>
                            )}
                        />

                        {/* EDITOR */}
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

                    <Box p={2} display="flex" flexDirection="column" gap={2}>

                        {extraComponents}

                        <Box
                            sx={{
                                border: "1px dashed #dddfe9",
                                borderRadius: 2,
                                p: 2,
                                bgcolor: "#fafbfc"
                            }}
                        >
                            {/* Header */}
                            <Box display="flex" alignItems="center" gap={0.5}>
                                <AttachFileIcon fontSize="small" sx={{ color: "primary.main" }} />
                                <Typography
                                    sx={{ color: 'primary.main', cursor: 'pointer', fontSize: 14 }}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    Attachments
                                </Typography>
                            </Box>
                            <input
                                type="file"
                                hidden
                                multiple
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />

                            <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                                {attachments.map((item, index) => (
                                    <Box
                                        key={index}
                                        display="flex"
                                        alignItems="center"
                                        gap={1}
                                        px={1.5}
                                        py={0.5}
                                        border="1px solid #e5e7eb"
                                        borderRadius={2}
                                        bgcolor="#fff"
                                    >
                                        <Typography fontSize={13}>
                                            {item.name}
                                        </Typography>

                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveFile(index)}

                                        >
                                            <CloseIcon fontSize="small"
                                                sx={{
                                                    color: "error.main",
                                                    p: 0.3
                                                }}
                                            />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                    </Box>
                </Box>
            </FormProvider>

            <Divider />

            {/* FOOTER */}
            <Box
                display="flex"
                gap={2}
                p={1}
                position="sticky"
                bottom={0}
                sx={{ bgcolor: "background.paper" }}
            >
                <CommonButton
                    variant="contained"
                    onClick={handleSubmit(handleFormSubmit)}
                    disabled={isLoading}
                    label="Send"
                    startIcon
                />

                <CommonButton
                    variant="outlined"
                    onClick={onCancel}
                    label="Cancel"
                    startIcon
                />
            </Box>
            <ContactPersonModal
                open={openContact}
                onClose={handleConactModalClose}
            // userId={invoiceDetails?.customer_id}
            />
        </Box>
    );
};

export default CommonSendEmail;