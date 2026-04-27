import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  CommonCountryStateCity,
  CommonTextField,
  CommonDescriptionField,
} from "../../../common/fields";
import { useMemo, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import PhoneNumberField from "../../../common/fields/NDE-MobileNumberCode";

const FormRow = ({ label, mandatory = false, children }) => (
  <Box display="flex" flexDirection="column" gap={0.5}>
    <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
      {label}
      {mandatory && <span style={{ color: "#d32f2f" }}> *</span>}
    </Typography>
    {children}
  </Box>
);



/* -------------------- Validation Schema -------------------- */

const schema = yup.object().shape({
  attention: yup.string().required("Attention is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  street1: yup.string().required("Street 1 is required"),
  pinCode: yup
    .string()
    .matches(/^[0-9]{5,6}$/, "Enter valid pin code")
    .required("Pin Code is required"),
  phone_number: yup.object({
    code: yup.string().required(),
    number: yup
      .string()
      .required("Phone number is required")
      .test("is-valid-phone", "Invalid phone number", (value, ctx) => {
        try {
          const phone = parsePhoneNumberFromString(
            `${ctx.parent.code}${value}`,
            "IN",
          );
          return phone?.isValid();
        } catch {
          return false;
        }
      }),
  }),

  fax: yup.string().nullable(),
});

export default function AdditionalAddressModal({ open, onClose }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      attention: "",
      country: "",
      state: "",
      city: "",
      street1: "",
      street2: "",
      pinCode: "",
      phone_number: {
        code: "+91",
        number: "",
      },
      fax: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    onClose();
  };

  /* -------------------- Watch Values -------------------- */

  const selectedCountry = useWatch({ control, name: "country" });
  const selectedState = useWatch({ control, name: "state" });

  /* -------------------- Options -------------------- */

  const countries = useMemo(() => Country.getAllCountries(), []);

  const states = useMemo(
    () => (selectedCountry ? State.getStatesOfCountry(selectedCountry) : []),
    [selectedCountry],
  );

  const cities = useMemo(
    () =>
      selectedCountry && selectedState
        ? City.getCitiesOfState(selectedCountry, selectedState)
        : [],
    [selectedCountry, selectedState],
  );

  /* -------------------- Reset Dependent Fields -------------------- */

  useEffect(() => {
    setValue("state", "");
    setValue("city", "");
  }, [selectedCountry, setValue]);

  useEffect(() => {
    setValue("city", "");
  }, [selectedState, setValue]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          maxHeight: "90vh",
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ================= HEADER (Fixed) ================= */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          py={1}
          borderBottom="1px solid #eee"
        >
          <Typography variant="h6" fontWeight={600}>
            Additional Address
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: "red" }} />
          </IconButton>
        </Box>

        {/* ================= BODY (Scrollable) ================= */}
        <Box
          component="form"
          id="additional-address-form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 2,
            py: 1,
          }}
        >
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Attention */}
            <Controller
              name="attention"
              control={control}
              render={({ field }) => (
                <FormRow label="Attention" >
                  <CommonTextField
                    {...field}
                    error={!!errors.attention}
                    helperText={errors.attention?.message}
                    mt={0}
                    mb={0}
                  />
                </FormRow>
              )}
            />

            {/* Country */}
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <FormRow label="Country / Region" >
                  <CommonCountryStateCity
                    {...field}
                    options={countries}
                    getOptionLabel={(opt) => opt.name}
                    getOptionValue={(opt) => opt.isoCode}
                    placeholder="Search Country"
                    mt={0}
                    mb={0}
                  />
                </FormRow>
              )}
            />

            {/* State */}
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <FormRow label="State" >
                  <CommonCountryStateCity
                    {...field}
                    options={states}
                    getOptionLabel={(opt) => opt.name}
                    getOptionValue={(opt) => opt.isoCode}
                    placeholder="Search State"
                    mt={0}
                    mb={0}
                  />
                </FormRow>
              )}
            />

            {/* Address */}
            <Controller
              name="street1"
              control={control}
              render={({ field }) => (
                <FormRow label="Address" >
                  <CommonDescriptionField
                    {...field}
                    rows={3}
                    placeholder="Street 1"
                    error={!!errors.street1}
                    helperText={errors.street1?.message}
                    mt={0}
                    mb={0}
                  />
                </FormRow>
              )}
            />

            <Controller
              name="street2"
              control={control}
              render={({ field }) => (
                <CommonDescriptionField
                  {...field}
                  mt={0}
                  mb={0}
                  rows={2}
                  placeholder="Street 2"
                />
              )}
            />

            {/* City + Pin */}
            <Box display="flex" gap={2}>
              <Box flex={1}>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <FormRow label="City" >
                      <CommonCountryStateCity
                        {...field}
                        options={cities}
                        getOptionLabel={(opt) => opt.name}
                        getOptionValue={(opt) => opt.name}
                        placeholder="Search City"
                      />
                    </FormRow>
                  )}
                />
              </Box>

              <Box flex={1}>
                <Controller
                  name="pinCode"
                  control={control}
                  render={({ field }) => (
                    <FormRow label="Pin Code" mandatory>
                      <CommonTextField
                        {...field}
                        error={!!errors.pinCode}
                        helperText={errors.pinCode?.message}
                      />
                    </FormRow>
                  )}
                />
              </Box>
            </Box>

            {/* Phone + Fax */}
            <Box display="flex" gap={2}>
              <Box flex={1}>
                <Controller
                  name="phone_number"
                  control={control}
                  render={({ field }) => (
                    <FormRow label="Phone" mandatory>
                      <PhoneNumberField
                        {...field}
                        error={!!errors?.phone_number?.number}
                        helperText={errors?.phone_number?.number?.message}
                      />
                    </FormRow>
                  )}
                />
              </Box>

              <Box flex={1}>
                <Controller
                  name="fax"
                  control={control}
                  render={({ field }) => (
                    <FormRow label="Fax Number">
                      <CommonTextField
                        {...field}
                        error={!!errors.fax}
                        helperText={errors.fax?.message}
                      />
                    </FormRow>
                  )}
                />
              </Box>
            </Box>

            {/* Note */}
            <Typography variant="body2" color="text.secondary">
              <strong>Note:</strong> Changes made here will be updated for this
              customer.
            </Typography>
          </Box>
        </Box>

        {/* ================= FOOTER (Fixed) ================= */}
        <Box px={3} py={2} display="flex" gap={2} borderTop="1px solid #eee">
          <Button
            type="submit"
            form="additional-address-form"
            variant="contained"
            sx={{
              backgroundColor: "#5ac39b",
              textTransform: "none",
              "&:hover": { backgroundColor: "#49b58a" },
            }}
          >
            Save
          </Button>

          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
