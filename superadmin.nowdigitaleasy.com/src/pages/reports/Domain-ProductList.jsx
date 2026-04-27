import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import ReusableTable from "../../components/common/Table/ReusableTable";
import CommonSearchBar from "../../components/common/fields/NDE-SearchBar";
import CustomPagination from "../../components/common/Table/TablePagination";
import CommonDeleteModal from "../../components/common/NDE-DeleteModal";
import { useDomainProductList } from "../../hooks/reports/reports-hooks";
import { useResellers } from "../../hooks/settings/resellers-hooks";
import CommonSelect from "../../components/common/fields/NDE-Select";

const DomainList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    let updated = false;

    if (!params.has("page")) {
      params.set("page", "1");
      updated = true;
    }
    if (!params.has("limit")) {
      params.set("limit", "10");
      updated = true;
    }
    if (!params.has("search")) {
      params.set("search", "");
      updated = true;
    }
    if (!params.has("sort")) {
      params.set("sort", "");
      updated = true;
    }

    if (updated) setSearchParams(params);
  }, []); 

  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const sortParam = searchParams.get("sort") || "";
  const searchTermFromParams = searchParams.get("search") || "";
  const aliasIdFromParams = searchParams.get("aliasId") || "all";

  const [search, setSearch] = useState(searchTermFromParams);
  const [selectedAlias, setSelectedAlias] = useState(aliasIdFromParams);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data: aliasRes, isLoading: aliasLoading } = useResellers();

  const aliasOptions =
    [{ label: "All", value: "all" }].concat(
      aliasRes?.data?.map((item) => ({
        label: item.aliasName,
        value: item.customerID,
      })) || []
    );


  useEffect(() => {
    setSearch(searchTermFromParams);
  }, [searchTermFromParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      if (params.get("search") !== search) {
        params.set("search", search);
        params.set("page", "1");
        setSearchParams(params);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useDomainProductList({
    searchTerm: searchTermFromParams,
    page,
    limit,
    sort: sortParam,
    config: selectedAlias === "all" ? "" : selectedAlias,
  });

  const domainData = data?.data || [];

  const updateQueryParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      newParams.set(key, value ?? "");
    });
    setSearchParams(newParams);
  };


  const handleSortChange = (columnId) => {
    let direction = "asc";
    if (sortParam.replace("-", "") === columnId) {
      direction = sortParam.startsWith("-") ? "asc" : "desc";
    }
    const newSort = direction === "desc" ? `-${columnId}` : columnId;
    updateQueryParams({ sort: newSort });
  };

  const handlePageChange = (_, newPage) => {
    updateQueryParams({ page: newPage + 1 });
  };

  const handleLimitChange = (e) => {
    updateQueryParams({ limit: e.target.value, page: 1 });
  };


  const confirmDelete = async () => {
    if (!selectedRow) return;
    try {
      console.log("Deleted Domain record:", selectedRow.clientId);
    } catch (err) {
      console.error("Error deleting record:", err);
    } finally {
      setDeleteModalOpen(false);
      setSelectedRow(null);
    }
  };

  const columns = [
    { accessorKey: "clientName", header: "Client Name" },
    { accessorKey: "DomainName", header: "Domain" },
    { accessorKey: "status", header: "Status" },
    {
      accessorKey: "orderDate",
      header: "Order Date",
      cell: ({ row }) =>
        row.original.orderDate
          ? new Date(row.original.orderDate).toLocaleDateString("en-IN")
          : "-",
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      cell: ({ row }) =>
        row.original.expiryDate
          ? new Date(row.original.expiryDate).toLocaleDateString("en-IN")
          : "-",
    },
  ];

  return (
    <Box sx={{ p: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1
        }}
      >
        <Typography variant="h4" gutterBottom>
          Domain List
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <CommonSelect
            options={aliasOptions}
            value={selectedAlias}
            onChange={(eventOrValue) => {
              const value = eventOrValue?.target?.value ?? eventOrValue?.value ?? "";
              setSelectedAlias(value);

              updateQueryParams({
                aliasId: value,
                page: 1
              });
            }}
            loading={aliasLoading}
            sx={{ width: 200 }}
            mb={0}
          />

          <CommonSearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
            placeholder="Search Domain records..."
            sx={{ width: 200 }}
            mb={0}
          />
        </Box>
      </Box>

      <ReusableTable
        columns={columns}
        data={domainData}
        isLoading={isLoading}
        sortableColumns={["clientName", "DomainName"]}
        onSortChange={handleSortChange}
      />

      <CustomPagination
        count={data?.paginatedData?.totalDocs || 0}
        page={page - 1}
        rowsPerPage={limit}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
      />

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={false}
        itemType="Domain Record"
      />
    </Box>
  );
};

export default DomainList;
