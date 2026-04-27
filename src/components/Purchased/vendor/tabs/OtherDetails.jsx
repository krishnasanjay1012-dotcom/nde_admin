import React, { useState, useMemo, useEffect } from "react";
import { Controller, useWatch } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import { InfoOutlined, Language, Facebook } from "@mui/icons-material";
import { FaXTwitter } from "react-icons/fa6";
import { FaSkype } from "react-icons/fa";
import { Country, State, City } from "country-state-city";

import {
    CommonCheckbox,
    CommonRadioButton,
    CommonSelect,
    CommonTextField,
    CommonCountryStateCity,
    CommonDescriptionField,
} from "../../../common/fields";

import { useCurrencies } from './../../../../hooks/settings/currency';
import { usePaymentTerms } from './../../../../hooks/payment-terms/payment-terms-hooks';
import { useTaxList } from "../../../../hooks/products/products-hooks";


const FieldRow = ({ label, children, required }) => (
    <Box
        sx={{
            display: "grid",
            gridTemplateColumns: "190px 1fr",
            alignItems: "flex-start",
            gap: 2,
            mb: -1
        }}
    >
        <Typography
            fontSize={14}
            fontWeight={400}
            sx={{
                lineHeight: "40px",
                color: required ? "error.main" : "text.primary",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 200,
            }}
        >
            {label}
            {required && (
                <span style={{ marginLeft: 4, color: "red" }}>*</span>
            )}
        </Typography>

        <Box sx={{ width: "22vw" }}>
            {children}
        </Box>
    </Box>
);

