// import {
//   Box,
//   Table,
//   TableBody,
//   TableContainer,
//   Typography,
// } from "@mui/material";
// import { useEffect, useMemo, useState } from "react";
// import { useTaxList } from "../../../../../hooks/products/products-hooks";

// import { useItemCalculations } from "../hooks/useItemCalculations";
// import ItemTableHeader from "./ItemTableHeader";
// import ItemTotalsPanel from "./ItemTotalsPanel";
// import TDSEditPopover from "./TDSEditPopover";
// import ManageTDS from "../../TDS/ManageTDS";
// import UpsertTDS from "../../TDS/UpsertTDS";
// import ItemTableRow from "./ItemTablerow";

// export default function ItemTableSection({
//   control,
//   fields,
//   append,
//   remove,
//   priceVariantsData,
//   isLoadingVariants,
//   currencySymbol = "₹",
//   watch,
//   setValue,
//   register,
//   edit,
//   errors,
//   billingAddress,
//   setError,
//   clearErrors,
// }) {
//   const isTDS = watch("taxType") === "TDS";
//   const taxType = isTDS ? "TDS" : "TCS";

//   const [anchorEl, setAnchorEl] = useState(null);
//   const [editAmount, setEditAmount] = useState(0);

//   const handleEditTDSClick = (event) => {
//     setEditAmount(watch("tdsValue"));
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClosePopover = () => setAnchorEl(null);
//   const handleUpdateTDS = () => {
//     setValue("tdsValue", editAmount, { shouldDirty: true });
//     handleClosePopover();
//   };

//   const [openManageTds, setOpenManageTds] = useState(false);
//   const [openTds, setOpenTds] = useState(false);
//   const [editData, setEditData] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const handleOpenTds = () => setOpenManageTds(true);
//   const handleCloseTds = () => setOpenManageTds(false);
//   const handleOpenCreateTds = () => setOpenTds(true);
//   const handleCloseCreateTds = () => setOpenTds(false);

//   const handleEdit = (editid) => {
//     setEditData(true);
//     setEditId(editid);
//     handleOpenCreateTds();
//     handleCloseTds();
//   };
//   const handleCreateNewTds = () => {
//     setEditData(false);
//     handleOpenCreateTds();
//     handleCloseTds();
//   };

//   useEffect(() => {
//     if (!edit) {
//       setValue("tdsTaxId", null);
//       setValue("tdsValue", 0.0);
//     }
//   }, [taxType]);

//   const productOptions = useMemo(() => {
//     const rawData = priceVariantsData?.data || priceVariantsData || [];
//     if (!Array.isArray(rawData) || rawData.length === 0) return [];
//     return rawData.map((product) => ({
//       label: `${product.productName || product.name} - (${product.planName})`,
//       dropdownlabel: product.productName || product.name || "Unknown",
//       // value: product.productId || product._id || "",
//       value: product._id,
//       variantId: product._id,
//       productId: product.productId || product._id || "",
//       productName: product.productName || product.name || "",
//       planId: product.planId || "",
//       planName: product.planName || "",
//       billingCycleId: product.billingCycleId || "",
//       billingCycleLabel: product.billingCycleName || "",
//       duration: product.duration || 1,
//       durationUnit: product.durationUnit || "month",
//       unit: product.unit || "",
//       registerPrice: product.registerPrice || product.register_amount || 0,
//       transferPrice: product.transferPrice || product.transfer_amount || 0,
//       renewalPrice: product.renewalPrice || product.renewal_amount || 0,
//     }));
//   }, [priceVariantsData]);

//   const getPricingOptions = (id) => {
//     console.log(id, "toid");
//     const product = productOptions.find((p) => p.value === id);
//     if (!product) return [];
//     return [
//       {
//         label: `Register (${currencySymbol}${product.registerPrice})`,
//         value: "register",
//         price: product.registerPrice,
//       },
//       {
//         label: `Transfer (${currencySymbol}${product.transferPrice})`,
//         value: "transfer",
//         price: product.transferPrice,
//       },
//       {
//         label: `Renewal (${currencySymbol}${product.renewalPrice})`,
//         value: "renewal",
//         price: product.renewalPrice,
//       },
//     ];
//   };

//   const { data: taxList, isLoading: taxLoading } = useTaxList({ taxType });
//   const taxData = taxList?.data ?? [];

