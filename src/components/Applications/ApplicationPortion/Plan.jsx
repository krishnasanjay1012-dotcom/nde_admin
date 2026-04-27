import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CommonTextField, CommonDescriptionField, CommonNumberField, CommonSelect } from '../../common/fields';
import { useProductGroups } from '../../../hooks/application/application-hooks';
import CommonDrawer from '../../common/NDE-Drawer';

const schema = yup.object().shape({
  planName: yup.string().required("Plan Name is required"),
  hsnCode: yup.string().required("HSN Code is required"),
  description: yup.string().required("Description is required"),
  trialPlanPeriod: yup
    .number()
    .typeError("Trial Plan Period must be a number")
    .required("Trial Plan Period is required"),
  trialPlanLicence: yup
    .number()
    .typeError("Trial Plan Licence must be a number")
    .required("Trial Plan Licence is required"),
  appCategory: yup.string().required("App Category is required"),
});

const CreatePlan = ({ open, setOpen, initialData = null, onSubmitAction }) => {

  const { data: productGroupsResponse, isLoading } = useProductGroups();
  const categoryOptions = (productGroupsResponse?.data || []).map(group => ({
    label: group.name,
    value: group._id,
  }));

  const appsCategory = (productGroupsResponse?.data || []).find(group => group.name === "Apps");

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      planName: '',
      hsnCode: '',
      description: '',
      trialPlanPeriod: '',
      trialPlanLicence: '',
      appCategory: appsCategory?._id || '',
    },
  });

  useEffect(() => {
    reset({
      planName: initialData?.planName || '',
      hsnCode: initialData?.hsnCode || '',
      description: initialData?.description || '',
      trialPlanPeriod: initialData?.trialPlanPeriod || '',
      trialPlanLicence: initialData?.trialPlanLicence || '',
      appCategory: initialData?.appCategory || appsCategory?._id || '',
    });
    if (appsCategory) setValue('appCategory', appsCategory._id);
  }, [initialData, open, reset, appsCategory, setValue]);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    onSubmitAction(data);
    handleClose();
  };

  return (
    <CommonDrawer
      open={open}
      onClose={handleClose}
      title={initialData ? "Edit Plan" : "Create Plan"}
      anchor='top'
      height={700}
      actions={[
        { label: "Cancel", variant: "outlined", onClick: handleClose },
        { label: initialData ? "Update" : "Save", onClick: handleSubmit(onSubmit) },
      ]}
    >
      <Box sx={{ display: "flex", flexDirection: "column", }}>

        {/* App Category */}
        <Controller
          name="appCategory"
          control={control}
          render={({ field }) => (
            <CommonSelect
              {...field}
              placeholder={isLoading ? "Loading categories..." : "Select App Category"}
              options={categoryOptions}
              label={"Group"}
              mandatory
              disabled={!!appsCategory}
              error={!!errors.appCategory}
              helperText={errors.appCategory?.message}
            />
          )}
        />
        {/* Plane Name */}
        <Controller
          name="planName"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              placeholder="Enter Plan Name"
              width="100%"
              error={!!errors.planName}
              helperText={errors.planName?.message}
              label={"Plan Name"}
              mandatory
            />
          )}
        />

        {/* HSN Code */}
        <Controller
          name="hsnCode"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              placeholder="Enter HSN Code"
              width="100%"
              label={"HSN Code"}
              mandatory
              error={!!errors.hsnCode}
              helperText={errors.hsnCode?.message}
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
              placeholder="Enter Description"
              width="100%"
              height="100px"
              label={"Description"}
              mandatory
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />

        {/* Trial Plan Period */}
        <Controller
          name="trialPlanPeriod"
          control={control}
          render={({ field }) => (
            <CommonNumberField
              {...field}
              placeholder="Trial Plan Period (in numbers)"
              width="100%"
              label={"Trial Plan Period (in numbers)"}
              mandatory
              error={!!errors.trialPlanPeriod}
              helperText={errors.trialPlanPeriod?.message}
            />
          )}
        />

        {/* Trial Plan Licence */}
        <Controller
          name="trialPlanLicence"
          control={control}
          render={({ field }) => (
            <CommonNumberField
              {...field}
              placeholder="Trial Plan Licence (in numbers)"
              label={"Trial Plan Licence (in numbers)"}
              mandatory
              width="100%"
              error={!!errors.trialPlanLicence}
              helperText={errors.trialPlanLicence?.message}
            />
          )}
        />
      </Box>
    </CommonDrawer>
  );
};

export default CreatePlan;
