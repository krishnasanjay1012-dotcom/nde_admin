
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/Upload";
import CommentIcon from "@mui/icons-material/Comment";
import PrintIcon from "@mui/icons-material/Print";

import InvoiceActionToolbar from "../../../Sales/Invoices/InvoiceActionToolbar";
import { Grid } from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PaymentIcon from "@mui/icons-material/Payment";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import Edit from "../../../../assets/icons/edit.svg";
import PaymentReceipt from "./PaymentReceipt";
import { useDeletePayment, useOpenPayment, usePaymentDetailsById } from "../../../../hooks/payment/payment-hooks";
import FlowerLoader from "../../../common/NDE-loader";
import { useRef, useState } from "react";
import CommonDeleteModal from "../../../common/NDE-DeleteModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import MailIcon from "@mui/icons-material/Mail";
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import html2pdf from 'html2pdf.js';
import PaymentVoidUnvoid from "./Payment-Void-Unvoid";
import NDEPrint from "../../../common/NDE-Print";
import Journal from "../../../Journal/Journal";
import PaymentStatusBox from "./PaymentStatusBox";
import PaymentRefunds from "./PaymentRefunds";
import { useRefundList } from "../../../../hooks/payment/refund-hooks";

const PaymentDetailsPanel = ({
  customer,
  onSend,
  onPdfPrint,
  onRefund,
  onUploadClick,
  onCommentClick,
  onDeleteSuccess

}) => {

  const navigate = useNavigate();
  const [printOpen, setPrintOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "-";

  const { data, isLoading } = usePaymentDetailsById({ id: customer?._id });
  const paymentDetails = data?.data || []
  const { data: refundList, isLoading: isLoadingRefund } = useRefundList({ id: customer?._id, workspaceId: paymentDetails?.workspaceId?._id });
  const refundData = refundList?.data || [];
  const journalRef = useRef();
  const paymentRef = useRef();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [voidDrawerOpen, setVoidDrawerOpen] = useState(false);
  const [unvoidDrawerOpen, setUnvoidDrawerOpen] = useState(false);

  const { mutate: openPaymentMutate } = useOpenPayment();

  const handleOpenPayment = () => {
    openPaymentMutate(paymentDetails?._id);
  };


  const deletePaymentMutation = useDeletePayment();
  const handleVoid = () => setVoidDrawerOpen(true);
  const handleUnvoid = () => setUnvoidDrawerOpen(true);

  const handleDeleteClick = (customer) => {
    setDeleteTarget(customer);
    setDeleteModalOpen(true);
  };

  const handleEdit = () => {
    navigate(`/sales/payments/edit/${customer?._id}`);
  };

  const confirmDelete = () => {
    if (!deleteTarget?._id) return;

    deletePaymentMutation.mutate(
      { id: deleteTarget._id },
      {
        onSuccess: () => {
          setDeleteModalOpen(false);
          if (onDeleteSuccess) onDeleteSuccess(deleteTarget._id);
          setDeleteTarget(null);
        },
      }
    );
  };

  const handleDownloadPDF = () => {
    const element = paymentRef.current;

    const opt = {
      margin: 0.3,
      // filename: `${paymentDetails?.billNo || 'download'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(element).save();
  };
  const handlePrintShow = () => setPrintOpen(true);

  const handleViewJournal = () => {
    journalRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const actions = [
    {
      label: "Edit",
      icon: <img src={Edit} alt="Edit" style={{ width: 15 }} />,
      onClick: handleEdit,
    },
    {
      label: "Send",
      type: "menu",
      icon: <MailIcon />,
      items: [
        {
          label: "Email",
          icon: <MailIcon fontSize="small" />,
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
          onClick: handleDownloadPDF
        },
        {
          label: "Print",
          icon: <PrintIcon fontSize="small" />,
          onClick: handlePrintShow,
        },
      ],
    },
    ...(paymentDetails?.status === "void"
      ? [{
        label: "Convert to Draft",
        icon: <NoteAltIcon />,
        onClick: handleUnvoid,
      }]
      : []),

    ...(
      paymentDetails?.status !== "draft" && paymentDetails?.status !== "refunded"
        ? [
          {
            label: "Refund",
            icon: <PaymentIcon />,
            onClick: () => navigate(`paymentrefund?${searchParams.toString()}`),
          },
        ]
        : []
    ),

    ...(paymentDetails?.status === "draft"
      ? [{
        label: "Mark as Paid",
        icon: <CheckCircleOutlinedIcon />,
        onClick: handleOpenPayment,
      }]
      : []),
    {
      label: null,
      type: "menu",
      icon: <MoreHorizIcon sx={{ fontSize: "50px" }} />,
      items: [
        ...(paymentDetails?.status !== "paid" && paymentDetails?.status !== "void"
          ? [{
            label: "Void",
            onClick: handleVoid
          }]
          : []),
        {
          label: "View Journal",
          onClick: handleViewJournal
        },
        {
          label: "Delete",
          onClick: () => handleDeleteClick(customer),

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
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
          mb: -1.8,
        }}
      >
        <Typography variant="h4" sx={{ pl: 1 }}>
          {capitalize(customer?.user)}
        </Typography>

        <Grid
          container
          alignItems="center"
          justifyContent="flex-end"
          wrap="nowrap"

        >
          {/* Upload */}
          <Grid item>
            <Box
              onClick={onUploadClick}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                mr: 2,
              }}
            >
              <UploadIcon color="primary" sx={{ mr: 1 }} />
              <Typography>Upload files</Typography>
            </Box>
          </Grid>

          <Box
            onClick={onCommentClick}
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              mr: 1
            }}
          >
            <CommentIcon />
          </Box>

          <IconButton color="error" onClick={() => navigate("/sales/payments")} >
            <CloseIcon sx={{ color: 'error.main' }} />
          </IconButton>
        </Grid>
      </Box>

      <Box sx={{ mb: 1 }}>

        <InvoiceActionToolbar
          onSend={onSend}
          onPdfPrint={onPdfPrint}
          onRefund={onRefund}
          onDelete={handleDeleteClick}
          actions={actions}
        />
      </Box>

      <Box sx={{ overflow: "scroll", maxHeight: "calc(100vh - 170px)", p: 2 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 20 }}>
            <FlowerLoader size={25} />
          </Box>
        ) : (
          <>
            {paymentDetails?.status === "open" ? (
              <Box>
                <PaymentRefunds refunds={refundData} isLoading={isLoadingRefund} />
              </Box>
            ) : (
              <Box>
                {paymentDetails?.status === "draft" && (
                  <PaymentStatusBox
                    data={paymentDetails}
                    onCreateRecordPayment={() =>
                      paymentDetails?.status === "draft"
                        ? handleOpenPayment()
                        : navigate(`payment?${searchParams.toString()}`)
                    }
                  />
                )}
                {refundData?.length > 0 && (
                  <Box>
                    <PaymentRefunds refunds={refundData} isLoading={isLoadingRefund} />
                  </Box>
                )}
              </Box>
            )}

            <div ref={paymentRef}>
              <PaymentReceipt paymentDetails={paymentDetails} />
            </div>
            <div ref={journalRef}>
              <Journal journalId={paymentDetails?._id} />
            </div>
          </>
        )}
      </Box>

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deletePaymentMutation.isLoading}
        itemType={deleteTarget ? deleteTarget.clientName || "Payment" : "Payment"}
        title="Payment"
      />

      <PaymentVoidUnvoid
        open={voidDrawerOpen}
        onClose={() => setVoidDrawerOpen(false)}
        billId={paymentDetails?._id}
        type="void"
      />

      <PaymentVoidUnvoid
        open={unvoidDrawerOpen}
        onClose={() => setUnvoidDrawerOpen(false)}
        billId={paymentDetails?._id}
        type="unvoid"
      />
      <NDEPrint
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        title="Preview"
      // fileName={billData?.billNo}
      >
        <PaymentReceipt paymentDetails={paymentDetails} />
      </NDEPrint>

    </Box>
  );
};

export default PaymentDetailsPanel;
