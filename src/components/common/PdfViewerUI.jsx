import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Stack,
  CircularProgress,
  Drawer,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Avatar,
  InputBase,
} from "@mui/material";
import { Document, Page } from "react-pdf";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ViewSidebarOutlinedIcon from "@mui/icons-material/ViewSidebarOutlined";
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const CHROME_TOOLBAR_BG = "#3c4043";
const CHROME_TOOLBAR_HOVER = "rgba(255,255,255,0.12)";
const CHROME_TOOLBAR_ACTIVE = "rgba(255,255,255,0.18)";
const CHROME_SIDEBAR_BG = "#2d2d2d";
const CHROME_VIEWER_BG = "#525659";
const CHROME_INPUT_BG = "rgba(255,255,255,0.12)";
const CHROME_INPUT_BORDER = "rgba(255,255,255,0.22)";
const CHROME_INPUT_FOCUS = "rgba(138,180,248,0.8)";
const CHROME_ACCENT = "#8ab4f8";

const GoogleDriveIcon = ({ size = 20 }) => (
  <svg
    viewBox="0 0 87.3 78"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H.01c0 1.55.4 3.1 1.2 4.5z"
      fill="#0066da"
    />
    <path
      d="M43.65 25L29.9 1.2C28.55 2 27.4 3.1 26.6 4.5L1.2 48.5c-.8 1.4-1.2 2.95-1.2 4.5h27.5z"
      fill="#00ac47"
    />
    <path
      d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H60.1l5.85 11.5z"
      fill="#ea4335"
    />
    <path
      d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z"
      fill="#00832d"
    />
    <path
      d="M60.1 52.5H27.5L13.75 76.3c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
      fill="#2684fc"
    />
    <path
      d="M73.4 26.5l-12.6-21.8c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.45 27.5H87.2c0-1.55-.4-3.1-1.2-4.5z"
      fill="#ffba00"
    />
  </svg>
);

const ToolbarBtn = ({ title, onClick, disabled, children, active, sx = {} }) => (
  <Tooltip title={title} placement="bottom" arrow>
    <span>
      <IconButton
        onClick={onClick}
        disabled={disabled}
        size="small"
        sx={{
          color: disabled ? "rgba(255,255,255,0.28)" : "#e8eaed",
          borderRadius: "4px",
          p: "6px",
          transition: "background 0.15s",
          bgcolor: active ? CHROME_TOOLBAR_ACTIVE : "transparent",
          "&:hover": {
            bgcolor: disabled ? "transparent" : CHROME_TOOLBAR_HOVER,
          },
          ...sx,
        }}
      >
        {children}
      </IconButton>
    </span>
  </Tooltip>
);

const Sep = () => (
  <Box
    sx={{
      width: "1px",
      height: "20px",
      bgcolor: "rgba(255,255,255,0.18)",
      mx: 0.5,
      flexShrink: 0,
    }}
  />
);

const DocPropTable = ({ rows }) => (
  <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
    <tbody>
      {rows.map(({ label, value }) => (
        <Box component="tr" key={label} sx={{ verticalAlign: "top" }}>
          <Box
            component="td"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              fontSize: "13px",
              py: 0.75,
              pr: 3,
              whiteSpace: "nowrap",
              width: "140px",
            }}
          >
            {label}
          </Box>
          <Box
            component="td"
            sx={{
              color: "text.primary",
              fontSize: "13px",
              py: 0.75,
              wordBreak: "break-all",
            }}
          >
            {value}
          </Box>
        </Box>
      ))}
    </tbody>
  </Box>
);


