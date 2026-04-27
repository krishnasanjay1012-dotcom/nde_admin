import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState } from "react";
import CustomPagination from "../../../components/common/Table/TablePagination";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import { useLogs } from "../../../hooks/Customer/Customer-hooks";

const CustomerHistory = ({selectedWorkspaceId}) => { 
  const { customerId } = useParams();  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const { data, isLoading } = useLogs({
    userId: customerId,
    workspace_Id:selectedWorkspaceId,
    page: page,
    limit: limit,
    filter: "order"
  });

  const tableData = data?.logData || [];


  const columns = [
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => row.original?.message || "-",
  },
  {
    accessorKey: "referenceModel",
    header: "Reference",
    cell: ({ row }) => row.original?.referenceModel || "-",
  },
  {
    accessorKey: "referenceId",
    header: "Reference ID",
    cell: ({ row }) => row.original?.referenceId || "-",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) =>
      row.original?.date
        ? new Date(row.original.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "-",
  },
];


  return (
    <Box>
      <ReusableTable 
        columns={columns} 
        data={tableData} 
        isLoading={isLoading} 
        skeletonRowCount={5}  
      />
     <CustomPagination
        count={data?.totalPages || 0}
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

export default CustomerHistory;
