import { Box, Typography } from "@mui/material";

import SmsRoundedIcon from "@mui/icons-material/SmsRounded";
import ShareIcon from "@mui/icons-material/Share";
import AlarmIcon from "@mui/icons-material/Alarm";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PaymentIcon from "@mui/icons-material/Payment";
import DownloadIcon from "@mui/icons-material/Download";
import TodayIcon from "@mui/icons-material/Today";
import StickyNote2SharpIcon from "@mui/icons-material/StickyNote2Sharp";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CancelIcon from "@mui/icons-material/Cancel";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import ScreenShareOutlinedIcon from '@mui/icons-material/ScreenShareOutlined';
import PrintIcon from "@mui/icons-material/Print";

import Edit from "../../../assets/icons/edit.svg";
import ActionToolbar from "./InvoiceActionToolbar";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CustomerNameHeader from "./Components/CustomerNameHeader";
import InvoicePayment from "./Payment/InvoicePayment";
import { useNavigate, useParams } from "react-router-dom";
import { useCancelWriteOff, useDeleteInvoice } from "../../../hooks/sales/invoice-hooks";
import InvoicePreview from "../../common/data/InvoicePreview";
import html2pdf from "html2pdf.js";
import CreditsCard from "./Invoice-OverDuePayment";
import { useRef, useState } from "react";
import NDEPrint from "../../common/NDE-Print";
import Journal from './../../Journal/Journal';
import ShareLink from "../../ShareLink/ShareLink";
import ShareInvoice from "../../../pages/sales/invoice/ShareInvoice";
import CommonDeleteModal from "../../common/NDE-DeleteModal";