//   const rateMap = useMemo(
//     () =>
//       taxData?.reduce((acc, t) => {
//         acc[t._id] = t.rate;
//         return acc;
//       }, {}),
//     [taxData],
//   );

//   const calculations = useItemCalculations({
//     control,
//     setValue,
//     watch,
//     billingAddress,
//   });

//   const handleAddRow = () => {
//     append({
//       productId: "",
//       planId: "",
//       billingCycleId: "",
//       productName: "",
//       planName: "",
//       billingCycleLabel: "",
//       duration: "",
//       durationUnit: "",
//       description: "",
//       quantity: 1,
//       price: 0,
//       unit: "",
//       tax: { taxName: "", percentage: 0, amount: 0 },
//     });
//   };

//   return (
//     <>
//       <Box sx={{ width: "100%", mt: 2 }}>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             mb: 2,
//           }}
//         >
//           <Typography fontSize={16} fontWeight={600}>
//             Item Table
//           </Typography>
//         </Box>

//         <TableContainer
//           sx={{ border: "1px solid #e0e0e0", borderRadius: "4px" }}
//         >
//           <Table>
//             <ItemTableHeader />
//             <TableBody>
//               {fields.map((row, index) => (
//                 <ItemTableRow
//                   key={row.id}
//                   row={row}
//                   index={index}
//                   control={control}
//                   setValue={setValue}
//                   errors={errors}
//                   watchedItems={calculations.watchedItems}
//                   productOptions={productOptions}
//                   isLoadingVariants={isLoadingVariants}
//                   getPricingOptions={getPricingOptions}
//                   remove={remove}
//                   edit={edit}
//                   currencySymbol={currencySymbol}
//                   watch={watch}
//                 />
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <ItemTotalsPanel
//           control={control}
//           register={register}
//           watch={watch}
//           setValue={setValue}
//           taxData={taxData}
//           rateMap={rateMap}
//           isTDS={isTDS}
//           onEditTDSClick={handleEditTDSClick}
//           onOpenManageTds={handleOpenTds}
//           onAddRow={handleAddRow}
//           // {...calculations}
//           subTotal={calculations.subTotal}
//           discountAmount={calculations.discountAmount}
//           taxBreakdown={calculations.taxBreakdown}
//           totalTaxAmount={calculations.totalTaxAmount}
//           adjustment={calculations.adjustment}
//           totalAmount={calculations.totalAmount}
//           tdsamountvalue={calculations.tdsamountvalue}
//           tdstaxcalculation={calculations.tdstaxcalculation}
//           errors={errors}
//           setError={setError}
//           clearErrors={clearErrors}
//         />
//       </Box>

//       {openManageTds && (
//         <ManageTDS
//           open={openManageTds}
//           onClose={handleCloseTds}
//           handleCreateNewTds={handleCreateNewTds}
//           handleEdit={handleEdit}
//           isTDS={isTDS}
//           taxType={taxType}
//           taxData={taxData}
//           taxLoading={taxLoading}
//         />
//       )}
//       {openTds && (
//         <UpsertTDS
//           open={openTds}
//           onClose={handleCloseCreateTds}
//           isEdit={editData}
//           isTDS={isTDS}
//           taxType={taxType}
//           editId={editId}
//         />
//       )}

//       <TDSEditPopover
//         anchorEl={anchorEl}
//         onClose={handleClosePopover}
//         editAmount={editAmount}
//         setEditAmount={setEditAmount}
//         onUpdate={handleUpdateTDS}
//       />
//     </>
//   );
// }

import {
  Box,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTaxList } from "../../../../../hooks/products/products-hooks";

import { useItemCalculations } from "../hooks/useItemCalculations";
import ItemTableHeader from "./ItemTableHeader";
import ItemTotalsPanel from "./ItemTotalsPanel";
import TDSEditPopover from "./TDSEditPopover";
import ManageTDS from "../../TDS/ManageTDS";
import UpsertTDS from "../../TDS/UpsertTDS";
import ItemTableRow from "./ItemTablerow";
import { useAccountTree } from "../../../../../hooks/account/account-hooks";
import { useNavigate } from "react-router-dom";

