import { useEffect, useMemo } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box } from "@mui/material";

import { useCurrencies } from "../../hooks/settings/currency";
import { useAddPlan, usePlanById, useUpdatePlan } from "../../hooks/products/products-hooks";

import CommonDrawer from "../common/NDE-Drawer";
import CommonTabs from "../common/NDE-No-Route-Tab";
import PlanDetailsForm from "./Product-Info";
import PlanConfigForm from "./Product-Config";
import { useMasters } from "../../hooks/GSuitePrice/GSuitePrice-hooks";

const planSchema = yup.object({
  plan_name: yup
    .string()
    .transform((val) =>
      typeof val === "string" ? val : typeof val?.label === "string" ? val.label : ""
    )
    .trim()
    .required("Plan Name is required"),
  hsn_code: yup
    .string()
    .trim()
    .required("Plan Code is required")
    .matches(/^[a-zA-Z0-9-_]+$/, "Plan Code must be alphanumeric")
    .max(20, "Plan Code can't exceed 20 characters"),
  base_price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be greater than 0"),
  value: yup
    .number()
    .typeError("Billing frequency must be a number")
    .required("Billing frequency is required")
    .positive("Must be at least 1"),
  time_unit: yup.string().required("Billing period is required"),

  // AppPlan fields
  trialDays: yup
    .number()
    .typeError("Trial days must be a number")
    .when("hasTrialPlan", {
      is: true,
      then: (schema) => schema.required("Trial days is required").positive().integer(),
      otherwise: (schema) => schema.notRequired(),
    }),
  trialUsers: yup
    .number()
    .typeError("Trial users must be a number")
    .when("hasTrialPlan", {
      is: true,
      then: (schema) => schema.required("Trial users is required").positive().integer(),
      otherwise: (schema) => schema.notRequired(),
    }),
});

