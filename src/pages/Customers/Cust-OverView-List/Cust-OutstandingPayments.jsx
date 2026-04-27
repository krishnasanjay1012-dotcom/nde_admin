import { Box } from "@mui/material";
import CustomPagination from "../../../components/common/Table/TablePagination";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import { useState } from "react";
import { useUserOutstandingPayments } from "../../../hooks/Customer/Customer-hooks";

const CustomerPayment = ({selectedWorkspaceId}) => { 
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useUserOutstandingPayments({
    worksapce_id: selectedWorkspaceId,
    status: "pending",
    // method: "resellerclub",
    page: page,
    limit: limit
  });

  const tableData = data?.data?.docs || [];  

 const columns = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.original?.userDetails;
      return user
        ? `${user.first_name} ${user.last_name}`
        : "-";
    },
  },
  {
    accessorKey: "invoiceNo",
    header: "Invoice No",
    cell: ({ row }) => row.original?.invoiceNo || "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row.original?.status || "-",
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => row.original?.totalAmount || "-",
  },
  {
    accessorKey: "paymentMade",
    header: "Paid",
    cell: ({ row }) => row.original?.paymentMade || "-",
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => row.original?.balance || "-",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) =>
      row.original?.dueDate
        ? new Date(row.original.dueDate).toLocaleDateString()
        : "-",
  },
];

  return (
    <Box>
      <ReusableTable columns={columns} data={tableData} isLoading={isLoading} skeletonRowCount={5} />
      <CustomPagination
        count={data?.data?.totalPages || 0}
        page={page - 1}
        rowsPerPage={limit}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);
        }}
      />
    </Box>
  );
};

export default CustomerPayment;
