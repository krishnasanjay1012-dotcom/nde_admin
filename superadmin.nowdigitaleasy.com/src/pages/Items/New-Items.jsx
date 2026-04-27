import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Typography,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import Delete from "../../assets/icons/delete.svg";

import {
  CommonTextField,
  CommonSelect,
  CommonRadioButton,
  CommonCheckbox,
  CommonDescriptionField,
} from "../../components/common/fields";

import CommonButton from "../../components/common/NDE-Button";
import CommonVendorList from "../../components/common/NDE-Vendor-list";

import { useGetItemInfo, useItemCreate, useUpdateItemById } from "../../hooks/Items/Items-hooks";
import { useCurrencies } from "../../hooks/settings/currency";
import { useAccounts } from "../../hooks/account/account-hooks";
import { useGetGstTaxes } from "../../hooks/tax/tax-hooks";
import SearchIcon from "@mui/icons-material/Search";
import ItemsHSNSearch from "./Items-HSNSearch";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  type: yup.string().required("Type is required"),
  unit: yup.string(),
  tax: yup.string().required("Tax is required"),

  salesInformation: yup.boolean(),
  sellingPrice: yup.number().when("salesInformation", {
    is: true,
    then: () =>
      yup
        .number()
        .typeError("Must be a number")
        .required("Selling price is required")
        .positive(),
    otherwise: () =>
      yup.number().nullable().transform((v) => (v === "" ? null : v)),
  }),
  salesAccount: yup.string().when("salesInformation", {
    is: true,
    then: () => yup.string().required("Account is required"),
  }),

  purchaseInformation: yup.boolean(),
  costPrice: yup.number().when("purchaseInformation", {
    is: true,
    then: () =>
      yup
        .number()
        .typeError("Must be a number")
        .required("Cost price is required")
        .positive(),
    otherwise: () =>
      yup.number().nullable().transform((v) => (v === "" ? null : v)),
  }),
  purchaseAccount: yup.string().when("purchaseInformation", {
    is: true,
    then: () => yup.string().required("Account is required"),
  }),
  vendor: yup.string().nullable(),
});

const defaultValues = {
  name: "",
  type: "Goods",
  unit: "",
  sku: "",
  hsn: "",
  tax: "Taxable",

  salesInformation: true,
  sellingPrice: "",
  salesAccount: "Sales",

  purchaseInformation: true,
  costPrice: "",
  purchaseAccount: "Cost of Goods Sold",
  vendor: "",
};

const Row = ({ label, required, children }) => (
  <Box display="flex" alignItems="center" mb={2}>
    <Box width="160px">
      <Typography color={required ? "error" : "text.primary"}>
        {label}
      </Typography>
    </Box>
    <Box flex={1}>{children}</Box>
  </Box>
);  

