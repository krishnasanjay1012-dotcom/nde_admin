import { useNavigate, useOutletContext } from "react-router-dom";
import InvoiceRightPanel from "./InvoiceRightPanel";
import { useLocation } from "react-router-dom";

const InvoiceRightPanelWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    selectedCustomer,
    selectedInvoiceData,
    setDrawerOpen,
    handleBack,
    handleWriteOffOpen,
    handleDebitNote,
    handleVoidOpen,
  } = useOutletContext();

  if (!selectedCustomer) return null;

  return (
    <InvoiceRightPanel
      selectedCustomer={selectedCustomer}
      selectedInvoiceData={selectedInvoiceData}
      handleBack={handleBack}
      onEdit={() => navigate(`/sales/invoices/edit/${selectedCustomer._id}`)}
      onShare={() => alert("Share clicked")}
      onReminders={() => alert("Reminders clicked")}
      onRecordPayment={() => alert("Record Payment clicked")}
      onMore={() => alert("More clicked")}
      onCreateRecordPayment={() => navigate(`payment${location.search}`)}
      onPdfPrint={() =>
        window.open(selectedCustomer.orderId?.[0]?.invoicepdf, "_blank")
      }
      onOpenDrawer={() => setDrawerOpen(true)}
      onSend={() => navigate(`/sales/invoices/${selectedCustomer._id}/email`)}
      onWriteOff={handleWriteOffOpen}
      onDebitNote={handleDebitNote}
      onVoid={handleVoidOpen}
    />
  );
};

export default InvoiceRightPanelWrapper;
