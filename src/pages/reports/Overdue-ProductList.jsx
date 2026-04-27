import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import ReusableTable from "../../components/common/Table/ReusableTable";
import { useOverdueCount } from "../../hooks/dashboard/dashboard";

const Overdue = () => {

  const [tableData, setTableData] = useState([]);

  const { data: overDueResponse,isLoading } = useOverdueCount();

  useEffect(() => {
    if (overDueResponse?.docs?.length) {
      const formatted = overDueResponse.docs.map((item, index) => ({
        id: index + 1,
        customerName: item.name || "-",
        workspace: item.workspace || "-",
        product: item.productName || "-",
        plan: item.planName || "-",
        expiryDate: item.expiryDate
          ? new Date(item.expiryDate).toLocaleDateString("en-GB")
          : "-",
      }));
      setTableData(formatted);
    }
  }, [overDueResponse]);

const columns = [
  {
    accessorKey: "customerName",
    header: "Customer Name",
    cell: ({ getValue }) => (
      <Typography
        noWrap
        title={getValue()}
        sx={{
          maxWidth: 150, 
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {getValue()}
      </Typography>
    ),
  },
  { accessorKey: "workspace", header: "Workspace" },
  { accessorKey: "product", header: "Product" },
  { accessorKey: "plan", header: "Plan" },
  { accessorKey: "expiryDate", header: "Expiry Date" },
];




  return (
    <Box p={1}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1,mt:2 }}>
        <Typography variant="h4" gutterBottom>
          Overdue Customers
        </Typography>
      </Box>
      <ReusableTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        maxHeight="calc(100vh - 170px)"
      />

    </Box>
  );
};

export default Overdue;
