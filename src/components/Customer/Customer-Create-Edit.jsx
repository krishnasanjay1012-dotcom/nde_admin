// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import BasicFields from "./BasicFields";
// import { CommonTab } from "../common/fields/index";
// import OtherDetails from "./OtherDetails";
// import Address from "./Address";
// import Remarks from "./Remarks";
// import { Box } from "@mui/material";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import {
//   useClientSignup,
//   useUpdateClientById,
//   useGetCustomerInfo,
// } from "../../hooks/Customer/Customer-hooks";
// import FlowerLoader from "../common/NDE-loader";
// import CommonDrawer from "../common/NDE-Drawer";
// import { useEmailGroups } from "../../hooks/settings/email-hooks";
// import { parsePhoneNumberFromString } from "libphonenumber-js";
// import { Country, State } from "country-state-city";

// const CustomerForm = ({ initialData, open, onClose }) => {
//   const [files, setFiles] = useState([]);
//   const customerId = initialData?._id;

//   const { data: customerData, isLoading: isFetching } = useGetCustomerInfo(customerId);
//   const { data: emailGroups } = useEmailGroups();

//   const groupOptions = Array.isArray(emailGroups?.data)
//     ? emailGroups.data.map((item) => ({ label: item.groupName, value: item._id }))
//     : [];

//   const defaultUserType =
//     groupOptions.find((opt) => opt.label.toLowerCase() === "customer")?.value ?? "";

//   const schema = yup.object().shape({
//     name: yup.string().required("Name is required"),
//     email: yup.string().trim().email("Invalid email format").required("Email is required"),
//     phone_number: yup
//       .string()
//       .trim()
//       .required("Phone number is required")
//       .test("is-valid-phone", "Invalid phone number", (value) => {
//         if (!value) return false;
//         try {
//           const phoneNumber = parsePhoneNumberFromString(value, "IN");
//           return phoneNumber && phoneNumber.isValid();
//         } catch {
//           return false;
//         }
//       }),
//     password: customerId
//       ? yup.string().notRequired()
//       : yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
//   });

//   const defaultValues = {
//     name: "",
//     email: "",
//     phone_number: "",
//     password: "",
//     groupId: defaultUserType,
//     billingattention: "",
//     billingaddress: "",
//     billingcountry: "",
//     billingstate: "",
//     billingcity: "",
//     billingpinCode: "",
//     billingphone: "",
//     billingfaxNumber: "",
//     remarks: "",
//   };

//   const {
//     control,
//     handleSubmit,
//     reset,
//     watch,
//     trigger,
//     getValues,
//     formState: { errors },
//     setValue,
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues,
//   });

//   const { mutate: clientSignup } = useClientSignup();
//   const { mutate: updateCustomer } = useUpdateClientById(customerId);

//   useEffect(() => {
//     if (!open) return;

//     if (customerData) {
//       const allCountries = Country.getAllCountries();
//       const countryObj = allCountries.find(
//         (c) => c.name?.toLowerCase() === (customerData.country || "").toLowerCase()
//       );
//       const countryIso = countryObj?.isoCode || "";

//       let stateIso = "";
//       if (countryIso && customerData.state) {
//         stateIso = (State.getStatesOfCountry(countryIso) || []).find(
//           (s) => s.name?.toLowerCase() === (customerData.state || "").toLowerCase()
//         )?.isoCode || "";
//       }

//       reset({
//         name: `${customerData.first_name || ""} ${customerData.last_name || ""}`.trim(),
//         email: customerData.email || "",
//         phone_number: customerData.phone_number || "",
//         password: "",
//         billingattention: "",
//         billingaddress: customerData.address || "",
//         billingcountry: countryIso || "",
//         billingstate: stateIso || "",
//         billingcity: customerData.city || "",
//         billingpinCode: customerData.pincode || "",
//         billingphone: customerData.phone_number || "",
//         billingfaxNumber: customerData.fax || "",
//         groupId: customerData.groupId || defaultUserType,
//         remarks: customerData.remarks || "",
//       });
//     } else {
//       reset({ ...defaultValues, groupId: defaultUserType });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open, customerData, reset, defaultUserType]);

