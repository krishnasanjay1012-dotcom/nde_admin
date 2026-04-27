// import React, { useEffect, useMemo } from "react";
// import { Box, IconButton, Tooltip, Typography } from "@mui/material";
// import { Controller, useFieldArray, useWatch } from "react-hook-form";
// import {
//   CommonTextField,
//   CustomSearchableSelect,
// } from "../../../common/fields";
// import CommonButton from "../../../common/NDE-Button";
// import ReusableTable from "../../../common/Table/ReusableTable";
// import CloseIcon from "@mui/icons-material/Close";

// const SplitPaymentSection = ({
//   control,
//   paymentModeOptions = [],
//   depositToOptions = [],
//   invoiceTotal = 0,
//   name = "batchPayments",
//   errors,
//   setValue,
//   getValues,
// }) => {
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name,
//   });

//   const payments = useWatch({
//     control,
//     name,
//   });

//   const hasBatchError = !!errors.batchPayments;
//   const batchErrorMessage = errors.batchPayments?.message || "";

//   const PaymentMode =
//     paymentModeOptions?.data?.map((pay) => ({
//       label: pay.name,
//       value: pay._id,
//     })) || [];

//   const DepositTo =
//     depositToOptions?.data?.map((dep) => ({
//       label: dep?.name,
//       value: dep?._id,
//     })) || [];

//   const totalPaid =
//     payments?.reduce((sum, item) => {
//       return sum + (Number(item?.amount) || 0);
//     }, 0) || 0;

//   const invoiceAmount = Number(invoiceTotal) || 0;

//   const balanceAmount = invoiceAmount - totalPaid;

//   useEffect(() => {
//     if (fields.length > 0) {
//       const firstAmount = getValues(`${name}.0.amount`);

//       if (!firstAmount && balanceAmount !== 0) {
//         setValue(`${name}.0.amount`, balanceAmount);
//       }
//     }
//   }, [balanceAmount, fields.length]);

//   const columns = useMemo(
//     () => [
//       {
//         header: "Payment Mode",
//         accessorKey: "paymentModes",
//         cell: ({ row }) => (
//           <Controller
//             control={control}
//             name={`${name}.${row.index}.paymentModes`}
//             render={({ field }) => (
//               <CustomSearchableSelect
//                 value={field.value}
//                 onChange={field.onChange}
//                 options={PaymentMode}
//                 placeholder="Select Payment Mode"
//                 mb={0}
//               />
//             )}
//           />
//         ),
//       },
//       {
//         header: "Deposit To",
//         accessorKey: "depositTo",
//         cell: ({ row }) => (
//           <Controller
//             control={control}
//             name={`${name}.${row.index}.depositTo`}
//             render={({ field }) => (
//               <CustomSearchableSelect
//                 value={field.value}
//                 onChange={field.onChange}
//                 options={DepositTo}
//                 placeholder="Select Account"
//                 mb={0}
//               />
//             )}
//           />
//         ),
//       },
//       {
//         header: "Amount Received",
//         accessorKey: "amount",
//         cell: ({ row }) => (
//           <Controller
//             control={control}
//             name={`${name}.${row.index}.amount`}
//             render={({ field }) => (
//               <CommonTextField
//                 noLabel
//                 value={field.value}
//                 onChange={field.onChange}
//                 placeholder="Enter Amount"
//                 type="number"
//                 height={40}
//                 mb={0}
//               />
//             )}
//           />
//         ),
//       },
//       {
//         header: "",
//         accessorKey: "actions",
//         cell: ({ row }) => (
//           <Box
//             sx={{
//               cursor: "pointer",
//               color: "error.main",
//               //   fontWeight: 600,
//             }}
//             onClick={() => fields?.length !== 1 && remove(row.index)}
//           >
//             <IconButton>
//               <CloseIcon fontSize="small" />
//             </IconButton>
//           </Box>
//         ),
//       },
//     ],
//     [control, paymentModeOptions, depositToOptions],
//   );

//   return (
//     <Box mt={3} width={800}>
//       <ReusableTable columns={columns} data={fields} />

//       <Box mt={2}>
//         <Box
//           sx={{
//             mt: 0,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-start",
//           }}
//         >
//           <Box>
//             <CommonButton
//               label="Add Split Payment"
//               onClick={() =>
//                 append({
//                   paymentModes: "",
//                   depositTo: "",
//                   amount: "",
//                 })
//               }
//               variant="text"
//             />
//           </Box>

//           <Box textAlign="right">
//             <Tooltip
//               title={batchErrorMessage}
//               arrow
//               open={!!batchErrorMessage}
//               disableHoverListener={!hasBatchError}
//               disableFocusListener={!hasBatchError}
//               disableTouchListener={!hasBatchError}
//             >
//               <Typography
//                 fontWeight={500}
//                 sx={{
//                   cursor: hasBatchError ? "pointer" : "default",
//                   color: hasBatchError ? "error.main" : "inherit",
//                 }}
//               >
//                 Total:{" "}
//                 {totalPaid.toLocaleString("en-IN", {
//                   minimumFractionDigits: 2,
//                 })}
//               </Typography>
//             </Tooltip>

