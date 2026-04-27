import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { CommonAutocomplete } from "../../common/fields";
import { useCustomerList } from "../../../hooks/Customer/Customer-hooks";
import { useDebounce } from "use-debounce";

const CustomerSelector = ({ value, onChange}) => {
  const [customerData, setCustomerData] = useState([]);
  const [customerPage, setCustomerPage] = useState(1);
  const [customerHasNext, setCustomerHasNext] = useState(true);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const listRefCustomer = useRef(null);

  const [debouncedCustomerSearch] = useDebounce(customerSearchTerm, 400);

  const { data: fetchedCustomers, isLoading, isFetching } = useCustomerList({
    page: customerPage,
    limit: 50,
    searchTerm: debouncedCustomerSearch,
  });

  useEffect(() => {
    if (fetchedCustomers?.data) {
      setCustomerData((prev) => {
        const merged =
          customerPage === 1 ? fetchedCustomers.data : [...prev, ...fetchedCustomers.data];
        return merged.filter(
          (item, index, self) => index === self.findIndex((t) => t._id === item._id)
        );
      });
      setCustomerHasNext(fetchedCustomers.data.length === 50);
    }
  }, [fetchedCustomers, customerPage]);

  const handleInputChange = (_, value, reason) => {
    setCustomerSearchTerm(value);
    if (reason === "input") {
      setCustomerData([]);
      setCustomerPage(1);
      setCustomerHasNext(true);
    }
  };

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 20 && !isLoading && customerHasNext) {
      setCustomerPage((prev) => prev + 1);
    }
  };

  const options = customerData.map((c) => ({
    value: c._id,
    label: `${c.first_name || ""} ${c.last_name || ""}`.trim() || c.name || "Unnamed",
    subLabel: c.email,
    fullData: c,
  }));


  return (
    <Box>
      <CommonAutocomplete
        value={value || null}
        onChange={onChange}
        onInputChange={handleInputChange}
        options={options}
        label="Customer Name"
        placeholder="Search Customer"
        loading={isLoading || isFetching}
        ListboxProps={{
          onScroll: handleScroll,
          ref: listRefCustomer,
          style: { maxHeight: 250, overflowY: "auto" },
        }}
      />
    </Box>
  );
};

export default CustomerSelector;
