// import {
//   Box,
//   IconButton,
//   TableCell,
//   TableRow,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { Controller } from "react-hook-form";
// import CloseIcon from "@mui/icons-material/Close";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import CommonAutocomplete from "../../../common/fields/NDE-Autocomplete";
// import {
//   CommonDescriptionField,
//   CommonSelect,
//   CustomSearchableSelect,
// } from "../../../common/fields";
// // import ItemTaxDropdown from "../ItemTaxDropdown";
// import FlowerLoader from "../../../common/NDE-loader";
// import ItemTaxDropdown from "../../../Sales/Invoices/New Component/ItemTaxDropdown";

// const EMPTY_TAX = { taxName: "", percentage: 0, amount: 0 };

// const ACCOUNT_OPTIONS = [];
// const CUSTOMER_OPTIONS = [];

// export default function BillItemTableRow({
//   row,
//   index,
//   control,
//   setValue,
//   errors,
//   watchedItems,
//   productOptions,
//   isLoadingVariants,
//   getPricingOptions,
//   remove,
//   edit,
//   watch,
// }) {
//   const currentProductId = watchedItems?.[index]?.pricingId;
//   const pricingOptions = getPricingOptions(currentProductId);

//   const clearRow = () => {
//     const fields = {
//       pricingId: "",
//       productId: "",
//       productName: "",
//       planId: "",
//       planName: "",
//       billingCycleId: "",
//       billingCycleLabel: "",
//       duration: "",
//       durationUnit: "",
//       pricingType: "",
//       price: 0,
//       quantity: 1,
//       unit: "",
//       description: "",
//       account: "",
//       customer: "",
//       tax: EMPTY_TAX,
//     };
//     Object.entries(fields).forEach(([key, val]) =>
//       setValue(`lineItems.${index}.${key}`, val),
//     );
//   };

//   if (edit && productOptions?.length === 0) {
//     return (
//       <TableRow key={row.id}>
//         <TableCell sx={{ verticalAlign: "center" }}>
//           <FlowerLoader size={10} />
//         </TableCell>
//       </TableRow>
//     );
//   }

//   return (
//     <TableRow key={row.id}>
//       <TableCell
//         sx={{
//           borderBottom: "1px solid #e0e0e0",
//           borderRight: "1px solid #e0e0e0",
//           verticalAlign: "top",
//         }}
//       >
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//           <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
//             {/* Product Autocomplete */}
//             <Box sx={{ flex: 1, minWidth: "200px" }}>
//               <Controller
//                 name={`lineItems.${index}.pricingId`}
//                 control={control}
//                 render={({ field }) => (
//                   <CommonAutocomplete
//                     {...field}
//                     options={productOptions}
//                     loading={isLoadingVariants}
//                     placeholder="Select Product"
//                     onChange={(newValue) => {
//                       const product = newValue || null;
//                       if (product) {
//                         field.onChange(product.value);
//                         const meta = {
//                           pricingId: product.value,
//                           actualProductId: product.productId,
//                           productName: product.productName,
//                           planId: product.planId,
//                           planName: product.planName,
//                           billingCycleId: product.billingCycleId,
//                           billingCycleLabel: product.billingCycleLabel,
//                           duration: product.duration,
//                           durationUnit: product.durationUnit,
//                           unit: product.unitLabel,
//                           pricingType: "",
//                           price: 0,
//                           quantity: 1,
//                         };
//                         Object.entries(meta).forEach(([k, v]) =>
//                           setValue(`lineItems.${index}.${k}`, v),
//                         );
//                       } else {
//                         clearRow();
//                       }
//                       setValue(`lineItems.${index}.description`, "");
//                     }}
//                     value={
//                       productOptions.find((opt) => opt.value === field.value) ||
//                       null
//                     }
//                     renderOption={(props, option) => (
//                       <li {...props} style={{ padding: 0, display: "block" }}>
//                         <Box sx={{ p: 1, borderBottom: "1px solid #f0f0f0" }}>
//                           <Typography
//                             fontWeight={600}
//                             fontSize={13}
//                             color="#333"
//                           >
//                             {option.dropdownlabel}
//                           </Typography>
//                           {option.planName && (
//                             <Typography
//                               variant="caption"
//                               fontSize={11}
//                               color="#333"
//                             >
//                               {option.planName} - {option.billingCycleLabel}
//                             </Typography>
//                           )}
//                         </Box>
//                       </li>
//                     )}
//                     invoiceTable
//                     fullWidth
//                     mt={0}
//                     mb={0}
//                     sx={{
//                       "& .MuiOutlinedInput-root": {
//                         fontSize: 13,
//                         minHeight: "32px",
//                         height: "32px",
//                         padding: "0 8px !important",
//                       },
//                       "& .MuiAutocomplete-input": { padding: "0 !important" },
//                     }}
//                     error={!!errors?.lineItems?.[index]?.productId}
//                     helperText={errors?.lineItems?.[index]?.productId?.message}
//                   />
//                 )}
//               />
//             </Box>

