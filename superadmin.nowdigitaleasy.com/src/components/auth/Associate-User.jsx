import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import CommonDialog from "../common/NDE-Dialog";
import { CommonSelect } from "../common/fields";
import { useAdminList } from "../../hooks/auth/login";
import { useMoveCustomersToAdmin } from "../../hooks/Customer/Customer-hooks";

const MoveCustomer = ({
  selectedIds = [],
  openMoveDialog,
  setOpenMoveDialog,
  adminId,
}) => {
  const moveCustomersMutation = useMoveCustomersToAdmin();
  const { data: admins } = useAdminList();
  const adminsList = admins?.data || [];

  const adminsOptions = useMemo(
    () =>
      adminsList.map((a) => ({
        label: a.username,
        value: a._id,
      })),
    [adminsList]
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    defaultValues: {
      adminId: adminId || "",
    },
  });

  const handleClose = () => {
    reset();
    setOpenMoveDialog(false);
  };

  const onSubmit = (data) => {
    if (!selectedIds.length) return;

    moveCustomersMutation.mutate(
      {
        adminId: data.adminId,
        users: Array.isArray(selectedIds) ? selectedIds : [selectedIds],
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  useEffect(() => {
    reset({ adminId: adminId || "" });
  }, [adminId, reset]);

  return (
    <CommonDialog
      open={openMoveDialog}
      onClose={handleClose}
      title="Move Customer"
      submitLabel="Move"
      onSubmit={handleSubmit(onSubmit)}
      submitDisabled={
        !selectedIds.length || moveCustomersMutation.isLoading || !isDirty
      }
      width={400}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="adminId"
          control={control}
          rules={{ required: "Admin is required" }}
          render={({ field }) => (
            <CommonSelect
              label="Associate to User"
              mandatory
              value={field.value}
              onChange={field.onChange}
              options={adminsOptions}
              error={!!errors.adminId}
              helperText={errors.adminId?.message}
              mb={0}
            />
          )}
        />
      </form>
    </CommonDialog>
  );
};

export default MoveCustomer;
