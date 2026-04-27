import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import dayjs from "dayjs";
import { yupResolver } from "@hookform/resolvers/yup";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  CommonDatePicker,
  CommonSelect,
} from "../../../components/common/fields";
import CommonDialog from "../../../components/common/NDE-Dialog";
import CommonButton from "../../../components/common/NDE-Button";
import {
  useDisableInvoiceLink,
  useInvoiceShare,
} from "../../../hooks/sales/invoice-hooks";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import CommonDrawer from "../../../components/common/NDE-Drawer";

const schema = yup.object().shape({
  visibility: yup.string().required("Visibility is required"),
  expiryDate: yup
    .date()
    .required("Expiration date is required")
    .min(new Date(), "Date cannot be in the past"),
});

export default function ShareInvoice({ open, onClose, worksapceid }) {
  const queryClient = useQueryClient()
  const { invoiceId } = useParams();
  const { mutate, data, isPending, reset } = useInvoiceShare();
  const { mutate: mutateDisableLink, isPending: isDisableLinkPending } =
    useDisableInvoiceLink();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      visibility: "Public",
      expiryDate: dayjs().add(30, "day").format("YYYY-MM-DD"),
    },
  });
  const token = data?.data?.token;
  const link = "https://mailadmin.nowdigitaleasy.com/share/invoice/" + token;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    toast.success("copied");
    onClose();
    reset();
  };

  const onSubmit = (data) => {
    const payload = {
      id: invoiceId,
      linkType: data.visibility.toLowerCase(),
      expireDate: dayjs(data.expiryDate).endOf("day").toISOString(),
    };

    mutate(payload);
  };

  const handleDisableLink = () => {
    mutateDisableLink(
      { invoiceId, workspaceId: worksapceid },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["invoice-share", invoiceId]);
          onClose();
          reset()
        },
      }
    );
  };

  return (
    <CommonDrawer
      open={open}
      onClose={onClose}
      title="Share Invoice Link"
      buttonWidth={"auto"}
      anchor="top"
      actions={[
        {
          label: token ? "Copy Link" : "Generate Link",
          onClick: token ? handleCopy : handleSubmit(onSubmit),
          disabled: isPending,
        },
        !token && {
          label: "Disable All Active Links",
          onClick: handleDisableLink,
          disabled: isDisableLinkPending,
          variant: "outlined",
          sx: {
            borderRadius: "6px",
            borderColor: "grey.4",
            color: "text.primary",
            backgroundColor: "grey.5",
          },
        },
      ].filter(Boolean)}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Typography color="error" mt={-2}>Visibility:</Typography>

        <Controller
          name="visibility"
          control={control}
          render={({ field }) => (
            <CommonSelect
              {...field}
              options={[
                { label: "Public", value: "Public" },
                { label: "Private", value: "Private" },
              ]}
              width="150px"
              height="34px"
              mt={0}
              disabled
            />
          )}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" my={1}>
        Select an expiration date and generate the link to share it with your
        customer. Remember that anyone who has access to this link can view,
        print or download it.
      </Typography>

      <Box>
        <Typography color="error">
          Link Expiration Date <span style={{ color: "red" }}>*</span>
        </Typography>

        <Controller
          name="expiryDate"
          control={control}
          render={({ field }) => (
            <CommonDatePicker
              {...field}
              type="date"
              fullWidth
              inputProps={{
                min: dayjs().format("YYYY-MM-DD"),
              }}
              error={!!errors.expiryDate}
              helperText={errors.expiryDate?.message}
            />
          )}
        />

        <Box display="flex" alignItems="center" gap={1} mt={1}>
          <InfoOutlinedIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            By default, the link is set to expire 30 days from today.
          </Typography>
        </Box>
      </Box>
      {token && (
        <>
          <Box
            component="a"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            p={2}
            sx={{
              textDecoration: "none",
              wordBreak: "break-word",
              color: "text.primary",
              display: "block",
              bgcolor: "blue.50",
            }}
            borderRadius={1}
            my={1}
          >
            {link}
          </Box>
        </>
      )}
    </CommonDrawer>
  );
}
