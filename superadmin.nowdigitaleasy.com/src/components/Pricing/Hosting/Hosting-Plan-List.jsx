import {
    Box,
    Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/Add";
import CommonButton from "../../common/NDE-Button";

const PlansSection = ({
    selectedHosting,
    handleEdit,
    setOpenPricingDrawer,
}) => {
    const recurringCurrencies =
        selectedHosting?.pricing?.recurring?.currency || [];

    const activePrice =
        recurringCurrencies.find(
            (c) => c.oneTimeMonthly?.enable && c.oneTimeMonthly?.price > 0
        )?.oneTimeMonthly;

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                PLANS
            </Typography>

            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1.5,
                    backgroundColor: "#F1F2FD",
                    borderRadius: "8px 8px 0 0",
                    border: "1px solid #E0E0E0",
                    fontWeight: 600,
                }}
            >
                <Typography>Plan Details</Typography>
                <Typography>Price</Typography>
            </Box>

            {selectedHosting ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 3,
                        p: 3,
                        border: "1px solid #C7CCFF",
                        borderTop: "none",
                        borderRadius: "0 0 12px 12px",
                    }}
                >
                    {/* LEFT */}
                    <Box sx={{ maxWidth: "70%" }}>
                        <Typography variant="h6" fontWeight={600}>
                            {selectedHosting.productName}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            HSN Code: {selectedHosting.hsnCode}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{ mt: 1 }}
                            dangerouslySetInnerHTML={{
                                __html:
                                    selectedHosting?.details?.Description ||
                                    "No description available",
                            }}
                        />

                        <Typography
                            variant="body2"
                            sx={{ mt: 1.5, color: "primary.main", fontWeight: 500 }}
                        >
                            <Box component="span" sx={{ display: "inline-flex", gap: 0.5 }}>
                                <span
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleEdit(selectedHosting)}
                                >
                                    Edit Plan
                                </span>
                                <span>|</span>
                                <span
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setOpenPricingDrawer(true)}
                                >
                                    Edit Price
                                </span>
                                <span>|</span>
                                <span
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setOpenPricingDrawer(true)}
                                >
                                    Delete
                                </span>
                                <span>|</span>
                                <span
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setOpenPricingDrawer(true)}
                                >
                                    Clone Server
                                </span>
                            </Box>
                        </Typography>

                    </Box>

                    {/* RIGHT */}
                    <Box sx={{ textAlign: "right", minWidth: 200 }}>
                        {activePrice ? (
                            <>
                                <Typography variant="h6" fontWeight={600}>
                                    ₹{activePrice.price}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    per month
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 0.5 }}
                                >
                                    ₹{activePrice.setUpFee || 0} setup fee
                                </Typography>
                            </>
                        ) : (
                            <CommonButton
                                label="Add Pricing"
                                variant="contained"
                                startIcon={<AddRoundedIcon sx={{ color: '#FFF' }} />}
                                onClick={() => setOpenPricingDrawer(true)}
                                sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    textTransform: "none",
                                }}
                            />
                        )}
                    </Box>
                </Box>
            ) : (
                <Box
                    sx={{
                        border: "1px solid #E0E0E0",
                        borderTop: "none",
                        p: 5,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h6">
                        No plans found for this product.
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default PlansSection;

