import React, { useEffect, useMemo, useState } from "react";
import { Country, State, City } from "country-state-city";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DoneIcon from "@mui/icons-material/Done";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Typography,
} from "@mui/material";
import Select from "react-select";
import { listTimeZones } from "timezone-support";
import { useUpdateWorkspace } from "../../../hooks/Customer/Customer-hooks";
import { CommonDescriptionField, CommonTextField } from "../../common/fields";

const schema = yup.object({
  workspace_name: yup.string().min(3).max(50).required("Please enter Company name"),
  email: yup.string().email("Invalid email format").required("Please enter Email"),
  phone_number: yup.string().matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").required("Phone number is required"),
  address: yup.string().min(3).max(100).required("Please enter Address"),
  country_code: yup.string().required("Please Select a country"),
  state: yup.string().required("Please Select State"),
  city: yup.string().required("Please Select City"),
  pincode: yup.string().optional(),
  timezone: yup.string().nullable().optional(),
  gst_no: yup.string().nullable().optional(),
  canChangePassword: yup.boolean().optional(),
});

const EditInfo = ({ setOpenEdit, workspaceDetails, workspaceId }) => {
  const [avatarColor, setAvatarColor] = useState(workspaceDetails?.color || "#673ab7");
  const [image, setImage] = useState(workspaceDetails?.logo_url);
  const [selectedImage, setSelectedImage] = useState(null);
  const countries = useMemo(() => Country.getAllCountries(), []);
  const [selectedCountrycode, setSelectedCountryCode] = useState({ name: "", phoneCode: "", isoCode: "", currency: "", locale: "" });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const mutation = useUpdateWorkspace();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { phone_number: "" },
  });

  const selectedCountryCode = watch("country_code");
  const selectedStatename = watch("state");
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size exceeds 5MB. Please select a smaller file.");
        return;
      }
      setImage(URL.createObjectURL(file));
      setSelectedImage(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size exceeds 5MB. Please select a smaller file.");
        return;
      }
      setImage(URL.createObjectURL(file));
      setSelectedImage(file);
    }
  };

  useEffect(() => {
    if (workspaceDetails) {
      setValue("workspace_name", workspaceDetails?.workspace_name);
      setValue("email", workspaceDetails?.email);
      setValue("gst_no", workspaceDetails?.gst_no);
      setValue("timezone", workspaceDetails?.timezone);
      setValue("address", workspaceDetails?.address);
      setValue("pincode", workspaceDetails?.pincode);
      setValue("phone_number", workspaceDetails?.phone_number);

      const countryName = workspaceDetails?.country;
      const stateName = workspaceDetails?.state;
      const cityName = workspaceDetails?.city;
      const countryObj = countries.find((c) => c.name === countryName);
      if (countryObj) {
        setValue("country_code", countryObj.isoCode);
        const fetchedStates = State.getStatesOfCountry(countryObj.isoCode);
        setStates(fetchedStates);
        const stateObj = fetchedStates.find((s) => s.name === stateName);
        if (stateObj) {
          setValue("state", stateObj.name);
          const fetchedCities = City.getCitiesOfState(countryObj.isoCode, stateObj.isoCode);
          setCities(fetchedCities);
          const cityObj = fetchedCities.find((c) => c.name === cityName);
          if (cityObj) setValue("city", cityObj.name);
        }
      }
    }
  }, [workspaceDetails]);

  useEffect(() => {
    if (selectedCountryCode) {
      const countryDetails = Country.getAllCountries().find((c) => c.isoCode === selectedCountryCode);
      if (countryDetails) {
        setSelectedCountryCode({
          name: countryDetails.name,
          phoneCode: countryDetails.phonecode,
          isoCode: countryDetails.isoCode,
          currency: countryDetails.currency,
          locale: countryDetails.isoCode.toLowerCase(),
        });
      }
    }
  }, [selectedCountryCode]);

  useEffect(() => {
    if (selectedCountrycode?.isoCode) {
      const fetchedStates = State.getStatesOfCountry(selectedCountrycode.isoCode);
      setStates(fetchedStates);
      setCities([]);
    }
  }, [selectedCountrycode]);

  useEffect(() => {
    if (selectedStatename) {
      const stateObj = states.find((s) => s.name === selectedStatename);
      if (stateObj) {
        const fetchedCities = City.getCitiesOfState(selectedCountrycode?.isoCode, stateObj.isoCode);
        setCities(fetchedCities);
      } else {
        setCities([]);
      }
    }
  }, [selectedStatename, selectedCountrycode, states]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    const changedFields = {};

    Object.keys(data).forEach((key) => {
      const originalValue = workspaceDetails?.[key] ?? "";
      const currentValue = data[key] ?? "";
      if (originalValue !== currentValue) changedFields[key] = currentValue;
    });

    if (avatarColor !== workspaceDetails?.color) formData.append("color", avatarColor);
    if (selectedCountrycode?.name && selectedCountrycode.name !== workspaceDetails?.country)
      formData.append("country_name", selectedCountrycode.name);
    if (selectedCountrycode?.phoneCode && selectedCountrycode.phoneCode !== workspaceDetails?.phone_number_code)
      formData.append("phone_number_code", selectedCountrycode.phoneCode);

    Object.entries(changedFields).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") formData.append(key, value);
    });

    if (selectedImage) formData.append("workspace_logo", selectedImage);

    if (formData.entries().next().done) {
      toast.error("No changes detected");
      return;
    }

    try {
      mutation.mutate(
        { _id: workspaceId, data: formData },
        {
          onSuccess: () => {
            setOpenEdit();
          },
          onError: (error) => {
            console.error("Update failed:", error);
          },
        }
      );

      setOpenEdit(false);
      setImage(null);
      setSelectedImage(null);
      setAvatarColor("#673ab7");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const timeZoneArray = listTimeZones();
  const bgColors = ["#673ab7", "#2196f3", "#e91e63", "#4caf50", "#ffc107", "#ff5722", "#ff9800", "#3f51b5", "#9c27b0", "#795548"];
  const formGroups = {
    "Workspace Details": [
      { name: "workspace_name", placeholder: "Workspace name" },
      { name: "email", placeholder: "Email", type: "email" },
      { name: "timezone", placeholder: "Timezone", type: "select" },
      { name: "gst_no", placeholder: "GST No" },
    ],
    "Contact Information": [
      { name: "address", placeholder: "Address", type: "textarea" },
      { name: "country_code", placeholder: "Country", type: "select" },
      { name: "state", placeholder: "State", type: "select" },
      { name: "city", placeholder: "City", type: "select" },
      { name: "pincode", placeholder: "Pincode" },
      { name: "phone_number", placeholder: "Phone Number" },
    ],
  };

  const getOptions = (name) => {
    switch (name) {
      case "country_code":
        return countries.map(({ isoCode, name }) => ({ value: isoCode, label: name }));
      case "state":
        return states.map(({ name }) => ({ value: name, label: name }));
      case "city":
        return cities.map(({ name }) => ({ value: name, label: name }));
      case "timezone":
        return timeZoneArray.map((zone) => ({ value: zone, label: zone }));
      default:
        return [];
    }
  };

  return (
    <Box sx={{ overflow: "auto", maxHeight: "calc(100vh - 40px)", mt: 1 }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {/* Title */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h3">Edit Workspace</Typography>
          <Typography sx={{ fontSize: 16, color: "#878787", mt: 1 }}>Add or change your Workspace Details</Typography>
        </Box>

        {/* Avatar */}
        <Box sx={{ display: "flex", alignItems: "start", gap: 3, mb: 3 }}>
          <Box sx={{ width: "40%", display: { xs: "none", md: "block" } }}>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#000", mb: 1 }}>Avatar</Typography>
            <Typography sx={{ fontSize: 13, color: "#878787" }}>Add or change your workspace avatar</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                borderRadius: 1,
                color: "#878787",
                width: 130,
                minWidth: 130,
                height: 120,
                cursor: "pointer",
                border: image ? "" : "1px dashed #878787",
              }}
              onClick={() => document.getElementById("fileInput").click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {image ? (
                <img src={image} alt="Uploaded" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <Box sx={{ textAlign: "center" }}>
                  <AddPhotoAlternateOutlinedIcon fontSize="medium" />
                  <Typography sx={{ fontSize: 13 }}>
                    Drop an image or <span style={{ color: "blue" }}>browse</span>
                  </Typography>
                </Box>
              )}
              <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleFileChange} accept="image/*" />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 1, width: 130, height: 120, backgroundColor: avatarColor }}>
              <Typography sx={{ color: "#fff", fontWeight: "bold", fontSize: 75 }}>
                {(workspaceDetails?.workspace_name?.[0] || "").toUpperCase()}
              </Typography>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 3 }}>
              {bgColors.map((color) => (
                <Box key={color} sx={{ border: avatarColor === color ? "1px solid green" : "1px solid #fff", borderRadius: "50px" }}>
                  <Box
                    sx={{
                      backgroundColor: color,
                      borderRadius: "50px",
                      width: 25,
                      height: 25,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      margin: "3px",
                    }}
                    onClick={() => setAvatarColor(color)}
                  >
                    <DoneIcon sx={{ color: avatarColor === color ? "#fff" : color, fontSize: 14 }} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Form Fields */}
        {Object.entries(formGroups).map(([sectionTitle, fields]) => (
          <Box key={sectionTitle} sx={{ display: "flex", alignItems: "start", mb: 3 }}>
            <Box sx={{ width: "40%", display: { xs: "none", md: "block" } }}>
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#000", mb: 1 }}>{sectionTitle}</Typography>
              <Typography sx={{ fontSize: 13, color: "#878787" }}>Add or change your {sectionTitle}</Typography>
            </Box>

            <Box sx={{ width: { xs: "100%", md: "calc(100% - 40%)" }, display: "flex", flexWrap: "wrap", gap: 2 }}>
              {fields.map(({ name, placeholder, type = "text" }) => (
                <Box key={name} sx={{ flex: "1 1 calc(50% - 8px)", minWidth: 200 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 500, mb: 1 }}>{placeholder}</Typography>

                  {type === "textarea" ? (
                    <CommonDescriptionField
                      value={watch(name)}
                      onChange={(e) => setValue(name, e.target.value)}
                      name={name}
                      placeholder={placeholder}
                      error={!!errors[name]}
                      helperText={errors[name]?.message}
                      rows={4}
                      width="100%"
                      mb={0}
                      mt={0}
                    />
                  ) : type === "checkbox" ? (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register(name)}
                          checked={watch(name) || false}
                          onChange={(e) => setValue(name, e.target.checked)}
                        />
                      }
                      label={placeholder}
                    />
                  ) : type === "select" ? (
                    <Select
                      options={getOptions(name)}
                      value={getOptions(name).find((option) => option.value === watch(name)) || null}
                      onChange={(selectedOption) => setValue(name, selectedOption?.value)}
                      placeholder={placeholder}
                      isClearable
                      styles={{
                        control: (base) => ({ ...base, minHeight: 40, borderRadius: 8 }),
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      menuPortalTarget={document.body}
                    />
                  ) : (
                    <CommonTextField
                      {...register(name)}
                      type={type}
                      placeholder={placeholder}
                      error={!!errors[name]}
                      helperText={errors[name]?.message}
                      fullWidth
                      mb={0}
                      mt={0}
                      height={39}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        ))}

        {/* Action Buttons */}
        <Box
          sx={{
            gap: 2,
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "flex-end",
            backgroundColor: "#fff",
            borderTop: "1px solid #e0e0e0",
            p: 2,
            zIndex: 10,
          }}
        >
          <Button
            type="button"
            variant="outlined"
            sx={{ textTransform: "none", borderRadius: 1, height: 40, minWidth: 100 }}
            onClick={() => setOpenEdit()}
          >
            Cancel
          </Button>

          <Button type="submit" variant="contained"  sx={{ textTransform: "none", borderRadius: 1, height: 40, minWidth: 100 }}>
            {isSubmitting ? <CircularProgress size={25} /> : "Edit Workspace"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditInfo;
