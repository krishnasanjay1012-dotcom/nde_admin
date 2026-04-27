import { useState, useRef } from 'react';
import { Box } from '@mui/material';
import BillTemplate from './BillTemplate';
import {
    useBillPayments,
    useGetBillsInfo,
    useOpenBill,
} from '../../../hooks/purchased/bills-hooks';
import ActionToolbar from '../../Sales/Invoices/InvoiceActionToolbar';
import Edit from "../../../assets/icons/edit.svg";
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PrintIcon from "@mui/icons-material/Print";
import FlowerLoader from '../../common/NDE-loader';
import BillPayment from './BillPayment';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BillPaymentMade from './Bill-PaymentMade';
import PlayForWorkIcon from '@mui/icons-material/PlayForWork';

import html2pdf from 'html2pdf.js';
import BillVoidUnvoid from './Bill-Void-Unvoid';
import NDEPrint from '../../common/NDE-Print';
import Journal from '../../Journal/Journal';

const BillRightsidePanel = ({ selectedBill, handleDelete, handleEdit }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const journalRef = useRef(null);
    const billRef = useRef();

    const { data, isLoading } = useGetBillsInfo(selectedBill?._id);
    const billData = data?.data || [];

    const { data: billPaymentList, isLoading: isLoadingPayment } = useBillPayments(selectedBill?._id);
    const billpaymentData = billPaymentList?.data || [];


    const [voidDrawerOpen, setVoidDrawerOpen] = useState(false);
    const [unvoidDrawerOpen, setUnvoidDrawerOpen] = useState(false);

    const { mutate: openBillMutate } = useOpenBill();


    const [printOpen, setPrintOpen] = useState(false);

    const handleOpenBill = () => {
        openBillMutate(selectedBill?._id);
    };

    const handlePrintShow = () => setPrintOpen(true);


    const handleDownloadPDF = () => {
        const element = billRef.current;

        const opt = {
            margin: 0.3,
            filename: `${billData?.billNo || 'download'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        };

        html2pdf().set(opt).from(element).save();
    };

    const handleViewJournal = () => {
        journalRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const handleVoid = () => setVoidDrawerOpen(true);
    const handleUnvoid = () => setUnvoidDrawerOpen(true);


    const actions = [
        ...(billData?.status !== "void"
            ? [{
                label: "Edit",
                icon: <img src={Edit} alt="Edit" style={{ width: 15 }} />,
                onClick: handleEdit,
            }]
            : []),

        {
            label: "PDF / Print",
            type: "menu",
            icon: <PictureAsPdfIcon />,
            items: [
                {
                    label: "Download PDF",
                    icon: <DownloadIcon fontSize="small" />,
                    onClick: handleDownloadPDF
                },
                {
                    label: "Print",
                    icon: <PrintIcon fontSize="small" />,
                    onClick: handlePrintShow,
                },
            ],
        },
        ...(billData?.status === "draft"
            ? [{
                label: "Convert to Open",
                icon: <NoteAltIcon />,
                onClick: handleOpenBill,
            }]
            : []),

        ...(billData?.status !== "paid" && billData?.status !== "void"
            ? [{
                label: "Record Payment",
                icon: <PlayForWorkIcon />,
                onClick: () => navigate(`payment?${searchParams.toString()}`),
            }]
            : []),

        ...(billData?.status === "void"
            ? [{
                label: "Convert to Draft",
                icon: <NoteAltIcon />,
                onClick: handleUnvoid,
            }]
            : []),

        {
            label: null,
            type: "menu",
            icon: <MoreHorizIcon sx={{ ml: "10px" }} />,
            items: [
                ...(billData?.status !== "paid" && billData?.status !== "void" && billData?.status !== "partially_paid"
                    ? [{ label: "Void", onClick: handleVoid }]
                    : []),
                { label: "View Journal", onClick: handleViewJournal },

                ...(billpaymentData?.length === 0 && billData?.status === "paid"
                    ? [{ label: "Delete", onClick: () => handleDelete(selectedBill) }]
                    : []),
            ],
        },
    ];

    return (
        <Box>
            <Box sx={{ mb: 1 }}>
                <ActionToolbar actions={actions} />
            </Box>

            <Box sx={{ overflow: "scroll", maxHeight: "calc(100vh - 190px)", mx: 2 }}>
                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 20 }}>
                        <FlowerLoader size={25} />
                    </Box>
                ) : (
                    <>
                        {billData?.status === "paid" ? (
                            <BillPaymentMade billpaymentData={billpaymentData} isLoading={isLoadingPayment} />
                        ) : (
                            <Box>
                                {billData?.status !== "void" && (
                                    <BillPayment
                                        data={billData}
                                        onCreateRecordPayment={() =>
                                            billData?.status === "draft"
                                                ? handleOpenBill()
                                                : navigate(`payment?${searchParams.toString()}`)
                                        } />
                                )}
                                {billpaymentData?.length > 0 && (
                                    <Box mt={2}>
                                        <BillPaymentMade
                                            billpaymentData={billpaymentData}
                                            isLoading={isLoadingPayment}
                                        />
                                    </Box>
                                )}
                            </Box>
                        )}

                        <div ref={billRef}>
                            <BillTemplate billData={billData} />
                        </div>

                        <div ref={journalRef}>
                            <Journal journalId={billData?._id} />
                        </div>
                    </>
                )}
            </Box>

            <BillVoidUnvoid
                open={voidDrawerOpen}
                onClose={() => setVoidDrawerOpen(false)}
                billId={selectedBill?._id}
                type="void"
            />

            <BillVoidUnvoid
                open={unvoidDrawerOpen}
                onClose={() => setUnvoidDrawerOpen(false)}
                billId={selectedBill?._id}
                type="unvoid"
            />

            <NDEPrint
                open={printOpen}
                onClose={() => setPrintOpen(false)}
                title="Preview"
                fileName={billData?.billNo}
            >
                <BillTemplate billData={billData} />
            </NDEPrint>
        </Box>
    );
};

export default BillRightsidePanel;