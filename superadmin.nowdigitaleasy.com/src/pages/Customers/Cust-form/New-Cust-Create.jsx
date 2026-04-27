import React, { useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Typography, Alert, Link, IconButton } from "@mui/material";
import SaveAltOutlinedIcon from "@mui/icons-material/SaveAltOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Country, State } from "country-state-city";

import Address from "../../../components/Customer/Address";
import OtherDetails from "../../../components/Customer/OtherDetails";
import Remarks from "../../../components/Customer/Remarks";
import CommonButton from "../../../components/common/NDE-Button";
import CommonTabs from "../../../components/common/NDE-No-Route-Tab";
import BasicField from "./Basic-Filed";

import {
  useClientSignup,
  useGetCustomerInfo,
  useUpdateClientById,
} from "../../../hooks/Customer/Customer-hooks";
import { useEmailGroups } from "../../../hooks/settings/email-hooks";
import { getCustomerFields } from "../../../components/common/data/customer-filed";
import GSTPrefillDrawer from "./GST-Fetch";
import ContactPersonsForm from "../../../components/Customer/ContactPerson";
import { Close } from "@mui/icons-material";

const getCustomerSchema = (isEdit) =>
  yup.object({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: isEdit
      ? yup.string().nullable()
      : yup.string().required("Password is required"),
    userType: yup.string().required("User type is required"),
    phone_number: yup
      .mixed()
      .required("Phone number is required")
      .test("is-valid-phone", "Invalid phone number", (value) => {
        if (!value) return false;
        try {
          const raw = typeof value === "object" ? value.number : value;
          const phoneNumber = parsePhoneNumberFromString(raw, "IN");
          return phoneNumber?.isValid();
        } catch {
          return false;
        }
      }),
    gst_treatment: yup.string().required("GST Treatment is required"),
    source_of_supply: yup
      .string()
      .nullable()
      .test(
        "is-required",
        "Source of Supply is required",
        function (value) {
          const { gst_treatment, gstin } = this.parent;
          if (gst_treatment === "unregistered") return !!value;
          if ((gst_treatment === "registered_regular" || gst_treatment === "registered_composition") && !!gstin) return !!value;
          return true;
        }
      ),
    gstin: yup
      .string()
      .nullable()
      .when("gst_treatment", {
        is: (val) => val === "registered_regular" || val === "registered_composition",
        then: (schema) => schema.required("GSTIN is required").matches(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
          { message: "Invalid GSTIN format", excludeEmptyString: true }
        ),
        otherwise: (schema) => schema.notRequired(),
      }),
    pan_no: yup
      .string()
      .nullable()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
        message: "Invalid PAN format",
        excludeEmptyString: true,
      }),
    billingcountry: yup.string().required("Billing country is required"),
    billingpinCode: yup
      .string()
      .nullable()
      .matches(/^[1-9][0-9]{5}$/, {
        message: "Invalid billing pincode",
        excludeEmptyString: true,
      }),
    billingphone: yup
      .string()
      .nullable()
      .matches(/^[6-9]\d{9}$/, {
        message: "Invalid mobile number",
        excludeEmptyString: true,
      }),
    currencyCode: yup.string().required("Currency is required"),
    currencyid: yup.string().nullable(),
    contact_persons: yup.array().when("has_contact_person", {
      is: true,
      then: () =>
        yup
          .array()
          .of(
            yup.object({
              name_details: yup.object({
                first_name: yup.string().required("First name is required"),
                last_name: yup.string().required("Last name is required"),
              }),
              email: yup
                .string()
                .email("Invalid email format")
                .required("Email is required"),
              phone: yup.object({
                work_phone: yup.object({
                  number: yup
                    .string()
                    .nullable()
                    .matches(/^[0-9]{6,15}$/, "Invalid work phone number"),
                }),
                mobile: yup.object({
                  number: yup
                    .string()
                    .nullable()
                    .matches(/^[0-9]{6,15}$/, "Invalid mobile number"),
                }),
              }),
              profile_pic: yup.string().nullable().url("Invalid URL format"),
            })
          )
          .min(1, "At least one contact person is required"),
      otherwise: () => yup.array().notRequired(),
    }),
  });