//             {/* Pricing Type */}
//             <Box sx={{ width: "180px" }}>
//               <Controller
//                 name={`lineItems.${index}.pricingType`}
//                 control={control}
//                 render={({ field }) => {
//                   const isDisabled = !currentProductId;
//                   return (
//                     <CommonSelect
//                       {...field}
//                       options={pricingOptions}
//                       disabled={isDisabled}
//                       value={field.value || ""}
//                       onChange={(e) => {
//                         const selectedType = e.target.value;
//                         field.onChange(selectedType);
//                         const selectedPricing = pricingOptions.find(
//                           (p) => p.value === selectedType,
//                         );
//                         if (selectedPricing) {
//                           setValue(
//                             `lineItems.${index}.price`,
//                             selectedPricing.price,
//                           );
//                           setValue(`lineItems.${index}.quantity`, 1);
//                           const quantity = watch(`lineItems.${index}.quantity`);
//                           setValue(`lineItems.${index}.tax`, {
//                             taxName: "gst18",
//                             percentage: 10,
//                             amount:
//                               (selectedPricing.price * quantity * 10) / 100,
//                           });
//                         }
//                       }}
//                       placeHolder={
//                         isDisabled ? "Select Product First" : "Pricing Type"
//                       }
//                       height={32}
//                       mt={0}
//                       mb={0}
//                       sx={{
//                         width: "100%",
//                         bgcolor: isDisabled ? "#f5f5f5" : "#fff",
//                       }}
//                       error={!!errors?.lineItems?.[index]?.pricingType}
//                       helperText={
//                         errors?.lineItems?.[index]?.pricingType?.message
//                       }
//                     />
//                   );
//                 }}
//               />
//             </Box>

//             {/* Clear Row */}
//             <IconButton
//               size="small"
//               onClick={clearRow}
//               sx={{
//                 height: "32px",
//                 width: "32px",
//                 border: "1px solid #e0e0e0",
//                 borderRadius: "4px",
//                 color: "#757575",
//                 "&:hover": {
//                   bgcolor: "#ffebee",
//                   color: "#d32f2f",
//                   borderColor: "#ef9a9a",
//                 },
//               }}
//             >
//               <CloseIcon fontSize="small" />
//             </IconButton>
//           </Box>

//           {/* Description */}
//           <Controller
//             name={`lineItems.${index}.description`}
//             control={control}
//             render={({ field }) => (
//               <CommonDescriptionField
//                 {...field}
//                 placeholder="Description"
//                 rows={2}
//                 mt={0}
//                 mb={0}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     fontSize: 13,
//                     bgcolor: "#fafafa",
//                   },
//                 }}
//               />
//             )}
//           />
//         </Box>
//       </TableCell>

//       <TableCell
//         align="center"
//         sx={{
//           padding: "5px 8px",
//           borderBottom: "1px solid #e0e0e0",
//           borderRight: "1px solid #e0e0e0",
//           //   verticalAlign: "top",
//         }}
//       >
//         <Controller
//           name={`lineItems.${index}.account`}
//           control={control}
//           render={({ field }) => (
//             <CommonSelect
//               {...field}
//               options={ACCOUNT_OPTIONS}
//               value={field.value || ""}
//               placeHolder="Select Account"
//               height={32}
//               mt={0}
//               mb={0}
//               sx={{ width: "100%" }}
//               error={!!errors?.lineItems?.[index]?.account}
//               helperText={errors?.lineItems?.[index]?.account?.message}
//             />
//           )}
//         />
//       </TableCell>

