import React, { useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Typography, Alert, Link } from "@mui/material";
import SaveAltOutlinedIcon from "@mui/icons-material/SaveAltOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Country, State } from "country-state-city";

import Remarks from "../../../components/Customer/Remarks";
import CommonButton from "../../../components/common/NDE-Button";
import CommonTabs from "../../../components/common/NDE-No-Route-Tab";
import BasicFields from "./VendorFields";
import ContactPersonsForm from "../../../components/Customer/ContactPerson";
import GSTPrefillDrawer from "../../../pages/Customers/Cust-form/GST-Fetch";

import {
    useVendorCreate,
    useGetVendorInfo,
    useUpdateVendorById,
} from "../../../hooks/Vendor/Vendor-hooks";
import { getVendorFields } from "../../common/data/vendor-field";
import OtherDetails from "./tabs/OtherDetails";
import Address from "./tabs/AddressVendor";

// Schema
const getCustomerSchema = () =>
    yup.object({
        first_name: yup.string().required("First name is required"),
        last_name: yup.string().required("Last name is required"),
        email: yup.string().email("Invalid email format").required("Email is required"),
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
        msme_register_type: yup.string().when("is_register_msme", {
            is: true,
            then: (schema) => schema.required("MSME type is required"),
        }),

        msme_register_no: yup
            .string()
            .matches(
                /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/,
                "Enter a valid MSME/Udyam Registration Number (UDYAM-XX-00-0000000)"
            )
            .when("is_register_msme", {
                is: true,
                then: (schema) => schema.required("MSME Registration Number is required"),
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
        currency: yup.string().required("Currency is required"),
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

// Helper to build address payload
const buildAddressPayload = (data, prefix) => {
    const countryObj = Country.getCountryByCode(data[`${prefix}country`]);
    const stateObj =
        data[`${prefix}country`] &&
        data[`${prefix}state`] &&
        State.getStateByCodeAndCountry(data[`${prefix}state`], data[`${prefix}country`]);

    const payload = {};
    if (data[`${prefix}address`]) payload.address = data[`${prefix}address`];
    if (countryObj?.name) payload.country = countryObj.name;
    if (stateObj?.name) payload.state = stateObj.name;
    if (data[`${prefix}city`]) payload.city = data[`${prefix}city`];
    if (data[`${prefix}pinCode`]) payload.pinCode = data[`${prefix}pinCode`];
    if (data[`${prefix}phone`]) payload.phone = data[`${prefix}phone`];
    if (data[`${prefix}faxNumber`]) payload.faxNumber = data[`${prefix}faxNumber`];

    return payload;
};

const NewVendor = () => {
    const navigate = useNavigate();
    const { vendorId } = useParams();
    const isEdit = Boolean(vendorId);
    const [openGSTDrawer, setOpenGSTDrawer] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const { mutate: clientSignup, isPending: isCreating } = useVendorCreate();
    const { mutate: updateCustomer, isPending: isUpdating } = useUpdateVendorById(vendorId);
    const { data: vendor } = useGetVendorInfo(vendorId);
    const customerData = vendor?.data;




    const {
        control,
        handleSubmit,
        reset,
        watch,
        trigger,
        getValues,
        setValue,
        formState: { errors, isDirty },
    } = useForm({
        resolver: yupResolver(getCustomerSchema(isEdit)),
        mode: "onSubmit",
        reValidateMode: "onChange",

    });

    // Prefill form if editing
    useEffect(() => {
        if (isEdit && customerData) {
            const defaultValues = {
                ...customerData,
                password: "",
                phone_number: { code: customerData.phone_number_code || "+91", number: customerData.phone_number || "" },
                billingaddress: customerData.billing_address_details?.address || "",
                billingcountry: Country.getAllCountries().find(
                    (c) => c.name === customerData.billing_address_details?.country
                )?.isoCode || "",
                billingstate: customerData.billing_address_details?.state
                    ? State.getStatesOfCountry(
                        Country.getAllCountries().find(
                            (c) => c.name === customerData.billing_address_details?.country
                        )?.isoCode
                    ).find((s) => s.name === customerData.billing_address_details?.state)?.isoCode || ""
                    : "",
                billingcity: customerData.billing_address_details?.city || "",
                billingpinCode: customerData.billing_address_details?.pinCode || "",
                billingphone: customerData.billing_address_details?.phone || "",
                billingfaxNumber: customerData.billing_address_details?.faxNumber || "",
                shippingaddress: customerData.shipping_address_details?.address || "",
                shippingcountry: Country.getAllCountries().find(
                    (c) => c.name === customerData.shipping_address_details?.country
                )?.isoCode || "",
                shippingstate: customerData.shipping_address_details?.state
                    ? State.getStatesOfCountry(
                        Country.getAllCountries().find(
                            (c) => c.name === customerData.shipping_address_details?.country
                        )?.isoCode
                    ).find((s) => s.name === customerData.shipping_address_details?.state)?.isoCode || ""
                    : "",
                shippingcity: customerData.shipping_address_details?.city || "",
                shippingpinCode: customerData.shipping_address_details?.pinCode || "",
                shippingphone: customerData.shipping_address_details?.phone || "",
                shippingfaxNumber: customerData.shipping_address_details?.faxNumber || "",
                contact_persons: customerData.contact_persons?.map((person) => ({
                    _id: person._id,
                    vendor_id: person.vendor_id,
                    name_details: person.name_details,
                    other_details: person.other_details,
                    phone: person.phone,
                    email: person.email,
                    profile_pic: person.profile_pic,
                })),
            };

            reset(defaultValues);
        }
    }, [isEdit, customerData, reset]);

    // Error alert
    useEffect(() => {
        setShowErrorAlert(Object.keys(errors).length > 0);
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
        if (errorsObj.contact_persons) {
            for (let i = 0; i < errorsObj.contact_persons.length; i++) {
                const msg = recursiveSearch(errorsObj.contact_persons[i]);
                if (msg) return `${generalError || ""}\nin Contact Person`;
            }
        }
        return generalError;
    };

    const handleClose = () => {
        reset();
        navigate(-1);
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
        if (Object.keys(billing).length > 0) addressPayload.billing_address_details = billing;
        if (Object.keys(shipping).length > 0) addressPayload.shipping_address_details = shipping;

        let payload = isEdit ? { ...data } : { ...data };

        if (payload.phone_number && typeof payload.phone_number === "object") {
            payload.phone_number_code = payload.phone_number.code;
            payload.phone_number = payload.phone_number.number;
        }
        const unwantedFields = [
            "billingaddress", "billingcity", "billingcountry", "billingstate",
            "billingpinCode", "billingphone", "billingfaxNumber",
            "shippingaddress", "shippingcity", "shippingcountry", "shippingstate",
            "shippingpinCode", "shippingphone", "shippingfaxNumber",
            "adminId", "paymentTermName", "country_code", "fax","unUsedCreditsAmount","outstandingReceivables","unpaidBillCount","currencyDetails"
        ];
        unwantedFields.forEach((field) => delete payload[field]);

        payload = { ...payload, ...addressPayload };
        if (!payload.password) delete payload.password;

        if (payload.contact_persons) {
            const filteredContacts = payload.contact_persons.filter(
                (row) => !isContactRowEmpty(row)
            );

            payload.contact_persons =
                filteredContacts.length > 0 ? filteredContacts : [];
        }

        if (!isEdit) {
            clientSignup(payload, {
                onSuccess: () => {
                    navigate(-1)
                },
            });
        } else {
            updateCustomer({ vendorId: vendorId, data: payload }, { onSuccess: handleClose });
        }
    };

    const tabs = [
        { label: "Other Details", component: <OtherDetails control={control} errors={errors} setValue={setValue} getValues={getValues} /> },
        { label: "Address", component: <Address control={control} errors={errors} watch={watch} trigger={trigger} getValues={getValues} setValue={setValue} data={customerData} /> },
        { label: "Contact Persons", component: <ContactPersonsForm control={control} errors={errors} /> },
        { label: "Remarks", component: <Remarks control={control} errors={errors} /> },
    ];

    const fields = useMemo(() => getVendorFields(), []);


    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "90vh" }}>
            <Box sx={{ position: "sticky", top: 0, zIndex: 10, p: 1, mt: 1 }}>
                <Typography variant="h4" mb={1.5}>
                    {isEdit ? "Edit Vendor" : "New Vendor"}
                </Typography>

                {getCombinedFirstError(errors) && showErrorAlert ? (
                    <Box
                        sx={{
                            bgcolor: "#FDECEC",
                            color: "#B42318",
                            px: 2,
                            py: 1.5,
                            borderRadius: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            height: 51.2,
                        }}
                    >
                        <Typography fontSize={14}>• {getCombinedFirstError(errors)}</Typography>
                        <Typography sx={{ cursor: "pointer", fontWeight: 600, fontSize: 16 }} onClick={() => setShowErrorAlert(false)}>
                            ✕
                        </Typography>
                    </Box>
                ) : (
                    !isEdit && (
                        <Alert
                            severity="info"
                            variant="outlined"
                            sx={{
                                bgcolor: (theme) => theme.palette.mode === "dark" ? "background.muted" : "#EFF8FF",
                                borderRadius: 2,
                            }}
                            icon={<SaveAltOutlinedIcon sx={{ color: "#1570EF" }} />}
                        >
                            <Box display="flex" gap={1}>
                                <Typography>Prefill Customer details from the GST portal using GSTIN.</Typography>
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

            <Box sx={{ flex: 1, overflow: "scroll", mx: 2 }}>
                {fields.map((field) => (
                    <BasicFields
                        key={field.name}
                        field={field}
                        control={control}
                        errors={errors}
                        vendorId={vendorId}
                    />
                ))}
                <CommonTabs tabs={tabs} />
            </Box>

            <Box sx={{ position: "sticky", bottom: 0, p: 1, display: "flex", gap: 2 }}>
                <CommonButton label={isEdit ? "Update" : "Create"} onClick={handleSubmit(onSubmit)} disabled={!isDirty || isCreating || isUpdating} startIcon />
                <CommonButton label="Cancel" variant="outlined" onClick={handleClose} startIcon />
            </Box>

            <GSTPrefillDrawer open={openGSTDrawer} handleClose={() => setOpenGSTDrawer(false)} />
        </Box>
    );
};

export default NewVendor;