import React, { useRef } from 'react';
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Button,
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@mui/material';
import {
    QrCodeScanner,
    MoreVert,
    Close,
    Info,
    Receipt
} from '@mui/icons-material';
import AddIcon from "@mui/icons-material/Add";
import CommonButton from '../../../common/NDE-Button';
import { Controller } from 'react-hook-form';
import { CommonCheckbox, CommonDescriptionField, CommonSelect, CommonTextField } from '../../../common/fields/index';

const ItemTable = ({
    control,
    register,
    fields,
    append,
    watch,
    remove,
    setValue
}) => {
    const fileInputRef = useRef(null);
    const handleFileUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert("File size exceeds 10MB limit.");
                return;
            }
            setValue("files", file);
            console.log("File selected:", file);
        }
    };

    const handleAddnewrow = () => {
        append({
            itemid: '',
            itemname: '',
            itemdescription: '',
            quantity: 1.0,
            rate: 0.0,
            tax: '',
            amount: 0.0,
        })
    }
    return (
        <>
            <Box sx={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #e0e0e0', mb: '20px' }}>
                {/* Header */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '14px', marginLeft: '15px' }}>
                        Item Table
                    </Typography>
                </Box>

                {/* Table */}
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    overflow: 'hidden',
                }}>
                    {/* Header Row */}
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                            <th style={{
                                padding: '8px 10px',
                                textAlign: 'left',
                                fontWeight: 600,
                                fontSize: '11px',
                                color: 'black',
                                borderBottom: '1px solid #e0e0e0',
                                borderRight: '1px solid #e0e0e0',
                                borderTop: '1px solid #e0e0e0',
                                width: '35%'
                            }}>
                                ITEM DETAILS
                            </th>
                            <th style={{
                                padding: '8px 10px',
                                textAlign: 'center',
                                fontWeight: 600,
                                fontSize: '11px',
                                color: 'black',
                                borderBottom: '1px solid #e0e0e0',
                                borderTop: '1px solid #e0e0e0',
                                borderRight: '1px solid #e0e0e0',
                                width: '12%'
                            }}>
                                QUANTITY
                            </th>
                            <th style={{
                                padding: '8px 10px',
                                textAlign: 'center',
                                fontWeight: 600,
                                fontSize: '11px',
                                color: 'black',
                                borderBottom: '1px solid #e0e0e0',
                                borderRight: '1px solid #e0e0e0',
                                borderTop: '1px solid #e0e0e0',
                                width: '15%'
                            }}>
                                RATE
                            </th>
                            <th style={{
                                padding: '8px 10px',
                                textAlign: 'center',
                                fontWeight: 600,
                                fontSize: '11px',
                                color: 'black',
                                borderBottom: '1px solid #e0e0e0',
                                borderRight: '1px solid #e0e0e0',
                                borderTop: '1px solid #e0e0e0',
                                width: '20%'
                            }}>
                                TAX
                            </th>
                            <th style={{
                                padding: '8px 10px',
                                textAlign: 'right',
                                fontWeight: 600,
                                fontSize: '11px',
                                color: 'black',
                                borderBottom: '1px solid #e0e0e0',
                                borderRight: '1px solid #e0e0e0',
                                borderTop: '1px solid #e0e0e0',
                                width: '15%'
                            }}>
                                AMOUNT
                            </th>
                            <th style={{
                                padding: '8px 10px',
                                textAlign: 'center',
                                fontWeight: 600,
                                fontSize: '11px',
                                color: 'black',
                                borderBottom: '1px solid #e0e0e0',
                                borderTop: '1px solid #e0e0e0',
                                width: '3%'
                            }}>
                            </th>
                        </tr>
                    </thead>

                    {/* Data Row */}
                    <tbody>
                        {fields.map((field, ind) => (
                            <tr key={ind}>
                                {/* First column - Image + TextField */}
                                <td
                                    style={{
                                        padding: '16px',
                                        borderBottom: '1px solid #e0e0e0',
                                        borderRight: '1px solid #e0e0e0',
                                        verticalAlign: 'top'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                        {/* Image placeholder */}
                                        <Box
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                backgroundColor: '#f5f5f5',
                                                border: '2px dashed #ddd',
                                                borderRadius: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                margin: 'auto',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 20,
                                                    height: 16,
                                                    backgroundColor: '#ddd',
                                                    borderRadius: '2px',
                                                    position: 'relative'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        width: 8,
                                                        height: 6,
                                                        backgroundColor: '#bbb',
                                                        borderRadius: '50% 50% 0 0'
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                        <Controller
                                            control={control}
                                            {...register(`items.${ind}.itemname`)}
                                            value={watch(`items.${ind}.itemname`) || ''}
                                            render={({ field }) => (
                                                <CommonTextField
                                                    name={field.name}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    width="335px"
                                                    height="65px"
                                                    sx={{ mb: 0 }}
                                                />
                                            )}
                                        />
                                    </Box>
                                </td>

                                {/* Quantity */}
                                <td
                                    style={{
                                        padding: '16px',
                                        borderBottom: '1px solid #e0e0e0',
                                        borderRight: '1px solid #e0e0e0',
                                        textAlign: 'right'
                                    }}
                                >

                                    <Controller
                                        control={control}
                                        {...register(`items.${ind}.quantity`)}
                                        value={watch(`items.${ind}.quantity`) || ''}
                                        render={({ field }) => (
                                            <CommonTextField
                                                name={field.name}
                                                value={field.value}
                                                onChange={field.onChange}
                                                width="80px"
                                                // height="25px"
                                                sx={{ mb: 0 }}
                                            />
                                        )}
                                    />
                                </td>

                                {/* Rate */}
                                <td
                                    style={{
                                        padding: '16px',
                                        borderBottom: '1px solid #e0e0e0',
                                        borderRight: '1px solid #e0e0e0',
                                        textAlign: 'right'
                                    }}
                                >
                                    <Controller
                                        control={control}
                                        {...register(`items.${ind}.rate`)}
                                        value={watch(`items.${ind}.rate`) || ''}
                                        render={({ field }) => (
                                            <CommonTextField
                                                name={field.name}
                                                value={field.value}
                                                onChange={field.onChange}
                                                width="80px"
                                                // height="25px"
                                                sx={{ mb: 0 }}
                                            />
                                        )}
                                    />

                                </td>

                                {/* Tax select */}
                                <td
                                    style={{
                                        padding: '16px',
                                        borderBottom: '1px solid #e0e0e0',
                                        textAlign: 'right',
                                        borderRight: '1px solid #e0e0e0',
                                    }}
                                >
                                    <Controller
                                        control={control}
                                        {...register(`items.${ind}.tax`)}
                                        value={watch(`items.${ind}.tax`) || ''}
                                        render={({ field }) => (
                                            <CommonSelect
                                                name={field.name}
                                                value={field.value}
                                                onChange={field.onChange}
                                                width='170px'
                                                height='40px'
                                                sx={{ mb: 0 }}
                                                options={[
                                                    {
                                                        label: 'GST Value', value: 'gst_value'
                                                    },
                                                    {
                                                        label: 'TCS value', value: 'tcs value'
                                                    }
                                                ]}
                                            />
                                        )}
                                    />
                                </td>

                                {/* Amount */}
                                <td
                                    style={{
                                        padding: '16px',
                                        borderBottom: '1px solid #e0e0e0',
                                        textAlign: 'right',
                                        borderRight: '1px solid #e0e0e0',
                                    }}
                                >
                                    <Controller
                                        control={control}
                                        {...register(`items.${ind}.amount`)}
                                        value={watch(`items.${ind}.amount`) || ''}
                                        render={({ field }) => (
                                            <CommonTextField
                                                name={field.name}
                                                value={field.value}
                                                onChange={field.onChange}
                                                width="80px"
                                                // height="25px"
                                                sx={{ mb: 0 }}
                                            />
                                        )}
                                    />

                                </td>

                                {/* Delete button */}
                                <td
                                    style={{
                                        padding: '16px',
                                        borderBottom: '1px solid #e0e0e0',
                                        borderRight: '1px solid #e0e0e0',
                                        textAlign: 'center'
                                    }}
                                >
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            if (fields.length > 1) {
                                                remove(ind);
                                            }
                                        }}

                                        sx={{
                                            color: '#999',
                                            '&:hover': {
                                                backgroundColor: '#ffebee',
                                                color: '#f44336'
                                            }
                                        }}
                                    >
                                        <Close sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </Box>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '500px' }}>
                {/* Add New Row Button */}
                <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '200px', gap: '120px' }}>
                    <CommonButton
                        label="Add New Row"
                        onClick={handleAddnewrow}
                        startIcon={
                            <Box
                                sx={{
                                    backgroundColor: "#4285F4", // Blue circle
                                    borderRadius: "50%",
                                    width: 24,
                                    height: 24,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <AddIcon fontSize="small" sx={{ color: "white" }} />
                            </Box>
                        }
                        sx={{
                            borderRadius: "12px",
                            textTransform: "none",
                            bgcolor: "#f5f6fc",
                            color: "#000",
                            fontSize: "15px",
                            fontWeight: 500,
                            boxShadow: "none",
                            "&:hover": {
                                bgcolor: "#eceef9",
                            },
                        }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 400, color: '#000000' }}>Customer Notes</Typography>
                        <Controller
                            name='customernotes'
                            control={control}
                            render={({ field, fieldState }) => (

                                <CommonDescriptionField
                                    {...field}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    placeholder="Enter Customer Notes"
                                    width="415px"
                                    height={60}
                                    paddingTop='50px'
                                    sx={{ mb: 0 }}
                                />
                            )}
                        />
                    </div>
                </div>


                {/* Right Side Panel */}
                <div
                    style={{
                        width: "544px",
                        backgroundColor: "#f9f9fb",
                        borderRadius: "10px",
                        padding: "10px 15px",
                        gap: '20px'
                    }}
                >
                    {/* Sub Total */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "20px",
                        }}
                    >
                        <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#000000" }}>
                            Sub Total
                        </Typography>
                        <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#000000" }}>
                            0.00
                        </Typography>
                    </div>

                    {/* Discount */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "20px",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Typography
                                sx={{
                                    fontSize: "13px",
                                    fontWeight: 400,
                                    color: "#212529",
                                    minWidth: "200px",
                                }}
                            >
                                Discount
                            </Typography>
                            <Controller
                                name="discount"
                                control={control}
                                render={({ field }) => (
                                    <CommonTextField
                                        name={field.name}
                                        value={field.value}
                                        onChange={field.onChange}
                                        width="95px"
                                        height="30px"
                                        sx={{ mb: 0 }}
                                    />
                                )}
                            />
                        </div>
                        <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#000000" }}>
                            0.00
                        </Typography>
                    </div>

                    {/* Tax Section */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "20px",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <RadioGroup
                                row
                                {...register("taxType")}
                                defaultValue="TDS"
                                sx={{ display: "flex", gap: 1, minWidth: "200px" }}
                            >
                                {["TDS", "TCS"].map((type) => (
                                    <FormControlLabel
                                        key={type}
                                        sx={{ "& .MuiTypography-root": { fontSize: "13px" } }}
                                        value={type}
                                        control={<Radio />}
                                        label={type}
                                    />
                                ))}
                            </RadioGroup>

                            <Controller
                                name="taxvalue"
                                control={control}
                                render={({ field }) => (
                                    <CommonSelect
                                        name={field.name}
                                        value={field.value}
                                        onChange={field.onChange}
                                        width="155px"
                                        height="35px"
                                        sx={{ mb: 0 }}
                                        options={[
                                            { label: "Tds tax", value: "tdstax" },
                                            { label: "Tcs type", value: "tcstax" },
                                        ]}
                                    />
                                )}
                            />
                        </div>
                        <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#000000" }}>
                            0.00
                        </Typography>
                    </div>

                    {/* Adjustments */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: '15px'
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ minWidth: "200px" }}>
                                <div
                                    style={{
                                        border: "1px dashed #ddd",
                                        width: "125px",
                                        height: "32px",
                                        backgroundColor: "white",
                                        color: "#000000",
                                        fontSize: "13px",
                                        fontWeight: 400,
                                        padding: "5px",
                                        textAlign: "center",
                                    }}
                                >
                                    Adjustments
                                </div>
                            </div>

                            <Controller
                                name="adjustment"
                                control={control}
                                render={({ field }) => (
                                    <CommonTextField
                                        name={field.name}
                                        value={field.value}
                                        onChange={field.onChange}
                                        width="155px"
                                        height="35px"
                                        sx={{ mb: 0 }}
                                    />
                                )}
                            />
                        </div>
                        <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#000000" }}>
                            0.00
                        </Typography>
                    </div>

                    {/* Total */}
                    <div
                        style={{
                            minHeight: "28px",
                            paddingTop: "5px",
                            marginTop: "10px",
                            borderTop: "1px solid #ebeaf2",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: '20px'
                        }}
                    >
                        <Typography>Total</Typography>
                        <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#000000" }}>
                            0.00
                        </Typography>
                    </div>
                </div>
            </div>


            <div style={{ padding: '20px', backgroundColor: '#f9f9fb', width: '100%', marginTop: '15px', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', marginLeft: '-20px', marginRight: '-20px' }}>
                <div style={{ maxWidth: '1040px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: 400 }}>Terms & Conditions</Typography>
                        <Controller
                            name="termsandcondition"
                            control={control}
                            render={({ field, fieldState }) => (
                                <CommonDescriptionField
                                    {...field}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    placeholder="Enter your Terms & condition"
                                    width="685px"
                                    height={100}
                                />
                            )}
                        />

                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                        <Typography>Attach File(s) to Quote</Typography>
                        <Button
                            onClick={handleFileUpload}
                            style={{
                                height: "34px",
                                width: "auto",
                                display: "inline-block",
                                border: "1px dashed #d7d5e2",
                                borderRadius: "6px",
                                backgroundColor: "primary.contrastText",
                                padding: "0 10px",
                                cursor: "pointer",
                                marginTop: "10px",
                            }}
                        >
                            Upload File
                        </Button>
                        <input
                            name='files'
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />

                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Typography sx={{ fontSize: '13px', fontWeight: 400 }}>Select an online payment option to get paid faster</Typography>
                    <Controller
                        name="acceptTerms"
                        control={control}
                        render={({ field }) => (
                            <CommonCheckbox
                                label="Razorpay"
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                sx={{ mb: 0, border: '1px solid #ebeaf2', borderRadius: '6px', backgroundColor: '#fff', margin: '0 10px 10px 0' }}
                                width='120px'
                                height='40px'

                            />
                        )}
                    />
                </div>



            </div>



        </>

    );
};

export default ItemTable;