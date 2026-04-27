// import React, { useState, useMemo, useEffect } from "react";
// import { Autocomplete, TextField, Box, Typography, Paper } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import NewTaxModal from "./NewTaxModal";
// import { useGetGstTaxes } from "../../../../hooks/tax/tax-hooks";
// import { useNavigate } from "react-router-dom";
// import ConfirmationDialog from "../Payment/ConfirmationDialog";

// const ItemTaxDropdown = ({
//   value,
//   onChange,
//   error,
//   helperText,
//   disabled = false,
//   index,
//   watchedItems,
// }) => {
//   console.log(value, "vv");
//   const { data: taxesData, isLoading } = useGetGstTaxes();
//   const [confirmationPopup, setConfirmationPopup] = useState(false);
//   const handleOpenConfirmation = () => {
//     setConfirmationPopup(true);
//   };

//   const handleCloseConfirmation = () => setConfirmationPopup(false);

//   const navigate = useNavigate();

//   const confirmNavigate = () => {
//     navigate("/settings/configuration/gst-taxes");
//   };

//   useEffect(() => {
//     if (!value?.percentage) return;

//     const total =
//       (Number(watchedItems?.[index]?.quantity) || 0) *
//       (Number(watchedItems?.[index]?.price) || 0);

//     const amount = (total * value.percentage) / 100;

//     // avoid unnecessary rerender loop
//     if (amount !== value.amount) {
//       onChange({
//         ...value,
//         amount,
//       });
//     }
//   }, [
//     watchedItems?.[index]?.quantity,
//     watchedItems?.[index]?.price,
//     value?.percentage,
//   ]);

//   const options = useMemo(() => {
//     const rawTaxes = taxesData?.data || [];

//     const nonTaxable = [
//       {
//         label: "No Tax",
//         value: 0,
//         // group: "Non-Taxable",
//         // rate: 0,
//         description: "No tax applies",
//       },
//       // {
//       //   label: "Out of Scope",
//       //   value: "Out of Scope",
//       //   group: "Non-Taxable",
//       //   rate: 0,
//       //   description: "Supplies on which you don't charge any GST",
//       // },
//       // {
//       //   label: "Non-GST Supply",
//       //   value: "Non-GST Supply",
//       //   group: "Non-Taxable",
//       //   rate: 0,
//       //   description: "Supplies which do not come under GST",
//       // },
//     ];

//     // Group 2: Tax Group (From API)
//     const taxGroup = rawTaxes.map((tax) => ({
//       label: tax.tax_name,
//       dropdownLabel: `${tax.tax_name} [${tax.rate}%]`,
//       value: tax._id,
//       rate: tax.rate,
//       group: tax.tax_group,
//       original: tax,
//     }));

//     return [...nonTaxable, ...taxGroup];
//   }, [taxesData]);

//   console.log(options, "lop");

//   const selectedOption =
//     options.find((opt) => opt.label === value?.taxName) || null;

//   console.log(selectedOption, "slop");

//   // const selectedOption = useMemo(() => {
//   //   if (!value?.taxName) return null;

//   //   return options.find((opt) => opt.label === value?.taxName);
//   // }, [options, value?.taxName, value?.percentage]);

//   return (
//     <>
//       <Autocomplete
//         options={options}
//         groupBy={(option) => option.group}
//         getOptionLabel={(option) => option.label}
//         value={selectedOption}
//         // onChange={(event, newValue) => {
//         //   onChange(() => {
//         //     if (newValue) {
//         //       setValue(`lineItems.${index}.tax.taxName`, newValue.label);
//         //       setValue(`lineItems.${index}.tax.percentage`, newValue.value);
//         //       setValue(
//         //         `lineItems.${index}.tax.amount`,
//         //         (total * newValue.value) / 100,
//         //       );
//         //     } else {
//         //       setValue(`lineItems.${index}.tax.taxName`, "");
//         //       setValue(`lineItems.${index}.tax.percentage`, 0);
//         //       setValue(`lineItems.${index}.tax.amount`, 0);
//         //     }
//         //   });
//         // }}

//         // onChange={(event, newValue) => {
//         //   onChange(newValue ? newValue : "");
//         // }}

//         onChange={(event, newValue) => {
//           if (newValue) {
//             const total =
//               (Number(watchedItems?.[index]?.quantity) || 0) *
//               (Number(watchedItems?.[index]?.price) || 0);

//             const percentage = Number(newValue.rate ?? newValue.value) || 0;

//             const amount = (total * percentage) / 100;

//             const taxObj = {
//               taxName: newValue.label,
//               percentage: percentage,
//               amount: amount,
//             };

