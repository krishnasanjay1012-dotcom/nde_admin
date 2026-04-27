import { useForm, Controller, useFieldArray } from "react-hook-form"
import { useRef, useState, useEffect, useCallback, useMemo } from "react"
import {
    Box,
    TextField,
    Typography,
    IconButton,
    Radio,
    RadioGroup,
    FormControlLabel,
    Divider,
    Button,
    useMediaQuery,
    useTheme,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import AddIcon from "@mui/icons-material/Add"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import { useNavigate, useParams } from "react-router-dom"
import CustomerDropdownList from "../../../components/Sales/Invoices/Components/CustomerDropdownList"
import { CommonDatePicker, CommonDescriptionField, CommonSelect, CommonTextField } from "../../../components/common/fields"
import { useInvoiceById } from "../../../hooks/sales/invoice-hooks"
import CommonButton from "../../../components/common/NDE-Button"

const Label = ({ text, required, sx = {} }) => (
    <Box sx={{ minWidth: { xs: 140, sm: 160 }, display: "flex", alignItems: "center", gap: 0.5, ...sx }}>
        <Typography fontSize={{ xs: 13, sm: 14 }} sx={{ color: required ? "red" : "#000" }}>
            {text}
            {required && <span style={{ color: "red" }}>*</span>}
        </Typography>
        <InfoOutlinedIcon sx={{ fontSize: 16, color: "#999" }} />
    </Box>
)

const FormRow = ({ label, required = false, children, sx = {} }) => (
    <Box sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        mb: 2,
        gap: { xs: 1, sm: 2 },
        ...sx
    }}>
        <Label text={label} required={required} />
        <Box sx={{ width: { xs: "100%", sm: "auto" }, flex: 1 }}>
            {children}
        </Box>
    </Box>
)

const SummaryRow = ({ label, value, fontSize = 14 }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
        <Typography fontSize={fontSize}>{label}</Typography>
        <Typography fontSize={fontSize} fontWeight={500}>{value}</Typography>
    </Box>
)

