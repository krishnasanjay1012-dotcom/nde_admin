import { useEffect } from "react";
import { Box } from "@mui/material";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonDialog from "../../../components/common/NDE-Dialog";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useResellers } from "../../../hooks/settings/resellers-hooks";
import { CommonDescriptionField, CommonSelect } from "../../common/fields";

const schema = Yup.object().shape({
    tld: Yup.string()
        .matches(/^\./, "Must start with a dot (.)")
        .min(2, "Minimum 3 characters including the dot")
        .max(11, "Maximum 10 characters including the dot")
        .required("Please enter TLD"),
    config: Yup.string().required("Configuration is required"),
    description: Yup.string().required("Description is required"),
});

const DomainTld = ({ open, setOpen, initialData, onSubmitAction }) => {
    const { data: resellersData } = useResellers();
    const domainData = resellersData?.data || [];

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors, isDirty },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            tld: "",
            config: "",
            description: "",
        },
    });

    // Prefill form (Edit Mode)
    useEffect(() => {
        if (initialData) {
            reset({
                tld: initialData.tld || "",
                config: initialData.config || "",
                description: initialData.description || "",
            });
        } else {
            reset({
                tld: "",
                config: "",
                description: "",
            });
        }
    }, [initialData, reset]);

    const handleClose = () => {
        setOpen(false);
        reset();
    };

    const onSubmit = (data) => {
        const payload = {
            tld: data.tld,
            config: data.config,
            description: data.description,
        };

        onSubmitAction(payload);
        // handleClose();
    };

    return (
        <Box>
            <CommonDialog
                open={open}
                onClose={handleClose}
                title={initialData ? "Edit Domain TLD" : "Create Domain TLD"}
                onSubmit={handleSubmit(onSubmit)}
                submitLabel={initialData ? "Update" : "Submit"}
                cancelLabel="Cancel"
                submitDisabled={!isDirty}
            >
                <Box>
                    {/* TLD */}
                    <Controller
                        name="tld"
                        control={control}
                        render={({ field }) => (
                            <CommonTextField
                                {...field}
                                label="TLD"
                                placeholder=".com"
                                error={!!errors.tld}
                                helperText={errors.tld?.message}
                                mandatory
                                sx={{ mb: 2 }}
                            />
                        )}
                    />

                    {/* Configuration Select */}
                    <Controller
                        name="config"
                        control={control}
                        render={({ field }) => (
                            <CommonSelect
                                {...field}
                                label="Configuration"
                                options={domainData.map((item) => ({
                                    label: item.domainName || item.aliasName,
                                    value: item._id,
                                }))}
                                fullWidth
                                mandatory
                                error={!!errors.config}
                                helperText={errors.config?.message}
                                sx={{ mb: 2 }}
                            />
                        )}
                    />

                    {/* Description */}
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <CommonDescriptionField
                                {...field}
                                label="Description"
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                mandatory
                                mb={0}
                            />
                        )}
                    />
                </Box>
            </CommonDialog>
        </Box>
    );
};

export default DomainTld;