export default function ItemTableSection({
  control,
  fields,
  append,
  remove,
  priceVariantsData,
  isLoadingVariants,
  currencySymbol = "₹",
  watch,
  setValue,
  register,
  edit,
  errors,
  billingAddress,
  setError,
  clearErrors,
}) {
  const navigate = useNavigate();
  const isTDS = watch("taxType") === "TDS";
  const taxType = isTDS ? "TDS" : "TCS";

  // ─── TDS popover state ────────────────────────────────────────────────────
  const [anchorEl, setAnchorEl] = useState(null);
  const [editAmount, setEditAmount] = useState(0);

  const handleEditTDSClick = (event) => {
    setEditAmount(watch("tdsValue"));
    setAnchorEl(event.currentTarget);
  };
  const handleClosePopover = () => setAnchorEl(null);
  const handleUpdateTDS = () => {
    setValue("tdsValue", editAmount, { shouldDirty: true });
    handleClosePopover();
  };

  // ─── Manage / Upsert TDS dialog state ────────────────────────────────────
  const [openManageTds, setOpenManageTds] = useState(false);
  const [openTds, setOpenTds] = useState(false);
  const [editData, setEditData] = useState(false);
  const [editId, setEditId] = useState(null);

  // const handleOpenTds = () => setOpenManageTds(true);
  const handleOpenTds = () => {
    if (taxType === "TDS") {
      navigate("/settings/configuration/manage-tax?type=tds");
    } else {
      navigate("/settings/configuration/manage-tax?type=tcs");
    }
  };
  const handleCloseTds = () => setOpenManageTds(false);
  const handleOpenCreateTds = () => setOpenTds(true);
  const handleCloseCreateTds = () => setOpenTds(false);

  const handleEdit = (editid) => {
    setEditData(true);
    setEditId(editid);
    handleOpenCreateTds();
    handleCloseTds();
  };
  const handleCreateNewTds = () => {
    setEditData(false);
    handleOpenCreateTds();
    handleCloseTds();
  };

  // Reset TDS fields whenever tax type changes (only on create, not edit)
  useEffect(() => {
    if (!edit) {
      setValue("tdsTaxId", null);
      setValue("tdsValue", 0.0);
    }
  }, [taxType]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Product options ──────────────────────────────────────────────────────
  /**
   * Transforms raw variant data into the shape that CreatableAutocomplete and
   * ItemTableRow expect.  Each option carries all the metadata needed to
   * auto-fill a row when a known product is selected.
   */
  const productOptions = useMemo(() => {
    const rawData = priceVariantsData?.data || priceVariantsData || [];
    if (!Array.isArray(rawData) || rawData.length === 0) return [];

    return rawData.map((product) => ({
      label: `${product.productName || product.name} - (${product.planName})`,
      dropdownlabel: product.productName || product.name || "Unknown",
      value: product._id,
      variantId: product._id,
      productId: product.productId || product._id || "",
      productName: product.productName || product.name || "",
      planId: product.planId || "",
      planName: product.planName || "",
      billingCycleId: product.billingCycleId || "",
      billingCycleLabel: product.billingCycleName || "",
      duration: product.duration || 1,
      durationUnit: product.durationUnit || "month",
      unit: product.unit || "",
      registerPrice: product.registerPrice || product.register_amount || 0,
      transferPrice: product.transferPrice || product.transfer_amount || 0,
      renewalPrice: product.renewalPrice || product.renewal_amount || 0,
    }));
  }, [priceVariantsData]);

  // ─── Pricing options per product ─────────────────────────────────────────
  /**
   * Returns the three pricing types (Register / Transfer / Renewal) for a
   * given product variant ID.
   *
   * Returns an empty array when:
   *   • no ID is provided, OR
   *   • the ID is a manual string that doesn't match any known option
   *     (in that case ItemTableRow renders without a pricing-type dropdown).
   */
  const getPricingOptions = (id) => {
    if (!id) return [];
    const product = productOptions.find((p) => p.value === id);
    if (!product) return []; // manual / unknown product — no pricing dropdown

    return [
      {
        label: `Register (${currencySymbol}${product.registerPrice})`,
        value: "register",
        price: product.registerPrice,
      },
      {
        label: `Transfer (${currencySymbol}${product.transferPrice})`,
        value: "transfer",
        price: product.transferPrice,
      },
      {
        label: `Renewal (${currencySymbol}${product.renewalPrice})`,
        value: "renewal",
        price: product.renewalPrice,
      },
    ];
  };

  // ─── Tax list ─────────────────────────────────────────────────────────────
  const { data: taxList, isLoading: taxLoading } = useTaxList({ taxType });
  const taxData = useMemo(
    () =>
      taxList?.data?.map((tax) => ({
        label: `${tax?.taxName}-${tax?.rate}`,
        value: tax?._id,
      })) || [],
    [taxList],
  );
  const rateMap = useMemo(
    () =>
      taxList?.data?.reduce((acc, t) => {
        acc[t._id] = t.rate;
        return acc;
      }, {}) || {},
    [taxList],
  );

  const { data: accountTree = {} } = useAccountTree();

  const flattenAccounts = (accounts, group) => {
    return accounts.flatMap((account) => {
      const current = {
        label: account.accountName,
        value: account._id,
        group,
        parentAccountId: account.parentAccountId,
      };

      if (account.children && account.children.length > 0) {
        return [current, ...flattenAccounts(account.children, group)];
      }
      return [current];
    });
  };

  const parentAccountOptions = useMemo(() => {
    if (!accountTree) return [];
    return Object.entries(accountTree).flatMap(([group, accounts]) =>
      Array.isArray(accounts) ? flattenAccounts(accounts, group) : [],
    );
  }, [accountTree]);

  // ─── Totals calculations ──────────────────────────────────────────────────
  const calculations = useItemCalculations({
    control,
    setValue,
    watch,
    billingAddress,
  });

  // ─── Add empty row ────────────────────────────────────────────────────────
  const handleAddRow = () => {
    append({
      productId: "",
      planId: "",
      billingCycleId: "",
      productName: "",
      planName: "",
      billingCycleLabel: "",
      duration: "",
      durationUnit: "",
      description: "",
      quantity: 1,
      price: 0,
      unit: "",
      tax: { taxName: "", percentage: 0, amount: 0 },
    });
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <Box sx={{ width: "100%", mt: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography fontSize={16} fontWeight={600}>
            Item Table
          </Typography>
        </Box>

        <TableContainer
          sx={{ border: "1px solid #e0e0e0", borderRadius: "4px" }}
        >
          <Table>
            <ItemTableHeader />
            <TableBody>
              {fields.map((row, index) => (
                <ItemTableRow
                  key={row.id}
                  row={row}
                  index={index}
                  control={control}
                  setValue={setValue}
                  errors={errors}
                  watchedItems={calculations.watchedItems}
                  productOptions={productOptions}
                  isLoadingVariants={isLoadingVariants}
                  getPricingOptions={getPricingOptions}
                  remove={remove}
                  edit={edit}
                  currencySymbol={currencySymbol}
                  watch={watch}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <ItemTotalsPanel
          control={control}
          register={register}
          watch={watch}
          setValue={setValue}
          taxData={taxData}
          rateMap={rateMap}
          isTDS={isTDS}
          onEditTDSClick={handleEditTDSClick}
          onOpenManageTds={handleOpenTds}
          onAddRow={handleAddRow}
          subTotal={calculations.subTotal}
          discountAmount={calculations.discountAmount}
          taxBreakdown={calculations.taxBreakdown}
          totalTaxAmount={calculations.totalTaxAmount}
          adjustment={calculations.adjustment}
          totalAmount={calculations.totalAmount}
          tdsamountvalue={calculations.tdsamountvalue}
          tdstaxcalculation={calculations.tdstaxcalculation}
          errors={errors}
          setError={setError}
          clearErrors={clearErrors}
          accountOptions={parentAccountOptions}
        />
      </Box>

      {openManageTds && (
        <ManageTDS
          open={openManageTds}
          onClose={handleCloseTds}
          handleCreateNewTds={handleCreateNewTds}
          handleEdit={handleEdit}
          isTDS={isTDS}
          taxType={taxType}
          taxData={taxData}
          taxLoading={taxLoading}
        />
      )}

      {openTds && (
        <UpsertTDS
          open={openTds}
          onClose={handleCloseCreateTds}
          isEdit={editData}
          isTDS={isTDS}
          taxType={taxType}
          editId={editId}
        />
      )}

      <TDSEditPopover
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        editAmount={editAmount}
        setEditAmount={setEditAmount}
        onUpdate={handleUpdateTDS}
      />
    </>
  );
}
