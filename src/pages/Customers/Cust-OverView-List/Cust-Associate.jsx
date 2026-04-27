import { Box } from "@mui/material";
import { useState } from "react";
import CustomPagination from "../../../components/common/Table/TablePagination";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import { useAdminId } from "../../../utils/session";
import { useGetAdminCustomers } from "../../../hooks/auth/login";

const CustomerAssociate = () => { 
  const adminId = useAdminId(); 
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const { data, isLoading } = useGetAdminCustomers(adminId);

  const tableData = data?.data || [];

  const columns = [
    {
      accessorKey: "first_name",
      header: "First Name",
      cell: ({ row }) => row.original?.first_name || "-",
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
      cell: ({ row }) => row.original?.last_name || "-",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original?.email || "-",
    },
    {
      accessorKey: "companyName",
      header: "Company Name",
      cell: ({ row }) => row.original?.companyName || "-",
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
      {/* <CustomPagination
        count={data?.pagination?.totalPages || 0}
        page={page - 1}
        rowsPerPage={limit}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);
        }}
      /> */}
    </Box>
  );
};

export default CustomerAssociate ;
