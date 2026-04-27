// import { useState } from "react";
// import { Box, Typography, IconButton } from "@mui/material";
// import CommonButton from "../../../components/common/NDE-Button";
// import ReusableTable from "../../../components/common/Table/ReusableTable";
// import CurrencyDetails from "../../../components/settings/finance/Currency-Create-Edit";
// import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
// import CommonCheckbox from "../../../components/common/fields/NDE-Checkbox";
// import {
//   useCurrencies,
//   useCreateCurrency,
//   useUpdateCurrency,
//   useDeleteCurrency
// } from "../../../hooks/settings/currency";
// import Delete from "../../../assets/icons/delete.svg";
// import Edit from "../../../assets/icons/edit.svg";

// const downloadCSV = (data, filename = "data.csv") => {
//   if (!data || data.length === 0) return;

//   const headers = Object.keys(data[0]);
//   const csvRows = [
//     headers.join(","), // header row
//     ...data.map(row => headers.map(field => `"${row[field] ?? ""}"`).join(",")) // data rows
//   ];

//   const csvContent = csvRows.join("\n");
//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.setAttribute("download", filename);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

// const Currencies = () => {
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedRow, setSelectedRow] = useState(null);

//   const { data: currenciesResponse = {}, isLoading } = useCurrencies();
//   const currencies = currenciesResponse.data || [];

//   const createCurrency = useCreateCurrency();
//   const updateCurrency = useUpdateCurrency();
//   const deleteCurrency = useDeleteCurrency();

//   const tableData = currencies.map((item) => ({
//     id: item._id,
//     country: item.country,
//     countryCode: item.countryCode,
//     currencyCode: item.code,
//     language: item.locale,
//     status: item.isdefault,
//   }));

//   const handleSubmit = (data) => {
//     const payload = {
//       code: data.country.currencyCode,
//       locale: data.language,
//       countryCode: data.country.code,
//       isdefault: data.defaultCurrency,
//       country: data.country.label
//     };

//     if (selectedRow) {
//       updateCurrency.mutate({ id: selectedRow.id, data: payload });
//     } else {
//       createCurrency.mutate(payload);
//     }

//     setOpenDialog(false);
//     setSelectedRow(null);
//   };

//   const handleDelete = (rowData) => {
//     setSelectedRow(rowData);
//     setDeleteModalOpen(true);
//   };

//   const confirmDelete = () => {
//     deleteCurrency.mutate(selectedRow.id);
//     setDeleteModalOpen(false);
//     setSelectedRow(null);
//   };

//   const handleEdit = (rowData) => {
//     setSelectedRow(rowData);
//     setOpenDialog(true);
//   };

//   const toggleCheckbox = (id) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (selectedIds.length === tableData.length) {
//       setSelectedIds([]);
//     } else {
//       setSelectedIds(tableData.map((row) => row.id));
//     }
//   };

//   const columns = [
//     // {
//     //   id: "select",
//     //   header: () => (
//     //     <CommonCheckbox
//     //       name="selectAll"
//     //       checked={selectedIds.length === tableData.length && tableData.length > 0}
//     //       indeterminate={
//     //         selectedIds.length > 0 && selectedIds.length < tableData.length
//     //       }
//     //       onChange={toggleSelectAll}
//     //       sx={{ p: 0 }}
//     //     />
//     //   ),
//     //   cell: ({ row }) => (
//     //     <CommonCheckbox
//     //       name={`row-${row.original.id}`}
//     //       checked={selectedIds.includes(row.original.id)}
//     //       onChange={() => toggleCheckbox(row.original.id)}
//     //       sx={{ p: 0 }}
//     //       disabled={selectedRow?.id === row.original.id}
//     //     />
//     //   ),
//     // },
//     { accessorKey: "country", header: "Country" },
//     {
//       accessorKey: "currencyCode",
//       header: "Currency Code",
//       cell: ({ row }) => {
//         const { currencyCode, status } = row.original;

//         return (
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <Typography variant="body2" fontWeight={400} fontSize={13}>
//               {currencyCode}
//             </Typography>

//             {status && (
//               <Typography
//                 variant="caption"
//                 sx={{
//                   backgroundColor: "#E8EDFF",
//                   color: "#27AE60",
//                   px: 1,
//                   py: 0.25,
//                   borderRadius: "12px",
//                   fontWeight: 600,
//                   fontSize: "12px",
//                 }}
//               >
//                 Default
//               </Typography>
//             )}
//           </Box>
//         );
//       },
//     },
//     { accessorKey: "language", header: "Language" },
//     // { accessorKey: "status", header: "Status" },
//     {
//       id: "action",
//       header: "Action",
//       cell: ({ row }) => (
//         <Box sx={{ display: "flex", gap: 1 }}>
//           <IconButton onClick={() => handleEdit(row.original)}>
//             <img src={Edit} style={{ height: 15 }} />
//           </IconButton>
//           <IconButton onClick={() => handleDelete(row.original)}>
//             <img src={Delete} style={{ height: 20 }} />
//           </IconButton>
//         </Box>
//       ),
//     },
//   ];

