import { useEffect, useState } from "react";
import CommonDrawer from "../common/NDE-Drawer";
import { useUpdatePlanPricing } from "../../hooks/products/products-hooks";
import PricingDetailsForm from "./PlanPricingForm"

const ProductPriceTable = ({ open, onClose, pricingData = [], type, priceLoading }) => {
  const updatePlanPricing = useUpdatePlanPricing();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [changedRows, setChangedRows] = useState({});

  useEffect(() => {
    if (pricingData?.length) {
      const transformed = pricingData.map((item) => ({
        ...item,
        plan_billing_cycle: item.plan_billing_cycle || null,
        base_price: item.base_price || 0,
        sale_price: item.sale_price || 0,
        renewal_price: item.renewal_price || 0,
      }));
      setRows(transformed);
      setChangedRows({});
    }
  }, [pricingData]);

 
  const onSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const payload = {
        pricings: Object.entries(changedRows).map(([id, changes]) => {
          const original = rows.find((r) => r._id === id);
          return {
            _id: original._id,
            product_id: original.product_id,
            plan_id: original.plan_id,
            pricing_type: type,
            currency_id: original.currency_id?._id || original.currency_id,
            plan_billing_cycle: original.plan_billing_cycle,
            is_active: original.is_active ?? true,
            base_price: changes.base_price ?? original.base_price,
            sale_price: changes.sale_price ?? original.sale_price,
            renewal_price: changes.renewal_price ?? original.renewal_price,
          };
        }),
      };

      await new Promise((resolve, reject) => {
        updatePlanPricing.mutate(payload, {
          onSuccess: () => resolve(true),
          onError: (err) => reject(err),
        });
      });

      onClose(false);
    } catch (error) {
      console.error("Failed to update prices", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonDrawer
      open={open}
      onClose={onClose}
      title="Add Plan Prices"
      onSubmit={onSubmit}
      width={800}
      anchor="right"
      actions={[
        { label: "Cancel", variant: "outlined", onClick: onClose },
        {
          label: loading ? null : "Save",
          onClick: onSubmit,
          loading: loading || priceLoading ,
          disabled:Object.keys(changedRows).length === 0
        },
      ]}
    >
      <PricingDetailsForm/>
    </CommonDrawer>
  );
};

export default ProductPriceTable;
