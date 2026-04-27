import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import ReusableTable from "../../components/common/Table/ReusableTable";
import CommonSearchBar from "../../components/common/fields/NDE-SearchBar";
import CommonSelect from "../../components/common/fields/NDE-Select";
import CustomPagination from "../../components/common/Table/TablePagination";
import CommonDeleteModal from "../../components/common/NDE-DeleteModal";
import { useGsuiteProductList } from "../../hooks/reports/reports-hooks";
import { useGSuite } from "../../hooks/settings/gsuite";

const GsuiteList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data: tableResponse, isLoading: aliasLoading } = useGSuite();

  const aliasOptions =
    [{ label: "All", value: "all" }].concat(
      tableResponse?.data?.map((item) => ({
        label: item.aliasName,
        value: item._id,
      })) || []
    );

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
    if (!params.has("aliasId")) {
      params.set("aliasId", "");
      updated = true;
    }

    if (updated) setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const sortParam = searchParams.get("sort") || "";
  const searchTermFromParams = searchParams.get("search") || "";
  const aliasIdFromParams = searchParams.get("aliasId") || "all";
  const [selectedAlias, setSelectedAlias] = useState(aliasIdFromParams);


  useEffect(() => {
    setSearch(searchTermFromParams);
    setSelectedAlias(aliasIdFromParams);
  }, [searchTermFromParams, aliasIdFromParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("aliasId", selectedAlias);
    params.set("page", "1");
    setSearchParams(params);
  }, [selectedAlias]);


  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedAlias) {
      params.set("aliasId", selectedAlias);
    } else {
      params.delete("aliasId");
    }
    params.set("page", "1");
    setSearchParams(params);
  }, [selectedAlias]);

  const { data, isLoading } = useGsuiteProductList({
    productId: "",
    searchTerm: searchTermFromParams,
    page,
    limit,
    sort: sortParam,
    config: selectedAlias === "all" ? "" : selectedAlias,
  });


  const gsuiteData = data?.data || [];

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
      console.log("Deleted GSuite record:", selectedRow._id);
    } catch (err) {
      console.error("Error deleting record:", err);
    } finally {
      setDeleteModalOpen(false);
      setSelectedRow(null);
    }
  };

  const columns = [
    { accessorKey: "clientName", header: "Client Name" },
    { accessorKey: "customerDomain", header: "Domain" },
    { accessorKey: "productName", header: "Product Name" },
    { accessorKey: "status", header: "Status" },
    {
      accessorKey: "orderDate",
      header: "Order Date",
      cell: ({ row }) =>
        new Date(row.original.orderDate).toLocaleDateString("en-IN"),
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      cell: ({ row }) =>
        new Date(row.original.expiryDate).toLocaleDateString("en-IN"),
    },
  ];

  return (
    <Box sx={{ p: 1 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" gutterBottom>
          G-Suite List
        </Typography>

        {/* Right-aligned filters */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <CommonSelect
            options={aliasOptions}
            value={selectedAlias}
            onChange={(eventOrValue) => {
              const value = eventOrValue?.target?.value ?? eventOrValue?.value ?? "";
              setSelectedAlias(value);
            }}
            loading={aliasLoading}
            sx={{ width: 200 }}
             mb={0}

          />
          <CommonSearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
            placeholder="Search G-Suite records..."
            sx={{ width: 200 }}
          />
        </Box>
      </Box>

      {/* Table */}
      <ReusableTable
        columns={columns}
        data={gsuiteData}
        isLoading={isLoading}
        sortableColumns={[
          "clientName",
          "customerDomain",
          "customerId",
          "productName",
        ]}
        onSortChange={handleSortChange}
      />

      {/* Pagination */}
      <CustomPagination
        count={data?.paginatedData?.totalDocs || 0}
        page={page - 1}
        rowsPerPage={limit}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
      />

      {/* Delete Modal */}
      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={false}
        itemType="G-Suite Record"
      />
    </Box>
  );
};

export default GsuiteList;