const InvoiceRightPanel = ({
  selectedCustomer,
  onSend,
  onReminders,
  onEdit,
  selectedInvoiceData,
  onCreateRecordPayment,
  onWriteOff,
  // onDebitNote,
  onVoid,
}) => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { mutateAsync } = useCancelWriteOff(invoiceId);
  const [printOpen, setPrintOpen] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const handleOpenShare = () => setOpenShare(true);
  const handleCloseShare = () => setOpenShare(false);
  const deleteMutation = useDeleteInvoice();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);


  const handleClone = () => navigate(`/sales/invoices/clone/${invoiceId}`);
  const invoiceRef = useRef();
  const journalRef = useRef();

  const handleDownloadPDF = () => {
    const element = invoiceRef.current;

    const opt = {
      margin: 0.3,
      filename: `${selectedCustomer?.invoiceNo || "download"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleViewInvoice = () => {
    journalRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(deleteTarget, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setDeleteTarget(null);
      },
    });
  };


  const handleCancelWriteOff = () => {
    mutateAsync({ invoiceId });
  };
  if (!selectedCustomer) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          borderRadius: "8px",
          ml: { md: 1 },
          p: 2,
        }}
      >
        <Typography sx={{ color: "#999", fontStyle: "italic" }}>
          No invoice selected
        </Typography>
      </Box>
    );
  }
  const isPaid = selectedInvoiceData?.data?.status?.toLowerCase() === "paid";
  // const isOverDued =
  //   selectedInvoiceData?.data?.status?.toLowerCase() === "overdue";

  const handlePrintShow = () => setPrintOpen(true);

  const isOverDued =
    selectedInvoiceData?.data?.status?.toLowerCase() !== "paid";

  const isVoid = selectedInvoiceData?.data?.status?.toLowerCase() === "void";
  const isWriteOff = selectedInvoiceData?.data?.writeOffAmount > 0;
  const actions = [
    {
      label: "Edit",
      icon: <img src={Edit} alt="Edit" style={{ width: 15 }} />,
      onClick: onEdit,
    },

    {
      label: "Send",
      type: "menu",
      icon: <MailOutlineIcon />,
      items: [
        {
          label: "Send Email",
          icon: <MailOutlineIcon fontSize="small" />,
          onClick: onSend,
        },
        {
          label: "Send SMS",
          icon: <SmsRoundedIcon fontSize="small" />,
          onClick: onSend,
        },
      ],
    },
    {
      label: "Share",
      icon: <ScreenShareOutlinedIcon />,
      onClick: handleOpenShare,
    },
    {
      label: "Reminders",
      type: "menu",
      icon: <AlarmIcon />,
      items: [
        {
          label: "1 Day Before",
          icon: <TodayIcon fontSize="small" />,
          onClick: onReminders,
        },
      ],
    },
    {
      label: "PDF / Print",
      type: "menu",
      icon: <PictureAsPdfIcon />,
      items: [
        {
          label: "Download PDF",
          icon: <DownloadIcon fontSize="small" />,
          onClick: handleDownloadPDF,
        },
        {
          label: "Print",
          icon: <PrintIcon fontSize="small" />,
          onClick: handlePrintShow,
        },
      ],
    },

    ...(!isPaid
      ? [
        {
          label: "Record Payment",
          type: "menu",
          icon: <PaymentIcon />,
          items: [
            {
              label: "RecordPayment",
              icon: <PaymentIcon fontSize="small" />,
              onClick: onCreateRecordPayment,
            },

            {
              label: "Write Off",
              icon: <StickyNote2SharpIcon fontSize="small" />,
              onClick: onWriteOff,
            },
          ],
        },
      ]
      : []),
    ...(isWriteOff
      ? [
        {
          label: "Cancel WritOff",
          icon: <CancelIcon />,
          onClick: handleCancelWriteOff,
        },
      ]
      : []),
    {
      label: null,
      type: "menu",
      icon: <MoreHorizIcon sx={{ ml: "10px" }} />,
      items: [
        { label: "View Journal", onClick: handleViewInvoice },
        {
          label: "Clone",
          onClick: handleClone,
        },
        ...(isOverDued && !isVoid
          ? [
            {
              label: "Void",
              onClick: onVoid,
            },
          ]
          : []),
        ...(isVoid
          ? [
            {
              label: "unvoid",
              icon: <NotInterestedIcon fontSize="small" />,
              onClick: onVoid,
            },
          ]
          : []),
        {
          label: "Delete",
          onClick: () => {
            setDeleteModalOpen(true);
            setDeleteTarget(invoiceId);
          },
        },
      ],
    },
  ];
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        height: "100%",
      }}
    >
      <CustomerNameHeader selectedCustomer={selectedCustomer} />

      <Box >
        <ActionToolbar actions={actions} />
      </Box>

      {/* Invoice Preview */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          minHeight: 0,
          mx: 1,
        }}
      >
        <Box mb={2} mt={2}>
          {isOverDued && (
            <CreditsCard
              onCreateRecordPayment={onCreateRecordPayment}
              selectedInvoiceData={selectedInvoiceData?.data}
            />
          )}
        </Box>

        {selectedInvoiceData?.data?.invoicePayments.length > 0 && (
          <Box>
            <InvoicePayment
              paymentData={selectedInvoiceData?.data?.invoicePayments ?? []}
            />
          </Box>
        )}

        <div ref={invoiceRef}>
          <InvoicePreview selectedInvoiceData={selectedInvoiceData} />
        </div>

        <div ref={journalRef}>
          <Journal journalId={invoiceId} />
        </div>
      </Box>
      <NDEPrint
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        title="Preview"
        fileName={selectedCustomer?.invoiceNo}
      >
        <InvoicePreview selectedInvoiceData={selectedInvoiceData} />
      </NDEPrint>

      <ShareInvoice open={openShare} onClose={handleCloseShare} worksapceid={selectedCustomer?.workspaceId} />
      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={`Invoice ${selectedCustomer?.invoiceNo}`}
        warningMessage="Invoice will be deleted and cannot be retrieved later. Are you sure about deleting it?"
      />
    </Box>
  );
};

export default InvoiceRightPanel;