export default function EditInvoice() {
    const theme = useTheme()
    const navigate = useNavigate()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const { invoiceId } = useParams();
    const { data: selectedInvoiceData } = useInvoiceById(invoiceId);

    const invoiceData = selectedInvoiceData?.data

    const transformInvoiceData = useCallback((invoiceData) => {
        if (!invoiceData) return null;

        return {
            customerName: invoiceData.userId ? {
                value: invoiceData.userId._id,
                label: `${invoiceData.userId.first_name} ${invoiceData.userId.last_name}`,
                email: invoiceData.userId.email,
                phone: invoiceData.userId.phone_number
            } : "",
            invoice: invoiceData.invoice_no || "",
            orderno: invoiceData.orderDetails?.orderId || "",
            invoicedate: invoiceData.date ? new Date(invoiceData.date) : new Date(),
            terms: "Net 15",
            duedate: invoiceData.due_date ? new Date(invoiceData.due_date) : new Date(),
            salesperson: "",
            subject: `Invoice for Order #${invoiceData.orderDetails?.orderId || ""}`,
            items: [{
                item: `Service - Invoice ${invoiceData.invoice_no || ""}`,
                qty: 1,
                rate: invoiceData.sub_total || 0,
                amount: invoiceData.sub_total || 0
            }],
            notes: invoiceData.settings?.Notes || "",
            termsConditions: "Kindly pay the invoice within due date.",
            tdsTcsSelect: "",
            adjustment: 0
        };
    }, []);

    const defaultValues = useMemo(() => {
        return invoiceData ?
            transformInvoiceData(invoiceData) : {
                customerName: "",
                invoice: "INV-000001",
                orderno: "",
                invoicedate: new Date(),
                terms: "Net 15",
                duedate: new Date(),
                salesperson: "",
                subject: "",
                items: [{ item: "", qty: 1, rate: 0, amount: 0 }],
                notes: "",
                termsConditions: "",
                tdsTcsSelect: "",
                adjustment: 0
            };
    }, [invoiceData, transformInvoiceData]);

    const { control, setValue, handleSubmit, formState: { errors }, reset, getValues } = useForm({
        defaultValues
    })

    useEffect(() => {
        if (invoiceData) {
            const transformedData = transformInvoiceData(invoiceData);
            reset(transformedData);
        }
    }, [invoiceData, transformInvoiceData, reset]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
        keyName: "id"
    })

    const fileInputRef = useRef(null)
    const [uploadedFiles, setUploadedFiles] = useState([])

    const { subTotal, totalQty, totalAmount } = useMemo(() => {
        const currentItems = getValues("items") || [];

        const calculatedSubTotal = currentItems.reduce((sum, row) => {
            const qty = Number(row.qty) || 0;
            const rate = Number(row.rate) || 0;
            return sum + (qty * rate);
        }, 0);

        const calculatedTotalQty = currentItems.reduce((sum, row) => {
            return sum + (Number(row.qty) || 0);
        }, 0);

        const finalSubTotal = invoiceData ? (invoiceData.sub_total || 0) : calculatedSubTotal;
        const finalTotalAmount = invoiceData ? (invoiceData.amount || 0) : calculatedSubTotal;

        return {
            subTotal: finalSubTotal,
            totalQty: calculatedTotalQty,
            totalAmount: finalTotalAmount
        };
    }, [getValues, invoiceData]);

    const handleItemChange = useCallback((index, fieldName, value) => {
        const currentItems = getValues("items");
        const updatedItems = [...currentItems];

        if (fieldName === 'qty' || fieldName === 'rate') {
            const qty = fieldName === 'qty' ? Number(value) || 0 : updatedItems[index].qty;
            const rate = fieldName === 'rate' ? Number(value) || 0 : updatedItems[index].rate;

            updatedItems[index] = {
                ...updatedItems[index],
                [fieldName]: value,
                amount: qty * rate
            };

            setValue(`items.${index}`, updatedItems[index], { shouldDirty: true });
        } else {
            updatedItems[index] = {
                ...updatedItems[index],
                [fieldName]: value
            };
            setValue(`items.${index}`, updatedItems[index], { shouldDirty: true });
        }
    }, [getValues, setValue]);

    const handleUploadClick = () => fileInputRef.current?.click()

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files)
        setUploadedFiles((prev) => [...prev, ...files])
        e.target.value = ""
    }

    const handleRemoveFile = (index) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const inputProps = {
        sx: {
            width: { xs: "100%", sm: 330 },
            mb: 0,
            "& .MuiInputBase-root": { height: { xs: 40, sm: 45 } }
        }
    }

    const dateInputProps = {
        sx: {
            width: { xs: "100%", sm: "100%" },
            mb: 0,
            "& .MuiInputBase-root": { height: { xs: 40, sm: 45 } }
        }
    }

    const onSubmit = (data) => {
        const apiData = {
            invoice_no: data.invoice,
            date: data.invoicedate,
            due_date: data.duedate,
            customerId: data.customerName.value,
            sub_total: subTotal,
            amount: totalAmount,
            notes: data.notes,
            termsConditions: data.termsConditions,
            items: data.items,
        };
    }

    return (
        <>
            {/* Header */}
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: { xs: 2, sm: 3 },
                py: 1,
                borderBottom: "1px solid #eee",
            }}>
                <Typography variant="h4">
                    {invoiceData ? `Edit Invoice: ${invoiceData.invoice_no}` : "New Invoice"}
                </Typography>
                <IconButton size={isMobile ? "small" : "medium"} onClick={() => navigate(-1)} color="error">
                    <CloseIcon sx={{ color: "error.main" }} />
                </IconButton>
            </Box>

            {/* Form Content */}
            <Box sx={{
                px: { xs: 2, sm: 3 },
                maxHeight: "calc(96vh - 200px)",
                overflow: "auto"
            }}>
                {/* Basic Information */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1, sm: 1.5, md: 2 } }}>
                    <Box sx={{ width: "100%", mt: { xs: 1, sm: 1.5 }, mb: -2 }}>
                        <CustomerDropdownList
                            control={control}
                            defaultValue={defaultValues.customerName}

                        />
                    </Box>

                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, minmax(0, 1fr))"
                        },
                        gap: { xs: "12px", sm: "16px" },
                        alignItems: "start"
                    }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1, sm: 1.5 } }}>
                            <Box >
                                <Controller
                                    name="invoice"
                                    control={control}
                                    rules={{ required: "Invoice number is required" }}
                                    render={({ field }) => (
                                        <CommonTextField
                                            {...field}
                                            {...inputProps}
                                            label="Invoice"
                                            error={!!errors.invoice}
                                            helperText={errors.invoice?.message}
                                            fullWidth
                                            mandatory
                                            mb={0}
                                            sx={{ "& .MuiOutlinedInput-root": { fontSize: { xs: "11px", sm: "13px" }, height: 44 } }}
                                        />
                                    )}
                                />
                            </Box>

                            {/* Invoice Date */}
                            <Box >
                                <Controller
                                    name="invoicedate"
                                    control={control}
                                    rules={{ required: "Invoice date is required" }}
                                    render={({ field, fieldState }) => (
                                        <CommonDatePicker
                                            {...field}
                                            {...dateInputProps}
                                            label="Invoice Date"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            fullWidth
                                            mandatory
                                        />
                                    )}
                                />
                            </Box>

                            {/* Due Date */}
                            <Box >
                                <Controller
                                    name="duedate"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <CommonDatePicker
                                            {...field}
                                            {...dateInputProps}
                                            label="Due Date"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            fullWidth
                                        />
                                    )}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1, sm: 1.5 } }}>
                            {/* Order Number */}
                            <Box >
                                <Controller
                                    name="orderno"
                                    control={control}
                                    render={({ field }) => (
                                        <CommonTextField
                                            {...field}
                                            {...inputProps}
                                            label="Order Number"
                                            fullWidth
                                            size="small"
                                            mb={0}
                                            sx={{ "& .MuiOutlinedInput-root": { fontSize: { xs: "11px", sm: "13px" }, height: 44 } }}
                                        />
                                    )}
                                />
                            </Box>

                            {/* Terms */}
                            <Box >
                                <Controller
                                    name="terms"
                                    control={control}
                                    render={({ field }) => (
                                        <CommonSelect
                                            {...field}
                                            {...inputProps}
                                            label="Terms"
                                            fullWidth
                                            size="small"
                                            mb={1}
                                            sx={{ "& .MuiOutlinedInput-root": { fontSize: { xs: "11px", sm: "13px" }, height: 44 } }}
                                        />
                                    )}
                                />
                            </Box>

                            {/* Salesperson */}
                            <Box >
                                <Controller
                                    name="salesperson"
                                    control={control}
                                    render={({ field }) => (
                                        <CommonTextField
                                            {...field}
                                            {...inputProps}
                                            label="Salesperson"
                                            fullWidth
                                            size="small"
                                            mb={0}
                                            sx={{ "& .MuiOutlinedInput-root": { fontSize: { xs: "11px", sm: "13px" }, height: 44 } }}
                                        />
                                    )}
                                />
                            </Box>
                        </Box>
                    </Box>

                    {/* Subject - Full Width */}
                    <Box sx={{ width: "100%" }}>
                        <Controller
                            name="subject"
                            control={control}
                            render={({ field }) => (
                                <CommonDescriptionField
                                    {...field}
                                    label="Subject"
                                    fullWidth
                                    size="small"
                                    sx={{ "& .MuiOutlinedInput-root": { fontSize: { xs: "11px", sm: "13px" } } }}
                                />
                            )}
                        />
                    </Box>
                </Box>
                {/* Item Table */}
                <Typography variant="h6" sx={{ mb: 2 }}>Item Table</Typography>
                <TableContainer
                    sx={{
                        borderRadius: "4px",
                        overflowX: "auto",
                        border: "1px solid #eee",
                    }}
                >
                    <Table size="small">
                        {/* Table Head */}
                        <TableHead sx={{ bgcolor: "#F5F7FA" }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, width: 40, fontSize: 13 }}></TableCell>
                                <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>ITEM DETAILS</TableCell>
                                <TableCell sx={{ fontWeight: 600, width: 120, fontSize: 13 }}>QUANTITY</TableCell>
                                <TableCell sx={{ fontWeight: 600, width: 120, fontSize: 13 }}>RATE</TableCell>
                                <TableCell sx={{ fontWeight: 600, width: 140, fontSize: 13 }}>AMOUNT</TableCell>
                                <TableCell width={50}></TableCell>
                            </TableRow>
                        </TableHead>

                        {/* Table Body */}
                        <TableBody>
                            {fields.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    sx={{
                                        "&:hover": { bgcolor: "#FAFBFC" },
                                    }}
                                >
                                    <TableCell>⋮</TableCell>
                                    <TableCell>
                                        <Controller
                                            name={`items.${index}.item`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    onChange={(e) => handleItemChange(index, "item", e.target.value)}
                                                    placeholder="Type or click to select an item."
                                                    size="small"
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Controller
                                            name={`items.${index}.qty`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    type="number"
                                                    onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                                                    size="small"
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Controller
                                            name={`items.${index}.rate`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    type="number"
                                                    onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                                                    size="small"
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Controller
                                            name={`items.${index}.amount`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    disabled
                                                    size="small"
                                                    fullWidth
                                                    sx={{ "& .MuiInputBase-root": { backgroundColor: "#f5f5f5" } }}
                                                />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => remove(index)}
                                            disabled={fields.length === 1}
                                            size="small"
                                            color="error"
                                        >
                                            <CloseIcon sx={{ color: "error.main" }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>


                {/* Add New Row */}
                <CommonButton
                    startIcon={<AddIcon sx={{ color: 'primary.main' }} />}
                    label="Add New Row"
                    variant="text"
                    onClick={() => append({ item: "", qty: 1, rate: 0, amount: 0 })}
                    sx={{ mb: 1, mt: 1 }}
                />

                {/* Show GST details if data exists */}
                {invoiceData && (
                    <Box sx={{ mb: 3, p: 2, border: "1px solid #e0e0e0", borderRadius: 2, backgroundColor: "#f9f9f9" }}>
                        <Typography variant="subtitle1" mb={1} fontSize={15} fontWeight={600}>Tax Details</Typography>
                        <SummaryRow label="Sub Total" value={`Rs. ${invoiceData.sub_total?.toFixed(2) || "0.00"}`} fontSize={13} />
                        <SummaryRow label="CGST (9%)" value={`Rs. ${invoiceData.cgst?.Amt?.toFixed(2) || "0.00"}`} fontSize={13} />
                        <SummaryRow label="SGST (9%)" value={`Rs. ${invoiceData.sgst?.Amt?.toFixed(2) || "0.00"}`} fontSize={13} />
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1.5 }}>
                            <Typography fontSize={14} fontWeight={600}>Total Amount</Typography>
                            <Typography fontSize={14} fontWeight={600}>Rs. {invoiceData.amount?.toFixed(2) || "0.00"}</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" mt={1} fontSize={12}>
                            Payment Status: <strong>{invoiceData.status || "N/A"}</strong>
                        </Typography>
                    </Box>
                )}

                {/* Notes and Summary Section */}
                <Box sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 4,
                    mb: 4
                }}>
                    {/* Customer Notes & Terms */}
                    <Box sx={{ flex: 2 }}>
                        <Typography variant="h6" mb={1}>Customer Notes</Typography>
                        <Controller
                            name="notes"
                            control={control}
                            render={({ field }) => (
                                <CommonDescriptionField
                                    {...field}
                                    sx={{
                                        width: "100%",
                                        mb: 0,
                                        "& .MuiInputBase-root": { minHeight: 120 }
                                    }}
                                />
                            )}
                        />
                        <Typography fontSize={12} color="#888" mt={0.5}>
                            Will be displayed on the invoice
                        </Typography>

                        <Typography variant="h6" mt={4} mb={1}>Terms & Conditions</Typography>
                        <Controller
                            name="termsConditions"
                            control={control}
                            render={({ field }) => (
                                <CommonDescriptionField
                                    {...field}
                                    sx={{
                                        width: "100%",
                                        mb: 0,
                                        "& .MuiInputBase-root": { minHeight: 120 }
                                    }}
                                />
                            )}
                        />
                    </Box>

                    {/* Summary Section */}
                    <Box sx={{ flex: 1, minWidth: { xs: "100%", md: 300 } }}>
                        <Box sx={{
                            p: 3,
                            border: "1px solid #eee",
                            borderRadius: 2,
                            backgroundColor: "#fafafa"
                        }}>
                            <SummaryRow label="Sub Total" value={`Rs. ${subTotal.toFixed(2)}`} />
                            <SummaryRow label="Discount" value="0.00" />
                            <Divider sx={{ my: 2 }} />

                            <RadioGroup defaultValue="tds" sx={{ mb: 2 }}>
                                <FormControlLabel
                                    value="tds"
                                    control={<Radio size={isMobile ? "small" : "medium"} />}
                                    label={<Typography fontSize={14}>TDS</Typography>}
                                />
                                <FormControlLabel
                                    value="tcs"
                                    control={<Radio size={isMobile ? "small" : "medium"} />}
                                    label={<Typography fontSize={14}>TCS</Typography>}
                                />
                            </RadioGroup>

                            <Controller
                                name="tdsTcsSelect"
                                control={control}
                                render={({ field }) => <CommonSelect {...field} sx={{ width: "100%", mb: 3 }} />}
                            />

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="h6">Adjustment</Typography>
                                <Controller
                                    name="adjustment"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} size="small" sx={{ width: 120 }} type="number" />
                                    )}
                                />
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h5" gutterBottom>
                                Total Amount: Rs. {totalAmount.toFixed(2)}
                            </Typography>
                            <Typography variant="h6">
                                Total Quantity: {totalQty}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* File Upload - Show existing invoice if available */}
                <Typography variant="h6" mb={2}>Attach File(s) to Invoice</Typography>
                {invoiceData?.invoicePdfs && (
                    <Box sx={{ mb: 3, p: 2, border: "1px solid #4caf50", borderRadius: 2, backgroundColor: "#f1f8e9" }}>
                        <Typography variant="subtitle1" mb={1} color="#2e7d32">
                            Existing Invoice PDF:
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            href={invoiceData.invoicePdfs}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View Invoice PDF
                        </Button>
                    </Box>
                )}

                <Box
                    sx={{
                        border: "1px dashed #ddd",
                        borderRadius: 2,
                        p: 4,
                        textAlign: "center"
                    }}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        multiple
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <Button
                        variant="outlined"
                        startIcon={<UploadFileIcon />}
                        onClick={handleUploadClick}
                        sx={{ mb: 1 }}
                    >
                        Upload File
                    </Button>
                    <Typography fontSize={12} color="#777">
                        You can upload a maximum of 10 files, 10MB each.
                    </Typography>

                    {uploadedFiles.map((file, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                border: "1px solid #eee",
                                borderRadius: 1,
                                p: 1.5,
                                mt: 1
                            }}
                        >
                            <Typography fontSize={14} noWrap sx={{ maxWidth: "70%" }}>
                                {file.name}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography fontSize={12} color="#666">
                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </Typography>
                                <IconButton size="small" color="error" onClick={() => handleRemoveFile(index)}>
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* Payment Gateway */}
                <Box
                    sx={{
                        mt: 3,
                        p: 2,
                        border: "1px solid #eee",
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
                        gap: 1
                    }}
                >
                    <Typography fontSize={16}>Want to get paid faster?</Typography>
                    <Typography fontSize={15}>
                        Configure payment gateways and receive payments online.{" "}
                        <Box component="span" sx={{ color: "#2330e7", cursor: "pointer" }}>
                            Set up Payment Gateway
                        </Box>
                    </Typography>
                </Box>

                <Typography fontSize={13} color="#666" mt={2}>
                    <strong>Additional Fields:</strong> Settings → Sales → Invoices
                </Typography>
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    position: "sticky",
                    bottom: 0,
                    background: "#fff",
                    borderTop: "1px solid #eee",
                    px: { xs: 2, sm: 3 },
                    py: 2,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", sm: "center" },
                    gap: 2,
                    zIndex: 1000
                }}
            >
                <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "center", sm: "flex-start" } }}>
                    <Button variant="outlined" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                        {invoiceData ? "Update Invoice" : "Save Invoice"}
                    </Button>
                </Box>

                <Box sx={{ textAlign: { xs: "center", sm: "right" } }}>
                    <Typography fontWeight={500} fontSize={16}>
                        Total Amount: Rs. {totalAmount.toFixed(2)}
                    </Typography>
                    <Typography fontSize={14} color="#777">
                        Total Quantity: {totalQty}
                    </Typography>
                </Box>
            </Box>
        </>
    )
}