import { useEffect } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Delete from "../../assets/icons/delete.svg";
import { CommonAutocomplete, CommonTextField } from "../common/fields";
import PhoneNumberField from "../common/fields/NDE-MobileNumberCode";
import CommonButton from "../common/NDE-Button";

const salutationOptions = [
  { label: "Mr.", value: "Mr" },
  { label: "Ms.", value: "Ms" },
  { label: "Mrs.", value: "Mrs" },
  { label: "Miss", value: "Miss" },
  { label: "Dr", value: "Dr" }, // fixed value
];

const defaultRow = {
  name_details: {
    salutation: "",
    first_name: "",
    last_name: "",
  },
  email: "",
  phone: {
    work_phone: {
      code: "+91",
      number: "",
    },
    mobile: {
      code: "+91",
      number: "",
    },
  },
  other_details: {
    designation: "",
    department: "",
  },
  profile_pic: "",
};

const COLUMN_WIDTHS = {
  salutation: 120,
  firstName: 160,
  lastName: 160,
  designation: 180,
  department: 180,
  email: 240,
  workPhone: 300,
  mobile: 300,
  profilePic: 200,
  action: 80,
};

const ContactPersonsForm = ({ control, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "contact_persons",
  });

  const isOnlyOneRow = fields.length === 1;

  useEffect(() => {
    if (fields.length === 0) {
      append(defaultRow);
    }
  }, [fields.length, append]);

  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 480, overflowY: "auto" }}
      >
        <Table size="small" stickyHeader sx={{ tableLayout: "fixed" }}>
          {/* Header */}
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: COLUMN_WIDTHS.salutation }}>
                <Typography fontSize={12} fontWeight={600}>SALUTATION</Typography>
              </TableCell>
              <TableCell sx={{ width: COLUMN_WIDTHS.firstName }}>
                <Typography fontSize={12} fontWeight={600}>FIRST NAME</Typography>
              </TableCell>
              <TableCell sx={{ width: COLUMN_WIDTHS.lastName }}>
                <Typography fontSize={12} fontWeight={600}>LAST NAME</Typography>
              </TableCell>
              <TableCell sx={{ width: COLUMN_WIDTHS.designation }}>
                <Typography fontSize={12} fontWeight={600}>DESIGNATION</Typography>
              </TableCell>
              <TableCell sx={{ width: COLUMN_WIDTHS.department }}>
                <Typography fontSize={12} fontWeight={600}>DEPARTMENT</Typography>
              </TableCell>
              <TableCell sx={{ width: COLUMN_WIDTHS.email }}>
                <Typography fontSize={12} fontWeight={600}>EMAIL ADDRESS</Typography>
              </TableCell>
              <TableCell sx={{ width: COLUMN_WIDTHS.workPhone }}>
                <Typography fontSize={12} fontWeight={600}>WORK PHONE</Typography>
              </TableCell>
              <TableCell sx={{ width: COLUMN_WIDTHS.mobile }}>
                <Typography fontSize={12} fontWeight={600}>MOBILE</Typography>
              </TableCell>
              <TableCell sx={{ width: COLUMN_WIDTHS.profilePic }}>
                <Typography fontSize={12} fontWeight={600}>PROFILE PICTURE</Typography>
              </TableCell>
              <TableCell align="center" sx={{ width: COLUMN_WIDTHS.action }}>
                <Typography fontSize={12} fontWeight={600}>ACTION</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Body */}
          <TableBody>
            {fields.map((item, index) => (
              <TableRow key={item.id}>
                {/* Salutation */}
                <TableCell>
                  <Controller
                    name={`contact_persons.${index}.name_details.salutation`}
                    control={control}
                    render={({ field }) => (
                      <CommonAutocomplete
                        options={salutationOptions}
                        value={salutationOptions.find(opt => opt.value === field.value) || null}
                        onChange={(val) => field.onChange(val?.value || "")}
                        placeholder="Select Salutation"
                        mt={0}
                        mb={0}
                      />
                    )}
                  />
                </TableCell>

                {/* First Name */}
                <TableCell>
                  <Controller
                    name={`contact_persons.${index}.name_details.first_name`}
                    control={control}
                    render={({ field }) => (
                      <CommonTextField
                        {...field}
                        fullWidth
                        error={!!errors?.contact_persons?.[index]?.name_details?.first_name}
                        helperText={errors?.contact_persons?.[index]?.name_details?.first_name?.message}
                        mt={0}
                        mb={0}
                      />
                    )}
                  />
                </TableCell>

                {/* Last Name */}
                <TableCell>
                  <Controller
                    name={`contact_persons.${index}.name_details.last_name`}
                    control={control}
                    render={({ field }) => (
                      <CommonTextField
                        {...field}
                        fullWidth
                        error={!!errors?.contact_persons?.[index]?.name_details?.last_name}
                        helperText={errors?.contact_persons?.[index]?.name_details?.last_name?.message}
                        mt={0}
                        mb={0}
                      />
                    )}
                  />
                </TableCell>

                {/* Designation */}
                <TableCell>
                  <Controller
                    name={`contact_persons.${index}.other_details.designation`}
                    control={control}
                    render={({ field }) => (
                      <CommonTextField
                        {...field}
                        fullWidth
                        error={!!errors?.contact_persons?.[index]?.other_details?.designation}
                        helperText={errors?.contact_persons?.[index]?.other_details?.designation?.message}
                        mt={0}
                        mb={0}
                      />
                    )}
                  />
                </TableCell>

                {/* Department */}
                <TableCell>
                  <Controller
                    name={`contact_persons.${index}.other_details.department`}
                    control={control}
                    render={({ field }) => (
                      <CommonTextField
                        {...field}
                        fullWidth
                        error={!!errors?.contact_persons?.[index]?.other_details?.department}
                        helperText={errors?.contact_persons?.[index]?.other_details?.department?.message}
                        mt={0}
                        mb={0}
                      />
                    )}
                  />
                </TableCell>

                {/* Email */}
                <TableCell>
                  <Controller
                    name={`contact_persons.${index}.email`}
                    control={control}
                    render={({ field }) => (
                      <CommonTextField
                        {...field}
                        type="email"
                        fullWidth
                        error={!!errors?.contact_persons?.[index]?.email}
                        helperText={errors?.contact_persons?.[index]?.email?.message}
                        mt={0}
                        mb={0}
                      />
                    )}
                  />
                </TableCell>

                {/* Work Phone */}
                <TableCell>
                  <Controller
                    name={`contact_persons.${index}.phone.work_phone`}
                    control={control}
                    render={({ field }) => (
                      <PhoneNumberField
                        value={field.value}
                        onChange={field.onChange}
                        error={!!errors?.contact_persons?.[index]?.phone?.work_phone?.number}
                        helperText={errors?.contact_persons?.[index]?.phone?.work_phone?.number?.message}
                        mt={0}
                        mb={0}
                      />
                    )}
                  />
                </TableCell>

                {/* Mobile */}
                <TableCell>
                  <Controller
                    name={`contact_persons.${index}.phone.mobile`}
                    control={control}
                    render={({ field }) => (
                      <PhoneNumberField
                        value={field.value}
                        onChange={field.onChange}
                        error={!!errors?.contact_persons?.[index]?.phone?.mobile?.number}
                        helperText={errors?.contact_persons?.[index]?.phone?.mobile?.number?.message}
                        mt={0}
                        mb={0}
                      />
                    )}
                  />
                </TableCell>

                {/* Profile Picture */}
                <TableCell>
                  <Controller
                    name={`contact_persons.${index}.profile_pic`}
                    control={control}
                    render={({ field }) => (
                      <CommonTextField
                        {...field}
                        placeholder="Image URL"
                        fullWidth
                        error={!!errors?.contact_persons?.[index]?.profile_pic}
                        helperText={errors?.contact_persons?.[index]?.profile_pic?.message}
                        mt={0}
                        mb={0}
                      />
                    )}
                  />
                </TableCell>

                {/* Action */}
                <TableCell align="center">
                  <Tooltip
                    title={isOnlyOneRow ? "At least one contact is required" : "Remove"}
                  >
                    <span>
                      <IconButton
                        size="small"
                        // disabled={isOnlyOneRow}
                        onClick={() => remove(index)}
                        color="error"
                      >
                        <img src={Delete} style={{ height: 20 }} alt="delete" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Button */}
      <CommonButton
        onClick={() => append(defaultRow)}
        label="Add Contact Person"
        variant="outlined"
        startIcon={<AddIcon sx={{ color: "primary.main" }} />}
        sx={{
          textTransform: "none",
          borderStyle: "dashed",
          mt: 1,
          "&:hover": { borderStyle: "dashed", bgcolor: "action.hover" },
        }}
      />
    </Box>
  );
};

export default ContactPersonsForm;