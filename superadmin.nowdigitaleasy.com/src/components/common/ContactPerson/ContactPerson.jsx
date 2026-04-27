import { useState, useRef } from "react";
import { Box, Typography, IconButton, Checkbox } from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { CommonSelect, CommonTextField } from "../fields";
import PhoneNumberField from "../fields/NDE-MobileNumberCode";
import {
  parsePhoneNumberFromString,
  getCountryCallingCode,
} from "libphonenumber-js";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { toast } from "react-toastify";
import { useCreateContactPerson } from "../../../hooks/sales/invoice-hooks";
import { useQueryClient } from "@tanstack/react-query";
import CommonDialog from "../NDE-Dialog";

const salutationOptions = [
  { label: "Mr.", value: "Mr" },
  { label: "Ms.", value: "Ms" },
  { label: "Mrs.", value: "Mrs" },
  { label: "Miss", value: "Miss" },
  { label: "Dr.", value: "Dr" },
];

const FormRow = ({ label, children }) => (
  <Box display="flex" alignItems="center" py={1} px={2}>
    <Box width="20%">
      <Typography>{label}</Typography>
    </Box>
    <Box width="80%" display={"flex"} gap={1}>
      {children}
    </Box>
  </Box>
);

const schema = yup.object({
  name_details: yup.object({
    salutation: yup.string().nullable(),
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().nullable(),
  }),

  email: yup.string().email("Invalid email").required("Email is required"),

  phone: yup.object({
    work_phone: yup.object({
      code: yup.string().required(),
      number: yup
        .string()
        .required("Phone number is required")
        .test("is-valid-work-phone", "Invalid phone number", (value) => {
          try {
            const phone = parsePhoneNumberFromString(`+91${value}`);
            return phone?.isValid();
          } catch {
            return false;
          }
        }),
    }),

    mobile: yup
      .object({
        code: yup.string().notRequired(),
        number: yup
          .string()
          .notRequired()
          .test("is-valid-mobile-phone", "Invalid mobile number", (value) => {
            if (!value) return true;
            try {
              const phone = parsePhoneNumberFromString(`+91${value}`);
              return phone?.isValid();
            } catch {
              return false;
            }
          }),
      })
      .notRequired(),
  }),

  other_details: yup.object({
    designation: yup.string().nullable(),
    department: yup.string().nullable(),
  }),

  enable_portal: yup.boolean(),
});