const PdfViewerUI = ({
  // Identity
  fileUrl,
  fileName,
  // Drawer control
  open,
  onClose,
  // Page state
  activePage,
  pageCount,
  currentZoom,
  currentRotation,
  scale,
  isPrintReady,
  renderedPagesCount,
  // UI state
  sidebarOpen,
  viewMode,
  pageInputValue,
  pageInputFocused,
  moreOpen,
  moreAnchorEl,
  docPropsOpen,
  docProps,
  driveDialogOpen,
  driveAccount,
  driveUploading,
  driveSnackbar,
  // Responsiveness
  isMobile,
  isTablet,
  sidebarWidth,
  thumbPageWidth,
  thumbBoxWidth,
  // Refs
  scrollContainerRef,
  // Handlers
  onSidebarToggle,
  onPageChange,
  onPageInputFocus,
  onPageInputBlur,
  onPageInputChange,
  onPageInputKeyDown,
  onThumbnailClick,
  onDocumentLoadSuccess,
  onPageRenderSuccess,
  onZoomIn,
  onZoomOut,
  onFitToPage,
  onFitToWidth,
  onRotate,
  onDownload,
  onPrint,
  onDriveOpen,
  onDriveSave,
  onSwitchAccount,
  onDriveClose,
  onDriveSnackbarClose,
  onMoreOpen,
  onMoreClose,
  onToggleViewMode,
  onDocPropsOpen,
  onDocPropsClose,
  enablePrint,
  enableDownload,
  enableDrive,
  enableSidebar,
}) => {
  const thumbnailItems = Array.from({ length: pageCount }, (_, i) => {
    const pageNum = i + 1;
    const isActive = activePage === pageNum;
    return (
      <Box
        key={pageNum}
        onClick={() => onThumbnailClick(pageNum)}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          py: 0.75,
          width: "100%",
          // bgcolor: isActive ? "rgba(138,180,248,0.18)" : "transparent",
          transition: "background 0.15s",
          // "&:hover": {
          //   bgcolor: isActive
          //     ? "rgba(138,180,248,0.22)"
          //     : "rgba(255,255,255,0.07)",
          // },
        }}
      >
        <Box
          sx={{
            width: thumbBoxWidth,
            bgcolor: "#fff",
            border: isActive
              ? `2px solid ${CHROME_ACCENT}`
              : "1px solid rgba(255,255,255,0.12)",
            overflow: "hidden",
            boxShadow: isActive
              ? `0 0 0 2px rgba(138,180,248,0.35), 0 2px 8px rgba(0,0,0,0.55)`
              : "0 2px 6px rgba(0,0,0,0.5)",
            transition: "border-color 0.15s, box-shadow 0.15s",
            flexShrink: 0,
          }}
        >
          <Document file={fileUrl} loading={null}>
            <Page
              pageNumber={pageNum}
              rotate={currentRotation}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              renderForms={false}
              width={thumbPageWidth}
            />
          </Document>
        </Box>
        <Typography
          sx={{
            color: isActive ? CHROME_ACCENT : "rgba(255,255,255,0.5)",
            fontSize: isMobile ? "10px" : "11px",
            fontWeight: isActive ? 600 : 400,
            mt: 0.75,
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          {pageNum}
        </Typography>
      </Box>
    );
  });

  const renderPageRows = () => {
    if (!fileUrl) return null;
    const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
    const rows =
      viewMode === "book"
        ? pages.reduce((acc, curr, i) => {
          if (i % 2 === 0) acc.push([curr]);
          else acc[acc.length - 1].push(curr);
          return acc;
        }, [])
        : pages.map((p) => [p]);

    return rows.map((row, ri) => (
      <Box
        key={`row-${ri}`}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: viewMode === "book" ? "1px" : 0,
          mb: viewMode === "book" ? "24px" : "20px",
          flexShrink: 0,
          ...(viewMode === "book" && {
            boxShadow: "0 4px 18px rgba(0,0,0,0.65)",
          }),
        }}
      >
        {row.map((pageNum) => (
          <Box
            key={pageNum}
            className="pdf-page-wrapper"
            data-page-number={pageNum}
            sx={{
              bgcolor: "#fff",
              lineHeight: 0,
              flexShrink: 0,
              overflow: "hidden",
              borderRadius: viewMode === "book" ? 0 : "1px",
              boxShadow:
                viewMode === "book"
                  ? "none"
                  : "0 4px 18px rgba(0,0,0,0.65)",
            }}
          >
            <Page
              pageNumber={pageNum}
              scale={scale}
              rotate={currentRotation}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              renderForms={false}
              onRenderSuccess={onPageRenderSuccess}
            />
          </Box>
        ))}
      </Box>
    ));
  };

  return (
    <>
      <Drawer
        anchor="top"
        open={open}
        onClose={onClose}
        disableScrollLock
        sx={{
          "& .MuiDrawer-paper": {
            height: isMobile ? "100dvh" : isTablet ? "96vh" : "92vh",
            width: isMobile ? "100%" : isTablet ? "100%" : "80%",
            maxWidth: isMobile || isTablet ? "100%" : "1280px",
            margin: "auto",
            borderRadius: isMobile || isTablet ? 0 : "0 0 14px 14px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <AppBar
          position="static"
          className="print-hide"
          elevation={0}
          sx={{
            bgcolor: "#fff",
            color: "#000",
            boxShadow: "0 1px 0 #e0e0e0",
            flexShrink: 0,
          }}
        >
          <Toolbar
            sx={{
              minHeight: `${isMobile ? 48 : 56}px !important`,
              justifyContent: "space-between",
              px: isMobile ? 1.5 : 2.5,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: isMobile ? "15px" : "17px",
              }}
            >
              Preview
            </Typography>
            <Stack direction="row" spacing={isMobile ? 0.75 : 1}>
              {enablePrint && (
                <Button
                  variant="contained"
                  onClick={onPrint}
                  disabled={!isPrintReady}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    textTransform: "none",
                    fontSize: isMobile ? "12px" : "14px",
                    px: isMobile ? 1.5 : 2.5,
                    borderRadius: "6px",
                    boxShadow: "none",
                    "&:hover": { boxShadow: "none" },
                  }}
                >
                  {isPrintReady
                    ? "Print"
                    : null
                  }
                </Button>
              )}
              <Button
                variant="outlined"
                onClick={onClose}
                size={isMobile ? "small" : "medium"}
                sx={{
                  textTransform: "none",
                  fontSize: isMobile ? "12px" : "14px",
                  px: isMobile ? 1.5 : 2.5,
                  borderRadius: "6px",
                }}
              >
                Close
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <AppBar
          position="static"
          className="print-hide"
          elevation={0}
          sx={{
            bgcolor: CHROME_TOOLBAR_BG,
            boxShadow: "0 1px 0 rgba(0,0,0,0.45)",
            flexShrink: 0,
          }}
        >
          <Toolbar
            sx={{
              minHeight: `${isMobile ? 44 : 48}px !important`,
              px: isMobile ? "4px" : "8px",
              gap: 0,
              flexWrap: "nowrap",
              alignItems: "center",
            }}
          >
            {/* Sidebar toggle */}
            {enableSidebar && (
              <ToolbarBtn
                title={sidebarOpen ? "Hide thumbnails" : "Show thumbnails"}
                onClick={onSidebarToggle}
                active={sidebarOpen}
              >
                <ViewSidebarOutlinedIcon
                  sx={{ fontSize: isMobile ? "18px" : "20px", color: 'icon.light' }}
                />
              </ToolbarBtn>
            )}

            <Sep />

            {/* Filename */}
            <Typography
              sx={{
                color: 'icon.light',
                fontSize: isMobile ? "12px" : "13px",
                flexGrow: 1,
                minWidth: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                mx: isMobile ? 0.5 : 1,
                opacity: 0.88,
                userSelect: "none",
              }}
            >
              {fileName}
            </Typography>

            {!isMobile && (
              <>
                <Sep />
                <Stack direction="row" alignItems="center" sx={{ flexShrink: 0 }}>
                  <ToolbarBtn
                    title="Previous page"
                    onClick={() => onPageChange(activePage - 1)}
                    disabled={activePage <= 1}
                  >
                    <ChevronLeftIcon sx={{ fontSize: "20px", color: 'icon.light' }} />
                  </ToolbarBtn>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing="4px"
                    sx={{ mx: 0.5 }}
                  >
                    <InputBase
                      value={pageInputFocused ? pageInputValue : activePage}
                      onFocus={onPageInputFocus}
                      onBlur={onPageInputBlur}
                      onChange={onPageInputChange}
                      onKeyDown={onPageInputKeyDown}
                      inputProps={{
                        style: {
                          textAlign: "center",
                          padding: 0,
                          width: isTablet ? "28px" : "34px",
                          fontSize: isTablet ? "12px" : "13px",
                          color: "#e8eaed",
                          caretColor: CHROME_ACCENT,
                        },
                      }}
                      sx={{
                        bgcolor: CHROME_INPUT_BG,
                        border: `1px solid ${pageInputFocused ? CHROME_INPUT_FOCUS : CHROME_INPUT_BORDER}`,
                        borderRadius: "4px",
                        px: "7px",
                        height: "28px",
                        transition: "border-color 0.15s",
                        "&:hover": {
                          borderColor: pageInputFocused
                            ? CHROME_INPUT_FOCUS
                            : "rgba(255,255,255,0.38)",
                        },
                      }}
                    />
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: isTablet ? "12px" : "13px",
                        userSelect: "none",
                      }}
                    >
                      / {pageCount}
                    </Typography>
                  </Stack>

                  <ToolbarBtn
                    title="Next page"
                    onClick={() => onPageChange(activePage + 1)}
                    disabled={activePage >= pageCount}
                  >
                    <ChevronRightIcon sx={{ fontSize: "20px", color: 'icon.light' }} />
                  </ToolbarBtn>
                </Stack>
              </>
            )}

            <Sep />

            <Stack direction="row" alignItems="center" sx={{ flexShrink: 0 }}>
              <ToolbarBtn
                title="Zoom out"
                onClick={onZoomOut}
                disabled={currentZoom <= 25}
              >
                <ZoomOutIcon sx={{ fontSize: isMobile ? "18px" : "20px", color: 'icon.light' }} />
              </ToolbarBtn>
              {!isMobile && (
                <Box
                  sx={{
                    bgcolor: CHROME_INPUT_BG,
                    border: `1px solid ${CHROME_INPUT_BORDER}`,
                    borderRadius: "4px",
                    px: "8px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    mx: 0.5,
                    minWidth: isTablet ? "46px" : "54px",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#e8eaed",
                      fontSize: isTablet ? "12px" : "13px",
                      userSelect: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {currentZoom}%
                  </Typography>
                </Box>
              )}
              <ToolbarBtn
                title="Zoom in"
                onClick={onZoomIn}
                disabled={currentZoom >= 500}
              >
                <ZoomInIcon sx={{ fontSize: isMobile ? "18px" : "20px", color: 'icon.light' }} />
              </ToolbarBtn>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              sx={{ ml: "auto", flexShrink: 0 }}
            >
              {!isMobile && !isTablet && (
                <>
                  <Sep />
                  <ToolbarBtn title="Fit to page" onClick={onFitToPage}>
                    <FitScreenIcon sx={{ fontSize: "20px", color: 'icon.light' }} />
                  </ToolbarBtn>
                  <ToolbarBtn title="Fit to width" onClick={onFitToWidth}>
                    <ZoomOutMapIcon sx={{ fontSize: "20px", color: 'icon.light' }} />
                  </ToolbarBtn>
                  <ToolbarBtn title="Rotate clockwise" onClick={onRotate}>
                    <RotateRightIcon sx={{ fontSize: "20px", color: 'icon.light' }} />
                  </ToolbarBtn>
                </>
              )}

              <Sep />

              {enableDrive && (
                <ToolbarBtn
                  title="Save to Google Drive"
                  onClick={onDriveOpen}
                >
                  <GoogleDriveIcon size={isMobile ? 18 : 20} />
                </ToolbarBtn>
              )}
              {enableDownload && (
                <ToolbarBtn title="Download" onClick={onDownload}>
                  <DownloadIcon sx={{ fontSize: isMobile ? "18px" : "20px", color: 'icon.light' }} />
                </ToolbarBtn>
              )}
              {enablePrint && !isMobile && (
                <ToolbarBtn title="Print" onClick={onPrint}>
                  <PrintIcon sx={{ fontSize: "20px", color: 'icon.light' }} />
                </ToolbarBtn>
              )}
              <ToolbarBtn
                title="More options"
                onClick={onMoreOpen}
                active={moreOpen}
              >
                <MoreVertIcon sx={{ fontSize: isMobile ? "18px" : "20px", color: 'icon.light' }} />
              </ToolbarBtn>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box
          className="print-main-area"
          sx={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
            bgcolor: CHROME_VIEWER_BG,
          }}
        >
          {enableSidebar && (
            <Box
              className="print-hide cpdf-sidebar"
              sx={{
                width: sidebarOpen ? sidebarWidth : 0,
                bgcolor: CHROME_SIDEBAR_BG,
                borderRight: sidebarOpen
                  ? "1px solid rgba(255,255,255,0.07)"
                  : "none",
                overflowY: "auto",
                overflowX: "hidden",
                transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
                flexShrink: 0,
              }}
            >
              {sidebarOpen && (
                <Stack alignItems="center" spacing={0} sx={{ py: 1.5, px: 0.75 }}>
                  {thumbnailItems}
                </Stack>
              )}
            </Box>
          )}

          <Box
            ref={scrollContainerRef}
            className="print-pdf-area cpdf-scroll"
            sx={{
              flex: 1,
              overflow: "auto",
              bgcolor: CHROME_VIEWER_BG,
              display: "block",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: "max-content",
                width: "100%",
                py: viewMode === "book" ? "24px" : "20px",
                px: "20px",
                boxSizing: "border-box",
              }}
            >
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mt: 12,
                    }}
                  >
                  </Box>
                }
              >
                {renderPageRows()}
              </Document>
            </Box>
          </Box>
        </Box>
      </Drawer>

      <Menu
        anchorEl={moreAnchorEl}
        open={moreOpen}
        onClose={onMoreClose}
        PaperProps={{
          elevation: 10,
          sx: {
            bgcolor: "#3c4043",
            color: "#e8eaed",
            minWidth: 210,
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.1)",
            mt: 0.5,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {(isMobile || isTablet) &&
          [
            {
              icon: <RotateRightIcon fontSize="small" />,
              label: "Rotate clockwise",
              action: () => { onRotate(); onMoreClose(); },
            },
            {
              icon: <FitScreenIcon fontSize="small" />,
              label: "Fit to page",
              action: () => { onFitToPage(); onMoreClose(); },
            },
            {
              icon: <ZoomOutMapIcon fontSize="small" />,
              label: "Fit to width",
              action: () => { onFitToWidth(); onMoreClose(); },
            },
            ...(isMobile && enablePrint
              ? [
                {
                  icon: <PrintIcon fontSize="small" />,
                  label: "Print",
                  action: () => { onPrint(); onMoreClose(); },
                },
              ]
              : []),
          ].map(({ icon, label, action }) => (
            <MenuItem
              key={label}
              onClick={action}
              sx={{ py: 1.25, "&:hover": { bgcolor: CHROME_TOOLBAR_HOVER } }}
            >
              <ListItemIcon sx={{ color: "#e8eaed", minWidth: 36 }}>
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{ fontSize: "14px", color: "#e8eaed" }}
              />
            </MenuItem>
          ))}
        {(isMobile || isTablet) && (
          <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 0.5 }} />
        )}

        <MenuItem
          onClick={onToggleViewMode}
          sx={{ py: 1.25, "&:hover": { bgcolor: CHROME_TOOLBAR_HOVER } }}
        >
          <ListItemIcon sx={{ color: "#e8eaed", minWidth: 36 }}>
            <Checkbox
              checked={viewMode === "book"}
              size="small"
              sx={{
                color: "rgba(255,255,255,0.55)",
                p: 0,
                "&.Mui-checked": { color: CHROME_ACCENT },
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary="Two page view"
            primaryTypographyProps={{ fontSize: "14px", color: "#e8eaed" }}
          />
        </MenuItem>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 0.5 }} />

        <MenuItem
          onClick={onDocPropsOpen}
          sx={{ py: 1.25, "&:hover": { bgcolor: CHROME_TOOLBAR_HOVER } }}
        >
          <ListItemText
            primary="Document properties"
            primaryTypographyProps={{ fontSize: "14px", color: "#e8eaed" }}
          />
        </MenuItem>
      </Menu>

      <Dialog
        open={docPropsOpen}
        onClose={onDocPropsClose}
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : "12px",
            minWidth: isMobile ? "100%" : 440,
            maxWidth: isMobile ? "100%" : 540,
            width: isMobile ? "100%" : undefined,
            p: 0,
          },
        }}
      >
        <DialogTitle
          sx={{ fontSize: "17px", fontWeight: 600, pb: 1, pt: 2.5, px: 3 }}
        >
          Document properties
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2, px: 3 }}>
          {docProps ? (
            <>
              <DocPropTable
                rows={[
                  { label: "File name:", value: docProps.fileName },
                  { label: "File size:", value: docProps.fileSize },
                ]}
              />
              <Divider sx={{ my: 1.5 }} />
              <DocPropTable
                rows={[
                  { label: "Title:", value: docProps.title },
                  { label: "Author:", value: docProps.author },
                  { label: "Subject:", value: docProps.subject },
                  { label: "Keywords:", value: docProps.keywords },
                  { label: "Created:", value: docProps.created },
                  { label: "Modified:", value: docProps.modified },
                  { label: "Application:", value: docProps.application },
                ]}
              />
              <Divider sx={{ my: 1.5 }} />
              <DocPropTable
                rows={[
                  // { label: "PDF producer:", value: docProps.pdfProducer },
                  { label: "PDF version:", value: docProps.pdfVersion },
                  { label: "Page count:", value: String(docProps.pageCount) },
                  { label: "Page size:", value: docProps.pageSize },
                ]}
              />
              <Divider sx={{ my: 1.5 }} />
              <DocPropTable
                rows={[{ label: "Fast web view:", value: docProps.fastWebView }]}
              />
            </>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={28} />
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            variant="contained"
            onClick={onDocPropsClose}
            sx={{
              borderRadius: "6px",
              px: 3,
              textTransform: "none",
              boxShadow: "none",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* {enableDrive && (
        <Dialog
          open={driveDialogOpen}
          onClose={onDriveClose}
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : "12px",
              width: isMobile ? "100%" : 460,
              maxWidth: isMobile ? "100%" : "95vw",
              p: 0,
              overflow: "hidden",
              boxShadow: "0 8px 40px rgba(0,0,0,0.22)",
            },
          }}
        >
          <Box
            sx={{
              px: 3,
              pt: 3,
              pb: 0,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "#202124",
                  lineHeight: 1.3,
                }}
              >
                Save to your account
              </Typography>
              <Typography sx={{ fontSize: "13px", color: "#5f6368", mt: 0.5 }}>
                Find your file in the{" "}
                <Box component="span" sx={{ fontWeight: 600, color: "#202124" }}>
                  My Drive
                </Box>{" "}
                folder
              </Typography>
            </Box>
            <Box sx={{ mt: 0.5 }}>
              <GoogleDriveIcon size={36} />
            </Box>
          </Box>

          <Divider sx={{ mx: 3, mt: 2, mb: 0, borderColor: "#e0e0e0" }} />

          <Box
            sx={{ px: 3, py: 2.5, display: "flex", alignItems: "center", gap: 2 }}
          >
            {driveAccount ? (
              <>
                <Avatar
                  src={driveAccount.picture}
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: "#6750a4",
                    fontSize: "18px",
                    fontWeight: 600,
                  }}
                >
                  {driveAccount.name?.[0]?.toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "#202124",
                      lineHeight: 1.3,
                    }}
                  >
                    {driveAccount.name}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "13px", color: "#5f6368", mt: 0.2 }}
                  >
                    {driveAccount.email}
                  </Typography>
                </Box>
              </>
            ) : (
              <CircularProgress size={24} />
            )}
          </Box>

          <Divider sx={{ mx: 3, borderColor: "#e0e0e0" }} />

          <Box
            sx={{
              px: isMobile ? 2 : 3,
              py: 2,
              display: "flex",
              flexDirection: isMobile ? "column-reverse" : "row",
              alignItems: isMobile ? "stretch" : "center",
              justifyContent: "space-between",
              gap: isMobile ? 1 : 0,
            }}
          >
            <Button
              variant="outlined"
              onClick={onSwitchAccount}
              disabled={driveUploading}
              fullWidth={isMobile}
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 500,
                borderColor: "#c084c0",
                color: "#7b1fa2",
                px: 2,
                "&:hover": {
                  borderColor: "#9c27b0",
                  bgcolor: "rgba(156,39,176,0.04)",
                },
              }}
            >
              Use a different account
            </Button>
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                onClick={onDriveClose}
                disabled={driveUploading}
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  borderColor: "#c084c0",
                  color: "#7b1fa2",
                  px: 2.5,
                  "&:hover": {
                    borderColor: "#9c27b0",
                    bgcolor: "rgba(156,39,176,0.04)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={onDriveSave}
                disabled={driveUploading || !driveAccount}
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  bgcolor: "#6750a4",
                  px: 2.5,
                  minWidth: 80,
                  "&:hover": { bgcolor: "#5a4090" },
                  "&.Mui-disabled": { bgcolor: "#c5b8e8", color: "#fff" },
                }}
              >
                {driveUploading ? (
                  <CircularProgress size={18} sx={{ color: "#fff" }} />
                ) : (
                  "Save"
                )}
              </Button>
            </Stack>
          </Box>
        </Dialog>
      )} */}

      <Snackbar
        open={Boolean(driveSnackbar)}
        autoHideDuration={5000}
        onClose={onDriveSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={onDriveSnackbarClose}
          severity={driveSnackbar?.severity || "info"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {driveSnackbar?.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PdfViewerUI;
