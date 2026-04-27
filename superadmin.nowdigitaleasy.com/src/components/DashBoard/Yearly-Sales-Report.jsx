import { useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import ReusableTable from "../../components/common/Table/ReusableTable";
import CommonSelect from "../../components/common/fields/NDE-Select";
import { useTotalAmountByMonth } from "../../hooks/dashboard/dashboard";
import CommonYearDatePicker from "../../components/common/NDE-YearDatePicker";


const YearlySalesReport = () => {
  const currentYear = new Date().getFullYear();
  const [currency, setCurrency] = useState("INR");
  const currencyOptions = [
    { label: "INR", value: "INR" },
    { label: "USD", value: "USD" },
    { label: "SGD", value: "SGD" },
  ];

  
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const formatCurrency = (value, currencyCode) => {
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currencyCode || "INR",
        minimumFractionDigits: 2,
      }).format(Number(value));
    } catch (error) {
      return error;
    }
  };

  
  const { data, isLoading } = useTotalAmountByMonth(selectedYear, currency);

  const tableData = useMemo(() => {
    if (!data) return [];
    return data.map((item, idx) => ({
      id: idx + 1,
      month: item.monthName,
      sales: formatCurrency(item.totalAmount, currency),
    }));
  }, [data, currency]);

  const columns = [
    { accessorKey: "month", header: "Month" },
    { accessorKey: "sales", header: "Sales" },
  ];

  return (
    <Box>
      {/* Top Bar */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Typography variant="h6">
        Yearly Sales Report ({selectedYear})
      </Typography>

      <Box sx={{ display: "flex", gap: 2, marginLeft: "auto" }}>
        {/* Currency Selector */}
        <CommonSelect
          options={currencyOptions}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          width="120px"
          mt={0}
        />

        {/* Year Picker */}
        <CommonYearDatePicker
          label="Select Year"
          value={new Date(selectedYear, 0)}
          onChange={(date) => setSelectedYear(date.getFullYear())}
          views={["year"]}
          
        />
      </Box>
    </Box>
      {/* Table */}
        <ReusableTable columns={columns} data={tableData} isLoading={isLoading} />
      </Box>
  );
};

export default YearlySalesReport;