export default function ContactPersonModal({ open, onClose, userId }) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      user_id: userId,
      name_details: {
        salutation: "",
        first_name: "",
        last_name: "",
      },

      email: "",

      phone: {
        work_phone: {
          code: "IN",
          number: "",
        },
        mobile: {
          code: "IN",
          number: "",
        },
      },

      other_details: {
        designation: "",
        department: "",
      },

      enable_portal: false,
    },
  });

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useCreateContactPerson();

  const onSubmit = (data) => {
    const payload = { ...data };
console.log("shjasaasasa",payload)
    if (payload?.phone?.work_phone?.number) {
      try {
        const phone = parsePhoneNumberFromString(
          payload.phone.work_phone.number,
          "IN",
        );

        const country = phone?.country || "IN";

        payload.phone.work_phone.code = "+" + getCountryCallingCode(country)
      } catch {
        payload.phone.work_phone.code ="+" + getCountryCallingCode("IN");
      }
    }

    if (payload?.phone?.mobile) {
      if (!payload.phone.mobile.number) {
        delete payload.phone.mobile;
      } else {
        try {
          const phone = parsePhoneNumberFromString(
            payload.phone.mobile.number,
            "IN",
          );

          const country = phone?.country || "IN";

          payload.phone.mobile.code = "+" + getCountryCallingCode(country);
        } catch {
          payload.phone.mobile.code ="+" + getCountryCallingCode("IN")
        }
      }
    }

    mutateAsync(payload, {
      onSuccess: () => {
        toast.success("Contact Person Added Successfully");
        queryClient.invalidateQueries({ queryKey: ["contactperson"] });
        reset();
        onClose();
      },
      onError: (err) => {
        toast.error(
          err?.response?.data?.message || "Failed to create contact person.",
        );
      },
    });
  };

  const fileRef = useRef(null);
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setImage(preview);
  };

  const handleDelete = () => {
    setImage(null);
  };
  return (
    <CommonDialog
      open={open}
      onClose={onClose}
      title="Add Contact Person"
      onSubmit={handleSubmit(onSubmit)}
      submitLabel="Save"
      loading={isPending}
      width={"70vw"}
      maxWidth={false}
    >
      <Box display={"flex"}>
        <Box p={1} width={"70%"}>
          <FormRow label={"Name"}>
            <Controller
              name="name_details.salutation"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  {...field}
                  placeholder={"Salution"}
                  options={salutationOptions}
                  mandatory
                  error={!!errors?.name_details?.salutation}
                  helperText={errors?.name_details?.salutation?.message}
                />
              )}
            />
            <Controller
              name="name_details.first_name"
              control={control}
              render={({ field }) => (
                <CommonTextField
                  {...field}
                  placeholder="First Name"
                  width="100%"
                  error={!!errors?.name_details?.first_name}
                  helperText={errors?.name_details?.first_name?.message}
                />
              )}
            />
            <Controller
              name="name_details.last_name"
              control={control}
              render={({ field }) => (
                <CommonTextField
                  {...field}
                  placeholder="Last Name"
                  width="100%"
                  error={!!errors?.name_details?.last_name}
                  helperText={errors?.name_details?.last_name?.message}
                />
              )}
            />
          </FormRow>
          <FormRow label={"Email Address"}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <CommonTextField
                  {...field}
                  width="100%"
                  error={!!errors?.email}
                  helperText={errors?.email?.message}
                />
              )}
            />
          </FormRow>
          <FormRow label={"Work Phone"}>
            <Controller
              name="phone.work_phone"
              control={control}
              render={({ field }) => (
                <PhoneNumberField
                  placeholder="Work Phone"
                  {...field}
                  error={!!errors?.phone?.work_phone}
                  helperText={errors?.phone?.work_phone?.number?.message}
                />
              )}
            />
          </FormRow>
          <FormRow label={"Mobile"}>
            <Controller
              name="phone.mobile"
              control={control}
              render={({ field }) => (
                <PhoneNumberField
                  placeholder="Mobile"
                  {...field}
                  error={!!errors?.phone?.mobile}
                  helperText={errors?.phone?.mobile?.number?.message}
                />
              )}
            />
          </FormRow>
          <FormRow label={"Other Details"}>
            <Controller
              name="other_details.designation"
              control={control}
              render={({ field }) => (
                <CommonTextField
                  {...field}
                  placeholder="Designation"
                  width="100%"
                  error={!!errors?.other_details?.designation}
                  helperText={errors?.other_details?.designation?.message}
                />
              )}
            />
            <Controller
              name="other_details.department"
              control={control}
              render={({ field }) => (
                <CommonTextField
                  {...field}
                  placeholder="Department"
                  width="100%"
                  error={!!errors?.other_details?.department}
                  helperText={errors?.other_details?.department?.message}
                />
              )}
            />
          </FormRow>
        </Box>

        <Box width={"30%"} display={"flex"} justifyContent={"center"} mt={3}>
          <Box
            sx={{
              width: 200,
              height: 200,
              borderRadius: 2,
              border: image ? "1px solid #e0e0e0" : "1px dashed #90caf9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              bgcolor: "#fafafa",
            }}
          >
            {image ? (
              <>
                <IconButton
                  size="small"
                  onClick={handleDelete}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "red",
                  }}
                >
                  <DeleteOutlineOutlinedIcon
                    fontSize="small"
                    style={{ color: "red" }}
                  />
                </IconButton>

                <Box
                  component="img"
                  src={image}
                  alt="profile"
                  sx={{
                    width: "90%",
                    height: "90%",
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
              </>
            ) : (
              <Box
                textAlign="center"
                sx={{ cursor: "pointer" }}
                onClick={() => fileRef.current.click()}
              >
                <CloudUploadOutlinedIcon
                  sx={{ fontSize: 36, color: "#1976d2", mb: 1 }}
                />

                <Typography fontWeight={600}>
                  Drag & Drop Profile Image
                </Typography>

                <Typography fontSize={13} color="text.secondary" mt={1}>
                  Supported Files: jpg, jpeg, png, gif, bmp
                </Typography>

                <Typography fontSize={13} color="text.secondary">
                  Maximum File Size: 5MB
                </Typography>

                <Typography
                  mt={2}
                  sx={{
                    textDecoration: "underline",
                    fontWeight: 500,
                  }}
                >
                  Upload File
                </Typography>

                <input
                  type="file"
                  hidden
                  ref={fileRef}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Box py={2} px={2}>
        <Box display="flex" alignItems="center" gap={0.4}>
          {" "}
          <Controller
            name="enable_portal"
            control={control}
            render={({ field }) => (
              <Checkbox
                {...field}
                checked={field.value}
                size="small"
                sx={{ padding: 0 }}
              />
            )}
          />
          <Typography fontWeight={500}>Enable portal access</Typography>
        </Box>

        <Typography>
          This customer will be able to see all their transactions with your
          organization by logging in to the portal using their email address
        </Typography>
      </Box>
    </CommonDialog>
  );
}
