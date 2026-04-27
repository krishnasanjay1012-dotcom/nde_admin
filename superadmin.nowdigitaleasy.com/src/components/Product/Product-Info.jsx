import {
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { Controller, FormProvider } from "react-hook-form";

import { CommonAutocomplete, CommonCheckbox, CommonDescriptionField, CommonNumberField, CommonRadioButton, CommonSelect, CommonTextField } from "../common/fields";
import PlanFeaturesForm from "./Plan/Plan-Features";
import { useNavigate } from "react-router-dom";


const PlanDetailsForm = ({
  methods,
  selectedProduct,
  planOptions = [],
  isLoading,
  errors,
  selectedCycle,
  showInWidgets,
  fields = [],
  append,
  remove,
  move,
  setValue,
  watch,
  pleskData,
  gsuiteData
}) => {
  const { control } = methods;
  const navigate = useNavigate();


  return (
    <FormProvider {...methods}>
      <Box component="form" >
        {/* Plan Details Section */}
        <Typography variant="h6">Plan Details</Typography>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 48%" } }}>
              <Controller
                name="plan_name"
                control={control}
                render={({ field }) =>
                  selectedProduct?.type === "gsuite" || selectedProduct?.type === "domain" ? (
                    <CommonAutocomplete
                      {...field}
                      label="Plan Name"
                      options={planOptions}
                      error={!!errors.plan_name}
                      helperText={errors.plan_name?.message}
                      mandatory
                      loading={isLoading}
                      bottomActionLabel={
                        selectedProduct?.type === "domain" ? "Configure Terms" : undefined
                      }

                      onBottomActionClick={() =>
                        selectedProduct?.type === "domain" &&
                        navigate("/settings/integration/domain-config")
                      }
                    />
                  ) : (
                    <CommonTextField
                      {...field}
                      label="Plan Name"
                      mandatory
                      error={!!errors.plan_name}
                      helperText={errors.plan_name?.message}
                    />
                  )
                }
              />
            </Box>

            {/* HSN Code */}
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 48%" } }}>
              <Controller
                name="hsn_code"
                control={control}
                render={({ field }) => (
                  <CommonNumberField
                    {...field}
                    label="Plan Code"
                    mandatory
                    error={!!errors.hsn_code}
                    helperText={errors.hsn_code?.message}
                  />
                )}
              />
            </Box>
          </Box>
          <Box>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <CommonDescriptionField
                  {...field}
                  label="Plan Description"
                  multiline
                  mb={-1}
                />
              )}
            />
          </Box>
        </Box>


        <Divider sx={{ my: 3 }} />

        {/* Billing Cycle Section */}
        <Box sx={{ flex: "1 1 100%" }} mt={3}>
          <Controller
            name="billing_cycle"
            control={control}
            render={({ field }) => (
              <CommonRadioButton
                {...field}
                label="Billing Cycles"
                mandatory
                options={[
                  { label: "Auto-renews until canceled", value: "auto" },
                  { label: "Expires after a specified no. of billing cycles", value: "fixed" },
                ]}
              />
            )}
          />
          {selectedCycle === "fixed" && (
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', mt: 1 }}>
              <Controller
                name="billing_count"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    type="number"
                    placeholder="Enter number"
                    mt={0}
                    mb={0}
                    sx={{ width: 300 }}
                  />
                )} />
              <Typography variant="subtitle1" fontWeight={400} fontSize={12} color="textSecondary">
                Number of times the customer will be billed for a subscription of this plan
              </Typography>
            </Box>
          )}
        </Box>

        {/* Trial and Setup Fee Section */}

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
          {["app","suite"].includes(selectedProduct?.type) && (
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 8px)" } }}>
              <Controller
                name="trial_days"
                control={control}
                render={({ field }) => (
                  <CommonNumberField {...field} label="Free Trial (days)" mb={1} />
                )}
              />

            </Box>
          )}
          {["app", "gsuite","suite"].includes(selectedProduct?.type) && (
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 8px)" } }}>
              <Controller
                name="max_users"
                control={control}
                render={({ field }) => (
                  <CommonNumberField {...field} label="Maximum users" mb={1} />
                )}
              />
            </Box>
          )}
        </Box>


        {["gsuite", "hosting", "app"].includes(selectedProduct?.type) && (
          <Box>
            <Divider sx={{ my: 1 }} />

            {/* HOSTED PAYMENT */}
            <Typography variant="h6" mb={1} mt={3}>
              Hosted Payment Pages & Portal
            </Typography>
            <Box display="flex" flexDirection="column">
              <Controller
                name="allow_plan_change"
                control={control}
                render={({ field }) => (
                  <CommonCheckbox
                    {...field}
                    checked={field.value}
                    label="Allow customers to switch plans from portal"
                    mr={0}
                  />
                )}
              />
              <Controller
                name="show_in_widgets"
                control={control}
                render={({ field }) => (
                  <CommonCheckbox
                    {...field}
                    checked={field.value}
                    label="Display this plan in pricing & checkout widgets"
                    mr={0}
                  />
                )}
              />
              {showInWidgets && (
                <PlanFeaturesForm
                  fields={fields}
                  append={append}
                  remove={remove}
                  move={move}
                  watch={watch}
                  setValue={setValue}
                />
              )}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* ACCOUNT DETAILS */}
        <Typography variant="h6">Account Details</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
          <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 8px)" } }}>
            <Controller
              name="plan_account"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  {...field}
                  label="Plan Account"
                  mb={0}
                  options={[
                    { label: "Sales", value: "sales" },
                    { label: "Revenue", value: "Revenue" },
                  ]}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 8px)" } }}>
            <Controller
              name="setup_fee_account"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  {...field}
                  label="Setup Fee Account"
                  mb={0}
                  options={[
                    { label: "Sales", value: "sales" },
                    { label: "Revenue", value: "Revenue" },
                  ]}
                />
              )}
            />
          </Box>
        </Box>

        <>
          <Divider sx={{ my: 2 }} />
          {["gsuite", "hosting"].includes(selectedProduct?.type) && (
            <Controller
              name="config_id"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  label="Configuration"
                  options={
                    selectedProduct?.type === "gsuite"
                      ? gsuiteData.map(item => ({
                        label: item.aliasName,
                        value: item._id,
                      }))
                      : selectedProduct?.type === "hosting"
                        ? pleskData.map(item => ({
                          label: item.serverName,
                          value: item._id,
                        }))
                        : []
                  }
                  mandatory
                  error={!!errors.config_id}
                  helperText={errors.config_id?.message}
                />
              )}
            />

          )}
        </>
      </Box>
    </FormProvider>
  );
};

export default PlanDetailsForm;