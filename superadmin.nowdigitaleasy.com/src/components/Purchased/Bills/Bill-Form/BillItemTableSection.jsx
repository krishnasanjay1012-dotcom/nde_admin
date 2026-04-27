import {
  Box,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import BillItemTableHeader from "./BillItemTableHeader";
import BillItemTableRow from "./BillItemTableRow";
import BillItemTotalPanel from "./BillItemTotalPanel";
import { useTaxList } from "../../../../hooks/products/products-hooks";
import ManageTDS from "../../../Sales/Invoices/TDS/ManageTDS";
import TDSEditPopover from "../../../Sales/Invoices/New Component/ItemTableFolder/TDSEditPopover";
import UpsertTDS from "../../../Sales/Invoices/TDS/UpsertTDS";
import { Controller } from "react-hook-form";
import { CommonSelect } from "../../../common/fields";
import { useBillItemCalculations } from "../Hooks/useBillItemCalculations";
import { useItemCustomView } from "../../../../hooks/Items/Items-hooks";
import { useAccountTree } from "../../../../hooks/account/account-hooks";
import { useNavigate } from "react-router-dom";

const TAX_SELECT = [
  { label: "Tax Exclusive", value: "exclusive" },
  { label: "Tax Inclusive", value: "inclusive" },
];

const BillItemTableSection = ({
  control,
  fields,
  append,
  remove,
  isLoadingVariants,
  watch,
  setValue,
  register,
  edit,
  errors,
  billingAddress,
  setError,
  clearErrors,
}) => {
  const navigate = useNavigate();
  const isTDS = watch("taxType") === "TDS";
  const taxType = isTDS ? "TDS" : "TCS";
  const taxSelect = watch("taxSelect");
  const source = watch("source");
  const destination = watch("destination");

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

  // const productOptions = [
  //   {
  //     label: "Domain - (.com)",
  //     dropdownlabel: "Domain",
  //     value: "1",
  //     variantId: "1",
  //     productId: "prod1",
  //     productName: "Domain",
  //     planId: "plan1",
  //     planName: ".com",
  //     billingCycleId: "bc1",
  //     billingCycleLabel: "1 Year",
  //     duration: 1,
  //     durationUnit: "year",
  //     unit: "",
  //     registerPrice: 800,
  //     transferPrice: 750,
  //     renewalPrice: 850,
  //   },
  //   {
  //     label: "Hosting - (Basic Plan)",
  //     dropdownlabel: "Hosting",
  //     value: "2",
  //     variantId: "2",
  //     productId: "prod2",
  //     productName: "Hosting",
  //     planId: "plan2",
  //     planName: "Basic Plan",
  //     billingCycleId: "bc2",
  //     billingCycleLabel: "1 Month",
  //     duration: 1,
  //     durationUnit: "month",
  //     unit: "",
  //     registerPrice: 500,
  //     transferPrice: 450,
  //     renewalPrice: 550,
  //   },
  // ];

  // const getPricingOptions = (id) => {
  //   const product = productOptions.find((p) => p.value === id);
  //   if (!product) return [];
  //   return [
  //     {
  //       label: `Register (${currencySymbol}${product.registerPrice})`,
  //       value: "register",
  //       price: product.registerPrice,
  //     },
  //     {
  //       label: `Transfer (${currencySymbol}${product.transferPrice})`,
  //       value: "transfer",
  //       price: product.transferPrice,
  //     },
  //     {
  //       label: `Renewal (${currencySymbol}${product.renewalPrice})`,
  //       value: "renewal",
  //       price: product.renewalPrice,
  //     },
  //   ];
  // };

  // const itemOptions = [
  //   {
  //     label: "chairs",
  //     value: "chair",
  //     account: "Sales account",
  //     price: "1500",
  //     unit: "5",
  //   },
  //   {
  //     label: "Gates",
  //     value: "gates",
  //     account: "expense account",
  //     price: "3500",
  //     unit: "4",
  //   },
  // ];

  const { data: itemApiResponse } = useItemCustomView({
    page: 1,
    limit: 20,
    filter: "69ba9a2272ea8144d3ff8bb3",
  });

  const itemOptions = useMemo(() => {
    return (itemApiResponse?.data ?? []).map((item) => ({
      label: item.name,
      value: item._id,
      price: parseFloat(item.purchaseRate?.replace(/[^\d.]/g, "") ?? 0),
      unit: item.unit ?? "",
      description: item.purchaseDescription ?? "",
      account: "",
    }));
  }, [itemApiResponse]);

  const watchedItems = watch("lineItems");
  const isReverse = watch("isReverseCharge");

  useEffect(() => {
    if (!edit) {
      setValue("tdsTaxId", null);
      setValue("tdsValue", 0.0);
    }
  }, [taxType]);

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

  const calculations = useBillItemCalculations({
    control,
    setValue,
    watch,
    billingAddress,
    taxSelect,
    source,
    destination,
    isReverse,
  });

  const handleAddRow = () => {
    append({
      itemId: "",
      itemName: "",
      account: "",
      description: "",
      quantity: 1,
      price: 0,
      unit: "",
      tax: { taxName: "", percentage: 0, amount: 0 },
    });
  };

  return (
    <>
      <Box sx={{ width: "100%", mt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 3 }}>
          <Typography fontSize={16} fontWeight={600}>
            Item Table
          </Typography>

          <Controller
            name="taxSelect"
            control={control}
            render={({ field, fieldState }) => (
              <CommonSelect
                {...field}
                options={TAX_SELECT}
                value={field.value || ""}
                mt={0}
                mb={0}
                width="150px"
                height={"35px"}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                clearable={false}
              />
            )}
          />
        </Box>

        <TableContainer
          sx={{ border: "1px solid #e0e0e0", borderRadius: "4px" }}
        >
          <Table>
            <BillItemTableHeader />
            <TableBody>
              {fields.map((row, index) => (
                <BillItemTableRow
                  key={row.id}
                  row={row}
                  index={index}
                  control={control}
                  setValue={setValue}
                  errors={errors}
                  watchedItems={watchedItems}
                  itemOptions={itemOptions}
                  accountOptions={parentAccountOptions}
                  isLoadingVariants={isLoadingVariants}
                  remove={remove}
                  edit={edit}
                  watch={watch}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <BillItemTotalPanel
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
          baseAmount={calculations.baseAmount}
          discountAmount={calculations.discountAmount}
          taxBreakdown={calculations.taxBreakdown}
          totalTaxAmount={calculations.totalTaxAmount}
          adjustment={calculations.adjustment}
          totalAmount={calculations.totalAmount}
          tdsamountvalue={calculations.tdsamountvalue}
          tdstaxcalculation={calculations.tdstaxcalculation}
          isInclusive={calculations.isInclusive}
          errors={errors}
          accountOptions={parentAccountOptions}
          isReverse={isReverse}
          setError={setError}
          clearErrors={clearErrors}
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
};

export default BillItemTableSection;
