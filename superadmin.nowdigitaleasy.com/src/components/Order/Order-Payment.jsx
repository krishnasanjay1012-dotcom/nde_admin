
import { Box, Typography } from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

const WalletPaymentCard = ({
    adminCart,
    walletPrice,
    userWallet,
    paymentSuccess,
    selectedCustomer
}) => {

    const customerName = selectedCustomer?.fullData?.name || "Customer";

    return (
        <>
            {paymentSuccess ? (
                /* ✅ Payment Success UI */
                <Box
                    sx={{
                        maxWidth: 520,
                        mx: "auto",
                        backgroundColor: "#e8f5e9",
                        borderRadius: 2,
                        p: { xs: 1.5, sm: 2 },
                        mt: 2,
                        textAlign: "center",
                        border: "1px solid #c8e6c9",
                    }}
                >
                    <Typography
                        sx={{
                            color: "#2e7d32",
                            fontWeight: 700,
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                    >
                        Payment Completed Successfully ✓
                    </Typography>
                </Box>
            ) : (
                /* 💳 Wallet Payment Card UI */
                <Box
                    sx={{
                        maxWidth: 520,
                        width: "100%",
                        mx: "auto",
                        borderRadius: 3,
                        overflow: "hidden",
                        border: "1px solid #7b7cff",
                        mt: 2
                    }}
                >
                    {/* Top Section */}
                    <Box
                        sx={{
                            p: { xs: 2, sm: 3 },
                            background:
                                "linear-gradient(135deg, #f6f3ff 0%, #fdeff4 100%)",
                        }}
                    >
                        {/* Header */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <AccountBalanceWalletOutlinedIcon
                                sx={{ fontSize: 22, color: "#4a4a4a" }}
                            />
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: 14, sm: 15 },
                                    color: "#444",
                                }}
                            >
                                {customerName} Wallet
                            </Typography>
                        </Box>

                        {/* Balance */}
                        <Box sx={{ textAlign: "center", mt: 3 }}>
                            <Typography
                                sx={{
                                    fontSize: { xs: 13, sm: 14 },
                                    color: "#6b6bff",
                                    mb: 0.5,
                                }}
                            >
                                Available Balance
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: { xs: 22, sm: 26 },
                                    fontWeight: 700,
                                    color: "#0b36ff",
                                }}
                            >
                                ₹ {customerName}.00
                            </Typography>
                        </Box>
                    </Box>

                    {/* Bottom Pay Bar */}
                    <Box
                        sx={{
                            px: { xs: 2, sm: 3 },
                            py: 1.8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background:
                                "linear-gradient(90deg, #0b36ff 0%, #e91e63 100%)",
                        }}
                    >
                        <Typography
                            sx={{
                                color: "#fff",
                                fontSize: { xs: 14, sm: 15 },
                                fontWeight: 500,
                            }}
                        >
                            Total Amount to Pay –
                        </Typography>
                        <Typography
                            sx={{
                                color: "#fff",
                                fontSize: { xs: 18, sm: 20 },
                                fontWeight: 700,
                            }}
                        >
                            ₹ {customerName}.00
                        </Typography>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default WalletPaymentCard;
