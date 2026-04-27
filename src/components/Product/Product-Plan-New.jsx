import { useEffect, useMemo, useRef } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  useAddPlan,
  useClonePlan,
  usePlanById,
  useUpdatePlan,
} from "../../hooks/products/products-hooks";
import { useMasters } from "../../hooks/GSuitePrice/GSuitePrice-hooks";

import CommonDrawer from "../common/NDE-Drawer";
import PlanDetailsForm from "./Product-Info";
import { useGetTlds } from "../../hooks/settings/resellers-hooks";
import { usePlesk } from "../../hooks/settings/plesk-hooks";
import { useGSuite } from "../../hooks/settings/gsuite";
import FlowerLoader from "../common/NDE-loader";
import { Box } from "@mui/material";




const DEFAULT_VALUES = {
  plan_name: "",
  hsn_code: "",
  description: "",
  billing_cycle: "auto",
  billing_count: 0,
  trial_days: 0,
  show_in_widgets: true,
  allow_plan_change: false,
  auto_renew_default: true,
  plan_account: "sales",
  setup_fee_account: "sales",

  plan_feature: [
    {
      heading: "",
      features: [
        {
          name: "",
          tool_tip_name: "",
          description: "",
          add_new_tag: false,
        },
      ],
    },
  ],
};

