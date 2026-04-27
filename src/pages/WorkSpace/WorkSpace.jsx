import React, { useEffect, useMemo, useState } from "react";
import "../../styles/work-space.css";
import TwolineHeaders from "../WorkSpace/TwolineHeaders";
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import Select from "react-select";
import DoneIcon from "@mui/icons-material/Done";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { Country, State, City } from "country-state-city";
import { PhoneNumberUtil } from "google-libphonenumber";
import PhoneNumberField from "../../components/common/NDE-PhoneNumber";
import { useAddWorkspace } from "../../hooks/Customer/Customer-hooks";
import CommonButton from "../../components/common/NDE-Button";

const phoneUtil = PhoneNumberUtil.getInstance();

const schema = yup.object({
  workspace_name: yup.string().min(3).max(50).required("Please enter Workspace name"),
  email: yup.string().email("Invalid email format").required("Please enter Email"),
  phone_number: yup.string().matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").required("Phone number is required"),
  address: yup.string().min(3).max(100).required("Please enter Address"),
  country_code: yup.string().required("Please Select a country"),
  state: yup.string().required("Please Select State"),
  city: yup.string().required("Please Select City"),
  pincode: yup.string().optional(),
});

const textField = {
  outline: "none",
  border: "none",
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  "&:focus-within .MuiOutlinedInput-root": { border: "none", outline: "none" },
};