//             onChange(taxObj);
//           } else {
//             onChange({
//               taxName: "",
//               percentage: 0,
//               amount: 0,
//             });
//           }
//         }}
//         disabled={disabled}
//         loading={isLoading}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             placeholder="Select Tax"
//             error={error}
//             helperText={helperText}
//             sx={{
//               "& .MuiOutlinedInput-root": {
//                 fontSize: 13,
//                 padding: "0 8px !important",
//                 height: "32px", // Match table cell height
//                 minHeight: "32px",
//               },
//               "& .MuiOutlinedInput-input": {
//                 padding: "0 !important",
//               },
//             }}
//           />
//         )}
//         renderOption={(props, option) => (
//           <li {...props} style={{ padding: 0, display: "block" }}>
//             <Box
//               sx={{
//                 p: 1,
//                 borderBottom: "1px solid #f0f0f0",
//                 "&:hover": { bgcolor: "#f5f5f5" },
//               }}
//             >
//               <Typography fontWeight={500} fontSize={13} color="#333">
//                 {option.dropdownLabel}
//               </Typography>
//               {option.description && (
//                 <Typography
//                   variant="caption"
//                   color="text.secondary"
//                   fontSize={11}
//                 >
//                   {option.description}
//                 </Typography>
//               )}
//             </Box>
//           </li>
//         )}
//         PaperComponent={({ children, ...props }) => (
//           <Paper {...props}>
//             {children}
//             <Box
//               sx={{
//                 p: 1,
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1,
//                 cursor: "pointer",
//                 borderTop: "1px solid #e0e0e0",
//                 position: "sticky",
//                 bottom: 0,
//                 zIndex: 1,
//               }}
//               onMouseDown={(e) => {
//                 e.preventDefault();
//                 handleOpenConfirmation();
//               }}
//             >
//               <AddIcon fontSize="small" />
//               <Typography fontSize={13} fontWeight={500}>
//                 New Tax
//               </Typography>
//             </Box>
//           </Paper>
//         )}
//         sx={{ width: "100%" }}
//       />

//       {/* <NewTaxModal open={openModal} onClose={() => setOpenModal(false)} /> */}
//       {confirmationPopup && (
//         <ConfirmationDialog
//           open={confirmationPopup}
//           onClose={handleCloseConfirmation}
//           onNavigate={confirmNavigate}
//         />
//       )}
//     </>
//   );
// };

// export default ItemTaxDropdown;

import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetGstTaxes } from "../../../../hooks/tax/tax-hooks";
import { CommonSelect } from "../../../common/fields";

const ItemTaxDropdown = ({
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  index,
  watchedItems,
}) => {
  const { data: taxesData, isLoading } = useGetGstTaxes();
  const navigate = useNavigate();

  useEffect(() => {
    if (!value?.percentage) return;

    const total =
      (Number(watchedItems?.[index]?.quantity) || 0) *
      (Number(watchedItems?.[index]?.price) || 0);

    const amount = (total * value.percentage) / 100;

    if (amount !== value.amount) {
      onChange({ ...value, amount });
    }
  }, [
    watchedItems?.[index]?.quantity,
    watchedItems?.[index]?.price,
    value?.percentage,
  ]);

  const options = useMemo(() => {
    const rawTaxes = taxesData?.data || [];

    const noTax = {
      label: "No Tax",
      value: "NO_TAX",
      rate: 0,
      description: "No tax applies",
    };

    const taxGroup = rawTaxes.map((tax) => ({
      label: `${tax.tax_name} [${tax.rate}%]`,
      value: tax._id,
      rate: tax.rate,
      group: tax.tax_group,
    }));

    return [noTax, ...taxGroup];
  }, [taxesData]);

  const flatValue = useMemo(() => {
    if (!value?.taxName) return "";
    if (value.taxName === "No Tax") return "NO_TAX";
    return options.find((o) => o.label.startsWith(value.taxName))?.value ?? "";
  }, [value?.taxName, options]);

  const handleChange = (e) => {
    const selectedId = e.target.value;
    const selected = options.find(
      (o) => String(o.value) === String(selectedId),
    );

    if (!selected) {
      onChange({ taxName: "", percentage: 0, amount: 0 });
      return;
    }

    const total =
      (Number(watchedItems?.[index]?.quantity) || 0) *
      (Number(watchedItems?.[index]?.price) || 0);

    const percentage = Number(selected.rate) || 0;

    onChange({
      taxName:
        selected.value === "NO_TAX" ? "No Tax" : selected.label.split(" [")[0], // strip "[rate%]"
      percentage,
      amount: (total * percentage) / 100,
    });
  };

  return (
    <>
      <CommonSelect
        value={flatValue}
        onChange={handleChange}
        options={options}
        labelKey="label"
        valueKey="value"
        error={error}
        helperText={helperText}
        disabled={disabled || isLoading}
        searchable
        height={32}
        mt={0}
        mb={0}
        bottomLabel="New Tax"
        onBottomonClick={() => navigate("/settings/configuration/gst-taxes")}
      />

      {/* {confirmationPopup && (
        <ConfirmationDialog
          open={confirmationPopup}
          onClose={() => setConfirmationPopup(false)}
          onNavigate={() => navigate("/settings/configuration/gst-taxes")}
        />
      )} */}
    </>
  );
};

export default ItemTaxDropdown;
