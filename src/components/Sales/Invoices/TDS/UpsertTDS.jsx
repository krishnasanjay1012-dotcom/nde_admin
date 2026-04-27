import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  CommonDatePicker,
  CommonSelect,
  CommonTextField,
  CommonCheckbox,
} from "../../../common/fields";

import CommonDialog from "../../../common/NDE-Dialog";

import {
  useCreateTDS,
  useSectionListinTaxes,
  useUpdateTDS,
} from "../../../../hooks/sales/invoice-hooks";

import { useTaxById } from "../../../../hooks/products/products-hooks";
import { useAccountTree } from "../../../../hooks/account/account-hooks";

const FormRow = ({ label, mandatory = false, children }) => (
  <Box display="flex" flexDirection="column">
    <Typography sx={{ color: mandatory ? "#d32f2f" : "inherit" }}>
      {label}
      {mandatory && " *"}
    </Typography>
    {children}
  </Box>
);

const schema = yup.object().shape({
  taxName: yup.string().required("Tax Name is required"),
  rate: yup
    .number()
    .typeError("Rate must be a number")
    .required("Rate is required")
    .positive("Rate must be positive")
    .max(100, "Rate should be less than or equal to 100%"),
  sectionId: yup.string().required("Section is required"),
  payableAccount: yup.string().required("Payable account is required"),
  receivableAccount: yup.string().required("Receivable account is required"),
  higherRateReason: yup.string().when("isHigherRate", {
    is: true,
    then: (schema) => schema.required("higherRateReason is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  applicableFrom: yup.string().nullable(),
  applicableTo: yup.string().nullable(),
  updateDraftInvoices: yup.boolean(),
  updateDraftSalesOrders: yup.boolean(),
  updateRecurring: yup.boolean(),
  acceptChanges: yup.boolean().when("$isEdit", {
    is: true,
    then: (schema) => schema.oneOf([true], "You must accept before saving"),
  }),
});

const UpsertTDS = ({
  open,
  onClose,
  isEdit = false,
  defaultValues,
  isTDS,
  taxType,
  editId,
}) => {
  const { data: selectedTaxid } = useTaxById(editId);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, dirtyFields, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(schema, { context: { isEdit } }),
    defaultValues: {
      taxName: "",
      rate: "",
      sectionId: "",
      payableAccount: "",
      receivableAccount: "",
      isHigherRate: false,
      higherRateReason: "",
      applicableFrom: "",
      applicableTo: "",
      updateDraftInvoices: false,
      updateDraftSalesOrders: false,
      updateRecurring: true,
      acceptChanges: false,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (selectedTaxid) {
      reset({
        taxName: selectedTaxid?.data?.taxName,
        rate: selectedTaxid?.data?.rate,
        sectionId: selectedTaxid?.data?.sectionId?._id,
        payableAccount: selectedTaxid?.data?.payableAccount,
        receivableAccount: selectedTaxid?.data?.receivableAccount,
        isHigherRate: selectedTaxid?.data?.isHigherRate,
        applicableFrom: selectedTaxid?.data?.applicableFrom,
        applicableTo: selectedTaxid?.data?.applicableTo,
      });
    }
  }, [selectedTaxid]);

  useEffect(() => {
    if (!isEdit && open) {
      reset({
        taxName: "",
        rate: "",
        sectionId: "",
        payableAccount: "",
        receivableAccount: "",
        isHigherRate: false,
        higherRateReason: "",
        applicableFrom: "",
        applicableTo: "",
        updateDraftInvoices: false,
        updateDraftSalesOrders: false,
        updateRecurring: true,
        acceptChanges: false,
      });
    }
  }, [open, isEdit, reset]);

  const isHigher = watch("isHigherRate");
  const [showEditImpact, setShowEditImpact] = React.useState(false);

  const { mutate: createMutation } = useCreateTDS();
  const { mutate: updateMutation } = useUpdateTDS();

  useEffect(() => {
    if (isHigher) setShowEditImpact(true);
  }, [isHigher]);

  const onSubmit = (data) => {
    console.log(data, "dataa");
    const payload = {
      taxType,
      taxName: data.taxName,
      rate: data.rate,
      sectionId: data.sectionId,
      isHigherRate: data.isHigherRate,
      applicableFrom: data.applicableFrom,
      applicableTo: data.applicableTo,
      payableAccount: data.payableAccount,
      receivableAccount: data.receivableAccount,
      ...(data.isHigherRate && { higherRateReason: data.higherRateReason }),
    };

    if (isEdit) {
      const filtered = Object.keys(dirtyFields).reduce((acc, key) => {
        acc[key] = payload[key];
        return acc;
      }, {});

      updateMutation(
        { id: selectedTaxid?.data?._id, data: filtered },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
          onError: (error) => console.error("Error updating TDS:", error),
        },
      );
      return;
    }

    createMutation(payload, {
      onSuccess: () => {
        reset();
        onClose();
      },
      onError: (error) => console.error("Error creating TDS:", error),
    });
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: Sections } = useSectionListinTaxes();
  // const { data: payableList } = usePayableAccountList();
  // const { data: receivableList } = useReceivableAccountList();

  const { data: accountTree = {} } = useAccountTree();

  console.log(accountTree, "accounts");
  const payableListOptions =
    accountTree?.liability?.flatMap(
      (parent) =>
        parent?.children?.map((child) => ({
          label: child?.accountName,
          value: child?._id,
        })) || [],
    ) || [];

  const receivableListOptions =
    accountTree?.asset?.flatMap(
      (parent) =>
        parent?.children?.map((child) => ({
          label: child?.accountName,
          value: child?._id,
        })) || [],
    ) || [];

  const sectionOptions =
    Sections?.data?.map((sec) => ({
      label: `${sec.sectionCode}-${sec.description}`,
      value: sec._id,
    })) || [];

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <CommonDialog
      open={open}
      onClose={handleClose}
      title={isEdit ? `Edit ${taxType}` : `New ${taxType}`}
      onSubmit={handleSubmit(onSubmit)}
      submitLabel="Save"
      cancelLabel="Cancel"
      maxWidth="md"
      width="45dvw"
      submitDisabled={isEdit && !isDirty}
    >
      <Box display="flex" flexDirection="column">
        {/* Tax Name & Rate */}
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          gap={2}
          sx={{ "& > *": { flex: 1 } }}
        >
          <Controller
            name="taxName"
            control={control}
            render={({ field }) => (
              <FormRow label="Tax Name" mandatory>
                <CommonTextField
                  {...field}
                  error={!!errors.taxName}
                  helperText={errors.taxName?.message}
                  maxLength={50}
                />
              </FormRow>
            )}
          />
          <Controller
            name="rate"
            control={control}
            render={({ field }) => (
              <FormRow label="Rate (%)" mandatory>
                <CommonTextField
                  {...field}
                  error={!!errors.rate}
                  type="number"
                  helperText={errors.rate?.message}
                />
              </FormRow>
            )}
          />
        </Box>

        {/* Section & Payable Account */}
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          gap={2}
          sx={{ "& > *": { flex: 1 } }}
        >
          <FormRow label="Section" mandatory>
            <Controller
              name="sectionId"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  {...field}
                  width="100%"
                  options={sectionOptions}
                  error={!!errors.sectionId}
                  helperText={errors.sectionId?.message}
                />
              )}
            />
          </FormRow>

          <FormRow label="TDS Payable Account" mandatory>
            <Controller
              name="payableAccount"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  {...field}
                  width="100%"
                  options={payableListOptions}
                  error={!!errors.payableAccount}
                  helperText={errors.payableAccount?.message}
                />
              )}
            />
          </FormRow>
        </Box>

        {/* Receivable Account */}
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          gap={2}
          sx={{ "& > *": { flex: 1 } }}
        >
          <FormRow label="TDS Receivable Account" mandatory>
            <Controller
              name="receivableAccount"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  {...field}
                  width="100%"
                  options={receivableListOptions}
                  error={!!errors.receivableAccount}
                  helperText={errors.receivableAccount?.message}
                />
              )}
            />
          </FormRow>
        </Box>

        {/* Higher Rate */}
        <Box>
          <Controller
            name="isHigherRate"
            control={control}
            render={({ field }) => (
              <CommonCheckbox
                {...field}
                checked={field.value}
                label={`Higher ${taxType} Rate`}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        </Box>

        {/* Applicable Period */}
        <Typography fontWeight={500} mb={1} mt={1}>
          Applicable Period
        </Typography>
        <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={3}>
          <Controller
            name="applicableFrom"
            control={control}
            render={({ field }) => (
              <CommonDatePicker {...field} label="Start Date" fullWidth />
            )}
          />
          <Controller
            name="applicableTo"
            control={control}
            render={({ field }) => (
              <CommonDatePicker {...field} label="End Date" fullWidth />
            )}
          />
        </Box>

        {/* Edit Impact Section */}
        {isEdit && showEditImpact && (
          <Box sx={{ p: 1, bgcolor: "background.default", borderRadius: 2 }}>
            <Typography fontSize={12} mb={2}>
              {isTDS
                ? "Select the existing transactions you want to update TDS details for"
                : "Terms and Conditions"}
            </Typography>

            {isTDS ? (
              <>
                <Box display="flex" flexDirection="column" gap={1}>
                  {[
                    {
                      name: "updateDraftInvoices",
                      label: "Draft Invoices",
                      weight: 500,
                    },
                    {
                      name: "updateDraftSalesOrders",
                      label: "Draft Sales Orders",
                      weight: 500,
                    },
                    {
                      name: "updateRecurring",
                      label: "Recurring Transactions",
                      weight: 600,
                    },
                  ].map(({ name, label, weight }) => (
                    <Controller
                      key={name}
                      name={name}
                      control={control}
                      render={({ field }) => (
                        <CommonCheckbox
                          {...field}
                          checked={field.value}
                          label={
                            <Typography fontWeight={weight}>{label}</Typography>
                          }
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <Typography
                    component="li"
                    fontSize={11}
                    sx={{
                      color: "#8a6d3b",
                      mb: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 150,
                    }}
                  >
                    The TDS details you edited will be updated in the selected
                    draft transactions and will automatically apply to your
                    future transactions. These changes will also be updated in
                    transactions where you've manually overridden the TDS
                    amounts.
                  </Typography>
                  <Typography
                    component="li"
                    fontSize={14}
                    sx={{ color: "#8a6d3b" }}
                  >
                    It may take some time for the edited TDS details to be
                    updated in all your existing transactions.
                  </Typography>
                </Box>
              </>
            ) : (
              <Controller
                name="confirmTCSUpdate"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <CommonCheckbox
                    {...field}
                    checked={field.value}
                    label={
                      <Typography fontSize={11}>
                        I understand that updating the TCS details will mark the
                        existing TCS Tax inactive and create a new TCS Tax. The
                        new TCS Tax will be applicable only for the future
                        transactions.
                      </Typography>
                    }
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            )}
          </Box>
        )}

        {/* Accept Changes Checkbox */}
        {isEdit && isTDS && (
          <Controller
            name="acceptChanges"
            control={control}
            render={({ field }) => (
              <CommonCheckbox
                {...field}
                checked={field.value}
                label="I accept that updating the TDS will mark the existing TDS inactive and create a new one."
                onChange={(e) => field.onChange(e.target.checked)}
                sx={{ mt: 2 }}
              />
            )}
          />
        )}
      </Box>
    </CommonDialog>
  );
};

export default UpsertTDS;