const CreateWorkspace = ({ onClose, userId, handleClose, customer ,activeStep}) => {

  const [avatarColor, setAvatarColor] = useState("#673ab7");
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const countries = useMemo(() => Country.getAllCountries(), []);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountrycode, setSelectedCountryCode] = useState({ name: "", phoneCode: "" });

  const MAX_FILE_SIZE = 5 * 1024 * 1024;


  const { control, handleSubmit, trigger, watch, formState: { errors , isDirty }, clearErrors, setError, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      workspace_name: "",
      email: customer?.email,
      phone_number: customer?.phone_number,
      address: "",
      country_code: customer?.country_code,
      state: "",
      city: "",
      pincode: "",
      phonenumber_by_country: "IN",
    },
  });

  const selectedCountry = watch("country_code");
  const selectedState = watch("state");
  const phone = watch("phone_number");
  const selectPhonecode = watch("phonenumber_by_country");

  const options = countries.map(c => ({
    value: c.isoCode,
    labelText: `${c.name} (+${c.phonecode})`,
    phonecode: `+${c.phonecode}`,
    label: c.name,
  }));


  const { mutateAsync: addWorkspace, isLoading } = useAddWorkspace(userId);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= MAX_FILE_SIZE) {
      setImage(URL.createObjectURL(file));
      setSelectedImage(file);
    } else toast.error("File size exceeds 5MB. Please select a smaller file.");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.size <= MAX_FILE_SIZE) {
      setImage(URL.createObjectURL(file));
      setSelectedImage(file);
    } else toast.error("File size exceeds 5MB. Please select a smaller file.");
  };

  useEffect(() => {
    if (selectedCountry) {
      const countryDetails = countries.find(c => c.isoCode === selectedCountry);
      if (countryDetails) setSelectedCountryCode({ name: countryDetails.name, phoneCode: countryDetails.phonecode });
      setStates(State.getStatesOfCountry(selectedCountry));
      setCities([]);
    }
  }, [selectedCountry, countries]);

  useEffect(() => {
    if (selectedState) {
      const stateObj = states.find(s => s.name === selectedState);
      if (stateObj) setCities(City.getCitiesOfState(selectedCountry, stateObj.isoCode));
    } else setCities([]);
  }, [selectedState, selectedCountry, states]);

  useEffect(() => {
    if (!phone) {
      clearErrors("phone_number");
      return;
    }
    try {
      const parsed = phoneUtil.parseAndKeepRawInput(phone, selectPhonecode);
      const isValid = phoneUtil.isValidNumberForRegion(parsed, selectPhonecode);
      if (!isValid) setError("phone_number", { type: "manual", message: "Invalid number for selected country" });
      else clearErrors("phone_number");
    } catch {
      setError("phone_number", { type: "manual", message: "Invalid number format" });
    }
  }, [phone, selectPhonecode, clearErrors, setError]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] && key !== "phonenumber_by_country") formData.append(key, data[key]);
    });
    formData.append("color", avatarColor);
    if (selectedCountrycode?.name) formData.append("country", selectedCountrycode.name);
    if (selectedCountrycode?.phoneCode) formData.append("phone_number_code", `+${selectedCountrycode.phoneCode}`);
    if (selectedImage) formData.append("workspace_logo", selectedImage);
    if (userId) formData.append("userId", userId);

    try {
      await addWorkspace(formData);
      reset();
      setImage(null);
      setSelectedImage(null);
      setAvatarColor("#673ab7");
      if (onClose) onClose();
      handleClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create workspace");
    }
  };

  const bgColors = ["#673ab7", "#2196f3", "#e91e63", "#4caf50", "#ffc107", "#ff5722", "#ff9800", "#3f51b5", "#9c27b0", "#795548"];

  const onError = (errors) => {
    const field = Object.keys(errors)[0];
    const el = document.querySelector(`[name="${field}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  useEffect(() => {
    if (customer) {
      reset({
        workspace_name: "",
        email: customer.email || "",
        phone_number: customer.phone_number || "",
        address: "",
        country_code: customer.country || "",
        state: customer.state || "",
        city: customer.city || "",
        pincode: customer.pincode || "",
        phonenumber_by_country: "IN",
      });
    }
  }, [customer, reset]);

  return (
    <Box
      sx={{
        overflow: "auto",
        maxHeight: activeStep ? "calc(100vh - 114px)" : "calc(100vh - 40px)",
        mt: 2
      }}
    >
      <Box className="welcomeMain">
        <TwolineHeaders
          header={"Create Workspace"}
          subline={"Set up a centralized hub for your team or organization."}
        />
        <Box className="ContentMain">
          <form className="createWorkspaceMain">
            {/* Avatar Section */}
            <Box>
              <Box
                className="profileMain"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <Box
                  className="profileImg"
                  style={{ border: image ? "" : "1px dashed #878787" }}
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  {image ? (
                    <img src={image} alt="Uploaded" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  ) : (
                    <>
                      <AddPhotoAlternateOutlinedIcon fontSize="medium" />
                      <Typography sx={{ fontSize: "12px", textAlign: "center" }}>
                        Drop an image or <span style={{ color: "blue" }}>browse</span>
                      </Typography>
                    </>
                  )}
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </Box>
                <Box className="divider">
                  <Box className="dividerLine" />
                  <Typography sx={{ color: "#ccc", fontSize: "14px", fontWeight: "bold", margin: "3px 0" }}>OR</Typography>
                  <Box className="dividerLine" />
                </Box>
                <Box display="flex" alignItems="center" gap="20px">
                  <Box className="profileAvatar" style={{ backgroundColor: avatarColor }} />
                  <Box className="colorOptionMain">
                    {bgColors.map(color => (
                      <Box key={color} style={{ border: avatarColor === color ? "1px solid green" : "1px solid #fff", borderRadius: "50px" }}>
                        <Box style={{ backgroundColor: color }} className="colorOptions" onClick={() => setAvatarColor(color)}>
                          <DoneIcon fontSize="small" sx={{ color: avatarColor === color ? "#fff" : color, fontSize: "14px" }} />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
              <Typography sx={{ color: "#878787", fontSize: "13px", marginTop: "10px", padding: "0 150px" }}>
                Provide or customize your workspace avatar
              </Typography>
            </Box>

            {/* Form Fields */}
            <Box className="wsformMain">
              {[
                { name: "workspace_name", placeholder: "Workspace name"},
                { name: "email", placeholder: "Email", type: "email", disabled: customer },
                { name: "phone_number", placeholder: "Phone Number", type: "codeSelect", disabled: customer },
                { name: "address", placeholder: "Address" },
                { name: "country_code", placeholder: "Country", type: "select" },
                { name: "state", placeholder: "State", type: "select" },
                { name: "city", placeholder: "City", type: "select" },
                { name: "pincode", placeholder: "Pincode" },
              ].map(({ name, placeholder, type, disabled }) => (
                <Box key={name} mb={0.5}>
                  <Box style={{ border: "1px solid #D1D1D1", borderRadius: "6px", padding: "0px" }}>
                    <FormControl fullWidth>
                      <Controller
                        name={name}
                        control={control}
                        render={({ field }) =>
                          type === "select" ? (
                            <Select
                              isDisabled={disabled}
                              placeholder={placeholder}
                              options={
                                name === "country_code"
                                  ? countries.map(c => ({ value: c.isoCode, label: c.name }))
                                  : name === "state"
                                    ? states.map(s => ({ value: s.name, label: s.name }))
                                    : name === "city"
                                      ? cities.map(c => ({ value: c.name, label: c.name }))
                                      : []
                              }
                              value={
                                (
                                  name === "country_code"
                                    ? countries.map(c => ({ value: c.isoCode, label: c.name }))
                                    : name === "state"
                                      ? states.map(s => ({ value: s.name, label: s.name }))
                                      : name === "city"
                                        ? cities.map(c => ({ value: c.name, label: c.name }))
                                        : []
                                ).find(option => option.value === field.value) || null
                              }
                              onChange={selected => { field.onChange(selected?.value); trigger(name); }}
                              menuPortalTarget={document.body}
                              styles={{
                                menuPortal: base => ({ ...base, zIndex: 9999 }),
                                menu: base => ({ ...base, zIndex: 9999 })
                              }}
                            />
                          ) : type === "codeSelect" ? (
                            <PhoneNumberField
                              name="phone_number"
                              countryCodeName="phonenumber_by_country"
                              control={control}
                              errors={errors}
                              placeholder={placeholder}
                              options={options}
                              textFieldSx={textField}
                              disabled={disabled}
                            />
                          ) : (
                            <TextField
                              {...field}
                              onChange={e => { field.onChange(e); trigger(name); }}
                              disabled={disabled}
                              size="small"
                              variant="outlined"
                              sx={textField}
                              placeholder={placeholder}
                              autoComplete="off"
                              error={!!errors[name]}
                            />
                          )
                        }
                      />
                    </FormControl>
                  </Box>
                  <FormHelperText sx={{ color: "#d32f2f", minHeight: "18px" }}>
                    {errors[name]?.message}
                  </FormHelperText>
                </Box>
              ))}
            </Box>
          </form>

          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              backgroundColor: "#fff",
              borderTop: "1px solid #e0e0e0",
              p: 2,
              zIndex: 10,
            }}
          >
            <CommonButton
              label="Cancel"
              variant="outlined"
              onClick={() => {
                reset();
                setImage(null);
                setSelectedImage(null);
                setAvatarColor("#673ab7");
                if (onClose) onClose();
                handleClose();
              }}
              startIcon={false}
              sx={{ width: 100 }}
            />

            <CommonButton
              label={isLoading ? (
                <>
                  <FlowerLoader size={20} sx={{ mr: 1 }} /> Creating...
                </>
              ) : "Create"}
              variant="contained"
              onClick={handleSubmit(onSubmit, onError)}
              startIcon={false}
              disabled={!isDirty}
              sx={{ width: 100 }}
            />
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default CreateWorkspace;
