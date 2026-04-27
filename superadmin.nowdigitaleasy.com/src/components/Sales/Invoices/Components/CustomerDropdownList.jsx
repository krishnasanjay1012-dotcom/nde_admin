import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import {
  useCustomerList,
  useGetCustomerInfo,
} from "../../../../hooks/Customer/Customer-hooks";
import CommonAutocomplete from "../../../common/fields/NDE-Autocomplete";
import { useDebounce } from "use-debounce";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BusinessIcon from "@mui/icons-material/Business";
import PixIcon from '@mui/icons-material/Pix';
import CommonSelectedItem from "../../../common/fields/NDE-SelectedItem";

const CustomerDropdownList = ({
  control,
  userId,
  setValue,
  defaultValue,
  customerForInvoice = false,
  onCustomerSelect,
  errors,
  width = "540px",
  customerData
}) => {
  const listRef = useRef(null);
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);


  const [debouncedSearchTerm] = useDebounce(searchTerm, 400);

  const { data: singleCustomer, isLoading: loadingSingle } = useGetCustomerInfo(
    userId,
    {
      enabled: !!userId,
    },
  );
  

  const {
    data: fetchedData,
    isLoading: loadingList,
    isFetching: fetchingList,
  } = useCustomerList(
    {
      page: pageNo,
      limit: 50,
      searchTerm: debouncedSearchTerm,
    },
    {
      enabled: !userId,
    },
  );

  const isLoading = loadingSingle || loadingList || fetchingList;

  useEffect(() => {
    if (userId && singleCustomer) {
      setData([singleCustomer]);
      setHasNext(false);
      setValue("customerId", singleCustomer._id, {
        shouldValidate: true,
      });
      const billingAddress = singleCustomer?.billing_address_details || {};

      onCustomerSelect?.(singleCustomer, billingAddress);
    }
  }, [userId, singleCustomer, setValue]);

  useEffect(() => {
    if (!userId && fetchedData?.data) {
      setData((prev) => {
        const merged =
          pageNo === 1 ? fetchedData.data : [...prev, ...fetchedData.data];
        return merged.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t._id === item._id),
        );
      });
      setHasNext(fetchedData.data.length === 50);
    }
  }, [fetchedData, pageNo, userId]);

  const handleScroll = (event) => {
    if (userId) return;

    const listboxNode = event.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = listboxNode;

    if (
      scrollHeight - scrollTop <= clientHeight + 20 &&
      !isLoading &&
      hasNext
    ) {
      setPageNo((prev) => prev + 1);
    }
  };

  const handleInputChange = (_, value, reason) => {
    if (userId) return;

    setSearchTerm(value);
    if (reason === "input") {
      // setData([]);
      setPageNo(1);
      setHasNext(true);
    }
  };

  const customerOptions = data.map((c) => ({
    value: c._id,
    label:
      `${c.first_name || ""} ${c.last_name || ""}`.trim() ||
      c.email ||
      "Unnamed",
    fullData: c,
  }));

  return (
    <Box>
      <Box display="flex" gap={1}>
        <Box display="flex" flexDirection="column" flex={1}>
          <Controller
            name="customerId"
            control={control}
            defaultValue={defaultValue?.value || singleCustomer?._id}
            render={({ field }) => {
              let selectedOption =
                customerOptions.find((opt) => opt.value === field.value) ||
                (singleCustomer
                  ? {
                    value: singleCustomer._id,
                    label:
                      `${singleCustomer.first_name || ""} ${singleCustomer.last_name || ""}`.trim() ||
                      singleCustomer.email,
                    fullData: singleCustomer,
                  }
                  : null) ||
                (defaultValue
                  ? {
                    value: defaultValue.value,
                    label: defaultValue.label,
                    fullData: defaultValue,
                  }
                  : null);

              return (
                <CommonAutocomplete
                  {...field}
                  label={customerForInvoice ? "" : "Customer Name"}
                  value={selectedOption}
                  onChange={(val) => {
                    field.onChange(val?.value || "");
                    const selectedCustomer = customerOptions.find(
                      (opt) => opt.value === val?.value,
                    )?.fullData;
                    if (selectedCustomer) {
                      const billingAddress =
                        selectedCustomer?.billing_address_details || {};

                      onCustomerSelect?.(selectedCustomer, billingAddress);
                    }
                    setSelectedCustomer(selectedCustomer);
                  }}
                  onInputChange={handleInputChange}
                  options={customerOptions}
                  placeholder="Search Customer"
                  loading={isLoading}
                  error={!!errors.customerId}
                  helperText={errors.customerId?.message}
                  mandatory={customerForInvoice ? false : true}
                  disabled={!!defaultValue || !!userId}
                  ListboxProps={{
                    onScroll: handleScroll,
                    ref: listRef,
                    style: { maxHeight: 250, overflowY: "auto" },
                  }}
                  mb={customerForInvoice ? 0 : 1}
                  {...(customerForInvoice && { width })}
                  customerForInvoice={true}
                  width={422}
                  renderOption={(props, option, { selected }) => {
                    const { key, ...optionProps } = props;
                    const customer = option.fullData;
                    const name =
                      `${customer?.first_name || ""} ${customer?.last_name || ""}`.trim() ||
                      "Unnamed";

                    const capitalizedName =
                      name.charAt(0).toUpperCase() + name.slice(1);

                    const email = customer?.email || "";
                    const companyName =
                      customer.workspaceDetails?.workspace_name || "";

                    return (
                      <li
                        key={key}
                        {...optionProps}
                        style={{
                          borderRadius: 8,
                          margin: "4px 8px",
                          padding: "6px",
                        }}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1.5}
                          sx={{
                            width: "100%",
                            color: selected ? "#fff" : "#000",
                            transition: "0.2s ease",
                          }}
                        >
                          {/* Avatar */}
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              backgroundColor: selected
                                ? "#ffffff33"
                                : "#E0E0E0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 600,
                              color: selected ? "#fff" : "#555",
                            }}
                          >
                            {name?.charAt(0)?.toUpperCase()}
                          </Box>

                          <Box>
                            <Typography
                              fontSize={14}
                              color={selected ? "#fff" : "text.primary"}
                            >
                              {capitalizedName}
                            </Typography>

                            {/* Email with icon */}
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={0.5}
                              mt={0.3}
                            >
                              <MailOutlineIcon
                                sx={{
                                  fontSize: 16,
                                  color: selected ? "#E3E8FF" : "#777",
                                }}
                              />
                              <Typography
                                fontSize={12}
                                color={selected ? "#E3E8FF" : "#777"}
                              >
                                {email}
                              </Typography>

                              <span
                                style={{ color: selected ? "#E3E8FF" : "#777" }}
                              >
                                |
                              </span>

                              <BusinessIcon
                                sx={{
                                  fontSize: 16,
                                  color: selected ? "#E3E8FF" : "#777",
                                }}
                              />
                              <Typography
                                fontSize={12}
                                color={selected ? "#E3E8FF" : "#777"}
                              >
                                {companyName}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </li>
                    );
                  }}
                />
              );
            }}
          />
        </Box>
        {selectedCustomer?.currencyCode && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 1, border: "1px solid #D1D1D1", borderRadius: 1.6, p: 1, gap: 0.5, height: 40 }}>
            <PixIcon sx={{ fontSize: 16, color: "success.main" }} />
            <Typography>{selectedCustomer?.currencyCode}</Typography>
          </Box>
        )}
        {(selectedCustomer || singleCustomer) && (
          <Box sx={{ ml: "auto", display: 'flex', justifyContent: 'flex-end' }}>
            <CommonSelectedItem
              listData={customerData || singleCustomer}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CustomerDropdownList;
