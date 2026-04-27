import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Popover,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReusableTable from "../common/Table/ReusableTable";
import CommonButton from "../common/NDE-Button";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { CommonTextField } from "../common/fields";
import CustomerWriteOff from "./Customer-WriteOff";
import { useDeleteWriteOff, useOpeningBalance, useSetOpeningBalance } from "../../hooks/Customer/Customer-hooks";
import { useParams } from "react-router-dom";

const CustomerReceivables = ({ workspaceId }) => {
    const { customerId } = useParams();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [balance, setBalance] = useState("");
    const [openWriteOff, setOpenWriteOff] = useState(false);

    const { data } = useOpeningBalance(workspaceId);
    const { mutateAsync: addOpeningBalance } = useSetOpeningBalance();
    const { mutateAsync: deleteWriteOff } = useDeleteWriteOff();


    const columns = [
        {
            accessorKey: "currency.code",
            header: "Currency",
        },
        {
            accessorKey: "overallOutstanding",
            header: "Outstanding Receivables",
            cell: (info) =>
                `${data?.currency?.symbol || "₹"} ${info.getValue() || 0.00}`,
        },
        {
            accessorKey: "unusedCredits",
            header: "Unused Credits",
            cell: (info) => `${data?.currency?.symbol || "₹"} ${info.getValue() || 0.00}`,
        },
    ];

    useEffect(() => {
        if (data) {
            setBalance(data?.overallOpeningBalance === 0 ? "" : data?.overallOpeningBalance);
        }
    }, [data]);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setIsEdit(!balance);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setIsEdit(false);
        setBalance(data?.overallOpeningBalance === 0 ? "" : data?.overallOpeningBalance);
    };

    const open = Boolean(anchorEl);

    const handleSave = () => {
        const payload = {
            workspaceId: workspaceId,
            amount: Number(balance) || 0,
            userId: customerId,
        };
        addOpeningBalance(payload,
            {
                onSuccess: () => {
                    handleClose();
                },
            }
        );
    };

    const handleDelete = () => {
        deleteWriteOff(workspaceId, {
            onSuccess: () => {
                handleClose();
            },
        });
    };

    return (
        <Box>
            <Typography variant="h6" mb={1}>
                Receivables
            </Typography>
            <ReusableTable
                columns={columns}
                data={data ? [data] : []}
                maxHeight="calc(100vh - 180px)"
            />

            <Typography
                sx={{ mt: 1, color: "primary.main", cursor: "pointer", }}
                onClick={handleOpen}
            >
                {balance ? "View Opening Balance" : "Enter Opening Balance"}
            </Typography>

            {/* Popover */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                sx={{ zIndex: 1200 }}
                PaperProps={{
                    sx: {
                        overflow: "visible",
                        mt: 1,
                        "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            left: 44,
                            width: 10,
                            height: 10,
                            bgcolor: "grey.100",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                            borderTop: "1px solid",
                            borderLeft: "1px solid",
                            borderColor: "divider",
                        },
                    },
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <Box
                    sx={{
                        width: 420,
                        borderRadius: 1.5,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    {/* Header */}
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        px={2}
                        py={1}
                        sx={{
                            bgcolor: "grey.100",
                            borderBottom: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <Typography fontWeight={500} fontSize={16}>
                            {isEdit ? "Edit Opening Balance" : "Opening Balance"}
                        </Typography>

                        <Box display="flex" alignItems="center" gap={0.5}>
                            {!isEdit && (
                                <IconButton size="small" onClick={() => setIsEdit(true)}>
                                    <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                            )}
                            <IconButton size="small" onClick={handleClose} color="error">
                                <CloseIcon fontSize="small" sx={{ color: 'error.main' }} />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Body */}
                    <Box px={2} py={2}>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                        >
                            <Typography color="text.secondary">
                                Opening Balance
                            </Typography>

                            {isEdit ? (
                                <CommonTextField
                                    value={balance}
                                    onChange={(e) => setBalance(e.target.value)}
                                    inputProps={{ min: 0 }}
                                    placeholder="Enter amount"
                                    width="140px"
                                    height={36}
                                    type="number"
                                />
                            ) : (
                                <Typography fontWeight={500} color="text.secondary">
                                    {data?.currency?.symbol || "₹"} {balance}
                                </Typography>
                            )}
                        </Box>

                        {!data?.overallOpeningBalance == 0 && (
                            <Box
                                display="flex"
                                alignItems="center"
                                pt={1}
                                borderTop="1px dashed"
                                borderColor="divider"
                            >
                                <Typography color="text.secondary">
                                    Outstanding Opening Balance
                                </Typography>

                                <Box display="flex" alignItems="center" gap={2} ml="auto">
                                    <Typography fontWeight={600} color="text.secondary">
                                        {data?.currency?.symbol || "₹"} {balance}
                                    </Typography>

                                    {!isEdit && balance > 0 && (
                                        data?.isWriteOff === true ? (
                                            <Typography
                                                fontWeight={500}
                                                color="error"
                                                sx={{ cursor: "pointer" }}
                                                onClick={handleDelete}
                                            >
                                                Cancel Write Off
                                            </Typography>
                                        ) : (
                                            <Typography
                                                fontWeight={500}
                                                color="primary"
                                                sx={{ cursor: "pointer" }}
                                                onClick={() => setOpenWriteOff(true)}
                                            >
                                                Write Off
                                            </Typography>
                                        )
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Box>

                    {isEdit && (
                        <Box
                            px={2}
                            py={1}
                            display="flex"
                            justifyContent="flex-start"
                            gap={1}
                            sx={{
                                bgcolor: "grey.50",
                                borderTop: "1px solid",
                                borderColor: "divider",
                            }}
                        >
                            <CommonButton
                                variant="contained"
                                size="small"
                                onClick={handleSave}
                                label="Save"
                                startIcon
                            />
                            <CommonButton
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                    if (!data?.overallOpeningBalance) {
                                        handleClose();
                                    } else {
                                        setIsEdit(false);
                                        setBalance(data.overallOpeningBalance);
                                    }
                                }}
                                label="Cancel"
                                startIcon
                            />
                        </Box>
                    )}
                </Box>
            </Popover>

            <CustomerWriteOff
                open={openWriteOff}
                onClose={() => setOpenWriteOff(false)}
                handleClose={handleClose}
                workspaceId={workspaceId}
            />
        </Box>
    );
};

export default CustomerReceivables;