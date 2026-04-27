// import { useEffect, useMemo } from "react";
// import { Box, IconButton } from "@mui/material";
// import CommonDialog from "../../../components/common/NDE-Dialog";
// import {
//   Controller,
//   useForm,
//   useFieldArray,
//   useWatch,
// } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as Yup from "yup";
// import CloseIcon from "@mui/icons-material/Close";

// import { CommonSelect } from "../../common/fields";
// import CommonTextField from "../../../components/common/fields/NDE-TextField";
// import CommonButton from "../../../components/common/NDE-Button";

// import {
//   usePlans,
//   useProducts,
//   usePlanBillingCycles,
// } from "../../../hooks/products/products-hooks";

// const schema = Yup.object().shape({
//   product: Yup.string().required("Product is required"),
//   suggestions: Yup.array().of(
//     Yup.object().shape({
//       product: Yup.string().required("Suggestion product required"),
//       // order: Yup.number().required("Order required"),
//       plans: Yup.array().of(
//         Yup.object().shape({
//           plan: Yup.string().required("Plan required"),
//           billing_cycle: Yup.string().required("Billing cycle required"),
//           quantity: Yup.number().required("Quantity required"),
//         })
//       ),
//     })
//   ),
// });


// const SuggestionRow = ({
//   index,
//   control,
//   errors,
//   remove,
//   fieldsLength,
//   productOptions,
//   setValue,
// }) => {
//   const suggestionProductId = useWatch({
//     control,
//     name: `suggestions.${index}.product`,
//   });

//   const selectedProduct = productOptions.find(
//     (item) => item.value === suggestionProductId
//   );

//   const { data: fetchedPlans = [] } = usePlans(
//     selectedProduct?.type,
//     suggestionProductId
//   );

//   const planOptions =
//     fetchedPlans?.data?.map((plan) => ({
//       label: plan.plan_name,
//       value: plan._id,
//     })) || [];

//   const { data: billingCycleResponse = [] } = usePlanBillingCycles({
//     type: selectedProduct?.type || "",
//     enabled: !!suggestionProductId,
//   });

//   const billingOptions = useMemo(
//     () =>
//       billingCycleResponse?.map((c) => ({
//         label: c.label,
//         value: c._id,
//       })) || [],
//     [billingCycleResponse]
//   );

//   const {
//     fields: planFields,
//     append: addPlan,
//     remove: removePlan,
//   } = useFieldArray({
//     control,
//     name: `suggestions.${index}.plans`,
//   });

//   return (
//     <Box sx={{ p: 2, mb: 2, border: "1px solid #eee", borderRadius: 2 }}>
//       {/* Suggested Product */}
//       <Controller
//         name={`suggestions.${index}.product`}
//         control={control}
//         render={({ field }) => (
//           <CommonSelect
//             {...field}
//             label="Suggested Product"
//             options={productOptions}
//             onChange={(value) => {
//               field.onChange(value);
//               setValue(`suggestions.${index}.plans`, []);
//             }}
//             error={!!errors?.suggestions?.[index]?.product}
//             helperText={errors?.suggestions?.[index]?.product?.message}
//             mb={0}
//           />
//         )}
//       />

//       {/* Plans */}
//       {(planFields || []).map((planItem, pIndex) => (
//         <Box
//           key={planItem.id}
//           sx={{ mt: 2, p: 2, border: "1px dashed #ccc", borderRadius: 2 }}
//         >
//           <Controller
//             name={`suggestions.${index}.plans.${pIndex}.plan`}
//             control={control}
//             render={({ field }) => (
//               <CommonSelect {...field} label="Plan" options={planOptions} />
//             )}
//           />

//           <Controller
//             name={`suggestions.${index}.plans.${pIndex}.billing_cycle`}
//             control={control}
//             render={({ field }) => (
//               <CommonSelect
//                 {...field}
//                 label="Billing Cycle"
//                 options={billingOptions}
//               />
//             )}
//           />

//           <Controller
//             name={`suggestions.${index}.plans.${pIndex}.quantity`}
//             control={control}
//             render={({ field }) => (
//               <CommonTextField
//                 {...field}
//                 label="Quantity"
//                 type="number"
//                 mb={0}
//               />
//             )}
//           />

//           <IconButton onClick={() => removePlan(pIndex)}>
//             <CloseIcon />
//           </IconButton>
//         </Box>
//       ))}

//       <Box mt={2}>
//         <CommonButton
//           label="Add Plan"
//           onClick={() =>
//             addPlan({
//               plan: "",
//               billing_cycle: "",
//               quantity: 1,
//             })
//           }
//         />
//       </Box>