const PlanCreate = ({
  open,
  handleClose,
  selectedProduct,
  initialData,
  cloneData,
}) => {

  const planSchema = useMemo(() => {
    return yup.object({
      plan_name: yup
        .string()
        .transform((val) =>
          typeof val === "string"
            ? val
            : typeof val?.label === "string"
              ? val.label
              : ""
        )
        .trim()
        .required("Plan Name is required"),

      hsn_code: yup
        .string()
        .required("Plan Code is required")
        .matches(/^[a-zA-Z0-9-_]+$/, "Plan Code must be alphanumeric")
        .max(20),

      config_id:
        ["gsuite", "hosting"].includes(selectedProduct?.type)
          ? yup.string().required("Configuration is required")
          : yup.string().nullable(),
    });
  }, [selectedProduct?.type]);

  const { data: fetchedPlans, refetch, isLoading: editLoading } = usePlanById(
    cloneData ? cloneData?._id : initialData?._id,
    false
  );

  useEffect(() => {
    if (open && (initialData?._id || cloneData?._id)) {
      refetch();
    }
  }, [open, initialData?._id, cloneData?._id, refetch]);

  const editData = fetchedPlans?.data;

  const { data: mastersData = [], isLoading } = useMasters();

  const addPlanMutation = useAddPlan();
  const clonePlanMutation = useClonePlan(cloneData?._id);
  const updatePlanMutation = useUpdatePlan();
  const { data: domainTld } = useGetTlds();
  const { data: gsuiteResponse } = useGSuite();
  const { data: pleskResponse } = usePlesk();



  const gsuiteData = gsuiteResponse?.data || [];
  const pleskData = pleskResponse || [];

  const domaintld = domainTld?.data || [];


  const domainOptions = useMemo(
    () =>
      domaintld.map((m) => ({
        label: m.tld,
        value: m._id,
        configId: m.config?._id,
      })),
    [domaintld]
  );

  const methods = useForm({
    resolver: yupResolver(planSchema),
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: DEFAULT_VALUES,
  });

  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isDirty },
  } = methods;

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "plan_feature",
  });


  const selectedPlanName = useWatch({ control, name: "plan_name" });
  const selectedCycle = useWatch({ control, name: "billing_cycle" });
  const showInWidgets = useWatch({ control, name: "show_in_widgets" });


  const planOptions = useMemo(
    () =>
      mastersData.map((m) => ({
        label: m.productName,
        value: m._id,
        skuId: m.skuId,
      })),
    [mastersData]
  );


  const prevDataId = useMemo(() => initialData?._id || cloneData?._id, [initialData?._id, cloneData?._id]);
  const lastResetId = useRef(prevDataId);

  useEffect(() => {
    if (!open) return;

    const currentId = initialData?._id || cloneData?._id;


    if (!currentId) {
      if (lastResetId.current) {
        reset(DEFAULT_VALUES, { keepDirty: false, keepTouched: false });
        lastResetId.current = null;
      }
      return;
    }

    if (!editData && !cloneData) return;

    if (lastResetId.current === currentId && isDirty) return;

    if (lastResetId.current === currentId && !editData) return;

    const dataToLoad = editData;

    const isSuitePlan = selectedProduct?.type === "gsuite";
    const isDomainPlan = selectedProduct?.type === "domain";

    const selectedDomainOption = domainOptions.find(
      (o) => o.label === dataToLoad?.plan_name
    );

    const selectedOption = planOptions.find(
      (o) => o.value === dataToLoad?.gsuite_config?.sku_id
    );

    reset(
      {
        plan_name: cloneData
          ? ""
          : isSuitePlan
            ? selectedOption || {
              label: dataToLoad?.plan_name,
              value: dataToLoad?.plan_name,
            }
            : isDomainPlan
              ? selectedDomainOption || null
              : dataToLoad?.plan_name || "",

        hsn_code: cloneData
          ? ""
          : dataToLoad?.hsn_code?.toString() || "",

        max_users: dataToLoad?.max_users || 0,

        description: dataToLoad?.description || "",
        billing_cycle: dataToLoad?.billing_cycle || "auto",
        billing_count: dataToLoad?.billing_count || 0,
        trial_days: dataToLoad?.trial_days || 0,
        show_in_widgets: dataToLoad?.show_in_widgets ?? true,
        allow_plan_change: dataToLoad?.allow_plan_change ?? false,
        auto_renew_default: dataToLoad?.auto_renew_default ?? true,
        plan_account: dataToLoad?.plan_account || "sales",
        setup_fee_account: dataToLoad?.setup_fee_account || "sales",
        ...(!["app", "suite"].includes(selectedProduct?.type) && {
          config_id: editData?.config_id || "",
        }),

        plan_feature:
          dataToLoad?.plan_feature?.map((section) => ({
            heading: section.heading || "",
            isExpanded: true,
            features:
              section.features?.map((feature) => ({
                name: feature.name || "",
                tool_tip_name: feature.tool_tip_name || "",
                description: feature.description || "",
                add_new_tag: feature.add_new_tag || false,
              })) || [
                {
                  name: "",
                  tool_tip_name: "",
                  description: "",
                  add_new_tag: false,
                },
              ],
          })) || [
            {
              heading: "",
              isExpanded: true,
              features: [
                {
                  name: "",
                  tool_tip_name: "",
                  description: "",
                  add_new_tag: false,
                },
              ],
            },
          ],
      },
      { keepDirty: false, keepTouched: false }
    );
    lastResetId.current = currentId;
  }, [open, editData, cloneData, planOptions, reset, selectedProduct, domainOptions, DEFAULT_VALUES]);


  const onSubmit = (data) => {
    let skuId;

    if (selectedProduct?.type === "gsuite") {
      if (typeof data.plan_name === "object") {
        skuId = data.plan_name.skuId;
      } else {
        const matched = planOptions.find(
          (o) =>
            o.label === data.plan_name || o.value === data.plan_name
        );
        skuId = matched?.skuId;
      }
    }

    let domainConfigId = null;

    if (selectedProduct?.type === "domain" && domainOptions?.length) {
      const selectedDomain = domainOptions.find(
        (o) => o.label === data.plan_name
      );

      domainConfigId = selectedDomain?.configId ?? null;
    }


    const payload = {
      product_id: selectedProduct?.id,
      type: selectedProduct?.type,
      ...data,

      gsuite_config:
        selectedProduct?.type === "gsuite"
          ? { sku_id: skuId }
          : undefined,

      ...(selectedProduct?.type === "domain" && {
        config_id: domainConfigId ?? null,
      }),

    };

    const onSuccessHandler = () => {
      reset();
      handleClose();
    };

    if (initialData?._id && !cloneData) {
      updatePlanMutation.mutate(
        { id: initialData._id, data: payload },
        { onSuccess: onSuccessHandler }
      );
      return;
    }

    if (cloneData?._id) {
      clonePlanMutation.mutate(payload, {
        onSuccess: onSuccessHandler,
      });
      return;
    }

    addPlanMutation.mutate(payload, {
      onSuccess: onSuccessHandler,
    });
  };


  useEffect(() => {
    if (!initialData?._id && !cloneData?._id) {
      reset(DEFAULT_VALUES);
    } else {
      reset(getValues());
    }
  }, [selectedProduct?.type, initialData?._id, cloneData?._id, reset, getValues]);


  return (
    <CommonDrawer
      open={open}
      anchor="right"
      width={650}
      title={`${cloneData
        ? "Clone Plan"
        : initialData
          ? "Edit Plan"
          : "Add Plan"
        } ${selectedProduct?.type
          ? `- ${selectedProduct.type[0].toUpperCase()}${selectedProduct.type.slice(1)}`
          : ""
        }`}

      onClose={handleClose}
      actions={[
        {
          label: "Cancel",
          variant: "outlined",
          onClick: handleClose,
        },
        {
          label:
            cloneData || !initialData ? "Save" : "Update",
          onClick: handleSubmit(onSubmit),
          disabled: !isDirty,
        },
      ]}
    >
      <Box sx={{ position: "relative" }}>
        {(editLoading) && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(255,255,255,0.6)",
              zIndex: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FlowerLoader size={25} />
          </Box>
        )}

        <PlanDetailsForm
          key={selectedPlanName?.value || "plan-info"}
          methods={methods}
          selectedProduct={selectedProduct}
          errors={errors}
          selectedCycle={selectedCycle}
          showInWidgets={showInWidgets}
          planOptions={selectedProduct?.type === "gsuite" ? planOptions : domainOptions}
          fields={fields}
          append={append}
          remove={remove}
          move={move}
          isLoading={isLoading}
          watch={watch}
          setValue={setValue}
          gsuiteData={gsuiteData}
          pleskData={pleskData}
        />
      </Box>
    </CommonDrawer>
  );
};

export default PlanCreate;
