import React, { useState } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddressForm from "./NDE-AddressForm";

const AddressSection = ({ customerData, entity = "vendor", onSuccess }) => {
    const theme = useTheme();
    

    const billing = customerData?.billing_address_details;
    const shipping = customerData?.shipping_address_details;
    const [open, setOpen] = useState(false);
    const [editType, setEditType] = useState("");

    const isAddressEmpty = (address) => {
        if (!address) return true;

        return !(
            address.address ||
            address.city ||
            address.state ||
            address.pinCode ||
            address.country
        );
    };

    const renderAddress = (address) => (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
            }}
        >
            {address?.address && (
                <Typography
                    variant="body2"
                    sx={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "text.secondary",
                    }}
                >
                    {address.address}
                </Typography>
            )}

            {(address?.city || address?.state || address?.pinCode) && (
                <Typography
                    variant="body2"
                    sx={{
                        fontSize: 12,
                        color: "text.secondary",
                    }}
                >
                    {[address.city, address.state, address.pinCode]
                        .filter(Boolean)
                        .join(", ")}
                </Typography>
            )}

            {address?.country && (
                <Typography
                    variant="body2"
                    sx={{
                        fontSize: 12,
                        color: "text.secondary",
                    }}
                >
                    {address.country}
                </Typography>
            )}

            {address?.phone && (
                <Typography
                    variant="body2"
                    sx={{
                        fontSize: 12,
                        color: "text.secondary",
                    }}
                >
                    Phone:{" "}
                    <Box component="span" sx={{ fontWeight: 500, color: "text.primary" }}>
                        {address.phone}
                    </Box>
                </Typography>
            )}
        </Box>
    );

    const NewAddressText = (type) => (
        <Typography
            variant="body2"
            sx={{
                color: "primary.main",
                cursor: "pointer",
                fontWeight: 400,
                fontSize: 12
            }}
            onClick={() => {
                setEditType(type);
                setOpen(true);
            }}
        >
            New Address
        </Typography>
    );

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                bgcolor:
                    theme.palette.mode === "dark"
                        ? "background.muted"
                        : "#f9f9fb",
                gap: 6
            }}
        >
            <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 400 }}
                    >
                        BILLING ADDRESS
                    </Typography>
                    {!isAddressEmpty(billing) && (
                        <IconButton size="small" sx={{ ml: 0.5 }} onClick={() => {
                            setEditType("billing");
                            setOpen(true);
                        }}>
                            <EditOutlinedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    )}
                </Box>

                {!isAddressEmpty(billing)
                    ? renderAddress(billing)
                    : NewAddressText("billing")}
            </Box>

            <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 400 }}
                    >
                        SHIPPING ADDRESS
                    </Typography>
                    {!isAddressEmpty(shipping) && (
                        <IconButton size="small" sx={{ ml: 0.5 }} onClick={() => {
                            setEditType("shipping");
                            setOpen(true);
                        }}>
                            <EditOutlinedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    )}
                </Box>

                {!isAddressEmpty(shipping)
                    ? renderAddress(shipping)
                    : NewAddressText("shipping")}
            </Box>
            <AddressForm
                open={open}
                onClose={() => setOpen(false)}
                billingAddress={billing}
                shippingAddress={shipping}
                editType={editType}
                entityId={entity === "vendor" ? customerData?._id : customerData?.workspace?._id}
                entity={entity}
                onSuccess={onSuccess}
            />

        </Box>
    );
};

export default AddressSection;