//       {/* Order + Delete */}
//       <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
//         {/* <Controller
//           name={`suggestions.${index}.order`}
//           control={control}
//           render={({ field }) => (
//             <CommonTextField
//               {...field}
//               label="Order"
//               type="number"
//               error={!!errors?.suggestions?.[index]?.order}
//               helperText={errors?.suggestions?.[index]?.order?.message}
//             />
//           )}
//         /> */}

//         <IconButton
//           color="error"
//           disabled={fieldsLength === 1}
//           onClick={() => remove(index)}
//         >
//           <CloseIcon />
//         </IconButton>
//       </Box>
//     </Box>
//   );
// };


// const ProductSuggestionDialog = ({
//   open,
//   setOpen,
//   initialData,
//   onSubmitAction,
//   isPending,
// }) => {
//   const { data: productsData } = useProducts({
//     type: "all",
//     filter: "",
//     customFilters: [],
//     search: "",
//     limit:100
//   });


//   const productOptions =
//     productsData?.data?.map((item) => ({
//       label: item.product_name,
//       value: item._id,
//       type: item.type,
//     })) || [];

//   const {
//     handleSubmit,
//     control,
//     reset,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       product: "",
//       suggestions: [
//         { product: "", plans: [], order: 1 },
//       ],
//     },
//   });

//   const { fields, append, remove, replace } = useFieldArray({
//     control,
//     name: "suggestions",
//   });

//  useEffect(() => {
//   const data = initialData?.fulldata;

//   if (data) {
//     const formatted =
//       data.suggested_products?.map((item) => ({
//         product: item.product?._id || "",
//         order: item.order || 1,
//         plans:
//           item.plans?.map((p) => ({
//             plan: p.plan?._id || "",
//             billing_cycle:
//               typeof p.billing_cycle === "object"
//                 ? p.billing_cycle?._id
//                 : p.billing_cycle || "",
//             quantity: p.quantity || 1,
//           })) || [],
//       })) || [];

//     reset({
//       product: data._id || "",
//       suggestions: formatted,
//     });

//     replace(
//       formatted.length
//         ? formatted
//         : [{ product: "", plans: [], order: 1 }]
//     );
//   } else {
//     const defaultVal = [
//       { product: "", plans: [], order: 1 },
//     ];

//     reset({
//       product: "",
//       suggestions: defaultVal,
//     });

//     replace(defaultVal);
//   }
// }, [initialData, reset, replace]);

//   const handleClose = () => {
//     setOpen(false);
//     reset();
//   };

//   const onSubmit = (data) => {
//   const payload = {
//     suggested_products: data.suggestions.map((item) => ({
//       product: item.product,
//       // order: Number(item.order),
//       isActive: true,
//       plans: item.plans.map((p) => ({
//         plan: p.plan,
//         billing_cycle: p.billing_cycle,
//         quantity: Number(p.quantity),
//       })),
//     })),
//   };

//   if (!initialData) {
//     payload.productId = data.product;
//   }

//   onSubmitAction(payload);
// };

//   return (
//     <CommonDialog
//       open={open}
//       onClose={handleClose}
//       title={
//         initialData
//           ? "Edit Product Suggestion"
//           : "Create Product Suggestion"
//       }
//       onSubmit={handleSubmit(onSubmit)}
//       submitLabel={initialData ? "Update" : "Submit"}
//       cancelLabel="Cancel"
//       submitDisabled={isPending} 
//       width={700}
//     >
//       <Box>
//         {/* Product */}
//         <Controller
//           name="product"
//           control={control}
//           render={({ field }) => (
//             <CommonSelect
//               {...field}
//               label="Product"
//               options={productOptions}
//               error={!!errors.product}
//               helperText={errors.product?.message}
//               sx={{ mb: 3 }}
//             />
//           )}
//         />

//         {/* Suggestions */}
//         {fields.map((item, index) => (
//           <SuggestionRow
//             key={item.id}
//             index={index}
//             control={control}
//             errors={errors}
//             remove={remove}
//             fieldsLength={fields.length}
//             productOptions={productOptions}
//             setValue={setValue}
//           />
//         ))}

//         <Box >
//           <CommonButton
//             label="Add Suggestion"
//             onClick={() =>
//               append({
//                 product: "",
//                 plans: [],
//                 order: fields.length + 1,
//               })
//             }
//           />
//         </Box>
//       </Box>
//     </CommonDialog>
//   );
// };

// export default ProductSuggestionDialog;


