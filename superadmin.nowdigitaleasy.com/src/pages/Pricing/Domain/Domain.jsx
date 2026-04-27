import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import DiscountIcon from "@mui/icons-material/Discount";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";

import CommonButton from "../../../components/common/NDE-Button";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import CreateDomain from "../../../components/Pricing/Domain/Create Domain";
import DominPricing from "../../../components/Pricing/Domain/DominPricing";
import UpdateDiscount from "../../../components/Pricing/Domain/UpdatingPrice";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import { CommonCheckbox } from "../../../components/common/fields";

import Delete from "../../../assets/icons/delete.svg";

import {
  getAllDomain,
  deleteDomain as deleteDomainApi,
  updateDomainDetails,
} from "../../../services/domain/domain-service";

const DomainPricing = () => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [productId, setProductId] = useState("");
  const [selectedTld, setSelectedTld] = useState("");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openPricing, setOpenPricing] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [openDiscount, setOpenDiscount] = useState(false);
  const [updateProps, setUpdateProps] = useState(null);
  const [pricingLoadingId, setPricingLoadingId] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: { domains: [] },
  });

  const { fields } = useFieldArray({
    control,
    name: "domains",
  });

  const getDomains = useCallback(async () => {
    try {
      setLoadingData(true);
      const res = await getAllDomain();
      reset({ domains: res });
    } finally {
      setLoadingData(false);
    }
  }, [reset]);

  useEffect(() => {
    getDomains();
  }, [getDomains]);

  const handleDeleteClick = (id, tld) => {
    setProductId(id);
    setSelectedTld(tld);
    setOpenDialog(true);
  };

  const deleteDomain = async () => {
    try {
      setLoading(true);
      await deleteDomainApi({ id: productId });
      setOpenDialog(false);
      getDomains();
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPricing = (domain) => {
    setPricingLoadingId(domain._id);
    setSelectedDomain(domain);
    setOpenPricing(true);
    setTimeout(() => setPricingLoadingId(null), 150);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = data.domains.map((item) => ({
        productId: item._id,
        tId: item.tld,
        dnsManagement: item.dnsManagement,
        emailForwarding: item.emailForwarding,
        idProtection: item.idProtection,
        eppCode: item.eppCode,
        Description: item.Description,
        Discount: item.Discount,
        domainPrice: item.domainPrice || {},
      }));

      await updateDomainDetails({ details: payload });
      getDomains();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

const updateSingleDomain = async (updatedDomain) => {
  try {
    setLoading(true);

    const payload = [
      {
        productId: updatedDomain._id,
        tId: updatedDomain.tld,
        dnsManagement: updatedDomain.dnsManagement,
        emailForwarding: updatedDomain.emailForwarding,
        idProtection: updatedDomain.idProtection,
        eppCode: updatedDomain.eppCode,
        Description: updatedDomain.Description,
        Discount: updatedDomain.Discount,
        domainPrice: updatedDomain.domainPrice || {},
      },
    ];

    await updateDomainDetails({ details: payload });
    getDomains(); 
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  } finally {
    setLoading(false);
  }
};



  const checkboxCell = (name) => ({ row }) => (
    <Controller
      name={`domains.${row.index}.${name}`}
      control={control}
      render={({ field }) => (
        <CommonCheckbox
          size="small"
          checked={!!field.value}
          onChange={(e) => field.onChange(e.target.checked)}
        />
      )}
    />
  );

  const columns = useMemo(
    () => [
      {
        header: "TLD",
        cell: ({ row }) => (
          <Controller
            name={`domains.${row.index}.tld`}
            control={control}
            render={({ field }) => (
              <TextField {...field} size="small" fullWidth />
            )}
          />
        ),
      },
      {
        header: "Pricing",
        cell: ({ row }) => (
          <LoadingButton
            loading={pricingLoadingId === fields[row.index]._id}
            size="small"
            variant="outlined"
            onClick={() => handleOpenPricing(fields[row.index])}
          >
            Pricing
          </LoadingButton>
        ),
      },
      { header: "DNS Mgmt", cell: checkboxCell("dnsManagement") },
      { header: "Email Forwarding", cell: checkboxCell("emailForwarding") },
      { header: "ID Protection", cell: checkboxCell("idProtection") },
      { header: "EPP Code", cell: checkboxCell("eppCode") },
      {
        header: "Discount",
        cell: ({ row }) => (
          <IconButton
            onClick={() => {
              setUpdateProps({
                ...fields[row.index],
                index: row.index,
              });
              setOpenDiscount(true);
            }}
          >
            <DiscountIcon fontSize="small" />
          </IconButton>
        ),
      },
      {
        header: "Action",
        cell: ({ row }) => (
          <IconButton
            onClick={() =>
              handleDeleteClick(fields[row.index]._id, fields[row.index].tld)
            }
          >
            <img src={Delete} alt="delete" height={20} />
          </IconButton>
        ),
      },
    ],
    [control, fields, pricingLoadingId]
  );

  return (
    <Box width="100%">
      <Stack direction="row" justifyContent="space-between" p={1}>
        <Typography variant="h4" mt={1}>Domain</Typography>
        <CommonButton label="Create TLD" onClick={() => setOpenCreateDialog(true)} />
      </Stack>

      <ReusableTable columns={columns} data={fields} isLoading={loadingData}   maxHeight = "calc(100vh - 184px)"/>

      <Stack direction="row" spacing={2} justifyContent="center" mt={1}>
        <CommonButton variant="outlined" disabled={!isDirty} onClick={() => reset()} label="Cancel" startIcon={false} sx={{height:40}}/>
          
        <CommonButton
          loading={loading}
          disabled={!isDirty}
          onClick={handleSubmit(onSubmit)}
          label="Submit"
          startIcon={false}
          sx={{height:40}}
        />
      </Stack>

      <CommonDeleteModal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirmDelete={deleteDomain}
        deleting={loading}
        itemType={`Domain ${selectedTld}`}
        title="Domain"
      />

      <CreateDomain
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        getDomains={getDomains}
      />

      <DominPricing
        open={openPricing}
        onClose={() => setOpenPricing(false)}
        selectedDomain={selectedDomain}
        getDomains={getDomains}
      />

      <UpdateDiscount
        open={openDiscount}
        onClose={() => setOpenDiscount(false)}
        domainData={fields}
        updateProps={updateProps}
        setUpdateProps={setUpdateProps}
        updateDomaine={updateSingleDomain}
      />
    </Box>
  );
};

export default DomainPricing;