//       <TableCell
//         align="left"
//         sx={{
//           padding: "5px 8px",
//           borderBottom: "1px solid #e0e0e0",
//           borderRight: "1px solid #e0e0e0",
//         }}
//       >
//         <Controller
//           name={`lineItems.${index}.quantity`}
//           control={control}
//           render={({ field }) => (
//             <TextField
//               {...field}
//               type="number"
//               size="small"
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   fontSize: 14,
//                   height: "32px",
//                   "& input": {
//                     textAlign: "right",
//                     padding: "0 8px",
//                     height: "32px",
//                     boxSizing: "border-box",
//                   },
//                 },
//               }}
//             />
//           )}
//         />
//       </TableCell>

//       <TableCell
//         align="left"
//         sx={{
//           padding: "5px 8px",
//           borderBottom: "1px solid #e0e0e0",
//           borderRight: "1px solid #e0e0e0",
//         }}
//       >
//         <Controller
//           name={`lineItems.${index}.tax`}
//           control={control}
//           render={({ field }) => (
//             <ItemTaxDropdown
//               {...field}
//               value={field.value}
//               onChange={(val) => field.onChange(val)}
//               setValue={setValue}
//               index={index}
//               watchedItems={watchedItems}
//             />
//           )}
//         />
//       </TableCell>

//       <TableCell
//         align="center"
//         sx={{
//           borderBottom: "1px solid #e0e0e0",
//           borderRight: "1px solid #e0e0e0",
//           padding: "5px 8px",
//         }}
//       >
//         <Controller
//           name={`lineItems.${index}.price`}
//           control={control}
//           render={({ field }) => (
//             <TextField
//               {...field}
//               type="number"
//               size="small"
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   fontSize: 14,
//                   height: "32px",
//                   "& input": {
//                     textAlign: "right",
//                     padding: "0 8px",
//                     height: "32px",
//                     boxSizing: "border-box",
//                   },
//                 },
//               }}
//             />
//           )}
//         />
//       </TableCell>

//       {/* <TableCell
//         align="right"
//         sx={{
//           padding: "5px 8px",
//           borderBottom: "1px solid #e0e0e0",
//           borderRight: "1px solid #e0e0e0",
//         }}
//       >
//         <Controller
//           name={`lineItems.${index}.customer`}
//           control={control}
//           render={({ field }) => (
//             <CustomSearchableSelect
//               {...field}
//               options={CUSTOMER_OPTIONS}
//               labelKey="name"
//               valueKey="_id"
//               width="100%"
//               height={32}
//               mt={0}
//               mb={0}
//               error={!!errors?.lineItems?.[index]?.customer}
//               helperText={errors?.lineItems?.[index]?.customer?.message}
//             />
//           )}
//         />
//       </TableCell> */}

//       <TableCell
//         align="right"
//         sx={{
//           pr: 2,
//           borderBottom: "1px solid #e0e0e0",
//           borderRight: "1px solid #e0e0e0",
//         }}
//       >
//         <Typography fontSize={14} fontWeight={500}>
//           {(
//             (Number(watchedItems?.[index]?.quantity) || 0) *
//             (Number(watchedItems?.[index]?.price) || 0)
//           ).toFixed(2)}
//         </Typography>
//       </TableCell>

//       <TableCell align="center" sx={{ borderBottom: "1px solid #e0e0e0" }}>
//         <Box sx={{ display: "flex", gap: 0.5 }}>
//           <IconButton size="small">
//             <MoreVertIcon fontSize="small" />
//           </IconButton>
//           <IconButton
//             size="small"
//             onClick={() => remove(index)}
//             sx={{ color: "#d32f2f" }}
//           >
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </Box>
//       </TableCell>
//     </TableRow>
//   );
// }

import {
  Box,
  IconButton,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CommonDescriptionField, CommonSelect } from "../../../common/fields";
import ItemTaxDropdown from "../../../Sales/Invoices/New Component/ItemTaxDropdown";
import FlowerLoader from "../../../common/NDE-loader";
import CreatableAutocomplete from "./../../../common/NDE-CreatableAutocomplete";
import { useState } from "react";
import { useGetItemInfo } from "../../../../hooks/Items/Items-hooks";

const EMPTY_TAX = { taxName: "", percentage: 0, amount: 0 };

