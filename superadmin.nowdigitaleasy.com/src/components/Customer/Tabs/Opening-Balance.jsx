import React, { useMemo } from "react";
import { Box } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams } from "react-router-dom";

import CommonDialog from "../../common/NDE-Dialog";
import { CommonTextField } from "../../common/fields";
import CommonDescriptionField from "../../common/fields/NDE-DescriptionField";
import CommonSelect from "../../common/fields/NDE-Select";

import {
  useUpdateOpeningBalance,
  useDepositaccounts,
} from "../../../hooks/Customer/Customer-hooks";


const schema = yup.object().shape({
  openingBalance: yup
    .number()
    .typeError("Opening balance must be a number")
    .required("Opening balance is required"),

  description: yup
    .string()
    .required("Description is required")
    .max(500, "Description cannot exceed 500 characters"),

  accountId: yup.string().required("Account is required"),
});


const OpeningBalance = ({ open, setOpen, selectedWorkspaceId }) => {
  const { customerId } = useParams();
  const updateBalance = useUpdateOpeningBalance();
  const { data } = useDepositaccounts();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      openingBalance: "",
      description: "",
      accountId: "",
    },
  });


  const accountOptions = useMemo(() => {
    if (!data?.data) return [];

    return Object.entries(data.data).flatMap(([groupName, accounts]) =>
      accounts.map((item) => ({
        label: `${item.name} (${groupName})`,
        value: item.id,
      }))
    );
  }, [data]);


  const handleClose = () => {
    setOpen(false);
    reset();
  };


  const onSubmit = (formValues) => {
    const payload = {
      userId: customerId,
      workspaceId: selectedWorkspaceId,
      amount: Number(formValues.openingBalance),
      description: formValues.description,
      accountId: formValues.accountId,
    };

    updateBalance.mutate(payload, {
      onSuccess: handleClose,
      onError: (err) => console.error("Opening Balance Error:", err),
    });
  };


  return (
    <Box>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title="Add Opening Balance"
        onSubmit={handleSubmit(onSubmit)}
        submitLabel="Save"
        maxWidth="sm"
        loading={updateBalance.isPending}
      >
        {/* Account Select */}
        <Controller
          name="accountId"
          control={control}
          render={({ field }) => (
            <CommonSelect
              {...field}
              label="Select Account"
              options={accountOptions}
              onChange={(val) => field.onChange(val)}
              error={!!errors.accountId}
              helperText={errors.accountId?.message}
              mandatory
              width="100%"
            />
          )}
        />

        {/* Opening Balance */}
        <Controller
          name="openingBalance"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              label="Opening Balance"
              type="number"
              placeholder="Enter opening balance"
              width="100%"
              error={!!errors.openingBalance}
              helperText={errors.openingBalance?.message}
              mandatory
            />
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <CommonDescriptionField
              {...field}
              label="Description"
              placeholder="Enter description"
              width="100%"
              error={!!errors.description}
              helperText={errors.description?.message}
              mandatory
              rows={3}
              mb={0}
            />
          )}
        />
      </CommonDialog>
    </Box>
  );
};

export default OpeningBalance;