const buildAddressPayload = (data, prefix) => {
  const countryObj = Country.getCountryByCode(data[`${prefix}country`]);
  const stateObj =
    data[`${prefix}country`] &&
    data[`${prefix}state`] &&
    State.getStateByCodeAndCountry(
      data[`${prefix}state`],
      data[`${prefix}country`],
    );

  const payload = {};
  if (data[`${prefix}address`]) payload.address = data[`${prefix}address`];
  if (countryObj?.name) payload.country = countryObj.name;
  if (stateObj?.name) payload.state = stateObj.name;
  if (data[`${prefix}city`]) payload.city = data[`${prefix}city`];
  if (data[`${prefix}pinCode`]) payload.pinCode = data[`${prefix}pinCode`];
  if (data[`${prefix}phone`]) payload.phone = data[`${prefix}phone`];
  if (data[`${prefix}faxNumber`])
    payload.faxNumber = data[`${prefix}faxNumber`];

  return payload;
};

const NewCustomer = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const isEdit = Boolean(customerId);
  const [openGSTDrawer, setOpenGSTDrawer] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const { mutate: clientSignup, isPending: isCreating } = useClientSignup();
  const { mutate: updateCustomer, isPending: isUpdating } =
    useUpdateClientById(customerId);
  const { data: customerData } = useGetCustomerInfo(customerId);
  const { data: emailGroups } = useEmailGroups();

  const groupOptions = useMemo(
    () =>
      Array.isArray(emailGroups?.data)
        ? emailGroups.data.map((item) => ({
          label: item.groupName,
          value: item._id,
        }))
        : [],
    [emailGroups],
  );

  const CUSTOMER_FIELDS = useMemo(
    () => getCustomerFields(groupOptions),
    [groupOptions],
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    trigger,
    getValues,
    setValue,
    formState: { errors, isDirty, dirtyFields },
  } = useForm({
    resolver: yupResolver(getCustomerSchema(isEdit)),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      customer_type: "business",
    },
  });

  useEffect(() => {
    if (isEdit && customerData && groupOptions.length > 0) {
      const defaultValues = {
        ...customerData,
        customer_type: customerData.customer_type,
        userType: customerData.userType || "",
        tax_preference: customerData.tax_preference || "",
        currencyid: customerData.currencyid || "",
        phone_number: {
          code: customerData.phone_number_code || "",
          number: customerData.phone_number || "",
        },
        country_code: customerData.country_code || "",
        password: "",

        // Billing Address
        billingaddress: customerData.billing_address_details?.address || "",
        billingcountry:
          Country.getAllCountries().find(
            (c) => c.name === customerData.billing_address_details?.country,
          )?.isoCode || "",
        billingstate: customerData.billing_address_details?.state
          ? State.getStatesOfCountry(
            Country.getAllCountries().find(
              (c) => c.name === customerData.billing_address_details?.country,
            )?.isoCode,
          ).find(
            (s) => s.name === customerData.billing_address_details?.state,
          )?.isoCode || ""
          : "",
        billingcity: customerData.billing_address_details?.city || "",
        billingpinCode: customerData.billing_address_details?.pinCode || "",
        billingphone: customerData.billing_address_details?.phone || "",
        billingfaxNumber: customerData.billing_address_details?.faxNumber || "",

        // Shipping Address
        shippingaddress: customerData.shipping_address_details?.address || "",
        shippingcountry:
          Country.getAllCountries().find(
            (c) => c.name === customerData.shipping_address_details?.country,
          )?.isoCode || "",
        shippingstate: customerData.shipping_address_details?.state
          ? State.getStatesOfCountry(
            Country.getAllCountries().find(
              (c) =>
                c.name === customerData.shipping_address_details?.country,
            )?.isoCode,
          ).find(
            (s) => s.name === customerData.shipping_address_details?.state,
          )?.isoCode || ""
          : "",
        shippingcity: customerData.shipping_address_details?.city || "",
        shippingpinCode: customerData.shipping_address_details?.pinCode || "",
        shippingphone: customerData.shipping_address_details?.phone || "",
        shippingfaxNumber:
          customerData.shipping_address_details?.faxNumber || "",

        // Contact Persons
        contact_persons: customerData.contact_persons?.map((person) => ({
          _id: person._id,
          name_details: {
            salutation: person.name_details?.salutation || "",
            first_name: person.name_details?.first_name || "",
            last_name: person.name_details?.last_name || "",
          },
          other_details: {
            designation: person.other_details?.designation || "",
            department: person.other_details?.department || "",
          },
          phone: {
            work_phone: person.phone?.work_phone || { code: "+91", number: "" },
            mobile: person.phone?.mobile || { code: "+91", number: "" },
          },
          email: person.email || "",
          profile_pic: person.profile_pic || "",
        })),
      };

      reset(defaultValues);
    }
  }, [isEdit, customerData, groupOptions, reset]);

  const getDirtyPayload = (data, dirtyFields) => {
    const payload = {};
    Object.keys(dirtyFields).forEach((key) => {
      const value = data[key];
      if (value !== undefined && value !== null && value !== "") {
        payload[key] = value;
      }
    });
    return payload;
  };

  const isContactRowEmpty = (row) => {
    return (
      !row?.name_details?.salutation &&
      !row?.name_details?.first_name &&
      !row?.name_details?.last_name &&
      !row?.email &&
      !row?.phone?.work_phone?.number &&
      !row?.phone?.mobile?.number &&
      !row?.other_details?.designation &&
      !row?.other_details?.department &&
      !row?.profile_pic
    );
  };


  const onSubmit = (data) => {
    const billing = buildAddressPayload(data, "billing");
    const shipping = buildAddressPayload(data, "shipping");

    const addressPayload = {};
    if (Object.keys(billing).length > 0)
      addressPayload.billing_address_details = billing;
    if (Object.keys(shipping).length > 0)
      addressPayload.shipping_address_details = shipping;

    let payload = isEdit ? { ...data } : getDirtyPayload(data, dirtyFields);

    if (!payload.customer_type) {
      payload.customer_type = data.customer_type || "business";
    }

    const unwantedFields = [
      "billingaddress",
      "billingcity",
      "billingcountry",
      "billingstate",
      "billingpinCode",
      "billingphone",
      "billingfaxNumber",
      "shippingaddress",
      "shippingcity",
      "shippingcountry",
      "shippingstate",
      "shippingpinCode",
      "shippingphone",
      "shippingfaxNumber",
      "adminId",
      "paymentTermName",
      "country_code",
      "fax",
      "country",
      "state",
      "workspace",
      "city",
      "address",
      "pincode",
      "unUsedCreditsAmount",
      "outstandingReceivables",
      "unUsedCreditsAmount",
      "unpaidInvoiceCount"
    ];

    unwantedFields.forEach((field) => delete payload[field]);

    if (payload?.phone_number && typeof payload.phone_number === "object") {
      const { code = "", number = "" } = payload.phone_number;

      payload.phone_number_code = code;
      payload.phone_number = number;
    }
    payload = { ...payload, ...addressPayload };

    if (!payload.password) delete payload.password;

    if (payload.contact_persons) {
      const filteredContacts = payload.contact_persons.filter(
        (row) => !isContactRowEmpty(row)
      );

      payload.contact_persons =
        filteredContacts.length > 0 ? filteredContacts : [];
    }

    if (Object.keys(payload).length === 0) return;

    if (!isEdit) {
      clientSignup(payload, {
        onSuccess: () => {
          handleClose();
        },
      });
    } else {
      updateCustomer(
        { clientId: customerId, data: payload },
        { onSuccess: handleClose },
      );
    }
  };

  const handleClose = () => {
    reset();
    navigate(-1);
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setShowErrorAlert(true);
    } else {
      setShowErrorAlert(false);
    }
  }, [errors]);

  const getCombinedFirstError = (errorsObj) => {
    if (!errorsObj) return null;

    const recursiveSearch = (obj) => {
      for (const key in obj) {
        if (obj[key]?.message) return obj[key].message;
        if (typeof obj[key] === "object") {
          const msg = recursiveSearch(obj[key]);
          if (msg) return msg;
        }
      }
      return null;
    };

    const generalError = recursiveSearch(errorsObj);

    let contactPersonError = null;
    if (errorsObj.contact_persons) {
      for (let i = 0; i < errorsObj.contact_persons.length; i++) {
        const msg = recursiveSearch(errorsObj.contact_persons[i]);
        if (msg) {
          contactPersonError = `in Contact Person`;
          break;
        }
      }
    }

    if (generalError && contactPersonError) {
      return `${generalError}\n${contactPersonError}`;
    } else {
      return generalError || contactPersonError || null;
    }
  };

  useEffect(() => {
    if (Array.isArray(emailGroups?.data)) {
      const defaultGroup = emailGroups.data.find(
        (group) => group.groupName?.toLowerCase() === "customer",
      );
      const current = getValues("userType");
      if (!current && defaultGroup) {
        setValue("userType", defaultGroup._id, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
  }, [emailGroups, setValue, getValues]);

  const tabs = [
    {
      label: "Other Details",
      component: (
        <OtherDetails
          control={control}
          errors={errors}
          setValue={setValue}
          getValues={getValues}
          isEdit={isEdit}
        />
      ),
    },
    {
      label: "Address",
      component: (
        <Address
          control={control}
          errors={errors}
          watch={watch}
          trigger={trigger}
          getValues={getValues}
          setValue={setValue}
          data={customerData}
        />
      ),
    },
    {
      label: "Contact Persons",
      component: <ContactPersonsForm control={control} errors={errors} />,
    },
    {
      label: "Remarks",
      component: <Remarks control={control} errors={errors} />,
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ position: "sticky", top: 0, zIndex: 10, p: 1, mt: 1 }}>
        <Typography variant="h4" mb={1.5}>
          {isEdit ? "Edit Customer" : "New Customer"}
        </Typography>

        {getCombinedFirstError(errors) && showErrorAlert ? (
          <Box
            sx={{
              bgcolor: "error.light",
              px: 2,
              py: 1.5,
              borderRadius: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: 51.2,
            }}
          >
            <Typography variant="h6" fontSize={"14px"}>
              * {getCombinedFirstError(errors)}
            </Typography>
            <IconButton onClick={() => setShowErrorAlert(false)}>
              <Close fontSize="medium" />
            </IconButton>
          </Box>
        ) : (
          !isEdit && (
          <Alert
            severity="info"
            variant="outlined"
            sx={{
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "background.muted" : "#EFF8FF",
              borderRadius: 2,
            }}
            icon={<SaveAltOutlinedIcon sx={{ color: "#1570EF" }} />}
          >
            <Box display="flex" gap={1}>
              <Typography>
                Prefill Customer details from the GST portal using GSTIN.
              </Typography>
              <Link
                target="_blank"
                rel="noreferrer"
                color="primary.main"
                underline="hover"
                sx={{ cursor: "pointer", fontSize: 14, mt: 0.5 }}
                onClick={() => setOpenGSTDrawer(true)}
              >
                Prefill
              </Link>
            </Box>
          </Alert>
          )
        )}

      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", mx: 2 }}>
        {CUSTOMER_FIELDS.map((field) => (
          <BasicField
            key={field.name}
            field={field}
            control={control}
            errors={errors}
            customerId={customerId}
          />
        ))}
        <CommonTabs tabs={tabs} />
      </Box>

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          p: 1,
          display: "flex",
          gap: 2,
        }}
      >
        <CommonButton
          label={isEdit ? "Update" : "Create"}
          onClick={handleSubmit(onSubmit)}
          disabled={!isDirty || isCreating || isUpdating}
          startIcon
        />
        <CommonButton
          label="Cancel"
          variant="outlined"
          onClick={handleClose}
          startIcon
        />
      </Box>

      <GSTPrefillDrawer
        open={openGSTDrawer}
        handleClose={() => setOpenGSTDrawer(false)}
      />
    </Box>
  );
};

export default NewCustomer;
