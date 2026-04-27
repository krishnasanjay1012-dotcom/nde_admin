import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Box } from "@mui/material";
import { CommonTextField, CommonMultiSelect } from "../../common/fields";
import CommonDialog from "../../common/NDE-Dialog";

const api_url1 = "https://api.nowdigitaleasy.com/ndeadmin/v2";

const UpgradePlan = ({ open, onClose, productId, upgraded, axiosConfig ,productName }) => {
  
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllProductsList = async () => {
    const response = await axios.get(
      `${api_url1}/product/getAllProducts?filter=all`,
      axiosConfig
    );
    const data = response.data.data;

    const hostingProducts = data.filter(
      (row) => row.group.productGroupName.toLowerCase() === "hosting"
    );

    const productOptions =
      hostingProducts[0]?.products.map((item) => ({
        id: item._id,
        label: item.details.productName,
      })) || [];

    const preSelected = productOptions.filter((item) =>
      upgraded?.upgradeTo?.includes(item.id)
    );

    setSelectedOptions(preSelected);
    return productOptions;
  };

  const { data: ProductList = [] } = useQuery({
    queryKey: ["ProductListHosting#", upgraded],
    queryFn: getAllProductsList,
    enabled: !!productId && !!upgraded,
    refetchOnWindowFocus: false,
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const upgradableIds = selectedOptions.map((item) => item.id);

      await axios.put(
        `${api_url1}/product/hosting/upgradeplan`,
        {
          productId,
          upgradableIds,
        },
        axiosConfig 
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonDialog
      open={open}
      onClose={onClose}
      title="Upgrade Plan"
      onSubmit={handleSubmit}
      submitLabel="Save"
      cancelLabel="Cancel"
      fullWidth
      maxWidth="sm"
      loading={loading}
      submitDisabled={loading}
      width={500}
    >
      <Box sx={{ display: "flex", flexDirection: "column"}}>
        <CommonTextField
          label="Product Name"
          value={productName}
          fullWidth
          disabled
        />

        <CommonMultiSelect
          label="Select Plans"
          value={selectedOptions.map((opt) => opt.id)}
          onChange={(e) => {
            const selectedIds = Array.isArray(e.target.value)
              ? e.target.value
              : [];
            const newSelected = ProductList.filter((opt) =>
              selectedIds.includes(opt.id)
            );
            setSelectedOptions(newSelected);
          }}
          options={ProductList.map((opt) => ({
            value: opt.id,
            label: opt.label,
          }))}
          name="upgradePlans"
        />
      </Box>
    </CommonDialog>
  );
};

export default UpgradePlan;
