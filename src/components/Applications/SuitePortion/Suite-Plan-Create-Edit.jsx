import { Box, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { CommonCheckbox, CommonDescriptionField, CommonRadioButton, CommonSelect, CommonTextField } from '../../common/fields'
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from '@mui/icons-material/Add';
import CommonButton from '../../common/NDE-Button';
import CommonDrawer from '../../common/NDE-Drawer';
import { useCreateSuitePlan, useUpdateSuitePlan } from '../../../hooks/application/application-hooks';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAdminId } from '../../../utils/session';

const schema = yup.object().shape({
  planname: yup.string().required("Plan Name is required"),
});

const mapInitialData = (data) => {
  if (!data) return null;

  return {
    planId: data._id,
    planname: data.plan_name || "",
    plancode: "", 
    unitname: "", 
    price: "", 
    billtype: "", 
    billvalue: "", 
    billcycles: "", 
    freetrial: data.trial_days || "", 
    setupfee: "", 
    plantype: "goods", 
    sac: "", 
    taxtype: "taxable", 
    nontaxreason: "", 
    plandescription: data.description || "", 
    customerportal: false, 
    intratax: "", 
    intertax: "", 
    pricingtype: false, 
    planfeature: data.features?.length
      ? data.features.map((f) => ({
          featureid: f._id || "",
          name: f.name || "",
          tooltipname: f.tooltip || "",
          addNewtag: false,
        }))
      : [
          {
            featureid: "",
            name: "",
            tooltipname: "",
            addNewtag: false,
          },
        ],
  };
};

const emptyFormValues = {
  planId: "",
  planname: "",
  plancode: "",
  unitname: "",
  price: "",
  billtype: "",
  billvalue: "",
  billcycles: "",
  freetrial: "",
  setupfee: "",
  plantype: "goods",
  sac: "",
  taxtype: "taxable",
  nontaxreason: "",
  plandescription: "",
  customerportal: false,
  intratax: "",
  intertax: "",
  pricingtype: false,
  planfeature: [
    {
      featureid: "",
      name: "",
      tooltipname: "",
      addNewtag: false,
    },
  ],
};



const CreatePlan = ({ open, setOpen, initialData,selectedProduct }) => {

  const adminId = useAdminId();   
  const productId = selectedProduct?.product?._id || selectedProduct?._id || null ;
  const createPlanMutation = useCreateSuitePlan();
  const updatePlanMutation = useUpdateSuitePlan();

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: mapInitialData(initialData),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "planfeature",
  });

  useEffect(() => {
    reset(mapInitialData(initialData));
  }, [initialData, reset]);

  const [editIconswap, setEditIconswap] = useState(false);

  const taxtype = watch('taxtype');
  const pricingtype = watch('pricingtype');

  const handleClose = () => {
    setOpen(false);
    reset();
    reset(emptyFormValues); 
  };