//             <Typography
//               mt={1}
//               fontWeight={500}
//               sx={{
//                 color: balanceAmount !== 0 ? "red" : "green",
//               }}
//             >
//               Balance Amount:{" "}
//               {Math.abs(balanceAmount).toLocaleString("en-IN", {
//                 minimumFractionDigits: 2,
//               })}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default SplitPaymentSection;

import React, { useEffect, useRef, useMemo } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import {
  CommonTextField,
  CustomSearchableSelect,
} from "../../../common/fields";
import CommonButton from "../../../common/NDE-Button";
import ReusableTable from "../../../common/Table/ReusableTable";
import CloseIcon from "@mui/icons-material/Close";

const SplitPaymentSection = ({
  control,
  paymentModeOptions = [],
  depositToOptions = [],
  invoiceTotal = 0,
  name = "batchPayments",
  errors,
  setValue,
  getValues,
}) => {
  const { fields, append, remove } = useFieldArray({ control, name });

  const hasSetInitialAmount = useRef(false);

  const payments = useWatch({ control, name });

  const hasBatchError = !!errors.batchPayments;
  const batchErrorMessage = errors.batchPayments?.message || "";

  const PaymentMode =
    paymentModeOptions?.data?.map((pay) => ({
      label: pay.name,
      value: pay._id,
    })) || [];

  const DepositTo =
    depositToOptions?.data?.map((dep) => ({
      label: dep?.name,
      value: dep?._id,
    })) || [];

  const totalPaid =
    payments?.reduce((sum, item) => sum + (Number(item?.amount) || 0), 0) || 0;

  const invoiceAmount = Number(invoiceTotal) || 0;
  const balanceAmount = invoiceAmount - totalPaid;

  useEffect(() => {
    if (!hasSetInitialAmount.current && fields.length > 0) {
      const firstAmount = getValues(`${name}.0.amount`);
      if (!firstAmount) {
        setValue(`${name}.0.amount`, invoiceAmount);
      }
      hasSetInitialAmount.current = true;
    }
  }, [fields.length]);

  const removeRef = useRef(remove);
  const fieldsLengthRef = useRef(fields.length);

  useEffect(() => {
    removeRef.current = remove;
  }, [remove]);

  useEffect(() => {
    fieldsLengthRef.current = fields.length;
  }, [fields.length]);

  console.log(fieldsLengthRef, removeRef.current, "fref");

  const columns = useMemo(
    () => [
      {
        header: "Payment Mode",
        accessorKey: "paymentModes",
        cell: ({ row }) => (
          <Controller
            control={control}
            name={`${name}.${row.index}.paymentModes`}
            render={({ field }) => (
              <CustomSearchableSelect
                value={field.value}
                onChange={field.onChange}
                options={PaymentMode}
                placeholder="Select Payment Mode"
                mb={0}
              />
            )}
          />
        ),
      },
      {
        header: "Deposit To",
        accessorKey: "depositTo",
        cell: ({ row }) => (
          <Controller
            control={control}
            name={`${name}.${row.index}.depositTo`}
            render={({ field }) => (
              <CustomSearchableSelect
                value={field.value}
                onChange={field.onChange}
                options={DepositTo}
                placeholder="Select Account"
                mb={0}
              />
            )}
          />
        ),
      },
      {
        header: "Amount Received",
        accessorKey: "amount",
        cell: ({ row }) => (
          <Controller
            control={control}
            name={`${name}.${row.index}.amount`}
            render={({ field }) => (
              <CommonTextField
                noLabel
                value={field.value}
                onChange={(e) => {
                  let val = e.target.value;
                  if (Number(val) < 0) return;
                  field.onChange(val);
                }}
                placeholder="Enter Amount"
                type="number"
                height={40}
                mb={0}
              />
            )}
          />
        ),
      },
      {
        header: "",
        accessorKey: "actions",
        cell: ({ row }) => (
          <Box sx={{ cursor: "pointer", color: "error.main" }}>
            <IconButton
              onClick={() => {
                if (fieldsLengthRef.current > 1) {
                  removeRef.current(row.index);
                }
              }}
              disabled={fieldsLengthRef.current === 1}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      },
    ],
    [control, paymentModeOptions, depositToOptions, fields, remove],
  );

  return (
    <Box mt={3} width={800}>
      <ReusableTable columns={columns} data={fields} />

      <Box mt={2}>
        <Box
          sx={{
            mt: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <CommonButton
              label="Add Split Payment"
              onClick={() => {
                if (fields.length <= 2) {
                  append({ paymentModes: "", depositTo: "", amount: "" });
                }
              }}
              variant="text"
              disabled={fields.length >= 3}
            />
          </Box>

          <Box textAlign="right">
            <Tooltip
              title={batchErrorMessage}
              arrow
              open={!!batchErrorMessage}
              disableHoverListener={!hasBatchError}
              disableFocusListener={!hasBatchError}
              disableTouchListener={!hasBatchError}
            >
              <Typography
                fontWeight={500}
                sx={{
                  cursor: hasBatchError ? "pointer" : "default",
                  color: hasBatchError ? "error.main" : "inherit",
                }}
              >
                Total:{" "}
                {totalPaid.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </Typography>
            </Tooltip>

            <Typography
              mt={1}
              fontWeight={500}
              sx={{ color: balanceAmount !== 0 ? "red" : "green" }}
            >
              Balance Amount:{" "}
              {Math.abs(balanceAmount).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SplitPaymentSection;
