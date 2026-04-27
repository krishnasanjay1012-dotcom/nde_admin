import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Box } from "@mui/material";
import CommonDialog from "../../../components/common/NDE-Dialog";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonSelect from "../../../components/common/fields/NDE-Select";
import { toast } from "react-toastify";
import { createDomain, getAllProductGroups } from "../../../services/domain/domain-service";

const validationSchema = Yup.object().shape({
  tld: Yup.string()
    .matches(/^\./, "Must start with a dot (.)")
    .min(2, "Minimum 3 characters including the dot")
    .max(11, "Maximum 10 characters including the dot")
    .required("Please enter TLD"),
  hsn: Yup.string().required("Please enter HSN Code"),
});


const CreateDomain = ({ open, onClose, getDomains, initialData }) => {
  const [groupList, setGroupList] = useState([]);
  const [groupId, setGroupId] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      tld: initialData?.tld || "",
      hsn: initialData?.hsn || "",
    },
  });

  const onSubmit = async (data) => {
    const params = {
      tld: data.tld,
      HsnCode: data.hsn,
      groupId: groupId,
    };

    await createDomain(params)
      .then(() => {
        getDomains?.();
        reset();
        handleClose();
      })
  };


  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getAllProductGroups();
        const groups = response.data || [];
        setGroupList(groups);

        const domainGroup = groups.find((g) => g.name.toLowerCase() === "domain");
        if (domainGroup) setGroupId(domainGroup._id);
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || "Failed to fetch product groups";
        toast.error(msg);
      }
    };

    fetchGroups();
  }, []);

  return (
    <>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title={initialData ? "Update Domain Pricing" : "Create Domain Pricing"}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={initialData ? "Update" : "Submit"}
        cancelLabel="Cancel"
        submitDisabled={!isDirty}
      >
        <Box>
          <CommonSelect
            label="Group"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            options={groupList.map((option) => ({
              label: option.name,
              value: option._id,
            }))}
            disabled
            mandatory
          />

          <Controller
            name="tld"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                size="small"
                label="TLD"
                error={!!errors.tld}
                helperText={errors.tld?.message}
                fullWidth
                mandatory
              />
            )}
          />

          <Controller
            name="hsn"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                size="small"
                label="HSN Code"
                error={!!errors.hsn}
                helperText={errors.hsn?.message}
                fullWidth
                mandatory
              />
            )}
          />
        </Box>
      </CommonDialog>
    </>
  );
};

export default CreateDomain;
