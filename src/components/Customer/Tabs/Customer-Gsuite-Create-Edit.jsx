import { useEffect, useMemo, useRef, useState } from "react";
import { Box } from "@mui/material";
import CommonSelect from "../../../components/common/fields/NDE-Select";
import CommonDatePicker from "../../../components/common/fields/NDE-DatePicker";
import CommonDialog from "../../../components/common/NDE-Dialog";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMigrateGSuite } from "../../../hooks/Customer/Customer-hooks";
import { useGSuite } from "../../../hooks/settings/gsuite";
import { CommonAutocomplete, CommonTextField } from "../../common/fields";
import { useGSuiteTransactionByDomain } from "../../../hooks/payment/payment-hooks";
import { useDebounce } from "use-debounce";
import { usePlanBillingCycles, usePlans } from "../../../hooks/products/products-hooks";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  domain: yup.string().required("Domain is required"),
  productName: yup.string().required("Product Name is required"),
  planName: yup.string().required("Plan Name is required"),
  alias: yup.string().required("Alias is required"),
  orderDate: yup.date().required("Order Date is required"),
  // purchasedDate: yup.date().required("Purchased Date is required"),
});

const GSuiteDetails = ({
  open,
  setOpen,
  initialData,
  clientId,
  selectedWorkspaceId,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      domain: "",
      productName: "",
      planName: "",
      alias: "",
      orderDate: null,
      purchasedDate: null,
    },
  });

  const navigate = useNavigate();

  const migrateGSuiteMutation = useMigrateGSuite();
  const { data: tableResponse, isLoading: aliasLoading } = useGSuite();

  const listRef = useRef(null);
  const [domainData, setDomainData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [debouncedSearchTerm] = useDebounce(searchTerm, 400);

  const { data: domainList, isLoading } = useGSuiteTransactionByDomain({
    domain: debouncedSearchTerm,
    filter: "all",
    year: "",
    page: pageNo,
    limit: 50,
  });

  const domainOptions = useMemo(
    () =>
      domainData.map((c) => ({
        value: c._id,
        label: c.domain_name,
      })),
    [domainData]
  );

  useEffect(() => {
    if (!domainList?.data) return;

    setDomainData((prev) => {
      const merged =
        pageNo === 1 ? domainList.data : [...prev, ...domainList.data];

      return merged.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t._id === item._id)
      );
    });

    setHasNext(domainList.data.length === 50);
  }, [domainList, pageNo]);

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

    if (
      scrollHeight - scrollTop <= clientHeight + 20 &&
      !isLoading &&
      hasNext
    ) {
      setPageNo((prev) => prev + 1);
    }
  };

  const handleInputChange = (_, value, reason) => {
    setSearchTerm(value);

    if (reason === "input") {
      setDomainData([]);
      setPageNo(1);
      setHasNext(true);
    }
  };



  const { data: billingCycleResponse = [] } = usePlanBillingCycles({ type: "gsuite", enabled: open });
  const billingCycles = billingCycleResponse || [];

  const productOptions = useMemo(
    () =>
      billingCycles?.map((c) => ({
        label: c.label,
        value: c._id,
      })) || [],
    [billingCycles]
  );


  const { data: plansData } = usePlans("gsuite", "");

  const planOptions = useMemo(
    () =>
      plansData?.data.map((plan) => ({
        label: plan.plan_name,
        value: plan._id,
      })) || [],
    [plansData]
  );



  const aliasOptions = useMemo(
    () =>
      tableResponse?.data?.map((item) => ({
        label: item.aliasName,
        value: item._id,
      })) || [],
    [tableResponse]
  );



  useEffect(() => {
    if (!open) return;

    if (initialData) {
      reset(initialData);
    } else {
      reset({
        domain: "",
        productName: "",
        planName: "",
        alias: "",
        orderDate: null,
        purchasedDate: null,
      });
    }
  }, [open, initialData, reset]);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (formData) => {
    const payload = {
      domain: formData.domain,
      clientId,
      workspace_id: selectedWorkspaceId,
      orderDate: formData.orderDate,
      purchaseDate: formData.purchasedDate,
      planId: formData.productName,
      billingCycleId: formData.planName,
      alias: formData.alias,
    };

    migrateGSuiteMutation.mutate(payload, {
      onSuccess: handleClose,
      onError: (err) => console.error("GSuite migration failed:", err),
    });
  };

  return (
    <Box>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title={initialData ? "Edit GSuite" : "Add GSuite"}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={initialData ? "Update" : "Submit"}
        cancelLabel="Cancel"
        submitDisabled={!isDirty || migrateGSuiteMutation.isPending}
        loading={migrateGSuiteMutation.isLoading}
        width={600}
      >
        <Box>

          {/* DOMAIN */}
          {/* <Controller
            name="domain"
            control={control}
            render={({ field }) => {
              const selectedOption =
                domainOptions.find((opt) => opt.value === field.value) || null;

              return (
                <CommonAutocomplete
                  label="Domain"
                  options={domainOptions}
                  value={selectedOption}
                  onChange={(newValue) =>
                    field.onChange(newValue ? newValue.value : "")
                  }
                  onInputChange={handleInputChange}
                  error={!!errors.domain}
                  helperText={errors.domain?.message}
                  mandatory
                  ListboxProps={{
                    onScroll: handleScroll,
                    ref: listRef,
                    style: { maxHeight: 250, overflowY: "auto" },
                  }}
                />
              );
            }}
          /> */}
          <Controller
            name="domain"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                label="Domain"
                error={!!errors.domain}
                helperText={errors.domain?.message}
                mandatory
                fullWidth
              />
            )}
          />

          {/* PRODUCT */}
          <Controller
            name="productName"
            control={control}
            render={({ field }) => {
              const selectedOption =
                planOptions.find((opt) => opt.value === field.value) || null;
              return (
                <CommonAutocomplete
                  label="Plan Name"
                  options={planOptions}
                  value={selectedOption}
                  onChange={(newValue) =>
                    field.onChange(newValue ? newValue.value : "")
                  }
                  error={!!errors.productName}
                  helperText={errors.productName?.message}
                  mandatory
                />
              );
            }}
          />

          {/* PLAN */}
          <Controller
            name="planName"
            control={control}
            render={({ field }) => {
              const selectedOption =
                productOptions.find((opt) => opt.value === field.value) || null;

              return (
                <CommonAutocomplete
                  label="Billing Cycle"
                  options={productOptions}
                  value={selectedOption}
                  onChange={(newValue) =>
                    field.onChange(newValue ? newValue.value : "")
                  }
                  error={!!errors.planName}
                  helperText={errors.planName?.message}
                  mandatory
                />
              );
            }}
          />

          {/* ALIAS */}
          <Controller
            name="alias"
            control={control}
            render={({ field }) => (
              <CommonSelect
                {...field}
                label="Alias"
                options={aliasOptions}
                error={!!errors.alias}
                helperText={errors.alias?.message}
                mandatory
                loading={aliasLoading}
                bottomActionLabel={"Configure Terms"}
                onBottomActionClick={() =>
                  navigate("/settings/integration/gsuite")
                }
              />
            )}
          />

          {/* ORDER DATE */}
          <Controller
            name="orderDate"
            control={control}
            render={({ field }) => (
              <CommonDatePicker
                {...field}
                label="Order Date"
                error={!!errors.orderDate}
                helperText={errors.orderDate?.message}
                mandatory
              />
            )}
          />

          {/* PURCHASE DATE */}
          {/* <Controller
            name="purchasedDate"
            control={control}
            render={({ field }) => (
              <CommonDatePicker
                {...field}
                label="Purchased Date"
                error={!!errors.purchasedDate}
                helperText={errors.purchasedDate?.message}
                mandatory
                mb={-1}
              />
            )}
          /> */}
        </Box>
      </CommonDialog>
    </Box>
  );
};

export default GSuiteDetails;
