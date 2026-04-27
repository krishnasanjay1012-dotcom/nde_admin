import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import CommonFilter from "../../common/NDE-CommonFilter";
import { CommonSelect } from "../../common/fields";
import CommonDateRange from "../../common/NDE-DateRange";
import { IconButton } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import GridOnIcon from "@mui/icons-material/GridOn";
import EmailIcon from "@mui/icons-material/Email";
import CommonButton from "../../common/NDE-Button";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import { useStatementDetails } from "../../../hooks/Customer/Customer-hooks";
import { getUserStatement } from "../../../services/Customer/Customer-service";
import NDEPrint from "../../common/NDE-Print";



const Statement = ({ userId, selectedWorkspaceId }) => {
  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Outstanding", value: "outstanding" },
  ];

  const dateFilterOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This Week", value: "this_week" },
    { label: "Previous Week", value: "previous_week" },
    { label: "This Month", value: "this_month" },
    { label: "Previous Month", value: "previous_month" },
    { label: "This Quarter", value: "this_quarter" },
    { label: "Previous Quarter", value: "previous_quarter" },
    { label: "This Year", value: "this_year" },
    { label: "Previous Year", value: "previous_year" },
    { label: "Custom", value: "custom" }
  ];

  const [status, setStatus] = useState("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState("this_month");
  const [openModal, setOpenModal] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
  const navigate = useNavigate();


  const [tempRange, setTempRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const { data } = useStatementDetails({
    workspaceId: selectedWorkspaceId,
    filter: selectedDateFilter,
  });

  const statementData = data?.data;

  const [selectedRange, setSelectedRange] = useState({
    startDate: null,
    endDate: null,
  });

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleDateFilterChange = (value) => {
    setSelectedDateFilter(value);

    if (value === "custom") {
      setOpenModal(true);
    } else {
      setSelectedRange({ startDate: null, endDate: null });
    }
  };

  const handleApplyCustomRange = () => {
    setSelectedRange({
      startDate: tempRange.startDate,
      endDate: tempRange.endDate,
    });
    setOpenModal(false);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  const handleSendMail = () => {
    navigate(`/customers/${userId}/statements/email`)
  }

  const getMimeType = (type) => {
    switch (type) {
      case "pdf":
        return "application/pdf";
      case "xlsx":
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      default:
        return "application/octet-stream";
    }
  };

  const handleExport = async (type) => {
    try {
      const response = await getUserStatement(
        {
          workspaceId: selectedWorkspaceId,
          filter: selectedDateFilter,
          type: type,
        },
        {
          responseType: "blob",
        }
      );

      const mimeType = getMimeType(type);
      const blobData = response instanceof Blob ? response : response.data;
      const blob = new Blob([blobData], { type: mimeType });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `statement.${type}`);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
    }
  };
  return (
    <Box
      sx={{
        p: 1,
        overflow: "auto",
        maxHeight: "calc(100vh - 180px)",
      }}
    >
      {/* Filters Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <CommonSelect
          options={dateFilterOptions}
          value={selectedDateFilter}
          onChange={(e) => handleDateFilterChange(e.target.value)}
          width="150px"
          clearable={false}
          mt={0}
          mb={0}
        />

        <CommonFilter
          menuOptions={statusOptions}
          value={status}
          onChange={handleStatusChange}
        />

        {/* Top Action Bar */}
        <Box
          sx={{
            gap: 2,
            display: "flex",
            ml: "auto",
          }}
        >
          {/* Print */}
          <Tooltip title="Print" arrow>
            <IconButton
              onClick={() => setPrintOpen(true)}
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "background.muted",
                "&:hover": { backgroundColor: "background.light" },
              }}
            >
              <PrintIcon fontSize="small" />
            </IconButton>
          </Tooltip>


          {/* Download PDF */}
          <Tooltip title="Download PDF" arrow>
            <IconButton
              onClick={() => handleExport("pdf")}
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "background.muted",
                "&:hover": { backgroundColor: "background.light" },
              }}
            >
              <PictureAsPdfIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Download Excel */}
          <Tooltip title="Download Excel" arrow>
            <IconButton
              onClick={() => handleExport("xlsx")}
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "background.muted",
                "&:hover": { backgroundColor: "background.light" },
              }}
            >
              <GridOnIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Email */}
          <CommonButton
            variant="contained"
            onClick={handleSendMail}
            startIcon={<EmailIcon sx={{ color: "icon.light" }} />}
            label="Send Email"
          // onClick={() => navigate("/customers/statement/email")}
          />
        </Box>
      </Box>

      <Typography
        variant="h5"
        fontWeight={400}
        sx={{ mt: 1, textAlign: "center" }}
      >
        {statementData?.customer}
      </Typography>
      <Typography
        variant="h6"
        fontWeight={400}
        sx={{ mt: 1, textAlign: "center", fontSize: 12 }}
      >
        From {formatDate(statementData?.from)} To{" "}
        {formatDate(statementData?.to)}
      </Typography>

      {statementData?.html_string && (
        <Box
          sx={{ p: 2, boxShadow: 3, mt: 2 }}
          dangerouslySetInnerHTML={{ __html: statementData.html_string }}
        />
      )}

      <CommonDateRange
        open={openModal}
        onClose={() => setOpenModal(false)}
        tempRange={tempRange}
        onChange={(ranges) => setTempRange(ranges.selection)}
        onApply={handleApplyCustomRange}
        title="Select Date Range"
      />

      <NDEPrint
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        title="Statement Preview"
        fileName={`${statementData?.customer}`}
      >
        <Box sx={{ p: 3 }}>
          {statementData?.html_string && (
            <Box
              dangerouslySetInnerHTML={{ __html: statementData.html_string }}
            />
          )}
        </Box>
      </NDEPrint>
    </Box>

  );
};

export default Statement;