const onSubmit = async (data) => {
  try {
    const payload = {
      suiteId: productId, 
      plan_name: data.planname,  
      description: data.plandescription || "",
      created_by:adminId,
    };

    if (initialData?._id) {
        //  console.log("Updating plan with ID:", initialData._id, "Payload:", payload);
      await updatePlanMutation.mutateAsync({id: initialData._id, data: payload});
    } else {
      await createPlanMutation.mutateAsync(payload);
    }

    handleClose();
    reset();
  } catch (err) {
    console.error(err);
  }
};



  return (
    <Box>
      <CommonDrawer
        open={open}
        onClose={handleClose}
        title={initialData ? "Edit Suite Plan" : "Add Suite Plan"}
        onSubmit={handleSubmit(onSubmit)}
        anchor="right"
        width={600}
        actions={[
          { label: "Cancel", variant: "outlined", onClick: handleClose },
          { label: initialData ? "Update" : "Save", onClick: handleSubmit(onSubmit) },
        ]}
      >
        <Box sx={{ p: 1 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 2 }}>
            {/* Plan Name */}
            <Box sx={{ flex: "1 1 45%", minWidth: 250 }}>
              <Controller
                name="planname"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    label="Plan Name"
                    error={!!errors.planname}
                    helperText={errors.planname?.message}
                    mandatory
                    fullWidth
                    sx={{ mb: 0 }}
                  />
                )}
              />
            </Box>

            {/* Unit Name */}
            <Box sx={{ flex: "1 1 45%", minWidth: 250 }}>
              <Controller
                name="unitname"
                control={control}
                render={({ field }) => (
                  <CommonSelect
                    {...field}
                    label="Unit Name"
                    options={[
                      { label: "Pcs", value: "pcs" },
                      { label: "Kgs", value: "kgs" },
                      { label: "Cms", value: "cms" },
                    ]}
                    onChange={(val) => field.onChange(val)}
                    fullWidth
                    sx={{ mb: 0 }}
                  />
                )}
              />
            </Box>
          </Box>
          {/* Billing Every */}
          <Box sx={{ display: "flex", flexDirection: "column", mb: 3 }}>
            {/* Title on top */}
            <Typography variant="body1" sx={{ mb: 1 }}>
              Billing Every 
            </Typography>

            {/* Fields in same row */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {/* Billing Value */}
              <Controller
                name="billvalue"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    label="Value"
                    sx={{ mb: 0, width: 217 }}
                  />
                )}
              />

              {/* Billing Type */}
              <Controller
                name="billtype"
                control={control}
                render={({ field }) => (
                  <CommonSelect
                    {...field}
                    label="Type"
                    options={[
                      { label: "Month(s)", value: "month" },
                      { label: "Year(s)", value: "year" },
                      { label: "Week(s)", value: "week" },
                    ]}
                    onChange={(val) => field.onChange(val)}
                    sx={{ mb: 0, width: 217 }}
                  />
                )}
              />
            </Box>
          </Box>



          {/* Billing Cycles */}
          <Box sx={{ display: "flex", flexDirection: "column", mb: 3 }}>
            {/* Title */}
            <Typography variant="body1"sx={{ mb: 1 }}>
              Billing Cycles 
            </Typography>

            {/* Radio options in same row */}
            <CommonRadioButton
              type="controller"
              control={control}
              name="billcycles"
              options={[
                { value: "autorenewal", label: "Auto-renews until canceled" },
                { value: "expires", label: "Expires after a specified no. of billing cycles" },
              ]}
              gap="16px" // add some spacing between options
              sxRadio={{ color: "#1976d2" }}
              sxLabel={{ fontSize: "14px" }}
            />
          </Box>


          {/* Free Trial & SAC Row */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
            {/* Free Trial */}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Controller
                name="freetrial"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    width="260px"
                    label={"Free Trial"}
                    sx={{ mb: 0 }}
                  />
                )}
              />
            </Box>

            {/* SAC */}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Controller
                name="sac"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    width="260px"
                    label={"SAC"}
                    sx={{ mb: 0 }}
                  />
                )}
              />
            </Box>
          </Box>


          {/* Tax Type */}
          <Box sx={{ display: "flex", flexDirection: "column", mb: 1}}>
            <Typography variant="body1" >
              Tax Type
            </Typography>
            <CommonRadioButton
              type="controller"
              control={control}
              name="taxtype"
              options={[
                { value: "taxable", label: "Taxable" },
                { value: "nontaxable", label: "Non-Taxable" },
              ]}
              sxRadio={{ color: "#1976d2" }}
              sxLabel={{ fontSize: "14px" }}
            />
          </Box>

          {/* Exemption Reason (only when non-taxable) */}
          {taxtype === "nontaxable" && (
            <Box sx={{ display: "flex", flexDirection: "column", mb: 3 }}>
              <Typography variant="body1" color="error" >
                Exemption Reason*
              </Typography>
              <Controller
                name="nontaxreason"
                control={control}
                render={({ field }) => (
                  <CommonSelect
                    {...field}
                    options={[{ label: "Exempt", value: "Exempt" }]}
                    onChange={(val) => field.onChange(val)}
                    sx={{ mb: 0 }}
                  />
                )}
              />
            </Box>
          )}


          {taxtype === 'taxable' &&
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>
              <Box display="flex" alignItems="center" gap="5px" sx={{ marginTop: "20px" }}>
                <Typography variant="h5" color="text.secondary">Tax Rates</Typography>
                {!editIconswap &&
                  <IconButton onClick={() => setEditIconswap(true)}>
                    <EditIcon color="primary" fontSize='small' />
                  </IconButton>
                }
              </Box>

              {/* Intra/Inter tax */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
                <div style={{ minWidth: '180px', maxWidth: '200px' }}>
                  <Typography variant='body1' color='text.secondary'>Intra State Tax Rate</Typography>
                </div>
                {editIconswap ?
                  <Controller
                    name="intratax"
                    control={control}
                    render={({ field }) => (
                      <CommonSelect
                        {...field}
                        width='260px'

                        options={[
                          { label: 'GST[0%]', value: 'gst0' },
                          { label: 'GST[10%]', value: 'gst10' },
                          { label: 'GST[15%]', value: 'gst15' },
                        ]}
                        onChange={(val) => field.onChange(val)}
                        sx={{ mb: 0 }}
                      />
                    )}
                  /> :
                  <Typography variant='body1' color='text.secondary'>GST18 (18%)</Typography>
                }
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
                <div style={{ minWidth: '180px', maxWidth: '200px' }}>
                  <Typography variant='body1' color='text.secondary'>Inter State Tax Rate</Typography>
                </div>
                {editIconswap ?
                  <Controller
                    name="intertax"
                    control={control}
                    render={({ field }) => (
                      <CommonSelect
                        {...field}
                        width='260px'

                        options={[
                          { label: 'GST[0%]', value: 'gst0' },
                          { label: 'GST[10%]', value: 'gst10' },
                          { label: 'GST[15%]', value: 'gst15' },
                        ]}
                        onChange={(val) => field.onChange(val)}
                        sx={{ mb: 0 }}
                      />
                    )}
                  /> :
                  <Typography variant='body1' color='text.secondary'>IGST18 (18%)</Typography>
                }
              </div>
            </div>
          }

          {/* Plan Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ minWidth: '180px', maxWidth: '180px' }}>
                <Typography variant='body1' color='text.secondary'>Plan Description</Typography>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Controller
                  name='plandescription'
                  control={control}
                  render={({ field, fieldState }) => (
                    <CommonDescriptionField
                      {...field}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      width="260px"
                      sx={{ mb: 1 }}
                    />
                  )}
                />

                <div>
                  <Controller
                    name="customerportal"
                    control={control}
                    render={({ field }) => (
                      <CommonCheckbox
                        label="Allow customers switch their existing plan to this plan, from the Customer Portal."
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        sx={{ mb: 2 }}

                      />
                    )}
                  />
                </div>


              </div>
            </div>
          </div>


          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>
            <div style={{ marginBottom: '10px', marginTop: "20px" }}>
              <Typography variant="h5" color="text.secondary">
                Pricing Widget
              </Typography>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ minWidth: '180px', maxidth: '180px' }}>
                <Typography variant='body1' color='text.secondary'>Pricing Widget</Typography>
              </div>
              <div>
                <Controller
                  name="pricingtype"
                  control={control}
                  render={({ field }) => (
                    <CommonCheckbox
                      label="Display this plan in the pricing widget."
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      sx={{ mb: 0 }}

                    />
                  )}
                />
              </div>
            </div>
            {pricingtype &&
              <>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ minWidth: '180px', maxidth: '180px' }}>
                    <Typography variant='body1' color='text.secondary' >Plan Features</Typography>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>


                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <table style={{ border: '1px solid #ddd', borderCollapse: 'collapse', marginBottom: '20px' }}>
                        <thead>
                          <tr style={{ border: '1px solid #ddd' }}>
                            <th style={{
                              textAlign: "left",
                              width: "265px",
                              borderRight: '1px solid #ddd',
                              height: "40px",
                              // fixed header height
                              verticalAlign: "middle", // keep text centered
                              // padding: "8px"
                            }}>
                              Name
                            </th>
                            <th style={{
                              textAlign: "left",
                              width: "265px",
                              borderRight: '1px solid #ddd',
                              height: "40px",          // fixed header height
                              verticalAlign: "middle", // keep text centered
                              // padding: "8px"
                            }}>
                              Tooltip
                            </th>
                            <th style={{
                              textAlign: "left",
                              width: "265px",
                              borderRight: '1px solid #ddd',
                              height: "40px",          // fixed header height
                              verticalAlign: "middle", // keep text centered
                              // padding: "8px"
                            }}>
                              Add New Tag
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {fields.map((field, ind) => (
                            <tr key={field.id}>
                              {/* Name field */}
                              <td style={{ width: "265px", height: "50px", borderRight: "1px solid #ddd", verticalAlign: "top", borderBottom: '1px solid #ddd ' }}>
                                <Controller
                                  control={control}
                                  name={`planfeature.${ind}.name`}
                                  render={({ field }) => (
                                    <CommonTextField
                                      {...field}
                                      width="265px"
                                      height="50px"
                                      sx={{ mb: 0 }}
                                    />
                                  )}
                                />
                              </td>
                              {/* Tooltip field */}
                              <td
                                style={{
                                  width: "265px",
                                  height: "50px",
                                  borderRight: "1px solid #ddd",
                                  verticalAlign: "top",
                                  borderBottom: "1px solid #ddd",
                                }}
                              >
                                <Controller
                                  control={control}
                                  name={`planfeature.${ind}.tooltipname`}   // ✅ only name
                                  render={({ field }) => (
                                    <CommonTextField
                                      {...field}
                                      width="265px"
                                      height="50px"
                                      sx={{ mb: 0 }}
                                    />
                                  )}
                                />
                              </td>

                              {/* Add New Tag checkbox */}
                              <td
                                style={{
                                  width: "100px",
                                  height: "50px",
                                  verticalAlign: "top",
                                  padding: "5px 15px",
                                  borderBottom: "1px solid #ddd",
                                  borderRight: "1px solid #ddd",
                                }}
                              >
                                <Controller
                                  control={control}
                                  name={`planfeature.${ind}.addNewtag`}   // ✅ only name
                                  render={({ field }) => (
                                    <CommonCheckbox
                                      checked={field.value}
                                      onChange={(e) => field.onChange(e.target.checked)}
                                      sx={{ mb: 0 }}
                                    />
                                  )}
                                />
                              </td>

                              <td style={{ width: "265px", height: "50px", borderRight: "1px solid #ddd", verticalAlign: "top", borderBottom: '1px solid #ddd' }}>
                                <IconButton
                                  onClick={() => {
                                    if (fields.length > 1) {
                                      remove(ind);
                                    }
                                  }}
                                >
                                  <CloseIcon color="error" fontSize="small" />
                                </IconButton>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <CommonButton
                      label={'Add Feature'}
                      variant='text'
                      startIcon={<AddIcon fontSize='small' />}
                      onClick={() =>
                        append({
                          name: "",        // default values for new row
                          tooltipname: "",
                          addNewtag: false,
                        })
                      }
                      sx={{
                        width: "150px",
                        height: "40px",

                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "inherit",
                          boxShadow: "none",
                        },
                      }}
                    />
                  </div>
                </div>
              </>
            }
          </div>
        </Box>
      </CommonDrawer>
    </Box>
  )
}

export default CreatePlan