const OtherDetails = ({ control, errors, setValue, getValues, isEdit }) => {
    const [openMoreDetails, setOpenMoreDetails] = useState(false);
    const { data: currenciesResponse = {} } = useCurrencies();
    const { data: terms } = usePaymentTerms();
    const { data: taxList } = useTaxList({ taxType: "TDS" });

    const termsData = terms?.data || [];


    const currencies = currenciesResponse?.data || [];



    const selectedCountry = useWatch({ control, name: "country_code" });
    const isMSME = useWatch({ control, name: "is_register_msme" });
    const selectedState = useWatch({ control, name: "state" });
    const gstTreatment = useWatch({ control, name: "gst_treatment" });
    const gstinValue = useWatch({ control, name: "gstin" });

    const currencyOptions = useMemo(
        () => currencies.map(c => ({ label: `${c.country} - ${c.code}`, value: c._id })),
        [currencies]
    );

    const termsOptions = useMemo(
        () => termsData.map(c => ({ label: c.termName, value: c._id })),
        [termsData]
    );

    const sectionOptions =
        taxList?.data?.map((sec) => ({
            label: sec.taxName,
            value: sec._id,
        })) || [];


    useEffect(() => {
        if (termsData.length > 0) {
            const defaultTerm = termsData.find((t) => t.isDefault);
            const current = getValues("payment_term");

            if (!current && defaultTerm) {
                setValue("payment_term", defaultTerm._id, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
            }
        }
    }, [termsData, setValue, getValues]);

    useEffect(() => {
        if (currencies.length > 0) {
            const defaultCurrency = currencies.find((c) => c.isdefault);
            const current = getValues("currency");

            if (!current && defaultCurrency) {
                setValue("currency", defaultCurrency._id, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
            }
        }
    }, [currencies, setValue, getValues]);

    useEffect(() => {
        if (gstTreatment === "unregistered") {
            setValue("source_of_supply", "TN", {
                shouldDirty: true,
                shouldValidate: true,
            });
        }
    }, [gstTreatment, setValue]);

    const countries = useMemo(() => Country.getAllCountries(), []);
    const states = useMemo(
        () => (selectedCountry ? State.getStatesOfCountry(selectedCountry) : []),
        [selectedCountry]
    );
    const cities = useMemo(
        () =>
            selectedCountry && selectedState
                ? City.getCitiesOfState(selectedCountry, selectedState)
                : [],
        [selectedCountry, selectedState]
    );

    return (
        <Box mt={2} ml={0.5}>
            {/* Address */}
            {/* <FieldRow label="Address">
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <CommonDescriptionField
              {...field}

              rows={1}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          )}
        />
      </FieldRow> */}

            {/* Country */}
            {/* <FieldRow label="Country / Region">
        <Controller
          name="country_code"
          control={control}
          render={({ field }) => (
            <CommonCountryStateCity
              {...field}

              options={countries}
              getOptionLabel={opt => opt.name}
              getOptionValue={opt => opt.isoCode}
              placeholder="Search Country"
            />
          )}
        />
      </FieldRow> */}

            {/* State */}
            {/* <FieldRow label="State">
        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <CommonCountryStateCity
              {...field}

              options={states}
              getOptionLabel={opt => opt.name}
              getOptionValue={opt => opt.isoCode}
              placeholder="Search State"
            />
          )}
        />
      </FieldRow> */}

            {/* City */}
            {/* <FieldRow label="City">
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <CommonCountryStateCity
              {...field}

              options={cities}
              getOptionLabel={opt => opt.name}
              getOptionValue={opt => opt.name}
              placeholder="Search City"
            />
          )}
        />
      </FieldRow> */}

            <FieldRow label="GST Treatment" required>
                <Controller
                    name="gst_treatment"
                    control={control}
                    render={({ field }) => (
                        <CommonSelect
                            {...field}
                            options={[
                                {
                                    label: "Registered Business - Regular",
                                    value: "registered_regular",
                                    subLabel: "Business that is registered under GST",
                                },
                                {
                                    label: "Registered Business - Composition",
                                    value: "registered_composition",
                                    subLabel: "Business that is registered under the Composition Scheme in GST",
                                },
                                {
                                    label: "Unregistered Business",
                                    value: "unregistered",
                                    subLabel: "Business that has not been registered under GST",
                                },
                            ]}
                            placeholder="Select a GST Treatment"
                            error={!!errors.msme_register_type}
                            helperText={errors.msme_register_type?.message}
                        />
                    )}
                />
            </FieldRow>

            {/* GST */}
            {(gstTreatment === "registered_regular" || gstTreatment === "registered_composition") && (
                <FieldRow label="GSTIN / UIN" required>
                    <Controller
                        name="gstin"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                {...field}
                                placeholder="Enter GST NO"
                                error={!!errors.gstin}
                                helperText={errors.gstin?.message}
                            />
                        )}
                    />
                </FieldRow>
            )}

            {(gstTreatment === "unregistered" || ((gstTreatment === "registered_regular" || gstTreatment === "registered_composition") && !!gstinValue)) && (
                <FieldRow label="Source of Supply" required>
                    <Controller
                        name="source_of_supply"
                        control={control}
                        render={({ field }) => (
                            <CommonCountryStateCity
                                {...field}
                                options={State.getStatesOfCountry("IN")}
                                getOptionLabel={opt => opt.name}
                                getOptionValue={opt => opt.isoCode}
                                placeholder="Search State"
                                error={!!errors.source_of_supply}
                                helperText={errors.source_of_supply?.message}
                                mb={2}
                            />
                        )}
                    />
                </FieldRow>
            )}

            {/* PAN */}
            <FieldRow label="PAN">
                <Controller
                    name="pan_no"
                    control={control}
                    render={({ field }) => (
                        <CommonTextField
                            {...field}
                            placeholder="Enter PAN"
                            error={!!errors.pan_no}
                            helperText={errors.pan_no?.message}
                        />
                    )}
                />
            </FieldRow>

            {/* MSME Registered */}
            <FieldRow label="MSME Registered?" >
                <Controller
                    name="is_register_msme"
                    control={control}
                    render={({ field }) => (
                        <CommonCheckbox
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                            label="This vendor is MSME registered"

                        />
                    )}
                />
            </FieldRow>

            {isMSME && (
                <>
                    {/* MSME Registration Type */}
                    <FieldRow label="MSME/Udyam Registration" required>
                        <Controller
                            name="msme_register_type"
                            control={control}
                            render={({ field }) => (
                                <CommonSelect
                                    {...field}
                                    options={[
                                        { label: "Micro", value: "Micro" },
                                        { label: "Small", value: "Small" },
                                        { label: "Medium", value: "Medium" },
                                    ]}
                                    error={!!errors.msme_register_type}
                                    helperText={errors.msme_register_type?.message}
                                    mt={2}
                                />
                            )}
                        />
                    </FieldRow>

                    {/* MSME Registration Number */}
                    <FieldRow label="MSME/Udyam Registration Number" required>
                        <Controller
                            name="msme_register_no"
                            control={control}
                            render={({ field }) => (
                                <CommonTextField
                                    {...field}
                                    placeholder="Enter the Registration Number"
                                    error={!!errors.msme_register_no}
                                    helperText={errors.msme_register_no?.message}
                                />
                            )}
                        />
                    </FieldRow>
                </>
            )}

            {/* Currency */}
            <Box mt={1}>
                <FieldRow label="Currency" required>
                    <Controller
                        name="currency"
                        control={control}
                        render={({ field }) => (
                            <CommonSelect {...field} options={currencyOptions} searchable
                                error={!!errors.currency}
                                helperText={errors.currency?.message}
                            />
                        )}
                    />
                </FieldRow>
            </Box>

            {/* <FieldRow label="Account Payable">
                <Controller
                    name="account_payable"
                    control={control}
                    render={({ field }) => (
                        <CommonSelect
                            {...field}
                            options={[
                                { label: "Account Payable", value: "account_payable" },
                            ]}
                            error={!!errors.account_payable}
                            helperText={errors.account_payable?.message}
                            mt={2}
                        />
                    )}
                />
            </FieldRow> */}


            {!isEdit && (
                <FieldRow label="Opening Balance">
                    <Controller
                        name="opening_balance"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                {...field}
                                type="number"
                                placeholder="Enter Opening Balance"
                            />
                        )}
                    />
                </FieldRow>
            )}

            <FieldRow label="Payment Terms">
                <Controller
                    name="payment_term"
                    control={control}
                    render={({ field }) => (
                        <CommonSelect
                            {...field}
                            options={termsOptions}
                            searchable
                        />
                    )}
                />
            </FieldRow>

            <FieldRow label="TDS">
                <Controller
                    name="tds"
                    control={control}
                    render={({ field }) => (
                        <CommonSelect
                            {...field}
                            options={sectionOptions}
                            searchable
                        />
                    )}
                />
            </FieldRow>

            {/* Enable Portal */}
            <FieldRow
                label={
                    <Box display="flex" alignItems="center" gap={0.5}>
                        Enable Portal?
                        <InfoOutlined sx={{ fontSize: 16, color: "#999" }} />
                    </Box>
                }
            >
                <Controller
                    name="allow_portal"
                    control={control}
                    render={({ field }) => (
                        <CommonCheckbox
                            checked={field.value || false}
                            onChange={field.onChange}
                            label="Allow portal access for this customer"

                        />
                    )}
                />
            </FieldRow>

            {/* Add More */}
            {!openMoreDetails && (
                <Typography
                    onClick={() => setOpenMoreDetails(true)}
                    sx={{
                        fontSize: 14,
                        color: "primary.main",
                        cursor: "pointer",
                        mt: 2,
                    }}
                >
                    Add more details
                </Typography>
            )}

            {openMoreDetails && (
                <>
                    <Box mt={1}>
                        <FieldRow label="Website URL">
                            <Controller
                                name="website"
                                control={control}
                                render={({ field }) => (
                                    <CommonTextField
                                        {...field}

                                        placeholder="www.zylker.com"
                                        startAdornment={<Language sx={{ color: "#999" }} />}
                                    />
                                )}
                            />
                        </FieldRow>
                    </Box>

                    <FieldRow label="Department">
                        <Controller
                            name="department_id"
                            control={control}
                            render={({ field }) => (
                                <CommonTextField {...field} />
                            )}
                        />
                    </FieldRow>

                    <FieldRow label="Designation">
                        <Controller
                            name="designation"
                            control={control}
                            render={({ field }) => (
                                <CommonTextField {...field} />
                            )}
                        />
                    </FieldRow>

                    <FieldRow label="X">
                        <Controller
                            name="x"
                            control={control}
                            render={({ field }) => (
                                <CommonTextField
                                    {...field}

                                    placeholder="https://x.com/"
                                    startAdornment={<FaXTwitter style={{ color: "#999" }} />}
                                />
                            )}
                        />
                    </FieldRow>

                    <FieldRow label="Skype Name/Number">
                        <Controller
                            name="skype"
                            control={control}
                            render={({ field }) => (
                                <CommonTextField
                                    {...field}

                                    startAdornment={<FaSkype style={{ color: "#00aff0" }} />}
                                />
                            )}
                        />
                    </FieldRow>

                    <FieldRow label="Facebook">
                        <Controller
                            name="facebook"
                            control={control}
                            render={({ field }) => (
                                <CommonTextField
                                    {...field}

                                    startAdornment={<Facebook sx={{ color: "#1877F2" }} />}
                                />
                            )}
                        />
                    </FieldRow>
                </>
            )}
        </Box>
    );
};

export default OtherDetails;
