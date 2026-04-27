import React, { useMemo, useEffect } from 'react'
import CommonDrawer from './NDE-Drawer'
import { Box, Typography } from '@mui/material'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { Country, State, City } from "country-state-city";
import {
    CommonCountryStateCity,
    CommonDescriptionField,
    CommonTextField,
} from "./fields";
import PhoneNumberField from "../common/fields/NDE-MobileNumberCode";
import { useUpdateBillingShippingAddress, useGetVendorInfo } from '../../hooks/Vendor/Vendor-hooks';
import { useGetCustomerInfo } from '../../hooks/Customer/Customer-hooks';
import { useQueryClient } from '@tanstack/react-query';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
    address: yup.string().required("Address is required"),
    country: yup.string().required("Country is required"),
    state: yup.string().required("State is required"),
    city: yup.string().required("City is required"),
    pinCode: yup.string().required("Pin code is required"),
    phone: yup.object().shape({
        number: yup.string().required("Phone number is required"),
    }),
});


const AddressForm = ({ open, onClose, billingAddress, shippingAddress, editType, entity, onSuccess, entityId }) => {
    const queryClient = useQueryClient();
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isDirty },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            address: '',
            country: '',
            state: '',
            city: '',
            pinCode: '',
            phone: { code: 'IN', number: '' },
            faxNumber: '',
        }
    });

    const { mutateAsync: updateBillingShippingAddress, isPending } = useUpdateBillingShippingAddress();

    const { data: customerData } = useGetCustomerInfo(entity === 'customer' ? entityId : null, {
        enabled: !!entityId && open && entity === 'customer'
    });
    const { data: vendorData } = useGetVendorInfo(entity === 'vendor' ? entityId : null);


    const transformAddress = (addr) => {
        if (!addr) return null;

        const countryObj = Country.getAllCountries().find(
            (c) => c.name === addr.country || c.isoCode === addr.country
        );
        const countryCode = countryObj?.isoCode || addr.country || "";

        let stateCode = addr.state || "";
        if (countryCode) {
            const countryStates = State.getStatesOfCountry(countryCode);
            const stateObj = countryStates.find(
                (s) => s.name === addr.state || s.isoCode === addr.state
            );
            stateCode = stateObj?.isoCode || addr.state || "";
        }

        return {
            ...addr,
            country: countryCode,
            state: stateCode,
            phone: typeof addr.phone === 'string'
                ? { code: 'IN', number: addr.phone }
                : (addr.phone || { code: 'IN', number: '' }),
        };
    };

    useEffect(() => {
        if (open) {
            const currentEntityData = entity === 'customer' ? customerData : vendorData?.data;
            const fetchedAddr = editType === "shipping" ? currentEntityData?.shipping_address_details : currentEntityData?.billing_address_details;
            const addr = fetchedAddr || (editType === "shipping" ? shippingAddress : billingAddress);

            if (addr) {
                reset(transformAddress(addr));
            } else {
                reset({
                    address: '',
                    country: '',
                    state: '',
                    city: '',
                    pinCode: '',
                    phone: { code: 'IN', number: '' },
                    faxNumber: '',
                });
            }
        }
    }, [open, editType, billingAddress, shippingAddress, reset, customerData, vendorData, entity]);

    const selectedCountry = useWatch({ control, name: "country" });
    const selectedState = useWatch({ control, name: "state" });

    const countries = useMemo(() => Country.getAllCountries(), []);
    const states = useMemo(
        () => (selectedCountry ? State.getStatesOfCountry(selectedCountry) : []),
        [selectedCountry],
    );
    const cities = useMemo(
        () =>
            selectedCountry && selectedState
                ? City.getCitiesOfState(selectedCountry, selectedState)
                : [],
        [selectedCountry, selectedState],
    );

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            country: Country.getCountryByCode(data.country)?.name || data.country,
            state: State.getStateByCodeAndCountry(data.state, data.country)?.name || data.state,
            phone: data.phone?.number ? `${data.phone.code} ${data.phone.number}` : '',
        };

        try {
            const response = await updateBillingShippingAddress({
                id: entityId,
                entity: entity,
                type: editType,
                data: payload,
            });
            if (response) {
                queryClient.invalidateQueries({
                    queryKey: entity === 'customer' ? ["Admin-customer-info", entityId] : ["vendor", entityId]
                });
                onClose();
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            console.error('Failed to update address:', error);
        }
    };

    return (
        <CommonDrawer
            open={open}
            onClose={onClose}
            title={editType === "shipping" ? "Shipping Address" : "Billing Address"}
            width={500}
            actions={[
                {
                    label: "Cancel",
                    onClick: onClose,
                    variant: "outlined",
                },
                {
                    label: "Save",
                    onClick: handleSubmit(onSubmit),
                    variant: "contained",
                    disabled: isPending || !isDirty,
                },
            ]}
        >
            <Box component="form" sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {editType === "shipping" && billingAddress && (
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-start", mb: 0 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "primary.main",
                                cursor: "pointer",
                                fontSize: 12,
                                fontWeight: 500,
                                "&:hover": {
                                    textDecoration: "underline",
                                }
                            }}
                            onClick={() => {
                                const values = transformAddress(billingAddress);
                                if (values) {
                                    Object.entries(values).forEach(([key, value]) => {
                                        setValue(key, value, { shouldDirty: true, shouldValidate: true });
                                    });
                                }
                            }}
                        >
                            Copy Billing Address
                        </Typography>
                    </Box>
                )}
                <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                        <CommonDescriptionField
                            {...field}
                            rows={2}
                            fullWidth
                            error={!!errors.address}
                            helperText={errors.address?.message}
                            label="Address"
                            mb={0}
                            mt={-1}
                        />
                    )}
                />

                <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                        <CommonCountryStateCity
                            {...field}
                            options={countries}
                            placeholder="Select"
                            getOptionLabel={(opt) => opt.name}
                            getOptionValue={(opt) => opt.isoCode}
                            fullWidth
                            error={!!errors.country}
                            helperText={errors.country?.message}
                            label="Country"
                            mt={-1}
                            mb={0}
                        />
                    )}
                />

                <Box sx={{ flex: "1 1 48%" }}>
                    <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                            <CommonCountryStateCity
                                {...field}
                                options={states}
                                placeholder="Select"
                                getOptionLabel={(opt) => opt.name}
                                getOptionValue={(opt) => opt.isoCode}
                                fullWidth
                                error={!!errors.state}
                                helperText={errors.state?.message}
                                label="State"
                                mb={0}
                            />
                        )}
                    />
                </Box>

                <Box sx={{ flex: "1 1 48%" }}>
                    <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                            <CommonCountryStateCity
                                {...field}
                                options={cities}
                                placeholder="Select"
                                getOptionLabel={(opt) => opt.name}
                                getOptionValue={(opt) => opt.name}
                                fullWidth
                                error={!!errors.city}
                                helperText={errors.city?.message}
                                label="City"
                                mb={0}
                            />
                        )}
                    />
                </Box>

                <Box sx={{ flex: "1 1 48%" }}>
                    <Controller
                        name="pinCode"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                {...field}
                                fullWidth
                                error={!!errors.pinCode}
                                helperText={errors.pinCode?.message}
                                label="Pin Code"
                                mb={0}
                            />
                        )}
                    />
                </Box>

                <Box sx={{ flex: "1 1 48%" }}>
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <PhoneNumberField
                                {...field}
                                fullWidth
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                                label="Phone"
                                mb={0}
                            />
                        )}
                    />
                </Box>

                <Box sx={{ flex: "1 1 48%" }}>
                    <Controller
                        name="faxNumber"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                {...field}
                                fullWidth
                                error={!!errors.faxNumber}
                                helperText={errors.faxNumber?.message}
                                label="Fax Number"
                            />
                        )}
                    />
                </Box>
            </Box>
        </CommonDrawer>
    )
}

export default AddressForm
