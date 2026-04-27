import {
    Popover,
    IconButton,
    Typography,
    Box,
    Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { useNavigate, useSearchParams } from "react-router-dom";

const BillDetailsPopover = ({ anchorEl, open, onClose, data }) => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleBillClick = (id) => {
        navigate(
            `/purchased/bills/details/${id}?${searchParams.toString()}`
        );
    };
    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center"
            }}
            PaperProps={{
                sx: {
                    width: 400,
                    borderRadius: 2,
                    boxShadow: 3,
                    mt: 1.5,
                    position: "relative",
                    overflow: "visible",
                    border: "1px solid #eee",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: -8,
                        left: "50%",
                        transform: "translateX(-50%) rotate(45deg)",
                        width: 16,
                        height: 16,
                        bgcolor: "background.paper",
                        boxShadow: 0,
                        transformOrigin: "center",
                        zIndex: 0,
                        borderTop: "1px solid #eee",
                        borderLeft: "1px solid #eee",

                    }
                }
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    py: 1.5,
                    borderBottom: "1px solid #eee"
                }}
            >
                <Typography fontSize={16}>
                    {data?.formattedDate
                        ? dayjs(data.formattedDate, "M/D/YYYY").format("MMMM D, YYYY")
                        : "Date"}
                </Typography>

                <IconButton size="small" onClick={onClose} color="error">
                    <CloseIcon fontSize="small" sx={{ color: 'error.main' }} />
                </IconButton>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "grey.1"
                }}
            >
                <Typography sx={{ width: "40%" }}>BILL DETAILS</Typography>
                <Typography sx={{ width: "30%", textAlign: "right" }}>AMOUNT</Typography>
                <Typography sx={{ width: "30%", textAlign: "right" }}>BALANCE</Typography>
            </Box>

            <Divider />

            {/* Bill List */}
            <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                {data?.bills?.length > 0 ? (
                    data.bills.map((bill, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                px: 2,
                                py: 1.5,
                                borderBottom: "1px solid #eee"
                            }}
                        >
                            <Box sx={{ width: "40%" }}>
                                <Typography
                                    color="primary"
                                    fontWeight={500}
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => handleBillClick(bill._id)}
                                >
                                    {bill.billNo}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {bill.contactName}
                                </Typography>
                            </Box>

                            <Typography color="primary"
                                sx={{
                                    textAlign: "right",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    width: "20%",

                                }}
                                onClick={() => handleBillClick(bill._id)}>
                                {bill.formattedTotalAmount}
                            </Typography>

                            <Typography sx={{
                                width: "20%", textAlign: "right",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",

                            }}>
                                {bill.formattedBalance}
                            </Typography>
                        </Box>
                    ))
                ) : (
                    <Typography align="center" sx={{ py: 3 }}>
                        No Data
                    </Typography>
                )}
            </Box>
        </Popover>
    );
};

export default BillDetailsPopover;