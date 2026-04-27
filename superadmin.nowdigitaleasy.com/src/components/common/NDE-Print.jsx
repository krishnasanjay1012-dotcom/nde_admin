import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import CommonPreviewDrawer from "./NDE-Preview";


const NDEPrint = ({ 
  open, 
  onClose, 
  children, 
  title = "Print Preview", 
  fileName = "document.pdf" 
}) => {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: title,
  });

  return (
    <CommonPreviewDrawer
      open={open}
      onClose={onClose}
      title={title}
      fileName={fileName}
      onPrint={handlePrint}
    >
      <div ref={componentRef}>
        {children}
      </div>
    </CommonPreviewDrawer>
  );
};

export default NDEPrint;