export default function BillItemTableRow({
  row,
  index,
  control,
  setValue,
  errors,
  watchedItems,
  itemOptions,
  accountOptions,
  isLoadingVariants,
  remove,
  edit,
  watch,
}) {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const { data: itemInfo } = useGetItemInfo(selectedItemId, {
    enabled: !selectedItemId,
  });

  const sourceValue = watch("source");
  const destinationValue = watch("destination");

  const clearRow = () => {
    const defaults = {
      itemId: "",
      itemName: "",
      account: "",
      description: "",
      quantity: 1,
      price: 0,
      unit: "",
      tax: EMPTY_TAX,
    };
    Object.entries(defaults).forEach(([key, val]) =>
      setValue(`lineItems.${index}.${key}`, val),
    );
  };

  if (edit && itemOptions?.length === 0) {
    return (
      <TableRow key={row.id}>
        <TableCell>
          <FlowerLoader size={10} />
        </TableCell>
      </TableRow>
    );
  }

  const isReverse = watch("isReverseCharge");

  return (
    <TableRow key={row.id}>
      <TableCell
        sx={{
          borderBottom: "1px solid #e0e0e0",
          borderRight: "1px solid #e0e0e0",
          verticalAlign: "top",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
            <Box sx={{ flex: 1, minWidth: "220px" }}>
              <Controller
                name={`lineItems.${index}.itemName`}
                control={control}
                render={({ field }) => (
                  <CreatableAutocomplete
                    options={itemOptions ?? []}
                    loading={isLoadingVariants}
                    placeholder="Select or type item name"
                    value={
                      itemOptions?.find(
                        (opt) => opt.value === watchedItems?.[index]?.itemId,
                      ) ??
                      field.value ??
                      ""
                    }
                    onChange={(newValue) => {
                      if (
                        newValue &&
                        typeof newValue === "object" &&
                        !newValue._isManual
                      ) {
                        field.onChange(newValue.label);
                        setValue(`lineItems.${index}.itemId`, newValue.value);
                        setSelectedItemId(newValue.value);

                        setValue(`lineItems.${index}.item`, newValue.value);
                        setValue(
                          `lineItems.${index}.account`,
                          newValue.account ?? "",
                        );
                        setValue(
                          `lineItems.${index}.price`,
                          newValue.price ?? 0,
                        );
                        setValue(`lineItems.${index}.quantity`, 1);
                        setValue(
                          `lineItems.${index}.unit`,
                          newValue.unit ?? "",
                        );
                        setValue(
                          `lineItems.${index}.description`,
                          newValue.description ?? "",
                        );
                        const quantity = watch(`lineItems.${index}.quantity`);
                        const price = newValue.price ?? 0;

                        let intraTax = itemInfo?.data?.intraStateTax;
                        let interTax = itemInfo?.data?.interStateTax;

                        let taxConfig;
                        if (sourceValue === destinationValue) {
                          taxConfig = intraTax;
                        } else {
                          taxConfig = interTax;
                        }

                        const rate = taxConfig?.rate ?? 0;

                        const taxAmount = (price * quantity * rate) / 100;

                        const defaultTax = {
                          taxName: taxConfig?.tax_name ?? "",
                          percentage: rate,
                          amount: taxAmount,
                        };

                        setValue(`lineItems.${index}.tax`, defaultTax);
                        // const defaultTax = {
                        //   taxName: "GST 18",
                        //   percentage: 18,
                        //   amount: (newValue.price * quantity * 18) / 100,
                        // };
                        setValue(
                          `lineItems.${index}.account`,
                          itemInfo?.data?.purchaseAccount?._id || "",
                        );
                      } else if (
                        typeof newValue === "string" ||
                        newValue?._isManual
                      ) {
                        const text =
                          typeof newValue === "string"
                            ? newValue
                            : newValue.label;
                        field.onChange(text);
                        setValue(`lineItems.${index}.itemId`, "");
                      } else {
                        // Cleared
                        clearRow();
                      }
                    }}
                    filterKeys={["label"]}
                    mt={0}
                    mb={0}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: 13,
                        minHeight: "32px",
                        height: "32px",
                        padding: "0 8px !important",
                      },
                      "& .MuiAutocomplete-input": { padding: "0 !important" },
                    }}
                    error={!!errors?.lineItems?.[index]?.itemName}
                    helperText={errors?.lineItems?.[index]?.itemName?.message}
                  />
                )}
              />
            </Box>

            <IconButton
              size="small"
              onClick={clearRow}
              sx={{
                height: "32px",
                width: "32px",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                color: "error.main",
                // "&:hover": {
                //   bgcolor: "#ffebee",
                //   color: "#d32f2f",
                //   borderColor: "#ef9a9a",
                // },
              }}
            >
              <CloseIcon sx={{ color: "error.main" }} fontSize="small" />
            </IconButton>
          </Box>

          {/* Description */}
          <Controller
            name={`lineItems.${index}.description`}
            control={control}
            render={({ field }) => (
              <CommonDescriptionField
                {...field}
                placeholder="Description"
                rows={2}
                mt={0}
                mb={0}
              />
            )}
          />
        </Box>
      </TableCell>

      <TableCell
        align="center"
        sx={{
          padding: "5px 8px",
          borderBottom: "1px solid #e0e0e0",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <Controller
          name={`lineItems.${index}.account`}
          control={control}
          render={({ field }) => (
            <CommonSelect
              {...field}
              options={accountOptions ?? []}
              value={field.value || ""}
              placeHolder="Account"
              height={32}
              mt={0}
              mb={0}
              // sx={{ width: "100%" }}
              error={!!errors?.lineItems?.[index]?.account}
              helperText={errors?.lineItems?.[index]?.account?.message}
              searchable
            />
          )}
        />
      </TableCell>

      <TableCell
        align="left"
        sx={{
          padding: "5px 8px",
          borderBottom: "1px solid #e0e0e0",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <Controller
          name={`lineItems.${index}.quantity`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              size="small"
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || Number(val) >= 1) field.onChange(val);
              }}
              onKeyDown={(e) => {
                if (["-", "e", "E", "+"].includes(e.key)) e.preventDefault();
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: 14,
                  height: "32px",
                  "& input": {
                    textAlign: "right",
                    padding: "0 8px",
                    height: "32px",
                    boxSizing: "border-box",
                  },
                },
                "& input[type=number]::-webkit-inner-spin-button": {
                  display: "none",
                },
                "& input[type=number]::-webkit-outer-spin-button": {
                  display: "none",
                },
              }}
            />
          )}
        />
      </TableCell>

      <TableCell
        align="left"
        sx={{
          padding: "5px 8px",
          borderBottom: "1px solid #e0e0e0",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <Controller
          name={`lineItems.${index}.tax`}
          control={control}
          render={({ field }) => (
            <ItemTaxDropdown
              {...field}
              value={field.value}
              onChange={(val) => field.onChange(val)}
              setValue={setValue}
              index={index}
              watchedItems={watchedItems}
              disabled={isReverse}
            />
          )}
        />
      </TableCell>

      <TableCell
        align="center"
        sx={{
          borderBottom: "1px solid #e0e0e0",
          borderRight: "1px solid #e0e0e0",
          padding: "5px 8px",
        }}
      >
        <Controller
          name={`lineItems.${index}.price`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              size="small"
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || Number(val) >= 1) field.onChange(val);
              }}
              onKeyDown={(e) => {
                if (["-", "e", "E", "+"].includes(e.key)) e.preventDefault();
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: 14,
                  height: "32px",
                  "& input": {
                    textAlign: "right",
                    padding: "0 8px",
                    height: "32px",
                    boxSizing: "border-box",
                  },
                },
                "& input[type=number]::-webkit-inner-spin-button": {
                  display: "none",
                },
                "& input[type=number]::-webkit-outer-spin-button": {
                  display: "none",
                },
              }}
            />
          )}
        />
      </TableCell>

      <TableCell
        align="right"
        sx={{
          pr: 2,
          borderBottom: "1px solid #e0e0e0",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <Typography fontSize={14} fontWeight={500}>
          {(
            (Number(watchedItems?.[index]?.quantity) || 0) *
            (Number(watchedItems?.[index]?.price) || 0)
          ).toFixed(2)}
        </Typography>
      </TableCell>

      <TableCell align="center" sx={{ borderBottom: "1px solid #e0e0e0" }}>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton size="small">
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => remove(index)}
            sx={{ color: "#d32f2f" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
}