//   return (
//     <Box>
//       <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between",p:1}}>
//         <Typography variant="h4" gutterBottom>
//           Currency Settings
//         </Typography>
//         <Box sx={{ display: "flex", gap: 1 }}>
//           {/* <CommonButton
//             label={"Export All Data"}
//             onClick={() => downloadCSV(tableData, "all_currencies.csv")}
//             disabled={tableData.length === 0}
//             startIcon={false}
//           />
//           <CommonButton
//             label={"Export Selected Data"}
//             onClick={() => {
//               const selectedData = tableData.filter((row) =>
//                 selectedIds.includes(row.id)
//               );
//               downloadCSV(selectedData, "selected_currencies.csv");
//             }}
//             disabled={selectedIds.length === 0}
//             startIcon={false}
//             disabledColor="#919191"
//           /> */}
//           <CommonButton
//             label={"Create New Currency"}
//             onClick={() => {
//               setSelectedRow(null);
//               setOpenDialog(true);
//             }}
//           />
//         </Box>
//       </Box>

//       <ReusableTable columns={columns} data={tableData} selectedIds={selectedIds} isLoading={isLoading} maxHeight="calc(100vh - 180px)" />

//       <CurrencyDetails
//         open={openDialog}
//         setOpen={setOpenDialog}
//         initialData={selectedRow}
//         onSubmitAction={handleSubmit}
//       />

//       <CommonDeleteModal
//         open={deleteModalOpen}
//         onClose={() => setDeleteModalOpen(false)}
//         onConfirmDelete={confirmDelete}
//         deleting={deleteCurrency.isLoading}
//         itemType="Currency"
//         title="Currency"
//       />
//     </Box>
//   );
// };

// export default Currencies;


import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CommonButton from "../../../components/common/NDE-Button";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import CurrencyDetails from "../../../components/settings/finance/Currency-Create-Edit";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import {
  useCurrencies,
  useCreateCurrency,
  useUpdateCurrency,
  useDeleteCurrency
} from "../../../hooks/settings/currency";
import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";

const Currencies = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data: currenciesResponse = {}, isLoading } = useCurrencies();
  const currencies = currenciesResponse?.data || [];

  const createCurrency = useCreateCurrency();
  const updateCurrency = useUpdateCurrency();
  const deleteCurrency = useDeleteCurrency();

  const tableData = currencies.map((item) => ({
    id: item._id,
    country: item.country,
    countryCode: item.countryCode,
    currencyCode: item.code,
    language: item.locale,
    status: item.isdefault,
    decimalPlaces: item.decimalPlaces,
    symbol: item.symbol,
  }));

  const normalizeString = (value) => {
    if (Array.isArray(value)) return value[0] || "";
    return value || "";
  };

  const handleSubmit = async (data) => {
    const payload = {
      code: normalizeString(data.currencyCode || data.country?.currencyCode),
      locale: normalizeString(data.language),
      countryCode: normalizeString(data.countryCode || data.country?.code),
      isdefault: Boolean(data.defaultCurrency),
      country: normalizeString(data.country?.label),
      symbol: normalizeString(data.currencySymbol),
      decimalPlaces: Number(data.decimalPlaces),
    };

    try {
      if (selectedRow) {
        await updateCurrency.mutateAsync({
          id: selectedRow.id,
          data: payload,
        });
      } else {
        await createCurrency.mutateAsync(payload);
      }

      setOpenDialog(false);
      setSelectedRow(null);

    } catch (error) {
      console.error("Currency API error:", error);
    }
  };

  const handleDelete = (rowData) => {
    setSelectedRow(rowData);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteCurrency.mutate(selectedRow.id);
    setDeleteModalOpen(false);
    setSelectedRow(null);
  };

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setOpenDialog(true);
  };

  const columns = [
    { accessorKey: "country", header: "Country" },
    {
      accessorKey: "currencyCode",
      header: "Currency Code",
      cell: ({ row }) => {
        const { currencyCode, status } = row.original;

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" fontWeight={400} fontSize={13}>
              {currencyCode}
            </Typography>

            {status && (
              <Typography
                variant="caption"
                sx={{
                  backgroundColor: "#E8EDFF",
                  color: "#27AE60",
                  px: 1,
                  py: 0.25,
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "12px",
                }}
              >
                Default
              </Typography>
            )}
          </Box>
        );
      },
    },
    { accessorKey: "language", header: "Language" },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={() => handleEdit(row.original)}>
            <img src={Edit} style={{ height: 15 }} />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.original)}>
            <img src={Delete} style={{ height: 20 }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
        }}
      >
        <Typography variant="h4">Currency Settings</Typography>

        <CommonButton
          label={"Create New Currency"}
          onClick={() => {
            setSelectedRow(null);
            setOpenDialog(true);
          }}
        />
      </Box>

      <ReusableTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        maxHeight="calc(100vh - 180px)"
      />

      <CurrencyDetails
        open={openDialog}
        setOpen={setOpenDialog}
        initialData={selectedRow}
        onSubmitAction={handleSubmit}
      />

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleteCurrency.isLoading}
        itemType="Currency"
        title="Currency"
      />
    </Box>
  );
};

export default Currencies;