import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { useState } from 'react'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { format } from "date-fns";
import Edit from "../../../../assets/icons/edit.svg";
import Delete from "../../../../assets/icons/delete.svg";
import { IconButton } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CommonDeleteModal from '../../../common/NDE-DeleteModal';
import { useDeleteRefund } from '../../../../hooks/payment/refund-hooks';
import ReusableTable from '../../../common/Table/ReusableTable';

const PaymentRefunds = ({isLoading, refunds}) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedRefund, setSelectedRefund] = useState(null);
    const deleteRefundMutation = useDeleteRefund();

    const handleEdit = (refund) => {
        navigate(`paymentrefund?refundId=${refund._id}&${searchParams.toString()}`);
    };

    const handleDelete = (refund) => {
        setSelectedRefund(refund);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedRefund?._id) {
            deleteRefundMutation.mutate(selectedRefund._id, {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setSelectedRefund(null);
                }
            });
        }
    };

    const columns = [
        {
            accessorKey: "refundNo",
            header: "Refund No",
            cell: ({ row }) => row.original.refundNo || "-",
        },
        {
            accessorKey: "refunded_at",
            header: "Date",
            cell: ({ row }) => row.original.refunded_at ? format(new Date(row.original.refunded_at), "dd/MM/yyyy") : "-",
        },
        {
            accessorKey: "amount",
            header: "Refund Amount",
            cell: ({ row }) => `₹${row.original.amount?.toLocaleString() || 0}`,
        },
        {
            accessorKey: "payment_mode",
            header: "Payment Mode",
            cell: ({ row }) => {
                const mode = row.original.payment_mode;
                return (typeof mode === "object" && mode !== null) ? (mode.name || mode.code || "-") : (mode || "-");
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Typography
                    sx={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "success.main",
                        textTransform: "capitalize",
                    }}
                >
                    Refunded
                </Typography>
            ),
        },
        {
            accessorKey: "action",
            header: "Action",
            cell: ({ row }) => (
                <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton onClick={() => handleEdit(row.original)} size="small">
                        <img src={Edit} style={{ width: 15 }} alt="edit" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row.original)} size="small">
                        <img src={Delete} style={{ width: 18 }} alt="delete" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const accordionData = [
        {
            title: "Refund History",
            content: (
                <ReusableTable
                    columns={columns}
                    data={refunds}
                    isLoading={isLoading}
                    maxHeight="300px"
                />
            ),
        },
    ];

    const [expandedPanel, setExpandedPanel] = useState([0]);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpandedPanel((prev) =>
            isExpanded ? [...prev, panel] : prev.filter((p) => p !== panel)
        );
    };

    if (!refunds || refunds.length === 0) return null;

    return (
        <Box mb={2}>
            {accordionData.map((item, index) => {
                const isExpanded = expandedPanel.includes(index);

                return (
                    <Accordion
                        key={index}
                        expanded={isExpanded}
                        onChange={handleChange(index)}
                        disableGutters
                        elevation={0}
                        sx={{
                            border: "1px solid #E9EDF5",
                            borderRadius: "6px",
                            mb: 1,
                            overflow: "hidden",
                            "&::before": { display: "none" },
                            "&.Mui-expanded": {
                                borderRadius: "6px",
                                margin: 0,
                                mb: 2,
                            },
                        }}
                    >
                        <AccordionSummary
                            sx={{
                                px: 2,
                                borderBottom: isExpanded ? "1px solid #E9EDF5" : "none",
                                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : '#f9f9fb',
                                "& .MuiAccordionSummary-content": {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    margin: 0,
                                },
                            }}
                        >
                            <ExpandMoreIcon
                                sx={{
                                    fontSize: 20,
                                    transition: "all 0.25s ease",
                                    transform: isExpanded ? "rotate(180deg)" : "rotate(-90deg)",
                                    color: isExpanded ? "primary.main" : "#98A2B3",
                                }}
                            />
                            <Typography fontSize={14} fontWeight={500}>
                                {item.title}
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails sx={{ p:0 }}>
                            {item.content}
                        </AccordionDetails>
                    </Accordion>
                );
            })}

            <CommonDeleteModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirmDelete={confirmDelete}
                deleting={deleteRefundMutation.isPending}
                title="Refund"
            />
        </Box>
    )
}

export default PaymentRefunds;
