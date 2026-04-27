import React, { useState, useEffect, useRef } from "react";
import { Stack, Box } from "@mui/material";
import { useUpdateGSuiteTransaction } from "../../../hooks/payment/payment-hooks";
import { CommonTextField, CommonAutocomplete } from "../../common/fields";
import CommonDrawer from "../../common/NDE-Drawer";
import { useCustomerList } from "../../../hooks/Customer/Customer-hooks";
import { useDebounce } from "use-debounce";

const EditGSuiteDrawer = ({ open, onClose, transaction, mode = "edit" }) => {
  const [formValues, setFormValues] = useState({
    customer: null,
  });

  const mutation = useUpdateGSuiteTransaction();

  const listRefCustomer = useRef(null);
  const [customerData, setCustomerData] = useState([]);
  const [customerPage, setCustomerPage] = useState(1);
  const [customerHasNext, setCustomerHasNext] = useState(true);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");

  const [debouncedCustomerSearch] = useDebounce(customerSearchTerm, 400);

  const {
    data: fetchedCustomers,
    isLoading: customerLoading,
    isFetching: customerFetching,
  } = useCustomerList({
    page: customerPage,
    limit: 50,
    searchTerm: debouncedCustomerSearch,
  });

  useEffect(() => {
    if (fetchedCustomers?.data) {
      setCustomerData((prev) => {
        const merged =
          customerPage === 1
            ? fetchedCustomers.data
            : [...prev, ...fetchedCustomers.data];
        return merged.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t._id === item._id)
        );
      });
      setCustomerHasNext(fetchedCustomers.data.length === 50);
    }
  }, [fetchedCustomers, customerPage]);

  const handleCustomerInputChange = (_, value, reason) => {
    setCustomerSearchTerm(value);

    if (reason === "input") {
      setCustomerData([]);
      setCustomerPage(1);
      setCustomerHasNext(true);
    }
  };

  const handleCustomerScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 20 &&
      !customerLoading &&
      customerHasNext
    ) {
      setCustomerPage((prev) => prev + 1);
    }
  };

  useEffect(() => {

    if (open) {
      setFormValues({
        customer: transaction?.clientUser && {
          value: transaction.customer._id,
          label:
            `${transaction.clientUser.first_name || ""} ${transaction.clientUser.last_name || ""}`.trim() ||
            transaction.clientUser.name ||
            "Unnamed",
        },
      });
    }
  }, [open, transaction]);



  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    mutation.mutate(
      {
        ...transaction,
        ...formValues,
        customer: formValues.customer?.value || null,
      },
      { onSuccess: () => onClose() }
    );
  };

  const customerOptions = [
    formValues.customer?.value
      ? {
        value: formValues.customer.value,
        label: formValues.customer.label,
        subLabel: transaction?.customer?.email || "",
        fullData: transaction?.customer,
      }
      : null,
    ...customerData.map((c) => ({
      value: c._id,
      label:
        `${c.first_name || ""} ${c.last_name || ""}`.trim() ||
        c.name ||
        "Unnamed",
      subLabel: c.email,
      fullData: c,
    })),
  ].filter(Boolean);


  return (
    <CommonDrawer
      open={open}
      onClose={onClose}
      title={mode === "edit" ? "Edit GSuite Transaction" : "Add GSuite Transaction"}
      width={700}
      actions={[
        { label: "Cancel", variant: "outlined", onClick: onClose },
        {
          label: mode === "edit" ? "Update" : "Add",
          onClick: handleSave,
          disabled: mutation.isLoading || !formValues.customer,
        },
      ]}
    >
      <Stack spacing={2}>
        {/* Customer + Domain */}
        <Box display="flex" flexWrap="wrap" gap={2}>
          <Box flexBasis={{ xs: "100%", sm: "48%" }} flexGrow={1}>
            <CommonAutocomplete
              value={formValues.customer || null}
              onChange={(val) => handleChange("customer", val)}
              onInputChange={handleCustomerInputChange}
              options={customerOptions}
              label="Customer Name"
              placeholder="Search Customer"
              loading={customerLoading || customerFetching}
              ListboxProps={{
                onScroll: handleCustomerScroll,
                ref: listRefCustomer,
                style: { maxHeight: 250, overflowY: "auto" },
              }}
              mandatory
              mb={0}
            />
          </Box>

          <Box flexBasis={{ xs: "100%", sm: "48%" }} flexGrow={1}>
            <CommonTextField
              label="Domain Name"
              value={transaction?.domain_name || ""}
              disabled
              fullWidth
              mb={0}
            />
          </Box>
        </Box>

        {/* Subscription + Description */}
        <Box display="flex" flexWrap="wrap" gap={2}>
          <Box flexBasis={{ xs: "100%", sm: "48%" }} flexGrow={1}>
            <CommonTextField
              label="Subscription"
              value={transaction?.subscription || ""}
              disabled
              fullWidth
              mb={0}
            />
          </Box>
          <Box flexBasis={{ xs: "100%", sm: "48%" }} flexGrow={1}>
            <CommonTextField
              label="Description"
              value={transaction?.description || ""}
              disabled
              fullWidth
              mb={0}
            />
          </Box>
        </Box>

        {/* Interval + Quantity */}
        <Box display="flex" flexWrap="wrap" gap={2}>
          <Box flexBasis={{ xs: "100%", sm: "48%" }} flexGrow={1}>
            <CommonTextField
              label="Interval"
              value={transaction?.interval || "0"}
              disabled
              fullWidth
              mb={0}
            />
          </Box>
          <Box flexBasis={{ xs: "100%", sm: "48%" }} flexGrow={1}>
            <CommonTextField
              label="Quantity"
              value={transaction?.quantity || ""}
              disabled
              fullWidth
              mb={0}
            />
          </Box>
        </Box>

        {/* Order Name + Start Date */}
        <Box display="flex" flexWrap="wrap" gap={2}>
          <Box flexBasis={{ xs: "100%", sm: "48%" }} flexGrow={1}>
            <CommonTextField
              label="Order Name"
              value={transaction?.order_name || ""}
              disabled
              fullWidth
              mb={0}
            />
          </Box>
          <Box flexBasis={{ xs: "100%", sm: "48%" }} flexGrow={1}>
            <CommonTextField
              label="Start Date"
              value={transaction?.start_date || ""}
              disabled
              fullWidth
              mb={0}
            />
          </Box>
        </Box>

        {/* End Date + Invoice Number */}
        <Box display="flex" flexWrap="wrap" gap={2}>
          <Box flexBasis={{ xs: "100%", sm: "48%" }} flexGrow={1}>
            <CommonTextField
              label="End Date"
              value={transaction?.end_date || ""}
              disabled
              fullWidth
              mb={0}
            />
          </Box>
          <Box flexBasis={{ xs: "100%", sm: "48%" }} flexGrow={1}>
            <CommonTextField
              label="Invoice Number"
              value={transaction?.invoice_number || ""}
              disabled
              fullWidth
              mb={0}
            />
          </Box>
        </Box>

        {/* Invoice Date + Amount */}
        <Box display="flex" flexWrap="wrap" gap={2}>
          <Box flexBasis={{ xs: "100%", sm: "48%" }} flexGrow={1}>
            <CommonTextField
              label="Invoice Date"
              value={transaction?.invoice_date || ""}
              disabled
              fullWidth
              mb={0}
            />
          </Box>
          <Box flexBasis={{ xs: "100%", sm: "48%" }} flexGrow={1}>
            <CommonTextField
              label="Amount"
              value={transaction?.amount || ""}
              disabled
              fullWidth
              mb={0}
            />
          </Box>
        </Box>
      </Stack>
    </CommonDrawer>
  );
};

export default EditGSuiteDrawer;