//   const resetForm = () => {
//     reset({ ...defaultValues, groupId: defaultUserType });
//     setFiles([]);
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   const handleCreateOrUpdate = (data) => {
//     const countryObj = Country.getAllCountries().find((c) => c.isoCode === data.billingcountry);
//     const stateObj = data.billingcountry
//       ? State.getStatesOfCountry(data.billingcountry).find((s) => s.isoCode === data.billingstate)
//       : null;

//     const payload = Object.entries({
//       name: data.name,
//       email: data.email,
//       phone_number: data.phone_number,
//       password: data.password,
//       address: data.billingaddress,
//       country: countryObj?.name || data.billingcountry || "",
//       state: stateObj?.name || data.billingstate || "",
//       city: data.billingcity || "",
//       pincode: data.billingpinCode,
//       userType: data.groupId ?? defaultUserType,
//       remarks: data.remarks,
//     }).reduce((acc, [key, value]) => {
//       if (value !== undefined && value !== null && value !== "") acc[key] = value;
//       return acc;
//     }, {});

//     if (customerId) {
//       updateCustomer({ clientId: customerId, data: payload }, { onSuccess: handleClose });
//     } else {
//       clientSignup(payload, { onSuccess: handleClose });
//     }
//   };

//   const tabs = [
//     { label: "Address", content: <Address control={control} errors={errors} watch={watch} trigger={trigger} getValues={getValues} setValue={setValue} /> },
//     { label: "Other Details", content: <OtherDetails control={control} errors={errors} files={files} setFiles={setFiles} /> },
//     { label: "Remarks", content: <Remarks control={control} /> },
//   ];

//   if (isFetching && !initialData) {
//     return (
//       <Box sx={{ width: "100%", height: "90vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
//         <FlowerLoader size={25} />
//       </Box>
//     );
//   }

//   return (
//     <CommonDrawer
//       open={open}
//       onClose={handleClose}
//       title={initialData || customerData ? "Edit Customer" : "New Customer"}
//       onSubmit={handleSubmit(handleCreateOrUpdate)}
//       anchor="right"
//       width={600}
//       actions={[
//         { label: "Cancel", variant: "outlined", onClick: handleClose },
//         { label: initialData || customerData ? "Update" : "Save", onClick: handleSubmit(handleCreateOrUpdate) },
//       ]}
//     >
//       <form style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
//         <Box>
//           <div style={{ marginTop: "10px" }} />
//           <BasicFields control={control} errors={errors} isEdit={!!customerId} groupOptions={groupOptions} />
//           <CommonTab tabs={tabs} height="auto" overFlow="hidden" />
//         </Box>
//       </form>
//     </CommonDrawer>
//   );
// };

// export default CustomerForm;



import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import BasicFields from "./BasicFields";
import { Box } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useClientSignup,
  useUpdateClientById,
  useGetCustomerInfo,
} from "../../hooks/Customer/Customer-hooks";
import FlowerLoader from "../common/NDE-loader";
import { useEmailGroups } from "../../hooks/settings/email-hooks";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Country } from "country-state-city";
import CommonButton from "../common/NDE-Button";

const CustomerForm = ({ initialData, open, onClose, onSuccess }) => {
  const customerId = initialData?._id;

  const { data: customerData, isLoading: isFetching } = useGetCustomerInfo(customerId);
  const { data: emailGroups } = useEmailGroups();

  const groupOptions = Array.isArray(emailGroups?.data)
    ? emailGroups.data.map((item) => ({ label: item.groupName, value: item._id }))
    : [];

  const defaultUserType =
    groupOptions.find((opt) => opt.label.toLowerCase() === "customer")?.value ?? "";

  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().trim().email("Invalid email format").required("Email is required"),
    phone_number: yup
      .string()
      .transform((val) => (typeof val === "object" ? val.number : val))
      .trim()
      .required("Phone number is required")
      .test("is-valid-phone", "Invalid phone number", (value) => {
        if (!value) return false;
        try {
          const phoneNumber = parsePhoneNumberFromString(value, "IN");
          return phoneNumber && phoneNumber.isValid();
        } catch {
          return false;
        }
      }),
    password: customerId
      ? yup.string().notRequired()
      : yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const defaultValues = {
    name: "",
    email: "",
    phone_number: { code: "+91", number: "" },
    password: "",
    groupId: defaultUserType,
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { mutate: clientSignup } = useClientSignup();
  const { mutate: updateCustomer } = useUpdateClientById(customerId);

  useEffect(() => {
    if (!customerId && open) {
      reset({ ...defaultValues, groupId: defaultUserType });
    }
  }, [customerId, open, reset, defaultUserType]);

  useEffect(() => {
    if (!customerId || !customerData) return;

    reset({
      name: `${customerData.first_name || ""} ${customerData.last_name || ""}`.trim(),
      email: customerData.email || "",
      phone_number: customerData.phone_number || "",
      password: "",

    });
  }, [customerData, customerId, reset, defaultUserType]);

  const resetForm = () => {
    reset({ ...defaultValues, groupId: defaultUserType });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };


  const handleCreateOrUpdate = (data) => {
    const countryObj = Country.getAllCountries().find((c) => c.isoCode);
    // console.log(countryObj, 'countryObj');
    // console.log(data.phone_number);
    // console.log("Phone number only:", data.phone_number.number);
    // console.log("Full phone number:", `${data.phone_number.code}${data.phone_number.number}`);



    const payload = Object.entries({
      name: data.name,
      email: data.email,
      phone_number: data.phone_number,
      country_code: data.phone_number.code,
      password: data.password,
      userType:defaultUserType,
      address: data.billingaddress,
      // country_code: countryObj?.name,
    }).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") acc[key] = value;
      return acc;
    }, {});

    if (customerId) {
      updateCustomer({ clientId: customerId, data: payload }, { onSuccess: handleClose });
    } else {
      clientSignup(payload, {
        onSuccess: (response) => {
          if (onSuccess) onSuccess(response);
        },
      });
    }
  };



  if (isFetching && !initialData) {
    return (
      <Box sx={{ width: "100%", height: "90vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <FlowerLoader size={25} />
      </Box>
    );
  }

  return (
    <Box sx={{ overflow: "auto", maxHeight: "calc(100vh - 110px)", p: 1, mt: 2 }}>
      <form style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
        <Box>
          <div style={{ marginTop: "10px" }} />
          <BasicFields control={control} errors={errors} isEdit={!!customerId} groupOptions={groupOptions} />
          {/* <CommonTab tabs={tabs} height="auto" overFlow="hidden" /> */}
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
          p: 1,
          mt: 12,
        }}
      >
        <CommonButton
          label="Cancel"
          variant="outlined"
          onClick={handleClose}
          startIcon={false}
          sx={{ width: 100 }}
        />
        <CommonButton
          label={customerId ? "Update" : "Create"}
          onClick={handleSubmit(handleCreateOrUpdate)}
          startIcon={false}
          sx={{ width: 100 }}
          disabled={!isDirty}
        />
      </Box>
    </Box>
  );
};

export default CustomerForm;