const PlanCreateFormProvider = ({ open, handleClose, selectedProduct, initialData }) => {
  const { data: fetchedPlans = [] } = usePlanById(initialData?._id);
  const { data: mastersData = [], isLoading } = useMasters();
  const { data: currenciesResponse = {} } = useCurrencies();
  const currencies = currenciesResponse?.data || [];
  const editData = fetchedPlans?.data;

  const methods = useForm({
    resolver: yupResolver(planSchema),
    mode: "onChange",
    defaultValues: {
      currency_id: currencies.find((c) => c.isdefault === true || c.isdefault === "true")?._id || "",
      plan_feature: [{ name: "", tool_tip_name: "", add_new_tag: false }],
    },
  });

  const { control, reset, setValue, handleSubmit, formState: { errors, isDirty } } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: "plan_feature" });

  const selectedCycle = useWatch({ control, name: "billing_cycle" });
  const showInWidgets = useWatch({ control, name: "showInWidgets" });
  const selectedPlanName = useWatch({ control, name: "plan_name" });

  const addPlanMutation = useAddPlan();
  const updatePlanMutation = useUpdatePlan();

  const currencyOptions = useMemo(
    () =>
      currencies.map((item) => ({
        label: `${item.code}`,
        value: item._id,
      })),
    [currencies]
  );

  const planOptions = useMemo(
    () =>
      mastersData.map((m) => ({
        label: m?.productName,
        value: m._id,
      })),
    [mastersData]
  );

  useEffect(() => {
    if (!editData) return;

    const planOption = planOptions.find(
      (p) => p.value === editData.gsuite_config?.sku_id
    );    

    reset({
      plan_name: planOption || editData?.plan_name,
      hsn_code: editData.hsn_code || "",
      description: editData.description || "",
      base_price: editData.base_price || 0,
      value: editData.value || 1,
      time_unit: editData.time_unit || "month",
      billing_cycle: editData.billing_cycle || "auto",
      billing_count: editData.billing_count || 0,
      trial_days: editData.trial_days || 0,
      hasTrialPlan: editData.app_config?.has_trial_plan || false,
      trialUsers: editData.app_config?.trial_plan_users || 0,
      showInWidgets: editData.show_in_widgets || false,
      allowPlanChange: editData.allow_plan_change || false,
      setupFee: editData.setup_fee || 0,
      plan_account: editData.plan_account || "sales",
      setup_fee_account: editData.setup_fee_account || "sales",
      plan_feature: editData.plan_feature?.map(f => ({
        name: f.name || "",
        tool_tip_name: f.tool_tip_name || "",
        add_new_tag: f.add_new_tag || false,
      })) || [{ name: "", tool_tip_name: "", add_new_tag: false }],
      currency_id: editData.currency_id?._id || "",
      gsuite_billing_type: editData.gsuite_config?.billing_type || "FLEXIBLE",
      commitment_term: editData.gsuite_config?.commitment_term || "MONTHLY",
    });
  }, [editData, reset, planOptions]);

  useEffect(() => {
    if (!currencies.length) return;
    if (!methods.getValues("currency_id")) {
      const defaultCurrency = currencies.find(c => c.isdefault === true || c.isdefault === "true");
      if (defaultCurrency) setValue("currency_id", defaultCurrency._id);
    }
  }, [currencies, setValue, methods]);

  const handleCloseDrawer = () => {
    reset({
      plan_name: "",
      hsn_code: "",
      description: "",
      base_price: 0,
      value: 1,
      time_unit: "month",
      billing_cycle: "auto",
      billing_count: 0,
      trial_days: 0,
      hasTrialPlan: false,
      trialUsers: 0,
      showInWidgets: false,
      allowPlanChange: false,
      setupFee: 0,
      plan_account: "",
      setup_fee_account: "",
      plan_feature: [{ name: "", tool_tip_name: "", add_new_tag: false }],
      currency_id: currencies.find(c => c.isdefault === true || c.isdefault === "true")?._id || "",
      planName: null,
    });
    handleClose();
  };

  const onSubmit = (data) => {
    const payload = {
      product_id: selectedProduct?.id,
      type: selectedProduct?.type,
      ...data,
      gsuite_config:
        selectedProduct?.type === "gsuite"
          ? {
              sku_id: selectedPlanName?.value || "",
              billing_type: data.billingType || "FLEXIBLE",
              commitment_term: "MONTHLY",
            }
          : undefined,
      gsuite_discount:
        selectedProduct?.type === "gsuite"
          ? { discount_percentage: 0, max_users: 0, duration_years: 0 }
          : undefined,
      app_config:
        selectedProduct?.type === "app"
          ? {
              has_trial_plan: data.hasTrialPlan,
              trial_plan_users: Number(data.trialUsers) || 0,
            }
          : undefined,
    };

    if (initialData?._id) {
      updatePlanMutation.mutate({ id: initialData._id, data: payload }, { onSuccess: handleCloseDrawer });
    } else {
      addPlanMutation.mutate(payload, { onSuccess: handleCloseDrawer });
    }
  };

  const tabs = useMemo(() => [
    {
      label: "Plan Info",
      component: (
        <PlanDetailsForm
          methods={methods}
          selectedProduct={selectedProduct}
          errors={errors}
          currencyOptions={currencyOptions}
          selectedCycle={selectedCycle}
          showInWidgets={showInWidgets}
          planOptions={planOptions}
          fields={fields}
          append={append}
          remove={remove}
          isLoading={isLoading}
        />
      ),
    },
    {
      label: "Config",
      component: <PlanConfigForm selectedProduct={selectedProduct} control={control} errors={errors} />,
    },
  ], [methods, selectedProduct, errors, currencyOptions, selectedCycle, showInWidgets, planOptions, fields, append, remove, isLoading, control]);

  return (
    <CommonDrawer
      open={open}
      anchor="right"
      width={600}
      title={initialData ? "Edit Plan" : "Create Plan"}
      onClose={handleCloseDrawer}
      actions={[
        { label: "Cancel", variant: "outlined", onClick: handleCloseDrawer },
        { label: initialData ? "Update" : "Save", onClick: handleSubmit(onSubmit), disabled: !isDirty },
      ]}
    >
      <Box>
        <CommonTabs tabs={tabs} />
      </Box>
    </CommonDrawer>
  );
};

export default PlanCreateFormProvider;
