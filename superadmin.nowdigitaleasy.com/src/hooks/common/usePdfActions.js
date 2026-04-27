import { useCallback } from "react";

/**
 * Custom hook to handle PDF download and printing logic.
 * @param {string} pdfUrl - The URL of the PDF to download or print.
 * @param {string} fileName - The default file name for download (default: 'document.pdf').
 * @returns {object} An object containing handleDownload and handlePrint functions.
 */
const usePdfActions = (pdfUrl, fileName = "document.pdf") => {
  const handleDownload = useCallback(async () => {
    if (!pdfUrl) return;

    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();

      const fileURL = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = fileName;
      link.click();

      window.URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  }, [pdfUrl, fileName]);

  const handlePrint = useCallback(async () => {
    if (!pdfUrl) return;

    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const fileURL = window.URL.createObjectURL(blob);

      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = fileURL;
      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        // Clean up after printing
        setTimeout(() => {
          window.URL.revokeObjectURL(fileURL);
          document.body.removeChild(iframe);
        }, 1000);
      };
    } catch (error) {
      console.error("Error printing PDF:", error);
    }
  }, [pdfUrl]);

  return { handleDownload, handlePrint };
};

export default usePdfActions;