const NewItems = () => {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const isEdit = Boolean(itemId);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenDrawer = () => setDrawerOpen(true);
  const handleCloseDrawer = () => setDrawerOpen(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { mutate: createItem, isPending } = useItemCreate();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateItemById();

  const { data } = useGetItemInfo(itemId);
  const itemData = data?.data;

  const { data: taxesData } = useGetGstTaxes();
  const gstTaxes = taxesData?.data || [];
  const { data: accountList } = useAccounts();
  const { data: currenciesResponse = {} } = useCurrencies();

  const account = accountList?.data || [];
  const currencies = currenciesResponse?.data || [];

  const watchedType = useWatch({ control, name: "type" });
  const isService = watchedType === "Service";

  useEffect(() => {
    if (!isEdit) {
      setValue("hsn", "");
    }
  }, [watchedType, setValue, isEdit]);

  const currencyOptions = useMemo(
    () =>
      currencies.map((c) => ({
        label: c.code,
        value: c._id,
        isDefault: c.isdefault,
      })),
    [currencies]
  );

  const taxOptions = useMemo(
    () =>
      gstTaxes.map((c) => ({
        label: c.tax_name,
        value: c._id,
      })),
    [gstTaxes]
  );

  const accountOptions = useMemo(
    () =>
      account.map((c) => ({
        label: c.accountName,
        value: c._id,
      })),
    [account]
  );
  

  useEffect(() => {
    if (itemData && isEdit && accountOptions.length) {
      setValue("name", itemData.name || "");
      setValue("sku", itemData.sku || "");
      setValue("type", itemData.type === "goods" ? "Goods" : "Service");
      setValue("unit", itemData.unit || "");
      setValue("tax", itemData.tax?._id || "");
      setValue("currency", itemData.currency?._id || "");
      setValue("hsn", itemData.hsn || "");

      // SALES
      setValue("salesInformation", !!itemData.rate);
      setValue("sellingPrice", itemData.rate || "");
      setValue("salesAccount", itemData.account?._id || "");
      setValue("salesDescription", itemData.description || "");

      // PURCHASE
      setValue("purchaseInformation", !!itemData.purchaseRate);
      setValue("costPrice", itemData.purchaseRate || "");
      setValue("purchaseAccount", itemData.purchaseAccount?._id || "");
      setValue("purchaseDescription", itemData.purchaseDescription || "");

      setValue("intraStateTax", itemData.intraStateTax?._id || "");
      setValue("interStateTax", itemData.interStateTax?._id || "");

      const venId = typeof itemData.vendor === "string" ? itemData.vendor : itemData.vendor?._id;
      if (venId) {
        setValue("vendor", venId);
      }

      if (itemData.logo) {
        setImage({
          preview: itemData.logo,
        });
      }
    }
  }, [itemData, isEdit, accountOptions, setValue]);

  useEffect(() => {
    const def = currencyOptions.find((opt) => opt.isDefault)?.value || "";
    setValue("currency", def);
  }, [currencyOptions, setValue]);

  const defaultCurrency = currencyOptions.find((opt) => opt.isDefault)?.value || "";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleRemoveImage = () => setImage(null);

  useEffect(() => {
    if (!isEdit && gstTaxes.length) {
      const intraTax =
        gstTaxes.find((t) => t.tax_type === "cgst") ||
        gstTaxes.find((t) => t.tax_type === "sgst");
      const interTax = gstTaxes.find((t) => t.tax_type === "sgst");

      if (intraTax) {
        setValue("intraStateTax", intraTax._id);
      }

      if (interTax) {
        setValue("interStateTax", interTax._id);
      }
    }
  }, [gstTaxes, isEdit, setValue]);

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("sku", data.sku || "");
    formData.append("type", data.type?.toLowerCase());
    formData.append("unit", data.unit || "");

    formData.append("tax", data.tax || "");
    formData.append("status", "ACTIVE");
    formData.append("currency", data.currency || "");
    formData.append("intraStateTax", data.intraStateTax || "");
    formData.append("interStateTax", data.interStateTax || "");

    if (data.type === "Service") {
      formData.append("sac", data.hsn || "");
    } else {
      formData.append("hsn", data.hsn || "");
    }

    if (data.salesInformation) {
      formData.append("rate", data.sellingPrice || 0);
      formData.append("account", data.salesAccount || "");
      formData.append("description", data.salesDescription || "");
    }

    if (data.purchaseInformation) {
      formData.append("purchaseRate", data.costPrice || 0);
      formData.append("purchaseAccount", data.purchaseAccount || "");
      formData.append("purchaseDescription", data.purchaseDescription || "");
      formData.append("vendor", data.vendor || "");
    }

    if (image?.file) {
      formData.append("logo", image.file);
    }

    if (isEdit) {
      updateItem(
        { itemId: itemId, data: formData },
        {
          onSuccess: () => navigate(-1),
        }
      );
    } else {
      createItem(formData, {
        onSuccess: () => navigate(-1),
      });
    }
  };

  const unitOptions = [
    { label: "LICENSE", value: "LICENSE" },
    { label: "USER", value: "USER" },
    { label: "SEAT", value: "SEAT" },
    { label: "GB", value: "GB" },
    { label: "DOMAIN", value: "DOMAIN" },
    { label: "CM", value: "CM" },
    { label: "GRAM", value: "GRAM" },
  ];

  const handleClose = () => {
    navigate(-1);
  };


  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
        }}
      >
        <Typography variant="h4">
          {isEdit ? "Edit Item" : "New Item"}
        </Typography>

        <IconButton onClick={handleClose} color="error">
          <CloseIcon sx={{ color: "error.main" }} />
        </IconButton>
      </Box>

      <Divider />

      <Box
        sx={{
          overflow: "auto",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" gap={4} p={3}>
            {/* LEFT */}
            <Box flex={1} maxWidth={500}>
              <Row label="Name*" required>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <CommonTextField
                      {...field}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      mb={0}
                      mt={0}
                    />
                  )}
                />
              </Row>

              <Row label="Type">
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <CommonRadioButton
                      {...field}
                      row
                      options={[
                        { label: "Goods", value: "Goods" },
                        { label: "Service", value: "Service" },
                      ]}
                      mb={0}
                      mt={0}
                    />
                  )}
                />
              </Row>

              <Row label="SKU">
                <Controller
                  name="sku"
                  control={control}
                  render={({ field }) => (
                    <CommonTextField {...field} mb={0} mt={0} />
                  )}
                />
              </Row>

              <Row label="Unit">
                <Controller
                  name="unit"
                  control={control}
                  render={({ field }) => (
                    <CommonSelect {...field} mb={0} mt={0} options={unitOptions} />
                  )}
                />
              </Row>

              <Row label={isService ? "SAC Code" : "HSN Code"}>
                <Controller
                  name="hsn"
                  control={control}
                  render={({ field }) => (
                    <CommonTextField
                      {...field}
                      mb={0}
                      mt={0}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleOpenDrawer}
                              onMouseDown={(e) => e.preventDefault()}
                              edge="end"
                            >
                              <SearchIcon sx={{ color: "primary.main" }} fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Row>

              <Row label="Tax Preference*" required>
                <Controller
                  name="tax"
                  control={control}
                  render={({ field }) => (
                    <CommonSelect
                      {...field}
                      options={taxOptions}
                      error={!!errors.tax}
                      helperText={errors.tax?.message}
                      mb={-4}
                      mt={0}
                    />
                  )}
                />
              </Row>
            </Box>

            {/* RIGHT IMAGE */}
            <Box width="260px">
              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: "1px dashed #ccc",
                  borderRadius: 2,
                  height: 180,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  onChange={handleImageChange}
                />

                {!image ? (
                  <>
                    <ImageOutlinedIcon sx={{ fontSize: 40, color: "#aaa" }} />
                    <Typography>Drag image(s) here</Typography>
                    <Typography color="primary">Browse images</Typography>
                  </>
                ) : (
                  <>
                    <img
                      src={image.preview}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage();
                      }}
                      sx={{ position: "absolute", top: 5, right: 5 }}
                    >
                      <img src={Delete} height={20} />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box display="flex" gap={4} px={2}>
            {/* SALES */}
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Typography variant="h6">Sales Information</Typography>

                <Controller
                  name="salesInformation"
                  control={control}
                  defaultValue={true}
                  render={({ field }) => (
                    <CommonCheckbox
                      name={field.name}
                      checked={field.value || false}
                      onChange={(e) => field.onChange(e.target.checked)}
                      label="Sellable"
                    />
                  )}
                />
              </Box>

              <Row label="Selling Price*" required>
                <Controller
                  name="sellingPrice"
                  control={control}
                  render={({ field }) => (
                    <CommonTextField
                      {...field}
                      type="number"
                      inputProps={{ min: 0, step: "1" }}
                      mb={0}
                      error={!!errors.costPrice}
                      helperText={errors.costPrice?.message}
                      startAdornment={
                        <Controller
                          name="currency"
                          control={control}
                          defaultValue={defaultCurrency}
                          render={({ field: currencyField }) => (
                            <CommonSelect
                              name={currencyField.name}
                              value={currencyField.value}
                              onChange={currencyField.onChange}
                              options={currencyOptions}
                              sx={{
                                bgcolor: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "background.muted"
                                    : "#f9f9fb",
                                marginLeft: "-14px",
                                marginTop: "15px",
                                "& .MuiSelect-select": {
                                  padding: "5px 8px",
                                  fontSize: "12px",
                                },
                              }}
                            />
                          )}
                        />
                      }
                    />
                  )}
                />
              </Row>

              <Row label="Account*" required>
                <Controller
                  name="salesAccount"
                  control={control}
                  render={({ field }) => (
                    <CommonSelect {...field} options={accountOptions} />
                  )}
                />
              </Row>

              <Typography>Description</Typography>
              <Controller
                name="salesDescription"
                control={control}
                render={({ field }) => (
                  <CommonDescriptionField {...field} rows={3} />
                )}
              />

              <Divider />
              <Box mt={2}>
                <Typography variant="h6" mb={2}>
                  Default Tax Rate
                </Typography>
                <Box width="380px">
                  <Row label="Intra State Tax Rate">
                    <Controller
                      name="intraStateTax"
                      control={control}
                      render={({ field }) => (
                        <CommonSelect {...field} options={taxOptions} mt={0} mb={0} />
                      )}
                    />
                  </Row>
                  <Row label="Inter State Tax Rate">
                    <Controller
                      name="interStateTax"
                      control={control}
                      render={({ field }) => (
                        <CommonSelect {...field} options={taxOptions} mt={0} mb={0} />
                      )}
                    />
                  </Row>
                </Box>
              </Box>
            </Box>

            {/* PURCHASE */}
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Typography variant="h6">Purchase Information</Typography>
                <Controller
                  name="purchaseInformation"
                  control={control}
                  defaultValue={true}
                  render={({ field }) => (
                    <CommonCheckbox
                      name={field.name}
                      checked={field.value || false}
                      onChange={(e) => field.onChange(e.target.checked)}
                      label="Purchasable"
                    />
                  )}
                />
              </Box>

              <Row label="Cost Price*" required>
                <Controller
                  name="costPrice"
                  control={control}
                  render={({ field }) => (
                    <CommonTextField
                      {...field}
                      type="number"
                      inputProps={{ min: 0, step: "1" }}
                      mb={0}
                      error={!!errors.costPrice}
                      helperText={errors.costPrice?.message}
                      startAdornment={
                        <Controller
                          name="currency"
                          control={control}
                          defaultValue={defaultCurrency}
                          render={({ field: currencyField }) => (
                            <CommonSelect
                              name={currencyField.name}
                              value={currencyField.value}
                              onChange={currencyField.onChange}
                              options={currencyOptions}
                              sx={{
                                bgcolor: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "background.muted"
                                    : "#f9f9fb",
                                marginLeft: "-14px",
                                marginTop: "15px",
                                "& .MuiSelect-select": {
                                  padding: "5px 8px",
                                  fontSize: "12px",
                                },
                              }}
                            />
                          )}
                        />
                      }
                    />
                  )}
                />
              </Row>

              <Row label="Account*" required>
                <Controller
                  name="purchaseAccount"
                  control={control}
                  render={({ field }) => (
                    <CommonSelect {...field} options={accountOptions} />
                  )}
                />
              </Row>

              <Typography>Description</Typography>
              <Controller
                name="purchaseDescription"
                control={control}
                render={({ field }) => (
                  <CommonDescriptionField {...field} rows={3} />
                )}
              />

              <CommonVendorList
                name="vendor"
                control={control}
                label="Prefered Vendor"
                vendorData={typeof itemData?.vendor === "string" ? itemData.vendor : itemData?.vendor?._id}
                setValue={setValue}
              />
            </Box>
          </Box>

          {/* ACTIONS */}
          <Box
            display="flex"
            gap={2}
            p={1}
            position="sticky"
            bottom={0}
            sx={{ bgcolor: "background.paper" }}
          >
            <CommonButton
              type="submit"
              variant="contained"
              disabled={isPending || isUpdating || !isDirty}
              label={isEdit ? "Update" : "Save"}
              startIcon
            />
            <CommonButton
              variant="outlined"
              onClick={() => navigate(-1)}
              label="Cancel"
              startIcon
              type="button"
            />
          </Box>
        </form>
      </Box>

      <ItemsHSNSearch
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onSelect={(hsn) => {
          setValue("hsn", hsn);
          handleCloseDrawer();
        }}
        isService={isService}
        title={isService ? "Find SAC Code" : "Find HSN Code"}
      />
    </Box>
  );
};

export default NewItems;