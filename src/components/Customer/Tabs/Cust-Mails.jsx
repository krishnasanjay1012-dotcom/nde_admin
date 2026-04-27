
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import ReusableTable from "../../common/Table/ReusableTable";
import CustomPagination from "../../common/Table/TablePagination";
import { useParams } from "react-router-dom";
import { useEmailLog } from "../../../hooks/Customer/Customer-hooks";

const MailList = ({ selectedWorkspaceId }) => {
  const { customerId } = useParams();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useEmailLog({
    userId: customerId,
    workspace_Id: selectedWorkspaceId,
    page,
    limit,
  });

  const invoices = data?.docs || [];



  const columns = [
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "service",
      header: "Service",
    },
    {
      accessorKey: "bulkmail",
      header: "Bulk Mail",
      cell: ({ row }) => (row.original.bulkmail ? "Yes" : "No"),
    },
    {
      accessorKey: "sendDate",
      header: "Send Date",
      cell: ({ row }) => {
        const date = row.original.sendDate;
        return date
          ? new Date(date).toLocaleDateString("en-GB")
          : "-";
      },
    },
    {
      accessorKey: "isSent",
      header: "Sent",
      cell: ({ row }) => (row.original.isSent ? "Yes" : "No"),
    },
    {
      accessorKey: "isViewed",
      header: "Viewed",
      cell: ({ row }) => (row.original.isViewed ? "Yes" : "No"),
    },
    {
      accessorKey: "count",
      header: "Count",
    },
  ];



  return (
    <Box >
      {/* Header */}
      <Typography variant="h4" gutterBottom p={1}>
        Mail
      </Typography>
      {/* Table */}
      <ReusableTable columns={columns} data={invoices} isLoading={isLoading} maxHeight="calc(100vh - 280px)" skeletonRowCount={5} />

      {/* Pagination */}
      <CustomPagination
        count={data?.totalDocs || 0}
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

export default MailList;
