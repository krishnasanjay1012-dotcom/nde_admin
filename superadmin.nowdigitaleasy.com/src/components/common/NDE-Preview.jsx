import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import html2pdf from 'html2pdf.js';
import PdfViewerUI from './PdfViewerUI';

const CommonPreviewDrawer = ({
  open,
  onClose,
  fileName = "document.pdf",
  children,
  fileUrl: externalFileUrl,
  onPrint: externalOnPrint,
  enablePrint = true,
  enableDownload = true,
  enableDrive = true,
  enableSidebar = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [fileUrl, setFileUrl] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [renderedPagesCount, setRenderedPagesCount] = useState(0);
  const [isPrintReady, setIsPrintReady] = useState(false);
  const [docProps, setDocProps] = useState(null);

  const [currentZoom, setCurrentZoom] = useState(100);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile && !isTablet);
  const [viewMode, setViewMode] = useState("single"); 
  const [pageInputValue, setPageInputValue] = useState("1");
  const [pageInputFocused, setPageInputFocused] = useState(false);

  const [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const [docPropsOpen, setDocPropsOpen] = useState(false);
  const [driveDialogOpen, setDriveDialogOpen] = useState(false);
  const [driveAccount, setDriveAccount] = useState({
    name: "John Doe",
    email: "john.doe@gmail.com",
    picture: "",
  });
  const [driveUploading, setDriveUploading] = useState(false);
  const [driveSnackbar, setDriveSnackbar] = useState(null);

  const scrollContainerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (externalFileUrl) {
      setFileUrl(externalFileUrl);
      return;
    }

    if (open && contentRef.current) {
      const waitAndGenerate = async () => {
        try {
          const opt = {
            margin: 0,
            filename: fileName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };
                    
          const blob = await html2pdf().set(opt).from(contentRef.current).output('blob');
          const url = URL.createObjectURL(blob);
          
          setFileUrl((oldUrl) => {
            if (oldUrl && oldUrl.startsWith('blob:')) URL.revokeObjectURL(oldUrl);
            return url;
          });
        } catch (error) {
          console.error("PDF preview generation failed:", error);
        }
      };
      
      waitAndGenerate();
    }

    return () => {
    
    };
  }, [open, externalFileUrl, fileName, children]);

  useEffect(() => {
    return () => {
      setFileUrl((oldUrl) => {
        if (oldUrl && oldUrl.startsWith('blob:')) URL.revokeObjectURL(oldUrl);
        return null;
      });
    };
  }, []);

  const handlePageChange = useCallback((pageNum) => {
    const validPage = Math.max(1, Math.min(pageNum, pageCount));
    setActivePage(validPage);
    setPageInputValue(String(validPage));
    
    const container = scrollContainerRef.current;
    if (container) {
      const pageEl = container.querySelector(`[data-page-number="${validPage}"]`);
      if (pageEl) {
        pageEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [pageCount]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setPageCount(numPages);
    setActivePage(1);
    setRenderedPagesCount(0);
    setIsPrintReady(false);
    
    setDocProps({
      fileName: fileName,
      fileSize: "1.2 MB",
      title: "Invoice - " + fileName,
      author: "NDE System",
      subject: "Business Document",
      keywords: "invoice, billing, ndp",
      created: new Date().toLocaleString(),
      modified: new Date().toLocaleString(),
      application: "NDE Admin Panel",
      pdfProducer: "react-pdf-renderer",
      pdfVersion: "1.7",
      pageCount: numPages,
      pageSize: "210 x 297 mm (A4)",
      fastWebView: "No",
    });
  };

  const onPageRenderSuccess = () => {
    setRenderedPagesCount((prev) => {
      const next = prev + 1;
      if (next >= pageCount) setIsPrintReady(true);
      return next;
    });
  };

  const handleZoomIn = () => setCurrentZoom((prev) => Math.min(prev + 25, 500));
  const handleZoomOut = () => setCurrentZoom((prev) => Math.max(prev - 25, 25));
  const handleFitToPage = () => setCurrentZoom(100);
  const handleFitToWidth = () => setCurrentZoom(150);
  const handleRotate = () => setCurrentRotation((prev) => (prev + 90) % 360);

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      link.click();
    }
  };

  const handlePrint = () => {
    if (externalOnPrint) {
      externalOnPrint();
    } else {
      window.print();
    }
  };

  const handlePageInputFocus = () => setPageInputFocused(true);
  const handlePageInputBlur = () => {
    setPageInputFocused(false);
    setPageInputValue(String(activePage));
  };
  const handlePageInputChange = (e) => setPageInputValue(e.target.value);
  const handlePageInputKeyDown = (e) => {
    if (e.key === "Enter") {
      const num = parseInt(pageInputValue);
      if (!isNaN(num)) handlePageChange(num);
      e.target.blur();
    }
  };

  const handleThumbnailClick = (pageNum) => handlePageChange(pageNum);

  const handleMoreOpen = (e) => setMoreAnchorEl(e.currentTarget);
  const handleMoreClose = () => setMoreAnchorEl(null);

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "single" ? "book" : "single"));
    handleMoreClose();
  };

  const handleDocPropsOpen = () => {
    setDocPropsOpen(true);
    handleMoreClose();
  };

  const handleDriveOpen = () => setDriveDialogOpen(true);
  const handleDriveSave = () => {
    setDriveUploading(true);
    setTimeout(() => {
      setDriveUploading(false);
      setDriveDialogOpen(false);
      setDriveSnackbar({
        message: "Saved to Google Drive successfully",
        severity: "success",
      });
    }, 2000);
  };

  const scale = useMemo(() => currentZoom / 100, [currentZoom]);
  const sidebarWidth = 220;
  const thumbPageWidth = 120;
  const thumbBoxWidth = 140;


  return (
    <>
      <div style={{ position: "absolute", top: "-10000px", left: "-10000px", width: "210mm" }}>
        <div ref={contentRef}>
          {children}
        </div>
      </div>
      <PdfViewerUI
        fileUrl={fileUrl || externalFileUrl}
        fileName={fileName}
        open={open}
        onClose={onClose}
        activePage={activePage}
        pageCount={pageCount}
        currentZoom={currentZoom}
        currentRotation={currentRotation}
        scale={scale}
        isPrintReady={isPrintReady}
        renderedPagesCount={renderedPagesCount}
        sidebarOpen={sidebarOpen}
        viewMode={viewMode}
        pageInputValue={pageInputValue}
        pageInputFocused={pageInputFocused}
        moreOpen={Boolean(moreAnchorEl)}
        moreAnchorEl={moreAnchorEl}
        docPropsOpen={docPropsOpen}
        docProps={docProps}
        driveDialogOpen={driveDialogOpen}
        driveAccount={driveAccount}
        driveUploading={driveUploading}
        driveSnackbar={driveSnackbar}
        isMobile={isMobile}
        isTablet={isTablet}
        sidebarWidth={sidebarWidth}
        thumbPageWidth={thumbPageWidth}
        thumbBoxWidth={thumbBoxWidth}
        scrollContainerRef={scrollContainerRef}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        onPageChange={handlePageChange}
        onPageInputFocus={handlePageInputFocus}
        onPageInputBlur={handlePageInputBlur}
        onPageInputChange={handlePageInputChange}
        onPageInputKeyDown={handlePageInputKeyDown}
        onThumbnailClick={handleThumbnailClick}
        onDocumentLoadSuccess={onDocumentLoadSuccess}
        onPageRenderSuccess={onPageRenderSuccess}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitToPage={handleFitToPage}
        onFitToWidth={handleFitToWidth}
        onRotate={handleRotate}
        onDownload={handleDownload}
        onPrint={handlePrint}
        onDriveOpen={handleDriveOpen}
        onDriveSave={handleDriveSave}
        onSwitchAccount={() => {}}
        onDriveClose={() => setDriveDialogOpen(false)}
        onDriveSnackbarClose={() => setDriveSnackbar(null)}
        onMoreOpen={handleMoreOpen}
        onMoreClose={handleMoreClose}
        onToggleViewMode={toggleViewMode}
        onDocPropsOpen={handleDocPropsOpen}
        onDocPropsClose={() => setDocPropsOpen(false)}
        enablePrint={enablePrint}
        enableDownload={enableDownload}
        enableDrive={enableDrive}
        enableSidebar={enableSidebar}
      />
    </>
  );
};

export default CommonPreviewDrawer;
