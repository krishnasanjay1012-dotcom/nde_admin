import { Box, Typography, Divider } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useAccountLedger } from "../../../hooks/account/account-hooks";
import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import ReusableTable from "../Table/ReusableTable";
import CustomPagination from "../Table/TablePagination";
import FlowerLoader from './../NDE-loader';

const AccountState = () => {
    const { accountId } = useParams();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data, isLoading } = useAccountLedger(accountId, {
        page,
        limit,
    });

    const account = data?.account;
    const accountData = data?.data;
    const tableData = data?.tableData;


    const columns = useMemo(
        () => [
            { accessorKey: "formattedDate", header: "Date" },
            { accessorKey: "description", header: "Description" },
            { accessorKey: "formattedReferenceType", header: "Type" },
            {
                accessorKey: "formattedDebit",
                header: "Debit",
                cell: ({ getValue }) => (
                    <span style={{ color: "#16a34a", fontWeight: 500 }}>
                        {getValue()}
                    </span>
                ),
            },
            {
                accessorKey: "formattedCredit",
                header: "Credit",
                cell: ({ getValue }) => (
                    <span style={{ color: "#dc2626", fontWeight: 500 }}>
                        {getValue()}
                    </span>
                ),
            },
            {
                accessorKey: "formattedRunningBalance",
                header: "Balance",
                cell: ({ getValue }) => <strong>{getValue()}</strong>,
            },
        ],
        []
    );

    const handlePageChange = (newPage) => {
        setPage(newPage + 1);
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    if (isLoading && !data) {
        return (
            <Box
                sx={{
                    width: "100%",
                    height: "60vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <FlowerLoader size={25} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",
                bgcolor: "background.muted",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Header Section */}
            <Box
                sx={{
                    px: 1,
                    py: { xs: 2, sm: 2 },
                }}
            >
                <Typography
                    variant="body1"

                    sx={{
                        fontSize: { xs: "12px", sm: "13px" },
                        fontWeight: 500,
                        mb: 2
                    }}
                >
                    CLOSING BALANCE
                </Typography>

                <Typography
                    sx={{
                        fontSize: { xs: "22px", sm: "26px", md: "28px" },
                        fontWeight: 600,
                        color: "primary.main",
                        mt: 0.5,
                    }}
                >
                    {account?.fomattedCurrentBalance}
                </Typography>

                <Typography
                    sx={{
                        mt: 1.5,
                        fontSize: { xs: "13px", sm: "14px" },
                        lineHeight: 1.6,
                        maxWidth: "900px",
                    }}
                >
                    <b>Description :</b> {account?.description || "--"}
                </Typography>
            </Box>

            {/* Divider */}
            <Divider
                sx={{
                    borderStyle: "dashed",
                    borderWidth: "1px",
                    borderColor: "primary.main",
                    opacity: 0.8
                }}
            />

            {accountData?.length > 0 ? (
                <Box sx={{ px: 1, py: 2 }}>
                    <ReusableTable
                        columns={columns}
                        data={accountData}
                        isLoading={isLoading}
                        maxHeight="calc(100vh - 260px)"
                    />

                    <CustomPagination
                        count={tableData?.total || 0}
                        page={page - 1}
                        rowsPerPage={limit}
                        onPageChange={(_, newPage) => handlePageChange(newPage)}
                        onRowsPerPageChange={(e) =>
                            handleLimitChange(Number(e.target.value))
                        }
                    />
                </Box>
            ) : (
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        py: 8,
                    }}
                >
                    <Box
                        sx={{
                            textAlign: "center",
                            maxWidth: "320px",
                            width: "100%",
                        }}
                    >
                        <Box
                            sx={{
                                width: { xs: 100, sm: 120 },
                                height: { xs: 100, sm: 120 },
                                borderRadius: "50%",
                                bgcolor: "#e5e7eb",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mx: "auto",
                            }}
                        >
                            <ReceiptLongIcon
                                sx={{
                                    fontSize: { xs: 40, sm: 50 },
                                    color: "#6b7280",
                                }}
                            />
                        </Box>

                        <Typography
                            sx={{
                                mt: 2,
                                fontSize: { xs: "14px", sm: "15px" },
                                color: "#6b7280",
                            }}
                        >
                            There are no transactions available
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default AccountState;