import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import moment from "moment";
import axios from "axios";

import CommonSelect from "../../../components/common/fields/NDE-Select";
import CommonButton from "../../../components/common/NDE-Button";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import CustomPagination from "../../../components/common/Table/TablePagination";

import { useTaxes, useTaxesExcel } from "../../../hooks/tax/tax-hooks";
import CommonDateRange from "../../common/NDE-DateRange";

const api_url1 = "https://api.nowdigitaleasy.com/ndeadmin/v2";

const dateFilterOptions = [
  { label: "Custom", value: "custom" },
  { label: "This Month", value: "this_month" },
  { label: "Last Month", value: "last_month" },
  { label: "Last Week", value: "last_week" },
  { label: "All", value: "all" },
];

const Tax = () => {
  const [selectedDateFilter, setSelectedDateFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const [tempRange, setTempRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const [selectedRange, setSelectedRange] = useState({
    startDate: null,
    endDate: null,
  });

  const { data, isLoading, refetch } = useTaxes({
    page,
    limit: rowsPerPage,
    date_filter: selectedDateFilter,
    start_date: selectedRange.startDate
      ? selectedRange.startDate.toISOString()
      : undefined,
    end_date: selectedRange.endDate
      ? selectedRange.endDate.toISOString()
      : undefined,
  });

  const { refetch: fetchExcel } = useTaxesExcel();
  const [tableData, setTableData] = useState([]);

  const getPdfUrl = async (key) => {
    if (!key) return null;
    try {
      const result = await axios.get(`${api_url1}/download-invoice/${key}`);
      return result.data || null;
    } catch (error) {
      console.error("Error fetching PDF", error);
      return null;
    }
  };

  useEffect(() => {
    const formatData = async () => {
      if (!data?.dataByCurrency) return;

      const formatted = await Promise.all(
        data.dataByCurrency.map(async (item, index) => ({
          id: index + 1,
          clientName: item.clientName,
          invoiceNo: item.InvoiceNo,
          invoiceDate: item.date ? moment(item.date).format("DD/MM/YYYY") : "-",
          invoiceValue: item.amount,
          taxRate: item.TaxPercentage,
          taxableValue: item.Taxablevalue,
          igst: item.igst,
          centralTax: item.cgst,
          stateTax: item.sgst,
          Url: item.key ? await getPdfUrl(item.key) : null,
        }))
      );

      setTableData(formatted);
    };

    formatData();
  }, [data]);

  const handleDownloadExcel = async () => {
    setLoading(true);
    try {
      const response = await fetchExcel();
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "tax_report.xlsx");

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Excel download failed", err);
    }
    setLoading(false);
  };

  // DATE FILTER CHANGE
  const handleDateFilterChange = (value) => {
    setSelectedDateFilter(value);

    if (value === "custom") {
      setOpenModal(true);
    } else {
      setSelectedRange({ startDate: null, endDate: null });
      setPage(1);
      refetch();
    }
  };

  // APPLY CUSTOM RANGE
  const handleApplyCustomRange = () => {
    setSelectedRange({
      startDate: tempRange.startDate,
      endDate: tempRange.endDate,
    });

    setPage(1);
    setOpenModal(false);

    refetch();
  };

  const columns = [
    { accessorKey: "id", header: "Id" },
    { accessorKey: "clientName", header: "Client Name" },
    { accessorKey: "invoiceNo", header: "Invoice No" },
    { accessorKey: "invoiceDate", header: "Invoice Date" },
    { accessorKey: "invoiceValue", header: "Invoice Value" },
    { accessorKey: "taxRate", header: "Tax Rate(%)" },
    { accessorKey: "taxableValue", header: "Taxable Value" },
    { accessorKey: "igst", header: "IGST" },
    { accessorKey: "centralTax", header: "Central Tax" },
    { accessorKey: "stateTax", header: "State Tax" },
    {
      header: "PDF",
      accessorKey: "Url",
      cell: (info) => {
        const url = info.row.original.Url;
        return url ? (
          <IconButton
            component="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            color="primary"
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        ) : (
          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
            No PDF
          </Typography>
        );
      },
    },
  ];

  return (
    <Box p={1}>
      {/* HEADER */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        gap={{ xs: 2, sm: 0 }}
      >
        <CommonSelect
          options={dateFilterOptions}
          value={selectedDateFilter}
          onChange={(e) => handleDateFilterChange(e.target.value)}
          width="140px"
        />

        <CommonButton
          label="Send to Auditor"
          onClick={handleDownloadExcel}
          loading={loading}
          startIcon={false}
        />
      </Box>

      {/* CUSTOM DATE RANGE MODAL */}
      <CommonDateRange
        open={openModal}
        onClose={() => setOpenModal(false)}
        tempRange={tempRange}
        onChange={(ranges) => setTempRange(ranges.selection)}
        onApply={handleApplyCustomRange}
        title="Select Date Range"
      />

      {/* TABLE */}
      <ReusableTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        maxHeight="calc(98vh - 200px)"
      />

      <CustomPagination
        count={data?.paginationData?.totalDocs || 0}
        page={page - 1}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, value) => setPage(value)}
        onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))}
      />
    </Box>
  );
};

export default Tax;
