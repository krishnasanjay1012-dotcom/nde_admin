import { useState, useEffect, useMemo } from "react";
import CommonSelect from "../common/fields/NDE-Select";
import CommonNumberField from "../common/fields/NDE-NumberField";
import CommonDrawer from "../common/NDE-Drawer";
import { Box, Typography } from "@mui/material";
import { useProductsByGroup, useUpdateCart } from "../../hooks/order/order-hooks";

const Cartedit = ({ open, onClose, item }) => {  
  const currentGroupId = item?.groupId || null;

  const { data: productsData } = useProductsByGroup(currentGroupId, {
    enabled: open && !!currentGroupId,
  });

  const [quantity, setQuantity] = useState(1);
  const [selectedCycle, setSelectedCycle] = useState("");

  const updateCartMutation = useUpdateCart(); 

  useEffect(() => {
    if (open) {
      setQuantity(item?.quantity || 1);
      const product = productsData?.data?.find((p) => p._id === item?.productId);
      // Determine default cycle
      const defaultCycle = product?.cycle?.map(String).includes(String(item?.period))
        ? String(item.period)
        : product?.cycle?.map(String).includes(String(item?.year))
        ? String(item.year)
        : "";
      setSelectedCycle(defaultCycle);
    }
  }, [open, item, productsData]);

  const handleQuantityChange = (e) => setQuantity(Number(e.target.value));
  const handleCycleChange = (e) => setSelectedCycle(e.target.value);

  const cycleOptions = useMemo(() => {
    const product = productsData?.data?.find((p) => p._id === item?.productId);
    return product?.cycle?.map((c) => ({
      value: String(c),
      label: String(c),
    })) || [];
  }, [productsData, item]);

  const handleSubmit = () => {
    const payload = {
      cartId: item._id,
      quantity: quantity,
       ...(item.product === "domain" ? { year: selectedCycle } : { period: selectedCycle }),
    };

    updateCartMutation.mutate(payload, {
      onSuccess: () => {
        onClose();
      },
      onError: (err) => {
        console.error("Cart update failed:", err);
      },
    });
  };

  return (
    <CommonDrawer
      open={open}
      onClose={onClose}
      anchor="top"
      title="Edit Cart"
      actions={[
        { label: "Cancel", variant: "outlined", onClick: onClose },
        {
          label: updateCartMutation.isLoading ? "Updating..." : "Update",
          onClick: handleSubmit,
          disabled: updateCartMutation.isLoading,
        },
      ]}
    >
      <Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="subtitle1">
          Name: {item?.productName || item?.domainName}
        </Typography>

        {(item?.product === "hosting" ||
          item?.product === "domain" ||
          item?.product === "apps" ||
          item?.product === "gsuite") && (
          <>
            <CommonSelect
              label={item.product === "domain" ? "Year" : "Period"}
              value={selectedCycle}
              onChange={handleCycleChange}
              options={cycleOptions}
            />

            <CommonNumberField
              label="Quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min={1}
            />
          </>
        )}
      </Box>
    </CommonDrawer>
  );
};

export default Cartedit;
