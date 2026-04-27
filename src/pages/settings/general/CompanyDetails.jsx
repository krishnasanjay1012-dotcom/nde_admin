import React, { useEffect, useRef } from "react";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonNumberField from "../../../components/common/fields/NDE-NumberField";
import CommonCountrySelect from "../../../components/common/fields/NDE-CountrySelect";
import CommonDescriptionField from "../../../components/common/fields/NDE-DescriptionField";
import { useConfigSettings, useGSuiteOAuthActiveConfig, useUpdateConfigSettings } from "../../../hooks/settings/confi-setting.js";
import countries from "../../../components/common/data/countries";
import WaveLoader from "../../../components/common/NDE-WaveLoader.jsx";
import { Tooltip } from "@mui/material";

// Validation schema
const schema = yup.object().shape({
  companyName: yup.string().required("Company Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  address: yup.string().required("Address is required"),
  district: yup.string().required("District is required"),
  state: yup.string().required("State is required"),
  country: yup.object().required("Country is required"),
  pincode: yup.string().required("Pincode is required"),
  phone: yup.string().required("Phone is required"),
  gstin: yup.string(),
  panNo: yup.string(),
  cin: yup.string(),
  logo1: yup.string(),
  logo2: yup.string(),
  notes: yup.string(),
  invoiceStartNo: yup
    .number()
    .typeError("Must be a number")
    .required("Invoice Start No is required"),
  dateFormat: yup.string().required("Date Format is required"),
  lateFee: yup.number().typeError("Must be a number"),
  invoiceIncrement: yup.number().typeError("Must be a number"),
  invoicePrefix: yup.string(),
  estimation: yup.number().typeError("Must be a number"),
  payTo: yup.string(),
  dueTime: yup.number().typeError("Must be a number"),
  cgst: yup.number().typeError("Must be a number"),
  sgst: yup.number().typeError("Must be a number"),
  igst: yup.number().typeError("Must be a number"),
  accountNo: yup.string().required("Account No is required"),
  accountName: yup.string().required("Account Name is required"),
  bankName: yup.string().required("Bank Name is required"),
  branch: yup.string().required("Branch is required"),
  ifsc: yup.string().required("IFSC is required"),
  auditor1: yup.string(),
  auditor2: yup.string(),
});

const defaultValues = {
  companyName: "",
  email: "",
  address: "",
  district: "",
  state: "",
  country: null,
  pincode: "",
  phone: "",
  gstin: "",
  panNo: "",
  cin: "",
  logo1: "",
  logo2: "",
  notes: "",
  invoiceStartNo: "",
  dateFormat: "",
  lateFee: "",
  invoiceIncrement: "",
  invoicePrefix: "",
  estimation: "",
  payTo: "",
  dueTime: "",
  cgst: "",
  sgst: "",
  igst: "",
  accountNo: "",
  accountName: "",
  bankName: "",
  branch: "",
  ifsc: "",
  auditor1: "",
  auditor2: "",

};

const CompanyDetails = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors , isDirty},
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { data: configData, isLoading } = useConfigSettings();
  const { data: oAuthData } = useGSuiteOAuthActiveConfig();

  const updateConfig = useUpdateConfigSettings();

  const lastLoadedData = useRef(defaultValues);

  // Map API data into form
  useEffect(() => {
    if (configData?.data?.length) {
      const apiData = configData.data[0];

      const selectedCountry =
        countries.find(
          (c) =>
            c.label.toLowerCase() ===
            apiData.company_address?.country?.toLowerCase()
        ) || null;

      const mappedData = {
        companyName: apiData.companyName || "",
        email: apiData.email || "",
        address: apiData.company_address?.address || "",
        district: apiData.company_address?.district || "",
        state: apiData.company_address?.state || "",
        country: selectedCountry,
        pincode: apiData.company_address?.pincode || "",
        phone: apiData.company_address?.Phone || "",
        gstin: apiData.company_address?.Gstin || "",
        panNo: apiData.company_address?.PanNo || "",
        cin: apiData.company_address?.cin || "",
        logo1: apiData.logo1 || "",
        logo2: apiData.company_address?.logo2 || "",
        notes: apiData.Notes || "",
        invoiceStartNo: apiData.invoiceStartNo || "",
        dateFormat: apiData.dateFormat || "",
        lateFee: apiData.lateFee || "",
        invoiceIncrement: apiData.invoiceNumIncrement || "",
        invoicePrefix: apiData.invoicePrefix || "",
        estimation: apiData.invoiceEstimation || "",
        payTo: apiData.paytoText || "",
        dueTime: apiData.Due_time || "",
        cgst: apiData.cgstPercentage || "",
        sgst: apiData.sgstPercentage || "",
        igst: apiData.igstPercentage || "",
        accountNo: apiData.accountDetails?.AccountNo || "",
        accountName: apiData.accountDetails?.Name || "",
        bankName: apiData.accountDetails?.Bank || "",
        branch: apiData.accountDetails?.Branch || "",
        ifsc: apiData.accountDetails?.IfscCode || "",
        auditor1: apiData.auditorEmail1 || "",
        auditor2: apiData.auditorEmail2 || "",
      };

      lastLoadedData.current = mappedData;
      reset(mappedData);
    }

    if (oAuthData?.data) {
      const mappedOAuthData = {
        clientID: oAuthData.data.clientID || "",
        clientSecret: oAuthData.data.clientSecret || "",
        callback_url: oAuthData.data.callback_url || "",
      };

      const mergedData = { ...lastLoadedData.current, ...mappedOAuthData };
      lastLoadedData.current = mergedData;
      reset(mergedData);
    }
  }, [configData, oAuthData, reset]);

  const onSubmit = (formData) => {
    const payload = {
      companyName: formData.companyName,
      email: formData.email,
      logo1: formData.logo1,
      logo2: formData.logo2,
      Notes: formData.notes,
      invoiceStartNo: Number(formData.invoiceStartNo),
      invoiceNumIncrement: Number(formData.invoiceIncrement),
      invoicePrefix: formData.invoicePrefix,
      invoiceEstimation: Number(formData.estimation),
      dateFormat: formData.dateFormat,
      lateFee: Number(formData.lateFee),
      paytoText: formData.payTo,
      Due_time: Number(formData.dueTime),
      cgstPercentage: Number(formData.cgst),
      sgstPercentage: Number(formData.sgst),
      igstPercentage: Number(formData.igst),
      auditorEmail1: formData.auditor1,
      auditorEmail2: formData.auditor2,
      company_address: {
        address: formData.address,
        district: formData.district,
        state: formData.state,
        country: formData.country?.label || "",
        pincode: formData.pincode,
        Phone: formData.phone,
        Gstin: formData.gstin,
        PanNo: formData.panNo,
        cin: formData.cin,
        logo2: formData.logo2,
      },
      accountDetails: {
        AccountNo: formData.accountNo,
        Name: formData.accountName,
        Bank: formData.bankName,
        Branch: formData.branch,
        IfscCode: formData.ifsc,
      },
    };

    updateConfig.mutate(payload);
  };

  const handleCancel = () => {
    reset(lastLoadedData.current);
  };

  const renderField = (fieldName) => {
    let Component = CommonTextField;
    if (fieldName === "country") Component = CommonCountrySelect;
    if (
      [
        "invoiceStartNo",
        "lateFee",
        "invoiceIncrement",
        "estimation",
        "dueTime",
        "cgst",
        "sgst",
        "igst",
      ].includes(fieldName)
    ) {
      Component = CommonNumberField;
    }
    if (fieldName === "notes") Component = CommonDescriptionField;

    return (
      <Controller
        key={fieldName}
        name={fieldName}
        control={control}
        render={({ field }) => (
          <Component
            fullWidth
            label={fieldName
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
            {...field}
            error={!!errors[fieldName]}
            helperText={errors[fieldName]?.message}
            options={fieldName === "country" ? countries : undefined}
            mandatory
            width="100%"
          />
        )}
      />
    );
  };

  const companyRows = [
    ["companyName", "email"],
    ["address", "district"],
    ["state", "country"],
    ["pincode", "phone"],
    ["panNo", "logo1"],
    ["gstin", "cin"],
    ["logo2", "notes"],
  ];

  const invoiceRows = [
    ["invoiceStartNo", "dateFormat"],
    ["invoicePrefix", "lateFee"],
    ["invoiceIncrement", "estimation"],
    ["cgst", "sgst"],
    ["igst", "payTo"],
    ["dueTime"],
  ];

  const accountRows = [
    ["accountNo", "accountName"],
    ["bankName", "branch"],
    ["ifsc", "auditor1"],
    ["auditor2"],
  ];

  const OAuthRows = [
    ["clientID", "clientSecret"],
    ["callback_url"],
  ];

  const renderRows = (rows) =>
    rows.map((row, idx) => (
      <Box key={idx} display="flex" gap={2} flexWrap="wrap">
        {row.map((field) => (
          <Box key={field} flex={1} minWidth="200px">
            {renderField(field)}
          </Box>
        ))}
      </Box>
    ));

  if (isLoading) {
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <WaveLoader size={50} barCount={6} />
        <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
          Loading Config Details...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "calc(100vh - 160px)",
        overflowY: "auto",
        display: "flex",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1200 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Card>
              <CardHeader title="Company Details" />
              <Divider sx={{ borderColor: "#ccc", borderBottomWidth: 1 }} />
              <CardContent>{renderRows(companyRows)}</CardContent>
            </Card>

            <Card>
              <CardHeader title="Invoice Details" />
              <Divider sx={{ borderColor: "#ccc", borderBottomWidth: 1 }} />
              <CardContent>{renderRows(invoiceRows)}</CardContent>
            </Card>

            <Card>
              <CardHeader title="Account Details" />
              <Divider sx={{ borderColor: "#ccc", borderBottomWidth: 1 }} />
              <CardContent>{renderRows(accountRows)}</CardContent>
            </Card>

            <Card>
              <CardHeader title="G-Suite OAuth Details" />
              <Divider sx={{ borderColor: "#ccc", borderBottomWidth: 1 }} />
              <CardContent>
                <Tooltip title="This section is disabled">
                  <Box >
                    <Box sx={{ pointerEvents: "none", opacity: 0.5 }}>
                      {renderRows(OAuthRows)}
                    </Box>
                  </Box>
                </Tooltip>
              </CardContent>
            </Card>
          </Box>

          <Box display="flex" justifyContent="center" gap={2} mt={2}>
            <Button
              variant="outlined"
              color="primary.extraLight"
              onClick={handleCancel}
              sx={{ height: 40, width: 90, borderRadius: 1 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={updateConfig.isLoading || !isDirty}
              sx={{ height: 40, width: 130, borderRadius: 1, whiteSpace: "nowrap" }}
            >
              {updateConfig.isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default CompanyDetails;
