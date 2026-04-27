import React, { useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";

import FormRow from "../../../Sales/Invoices/New Component/FormRow";
import {
  CommonCheckbox,
  CommonCountryStateCity,
  CommonDatePicker,
  CommonDescriptionField,
  CommonSelect,
  CommonTextField,
} from "../../../common/fields";

import { usePaymentTerms } from "../../../../hooks/payment-terms/payment-terms-hooks";
import { useAccountTree } from "../../../../hooks/account/account-hooks";

const BillsHeaderSection = ({
  control,
  errors,
  setValue,
  edit,
  watch,
  billingAddress,
  updatedata,
}) => {
  const navigate = useNavigate();
  const { data: PaymentTerms } = usePaymentTerms();
  const { data: accountTree = {} } = useAccountTree();

  const isVendor = watch("vendorId");
  const billDate = watch("billDate");
  const paymentTermValue = watch("paymentTerm");

  const normalize = (str = "") => str.trim().toLowerCase();

  const countries = Country.getAllCountries();

  const countryMap = useMemo(() => {
    const map = {};
    countries.forEach((c) => {
      map[normalize(c.name)] = c.isoCode;
    });
    return map;
  }, []);

  const selectedCountry = edit
    ? updatedata?.billingAddress?.country
    : billingAddress?.country;
  const destinationCountry = "IN";

  console.log(selectedCountry, "scc");

  const countryCode = useMemo(() => {
    return countryMap[normalize(selectedCountry)] || "";
  }, [selectedCountry, countryMap]);

  const states = useMemo(() => {
    return countryCode ? State.getStatesOfCountry(countryCode) : [];
  }, [countryCode]);

  const destinationStates = useMemo(() => {
    return destinationCountry
      ? State.getStatesOfCountry(destinationCountry)
      : [];
  }, [destinationCountry]);

  const selectedState = useMemo(() => {
    if (!billingAddress?.state || !states.length) return null;

    return (
      states.find(
        (s) => normalize(s.name) === normalize(billingAddress.state),
      ) || null
    );
  }, [billingAddress?.state, states]);

  console.log(selectedState, billingAddress, "statecheck");

  const defaultDestinationState = useMemo(() => {
    if (!destinationStates.length) return null;

    return (
      destinationStates.find((s) => normalize(s.name) === "tamil nadu") || null
    );
  }, [destinationStates]);

  useEffect(() => {
    if (selectedState) {
      setValue("source", selectedState.isoCode);
    }
  }, [selectedState, setValue, billingAddress]);

  useEffect(() => {
    if (defaultDestinationState) {
      setValue("destination", defaultDestinationState.isoCode);
    }
  }, [defaultDestinationState, setValue]);

  const termsOptions =
    PaymentTerms?.data?.map((term) => ({
      label: term.termName,
      value: term._id,
    })) || [];

  const paymentTermsMap = useMemo(() => {
    const map = {};
    PaymentTerms?.data?.forEach((term) => {
      map[term._id] = term.numberOfDays;
    });
    return map;
  }, [PaymentTerms]);

  const customTermId = useMemo(() => {
    return (
      PaymentTerms?.data?.find(
        (term) => term.termName?.toLowerCase() === "custom",
      )?._id || ""
    );
  }, [PaymentTerms]);

  useEffect(() => {
    if (!billDate || paymentTermValue === customTermId) return;
    const days = paymentTermsMap[paymentTermValue] || 0;
    const date = new Date(billDate);
    date.setDate(date.getDate() + days);
    setValue("dueDate", date.toISOString());
  }, [billDate, paymentTermValue, paymentTermsMap, setValue]);

  const flattenAccounts = (accounts, group) => {
    return accounts.flatMap((account) => {
      const current = {
        label: account.accountName,
        value: account._id,
        group,
        parentAccountId: account.parentAccountId,
      };

      return account.children?.length
        ? [current, ...flattenAccounts(account.children, group)]
        : [current];
    });
  };

  const parentAccountOptions = useMemo(() => {
    return Object.entries(accountTree).flatMap(([group, accounts]) =>
      Array.isArray(accounts) ? flattenAccounts(accounts, group) : [],
    );
  }, [accountTree]);

  const liabilitesOptions = useMemo(() => {
    return parentAccountOptions.filter((item) => item.group === "liability");
  }, [parentAccountOptions]);

  const handleNavigateToPaymentTerm = () => {
    navigate("/settings/configuration/payment-terms");
  };

  // const confirmNavigate = () => {
  //   if (navigateType === "Manage Sales Person") {
  //     navigate("/admin");
  //   } else if (navigateType === "Configure Terms") {
  //     navigate("/settings/configuration/payment-terms");
  //   } else {
  //     navigate("/settings/transaction-series");
  //   }
  // };

  return (
    <>
      {isVendor && (
        <>
          <FormRow label="Source of Supply" mandatory>
            <Controller
              name="source"
              control={control}
              render={({ field }) => (
                <CommonCountryStateCity
                  {...field}
                  options={states}
                  placeholder="Select"
                  getOptionLabel={(opt) => opt.name}
                  getOptionValue={(opt) => opt.isoCode}
                  width="325px"
                  error={!!errors?.source}
                  helperText={errors?.source?.message}
                />
              )}
            />
          </FormRow>

          <FormRow label="Destination of Supply" mandatory>
            <Controller
              name="destination"
              control={control}
              render={({ field }) => (
                <CommonCountryStateCity
                  {...field}
                  options={destinationStates}
                  placeholder="Select"
                  getOptionLabel={(opt) => opt.name}
                  getOptionValue={(opt) => opt.isoCode}
                  width="325px"
                  error={!!errors?.destination}
                  helperText={errors?.destination?.message}
                />
              )}
            />
          </FormRow>
        </>
      )}

      <FormRow label="Bill#" mandatory>
        <Controller
          name="billNo"
          control={control}
          rules={{ required: "Bill Number is required" }}
          render={({ field }) => (
            <CommonTextField
              {...field}
              width="325px"
              error={!!errors.billNo}
              helperText={errors.billNo?.message}
              maxLength={50}
            />
          )}
        />
      </FormRow>

      <FormRow label="Order Number">
        <Controller
          name="orderNo"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              width="325px"
              error={!!errors.orderNo}
              helperText={errors.orderNo?.message}
              maxLength={100}
            />
          )}
        />
      </FormRow>

      <FormRow label="Bill Date" mandatory>
        <Controller
          name="billDate"
          control={control}
          render={({ field }) => (
            <CommonDatePicker
              {...field}
              width="325px"
              error={!!errors.billDate}
              helperText={errors.billDate?.message}
            />
          )}
        />
      </FormRow>

      <Box display="flex" alignItems="center" gap="25px">
        <FormRow label="Due Date" mandatory>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <CommonDatePicker
                {...field}
                width="325px"
                onChange={(date) => {
                  field.onChange(date);
                  setValue("paymentTerm", customTermId);
                }}
                error={!!errors.dueDate}
                helperText={errors.dueDate?.message}
                minDate={billDate}
              />
            )}
          />
        </FormRow>

        <FormRow label="Payment Terms" minWidth={70}>
          <Controller
            name="paymentTerm"
            control={control}
            render={({ field, fieldState }) => (
              <CommonSelect
                {...field}
                width="200px"
                value={field.value}
                onChange={field.onChange}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                options={termsOptions}
                onBottomonClick={handleNavigateToPaymentTerm}
                bottomLabel="Configure Terms"
                mt={0}
                mb={0}
                clearable={false}
              />
            )}
          />
        </FormRow>
      </Box>

      <Controller
        name="isReverseCharge"
        control={control}
        render={({ field }) => (
          <CommonCheckbox
            label="This transaction is applicable for reverse charge"
            checked={field.value}
            onChange={field.onChange}
            sx={{ mb: 2 }}
          />
        )}
      />

      <FormRow label="Accounts Payable">
        <Controller
          name="payableAccount"
          control={control}
          render={({ field }) => (
            <CommonSelect
              {...field}
              options={liabilitesOptions}
              value={field.value || ""}
              placeHolder="Payableaccount"
              width="325px"
              searchable
            />
          )}
        />
      </FormRow>

      <FormRow label="Subject">
        <Controller
          name="subject"
          control={control}
          render={({ field }) => (
            <CommonDescriptionField
              {...field}
              rows={2}
              width="325px"
              maxLength={250}
            />
          )}
        />
      </FormRow>

      {/* <ConfirmationDialog
        open={confirmationPopup}
        onClose={handleCloseConfirmation}
        onNavigate={confirmNavigate}
      /> */}
    </>
  );
};

export default BillsHeaderSection;
