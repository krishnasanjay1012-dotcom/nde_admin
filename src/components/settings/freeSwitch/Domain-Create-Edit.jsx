import { useEffect, useMemo, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonSelect from "../../../components/common/fields/NDE-Select";
import CommonToggleSwitch from "../../../components/common/NDE-CommonToggleSwitch";
import CommonDescriptionField from "../../../components/common/fields/NDE-DescriptionField";
import CommonDrawer from "../../../components/common/NDE-Drawer";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCustomerList } from "../../../hooks/Customer/Customer-hooks";
import { useFreeSwitchData } from "../../../hooks/freeSwitch/freeSwitch-hooks";
import WorkSpaceDropdownList from "../../common/NDE-WorkspaceList";
import { useCheckFreeSwitchDomain } from "../../../hooks/freeSwitch/domain-hooks";


const schema = yup.object().shape({
  // freeswitch_server_id: yup.string().required("Free Switch is required"),
  domain: yup
    .string()
    .required("Domain Name is required")
    .matches(
      /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i,
      "Please enter a valid domain name (e.g., example.com)"
    ),
  enable: yup.boolean(),
  description: yup.string(),
  workspace_id: yup.string().required("Work Space is required"),
});

const defaultValues = {
  // freeswitch_server_id: "",
  domain: "",
  enable: false,
  description: "",
  workspace_id: "",
};

const DomainDetails = ({ open, setOpen, initialData = null, onSubmitAction }) => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const [domainStatus, setDomainStatus] = useState({ message: "", type: "" });

  const { mutateAsync: checkFreeSwitchDomain, isLoading: checkFreeSwitchDomainLoading } = useCheckFreeSwitchDomain();

  // const { data: freeSwitchData, isLoading: freeSwitchLoading, isFetching: freeSwitchFetching } = useFreeSwitchData();

  // const freeSwitchList = freeSwitchData?.data || [];

  // const freeSwitchOptions = useMemo(
  //   () =>
  //     freeSwitchList?.map((c) => ({
  //       label: c.host || c?.port,
  //       value: c._id,
  //     })),
  //   [freeSwitchList]
  // );
  // console.log(freeSwitchData, "freeSwitchData");


  useEffect(() => {
    if (initialData) {
      reset({
        // freeswitch_server_id: initialData.freeswitch_server_id?._id || initialData.freeswitch_server_id || "",
        domain: initialData.domain || "",
        enable: initialData.enable || false,
        description: initialData.description || "",
        workspace_id: initialData.workspace_id?._id || initialData.workspace_id || "",
      });
      setDomainStatus({ message: "", type: "" });
    } else {
      reset(defaultValues);
      setDomainStatus({ message: "", type: "" });
    }
  }, [initialData, open, reset]);

  const handleClose = () => {
    reset(defaultValues);
    setOpen(false);
  };

  const onSubmit = (data) => {
    onSubmitAction(data);
  };

  const handleCheckDomain = async (domainValue) => {
    if (/\.[a-zA-Z]{2,}$/.test(domainValue)) {
      setDomainStatus({ message: "Checking availability...", type: "loading" });
      try {
        const res = await checkFreeSwitchDomain(domainValue);
        if (res?.success) {
          setDomainStatus({ message: "✔ Domain valid", type: "success" });
        } else {
          setDomainStatus({ message: res?.message || "Domain already exists", type: "error" });
        }
      } catch (error) {
        setDomainStatus({ message: error?.response?.data?.message || "Error checking domain", type: "error" });
      }
    } else {
      setDomainStatus({ message: "", type: "" });
    }
  };

  const handleDomainChange = (e, field) => {
    const value = e.target.value;
    field.onChange(value);
    handleCheckDomain(value);
  };

  return (
    <Box>
      <CommonDrawer
        open={open}
        onClose={handleClose}
        title={initialData ? "Edit Domain" : "Create New Domain"}
        width={450}
        actions={[
          {
            label: "Cancel",
            onClick: handleClose,
            variant: "outlined",
            color: "primary",
          },
          {
            label: initialData ? "Update" : "Submit",
            onClick: handleSubmit(onSubmit),
            variant: "contained",
            color: "primary",
            disabled: !isDirty,
          },
        ]}
      >

        <WorkSpaceDropdownList
          control={control}
          errors={errors}
          workspaceId={initialData?.workspace_id?._id}
          setValue={setValue}
          name="workspace_id"

        />

        {/* <Controller
          name="freeswitch_server_id"
          control={control}
          render={({ field }) => (
            <CommonSelect
              {...field}
              label="Free Switch"
              options={freeSwitchOptions}
              error={!!errors.freeswitch_server_id}
              helperText={errors.freeswitch_server_id?.message}
              mandatory
              sx={{ mb: 2 }}
            />
          )}
        /> */}


        <Controller
          name="domain"
          control={control}
          render={({ field }) => (
            <Box>
              <CommonTextField
                {...field}
                label="Domain Name"
                placeholder="Enter the name of the domain"
                error={!!errors.domain}
                helperText={errors.domain?.message}
                mandatory
                onChange={(e) => handleDomainChange(e, field)}
                sx={{ mb: 1 }}
                endAdornment={
                  domainStatus.type === "loading" && (
                    <CircularProgress size={20} color="inherit" />
                  )
                }
              />
              {domainStatus.message && (
                <Typography
                  variant="caption"
                  sx={{
                    color: domainStatus.type === "success" ? "green" : domainStatus.type === "error" ? "red" : "text.secondary",
                    display: "block",
                    mb: 2,
                    ml: 1,
                    fontWeight: 500
                  }}
                >
                  {domainStatus.message}
                </Typography>
              )}
            </Box>
          )}
        />

        <Box sx={{ mb: 2, mt: 1, display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body1">
            Enable
          </Typography>
          <Controller
            name="enable"
            control={control}
            render={({ field }) => (
              <CommonToggleSwitch
                checked={field.value || false}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        </Box>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <CommonDescriptionField
              {...field}
              label="Description"
              placeholder="Enter the description"
              error={!!errors.description}
              helperText={errors.description?.message}
              sx={{ mb: 2 }}
            />
          )}
        />
      </CommonDrawer>
    </Box>
  );
};

export default DomainDetails;
