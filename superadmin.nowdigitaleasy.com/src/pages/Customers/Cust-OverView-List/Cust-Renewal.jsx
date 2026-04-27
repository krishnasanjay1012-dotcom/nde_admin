import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState } from "react";
import CustomPagination from "../../../components/common/Table/TablePagination";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import { useRenewalDataByDate } from "../../../hooks/Customer/Customer-hooks";

const CustomerRenewal = () => { 
  const { customerId } = useParams();  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const { data, isLoading } = useRenewalDataByDate({
    user: customerId,
    page: page,
    limit: limit,
    service: "resellerclub"
  });

  const tableData = data?.data || [];

  const columns = [
    {
      accessorKey: "userName",
      header: "User Name",
      cell: ({ row }) => row.original?.userName || "-",
    },
    {
      accessorKey: "domainName",
      header: "Domain Name",
      cell: ({ row }) => row.original?.domainName || "-",
    },
    {
      accessorKey: "productName",
      header: "Product Name",
      cell: ({ row }) => row.original?.productName || "-",
    },
    {
      accessorKey: "service",
      header: "Service",
      cell: ({ row }) => row.original?.service || "-",
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      cell: ({ row }) => row.original?.expiryDate 
          ? new Date(row.original.expiryDate).toLocaleDateString()
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
        count={data?.pagination?.totalPages || 0}
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

export default CustomerRenewal;