import { useEffect, useMemo } from "react";
import { Box, IconButton, Typography, Paper, Stack } from "@mui/material";
import CommonDialog from "../../../components/common/NDE-Dialog";
import {
  Controller,
  useForm,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { CommonSelect } from "../../common/fields";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonButton from "../../../components/common/NDE-Button";

import {
  usePlans,
  useProducts,
  usePlanBillingCycles,
} from "../../../hooks/products/products-hooks";

const schema = Yup.object().shape({
  product: Yup.string().required("Product is required"),
  suggestions: Yup.array().of(
    Yup.object().shape({
      product: Yup.string().required("Suggestion product required"),
      plans: Yup.array().of(
        Yup.object().shape({
          plan: Yup.string().required("Plan required"),
          billing_cycle: Yup.string().required("Billing cycle required"),
          quantity: Yup.number().required("Quantity required"),
        })
      ),
    })
  ),
});

const SuggestionRow = ({
  index,
  control,
  errors,
  remove,
  fieldsLength,
  productOptions,
  setValue,
}) => {
  const suggestionProductId = useWatch({
    control,
    name: `suggestions.${index}.product`,
  });

  const allSelectedSuggestions = useWatch({
    control,
    name: "suggestions",
  });

  const filteredOptions = useMemo(() => {
    return productOptions.filter(
      (option) =>
        !allSelectedSuggestions?.some(
          (s, i) => i !== index && s.product === option.value
        )
    );
  }, [productOptions, allSelectedSuggestions, index]);

  const selectedProduct = productOptions.find(
    (item) => item.value === suggestionProductId
  );

  const { data: fetchedPlans = [] } = usePlans(
    selectedProduct?.type,
    suggestionProductId
  );

  const planOptions =
    fetchedPlans?.data?.map((plan) => ({
      label: plan.plan_name,
      value: plan._id,
    })) || [];

  const { data: billingCycleResponse = [] } = usePlanBillingCycles({
    type: selectedProduct?.type || "",
    enabled: !!suggestionProductId,
  });

  const billingOptions = useMemo(
    () =>
      billingCycleResponse?.map((c) => ({
        label: c.label,
        value: c._id,
      })) || [],
    [billingCycleResponse]
  );

  const {
    fields: planFields,
    append: addPlan,
    remove: removePlan,
  } = useFieldArray({
    control,
    name: `suggestions.${index}.plans`,
  });

  return (
    <Box sx={{ mb: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
      <Box sx={{ bgcolor: "background.default", py: 1.5, px: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="subtitle2" sx={{ color: "text.primary", textTransform: "uppercase", letterSpacing: 0.5 }}>
          Suggested Product {index + 1}
        </Typography>
        <IconButton
          color="error"
          size="small"
          disabled={fieldsLength === 1}
          onClick={() => remove(index)}
          sx={{
            opacity: fieldsLength === 1 ? 0.5 : 1,
            '&:hover': { bgcolor: "error.main",
              "& .MuiSvgIcon-root": {
                color: "icon.light",
              },
             }
          }}
        >
          <DeleteOutlineIcon fontSize="small"/>
        </IconButton>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* Suggested Product */}
        <Box sx={{ mb: planFields?.length > 0 ? 3 : 1 }}>
          <Controller
            name={`suggestions.${index}.product`}
            control={control}
            render={({ field }) => (
              <CommonSelect
                {...field}
                label="Select Product"
                options={filteredOptions}
                onChange={(value) => {
                  field.onChange(value);
                  setValue(`suggestions.${index}.plans`, []);
                }}
                error={!!errors?.suggestions?.[index]?.product}
                helperText={errors?.suggestions?.[index]?.product?.message}
                mb={0}
                searchable
              />
            )}
          />
        </Box>

        {/* Plans */}
        {planFields && planFields.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: "block", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Pricing Plans
            </Typography>
            <Stack spacing={2}>
              {planFields.map((planItem, pIndex) => (
                <Box
                  key={planItem.id}
                  sx={{
                    p: 2,
                    pt: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    bgcolor: "grey.50",
                    position: "relative",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      borderColor: "primary.main",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                    }
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => removePlan(pIndex)}
                    sx={{
                      position: "absolute",
                      top: -12,
                      right: -12,
                      bgcolor: "background.paper",
                      boxShadow: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      "&:hover": { bgcolor: "error.main",
                        "& .MuiSvgIcon-root": {
                          color: "icon.light",
                        },
                         borderColor: "error.main" },
                    }}
                  >
                    <CloseIcon fontSize="small"/>
                  </IconButton>

                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2 }}>
                    <Box>
                      <Controller
                        name={`suggestions.${index}.plans.${pIndex}.plan`}
                        control={control}
                        render={({ field }) => (
                          <CommonSelect {...field} label="Plan" options={planOptions} mb={0} />
                        )}
                      />
                    </Box>

                    <Box>
                      <Controller
                        name={`suggestions.${index}.plans.${pIndex}.billing_cycle`}
                        control={control}
                        render={({ field }) => (
                          <CommonSelect
                            {...field}
                            label="Billing Cycle"
                            options={billingOptions}
                            mb={0}
                          />
                        )}
                      />
                    </Box>

                    <Box>
                      <Controller
                        name={`suggestions.${index}.plans.${pIndex}.quantity`}
                        control={control}
                        render={({ field }) => (
                          <CommonTextField
                            {...field}
                            label="Quantity"
                            type="number"
                            mb={0}
                          />
                        )}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        <Box display="flex" justifyContent="flex-start">
          <CommonButton
            variant="outlined"
            onClick={() =>
              addPlan({
                plan: "",
                billing_cycle: "",
                quantity: 1,
              })
            }
            label="Add Plan"
            startIcon={<AddCircleOutlineIcon sx={{ color: "primary.main" }} />}
          />
        </Box>
      </Box>
    </Box>
  );
};

const ProductSuggestionDialog = ({
  open,
  setOpen,
  initialData,
  onSubmitAction,
  isPending,
}) => {
  const { data: productsData } = useProducts({
    type: "all",
    filter: "",
    customFilters: [],
    search: "",
    limit: 100,
  });

  const productOptions =
    productsData?.data?.map((item) => ({
      label: item.product_name,
      value: item._id,
      type: item.type,
    })) || [];

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      product: "",
      suggestions: [{ product: "", plans: [], order: 1 }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "suggestions",
  });

  const selectedMainProduct = useWatch({
    control,
    name: "product",
  });

  const filteredProductOptions = useMemo(() => {
    return productOptions.filter(
      (item) => item.value !== selectedMainProduct
    );
  }, [productOptions, selectedMainProduct]);

  useEffect(() => {
    const data = initialData?.fulldata;

    if (data) {
      const formatted =
        data.suggested_products?.map((item) => ({
          product: item.product?._id || "",
          order: item.order || 1,
          plans:
            item.plans?.map((p) => ({
              plan: p.plan?._id || "",
              billing_cycle:
                typeof p.billing_cycle === "object"
                  ? p.billing_cycle?._id
                  : p.billing_cycle || "",
              quantity: p.quantity || 1,
            })) || [],
        })) || [];

      reset({
        product: data._id || "",
        suggestions: formatted,
      });

      replace(
        formatted.length
          ? formatted
          : [{ product: "", plans: [], order: 1 }]
      );
    } else {
      const defaultVal = [{ product: "", plans: [], order: 1 }];

      reset({
        product: "",
        suggestions: defaultVal,
      });

      replace(defaultVal);
    }
  }, [initialData, reset, replace]);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    const payload = {
      suggested_products: data.suggestions.map((item) => ({
        product: item.product,
        isActive: true,
        plans: item.plans.map((p) => ({
          plan: p.plan,
          billing_cycle: p.billing_cycle,
          quantity: Number(p.quantity),
        })),
      })),
    };

    if (!initialData) {
      payload.productId = data.product;
    }

    onSubmitAction(payload);
  };

  return (
    <CommonDialog
      open={open}
      onClose={handleClose}
      title={
        initialData
          ? "Edit Product Suggestion"
          : "Create Product Suggestion"
      }
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={initialData ? "Update" : "Submit"}
      cancelLabel="Cancel"
      submitDisabled={isPending}
    >
      <Box>
        <Box sx={{ p: 2, mb: 2, bgcolor: "rgba(25, 118, 210, 0.04)", border: "1px solid", borderColor: "primary.light", borderRadius: 2 }}>
          <Typography variant="subtitle2" color="primary.main" sx={{ mb: 1.5, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Target Product
          </Typography>
          <Controller
            name="product"
            control={control}
            render={({ field }) => (
              <CommonSelect
                {...field}
                label="Select Primary Product"
                options={productOptions}
                error={!!errors.product}
                helperText={errors.product?.message}
                mb={0}
                searchable
                sx={{ bgcolor: "background.paper" }}
              />
            )}
          />
        </Box>

        {/* Suggestions */}
        <Box sx={{ mb: 2, mt: 2 }}>
          <Typography variant="subtitle2" color="text.primary" sx={{ mb: 1.5, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Suggested Items
          </Typography>
          {fields.map((item, index) => (
            <SuggestionRow
              key={item.id}
              index={index}
              control={control}
              errors={errors}
              remove={remove}
              fieldsLength={fields.length}
              productOptions={filteredProductOptions}
              setValue={setValue}
            />
          ))}
        </Box>

        <Box display="flex" justifyContent="center">
          <CommonButton
            variant="outlined"
            label="Add New Suggestion"
            startIcon={<AddCircleOutlineIcon sx={{ color: "primary.main" }} />}
            sx={{ borderRadius: 2, borderStyle: "dashed", borderWidth: 2, '&:hover': { borderWidth: 2 } }}
            onClick={() =>
              append({
                product: "",
                plans: [],
                order: fields.length + 1,
              })
            }
          />
        </Box>
      </Box>
    </CommonDialog>
  );
};

export default ProductSuggestionDialog;