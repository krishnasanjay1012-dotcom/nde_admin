import { Controller } from "react-hook-form";
import {
  CommonDatePicker,
  CommonDescriptionField,
  CommonSelect,
  CommonTextField,
} from "../../../common/fields";
import FormRow from "./FormRow";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useEffect, useMemo, useState } from "react";
import { useAdminList } from "../../../../hooks/auth/login";
import { useInvoiceNumber } from "../../../../hooks/payment-terms/payment-terms-hooks";
import { useNavigate } from "react-router-dom";
import ConfigurePaymentDialog from "../Payment/PaymentNumberDialog";

export default function InvoiceHeaderSection({
  control,
  errors,
  setValue,
  edit,
  watch,
  PaymentTerms,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [openSettings, setOpenSettings] = useState(false);

  const { data: admins } = useAdminList();

  const { data } = useInvoiceNumber("invoice");
  const invoiceNumber = data?.counters?.[0]?.nextNumber;
  const invoicePrefix = data?.counters?.[0]?.prefixString;
  const counterId = data?.counters?.[0]?._id;
  useEffect(() => {
    if (invoiceNumber && invoicePrefix && !edit)
      setValue("invoiceNo", `${invoicePrefix} ${invoiceNumber}`);
  }, [invoiceNumber, setValue, edit, invoicePrefix]);

  const termsOptions =
    PaymentTerms?.data?.map((term) => ({
      label: term.termName,
      value: term._id,
    })) || [];

  const salesPersonOptios =
    admins?.data
      ?.filter((sales) => sales?.isSuspended === false)
      .map((sales) => ({
        label: sales?.name,
        value: sales?._id,
      })) || [];

  const invoicedate = watch("invoiceDate");
  const paymentTermValue = watch("paymentTerm");

  const paymentTermsMap = useMemo(() => {
    const map = {};
    PaymentTerms?.data?.forEach((term) => {
      map[term._id] = term.numberOfDays;
    });
    return map;
  }, [PaymentTerms]);

  // useEffect(() => {
  //   if (!invoicedate) return;

  //   const days = paymentTermsMap[paymentTermValue] || 0;

  //   const date = new Date(invoicedate);
  //   date.setDate(date.getDate() + days);

  //   setValue("dueDate", date.toISOString());
  // }, [invoicedate, paymentTermValue, paymentTermsMap]);

  const customTermId = useMemo(() => {
    return (
      PaymentTerms?.data?.find(
        (term) => term.termName?.toLowerCase() === "custom",
      )?._id || ""
    );
  }, [PaymentTerms]);

  useEffect(() => {
    if (!invoicedate || paymentTermValue === customTermId) return;

    const days = paymentTermsMap[paymentTermValue] || 0;

    const date = new Date(invoicedate);
    date.setDate(date.getDate() + days);

    setValue("dueDate", date.toISOString());
  }, [invoicedate, paymentTermValue, paymentTermsMap, setValue]);

  const handleOpenConfirmation = () => {
    navigate("/settings/transaction-series");
  };

  return (
    <>
      <FormRow
        label="Invoice#"
        mandatory
        flexDirection={isMobile ? "column" : "row"}
        alignItems={isMobile ? "flex-start" : "center"}
      >
        <Controller
          name="invoiceNo"
          control={control}
          rules={{ required: "Invoice number is required" }}
          render={({ field }) => (
            <CommonTextField
              {...field}
              width={isMobile ? "100%" : "325px"}
              error={!!errors.invoiceNo}
              helperText={errors.invoiceNo?.message}
              endAdornment={
                <SettingsIcon
                  fontSize="small"
                  sx={{ cursor: "pointer", color: "primary.main" }}
                />
              }
              onEndAdornmentClick={() => setOpenSettings(true)}
            />
          )}
        />
      </FormRow>

      <FormRow
        label="Order Number"
        flexDirection={isMobile ? "column" : "row"}
        alignItems={isMobile ? "flex-start" : "center"}
      >
        <Controller
          name="orderNo"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              width={isMobile ? "100%" : "325px"}
              mt={0}
              mb={1}
              error={!!errors.orderNo}
              helperText={errors.orderNo?.message}
              maxLength={100}
            />
          )}
        />
      </FormRow>

      <Box
        display="flex"
        flexDirection={"row"}
        flexWrap="wrap"
        alignItems="center"
        gap="10px"
        mb={0}
      >
        <FormRow
          label="Invoice Date"
          mandatory
          flexDirection={isMobile ? "column" : "row"}
          alignItems={isMobile ? "flex-start" : "center"}
        >
          <Controller
            name="invoiceDate"
            control={control}
            render={({ field }) => (
              <CommonDatePicker
                {...field}
                width={isMobile ? "100%" : "325px"}
                mt={0}
                mb={0}
                error={!!errors.invoiceDate}
                helperText={errors.invoiceDate?.message}
              />
            )}
          />
        </FormRow>

        <FormRow
          label="Terms"
          minWidth={50}
          gap={1}
          flexDirection={isMobile ? "column" : "row"}
          alignItems={isMobile ? "flex-start" : "center"}
        >
          <Controller
            name="paymentTerm"
            control={control}
            render={({ field, fieldState }) => (
              <CommonSelect
                {...field}
                width={isMobile ? "100%" : "200px"}
                value={field.value}
                onChange={field.onChange}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                options={termsOptions}
                mt={0}
                mb={0}
                onBottomonClick={() => {
                  navigate("/settings/configuration/payment-terms");
                }}
                bottomLabel={"Configure Terms"}
                clearable={false}
              />
            )}
          />
        </FormRow>

        <FormRow
          label="Due Date"
          minWidth={70}
          gap={1}
          flexDirection={isMobile ? "column" : "row"}
          alignItems={isMobile ? "flex-start" : "center"}
        >
          <Controller
            name="dueDate"
            control={control}
            render={({ field, fieldState }) => (
              <CommonDatePicker
                {...field}
                width={isMobile ? "100%" : "145px"}
                mt={0}
                mb={0}
                onChange={(date) => {
                  field.onChange(date);
                  setValue("paymentTerm", customTermId);
                }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                minDate={invoicedate}
              />
            )}
          />
        </FormRow>
      </Box>

      <hr
        style={{
          margin: "10px 0",
          borderTop: "none",
          borderBottom: "1px solid #f3f3f3",
        }}
      ></hr>

      <FormRow
        label="Salesperson"
        flexDirection={isMobile ? "column" : "row"}
        alignItems={isMobile ? "flex-start" : "center"}
      >
        <Controller
          name="salesPersonId"
          control={control}
          render={({ field, fieldState }) => (
            <CommonSelect
              {...field}
              searchable
              width={isMobile ? "100%" : "325px"}
              value={field.value}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              options={salesPersonOptios}
              onBottomonClick={() => {
                navigate(`/settings/admin`);
              }}
              bottomLabel={"Manage Sales Person"}
            />
          )}
        />
      </FormRow>

      <FormRow
        label="Subject"
        flexDirection={isMobile ? "column" : "row"}
        alignItems={isMobile ? "flex-start" : "center"}
      >
        <Controller
          name="subject"
          control={control}
          render={({ field }) => (
            <CommonDescriptionField
              {...field}
              rows={2}
              width={isMobile ? "100%" : "325px"}
              mt={0}
              mb={2}
            />
          )}
        />
      </FormRow>

      <hr
        style={{
          margin: "10px 0",
          borderTop: "none",
          borderBottom: "1px solid #f3f3f3",
        }}
      ></hr>

      {/* <ManageSalespersonsDialog
        open={openSalesPerson}
        onClose={handleCloseSalesPerson}
      /> */}

      {/* <PaymentTermsModal
        open={openPaymentConfig}
        onClose={handleClosePaymentConfig}
      /> */}

      <ConfigurePaymentDialog
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        nextNumber={invoiceNumber}
        prefix={invoicePrefix}
        uniqueId={counterId}
        invoiceId={""}
        module="Invoice"
        handleToOpenConfirmation={handleOpenConfirmation}
      />
    </>
  );
}
