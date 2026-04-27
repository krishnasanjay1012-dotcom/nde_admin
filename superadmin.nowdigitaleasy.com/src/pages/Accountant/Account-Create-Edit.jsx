// import { useEffect, useMemo } from "react";
// import { Box } from "@mui/material";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import {
//   CommonSelect,
//   CommonTextField,
// } from "../../components/common/fields";
// import CommonDialog from "../../components/common/NDE-Dialog";
// import { useCurrencies } from "../../hooks/settings/currency";
// import { useAccountTree, useCreateAccount } from "../../hooks/account/account-hooks";

// const schema = yup.object().shape({
//   accountType: yup.string().required("Account Type is required"),
//   accountName: yup
//     .string()
//     .required("Account Name is required")
//     .min(3, "Account Name must be at least 3 characters")
//     .max(50, "Account Name cannot exceed 50 characters"),
//   accountCode: yup.string().required("Account Code is required"),
//   parentAccountId: yup.string().nullable(),
//   currency: yup.string().required("Currency is required"),
// });

// const AccountantForm = ({ open, setOpen, initialData = null }) => {
//   const { data: currenciesResponse = {} } = useCurrencies();
//   const currencies = currenciesResponse?.data || [];

//   const { data: accountTree = {} } = useAccountTree(); 

//   const createAccount = useCreateAccount();

//   const flattenAccounts = (accounts, group) => {
//     return accounts.flatMap((account) => {
//       const current = {
//         label: account.accountName,
//         value: account._id,          
//         parentAccountId: account.parentAccountId,
//         group,
//       };

//       if (account.children && account.children.length > 0) {
//         return [current, ...flattenAccounts(account.children, group)];
//       }
//       return [current];
//     });
//   };

//   const parentAccountOptions = useMemo(() => {
//     if (!accountTree) return [];
//     return Object.entries(accountTree).flatMap(([group, accounts]) =>
//       Array.isArray(accounts) ? flattenAccounts(accounts, group) : []
//     );
//   }, [accountTree]);

//   const accountTypeOptions = useMemo(() => {
//     if (!accountTree) return [];
//     return Object.keys(accountTree).map((key) => ({
//       label: key,
//       value: key,
//     }));
//   }, [accountTree]);

//   const currencyOptions = useMemo(
//     () =>
//       currencies.map((c) => ({
//         label: c.code,
//         value: c._id,
//         isDefault: c.isdefault,
//       })),
//     [currencies]
//   );

//   const { handleSubmit, control, formState: { errors, isDirty }, reset } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: initialData || {
//       accountType: "",
//       accountName: "",
//       accountCode: "",
//       parentAccountId: null,
//       currency: currencyOptions.find(c => c.isDefault)?.value || "",
//     },
//   });

//   useEffect(() => {
//     reset(
//       initialData || {
//         accountType: "",
//         accountName: "",
//         accountCode: "",
//         parentAccountId: null,
//         currency: currencyOptions.find(c => c.isDefault)?.value || "",
//       }
//     );
//   }, [initialData, open, reset, currencyOptions]);

//   const handleClose = () => {
//     setOpen(false);
//     reset();
//   };

//   const onSubmit = (formData) => {
//     const payload = {
//       accountName: formData.accountName,
//       accountCode: formData.accountCode,
//       accountType: formData.accountType,        
//       parentAccountId: formData.parentAccountId || null,
//       currency: formData.currency,
//     };
//     createAccount.mutate(payload, { onSuccess: handleClose });
//   };

//   return (
//     <Box>
//       <CommonDialog
//         open={open}
//         onClose={handleClose}
//         title={initialData ? "Edit Account" : "Create Account"}
//         onSubmit={handleSubmit(onSubmit)}
//         submitLabel={"Submit"}
//         cancelLabel="Cancel"
//         submitDisabled={!isDirty}
//       >
//         <Box>
//           {/* Account Type (top-level group) */}
//           <Controller
//             name="accountType"
//             control={control}
//             render={({ field }) => (
//               <CommonSelect
//                 label="Account Type"
//                 {...field}
//                 options={accountTypeOptions}
//                 error={!!errors.accountType}
//                 helperText={errors.accountType?.message}
//                 mandatory
//               />
//             )}
//           />

//           {/* Parent Account (optional) */}
//           <Controller
//             name="parentAccountId"
//             control={control}
//             render={({ field }) => (
//               <CommonSelect
//                 label="Parent Account"
//                 {...field}
//                 options={parentAccountOptions}
//                 error={!!errors.parentAccountId}
//                 helperText={errors.parentAccountId?.message}
//                 searchable
//               />
//             )}
//           />

//           {/* Account Name */}
//           <Controller
//             name="accountName"
//             control={control}
//             render={({ field }) => (
//               <CommonTextField
//                 label="Account Name"
//                 {...field}
//                 error={!!errors.accountName}
//                 helperText={errors.accountName?.message}
//                 mandatory
//               />
//             )}
//           />

//           {/* Account Code */}
//           <Controller
//             name="accountCode"
//             control={control}
//             render={({ field }) => (
//               <CommonTextField
//                 label="Account Code"
//                 {...field}
//                 error={!!errors.accountCode}
//                 helperText={errors.accountCode?.message}
//                 mandatory
//               />
//             )}
//           />

//           {/* Currency */}
//           <Controller
//             name="currency"
//             control={control}
//             render={({ field }) => (
//               <CommonSelect
//                 label="Currency"
//                 {...field}
//                 options={currencyOptions}
//                 error={!!errors.currency}
//                 helperText={errors.currency?.message}
//                 mandatory
//               />
//             )}
//           />
//         </Box>
//       </CommonDialog>
//     </Box>
//   );
// };

// export default AccountantForm;



import { useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  CommonDescriptionField,
  CommonSelect,
  CommonTextField,
} from "../../components/common/fields";
import CommonDialog from "../../components/common/NDE-Dialog";
import { useCurrencies } from "../../hooks/settings/currency";
import { useAccountTree, useCreateAccount, useGetAccountById, useUpdateAccount } from "../../hooks/account/account-hooks";

const schema = yup.object().shape({
  accountName: yup
    .string()
    .required("Account Name is required")
    .min(3, "Account Name must be at least 3 characters")
    .max(50, "Account Name cannot exceed 50 characters"),
  accountCode: yup.string().required("Account Code is required"),
  parentAccountId: yup.string().required("Account Type is required"),
  currency: yup.string().required("Currency is required"),
  description: yup.string().max(500, "Description cannot exceed 500 characters"),
});

const AccountantForm = ({ open, setOpen, accountId }) => {
  const { data: currenciesResponse = {} } = useCurrencies();
  const currencies = currenciesResponse?.data || [];

  const { data: accountTree = {} } = useAccountTree();

  const { data } = useGetAccountById(accountId);
  const accountData = data?.data;

  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount(accountId);


  const flattenAccounts = (accounts, group) => {
    return accounts.flatMap((account) => {
      const current = {
        label: account.accountName,
        value: account._id,
        group,
        parentAccountId: account.parentAccountId,
      };

      if (account.children && account.children.length > 0) {
        return [current, ...flattenAccounts(account.children, group)];
      }
      return [current];
    });
  };

  const parentAccountOptions = useMemo(() => {
    if (!accountTree) return [];
    return Object.entries(accountTree).flatMap(([group, accounts]) =>
      Array.isArray(accounts) ? flattenAccounts(accounts, group) : []
    );
  }, [accountTree]);

  const currencyOptions = useMemo(
    () =>
      currencies.map((c) => ({
        label: c.code,
        value: c.code,
        isDefault: c.isdefault,
      })),
    [currencies]
  );

  const { handleSubmit, control, formState: { errors, isDirty }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      accountName: "",
      accountCode: "",
      parentAccountId: "",
      currency: currencyOptions.find(c => c.isDefault)?.value || "",
      description: "",
    },
  });

  useEffect(() => {
    if (accountData && open) {
      reset({
        accountName: accountData.accountName || "",
        accountCode: accountData.accountCode || "",
        parentAccountId: accountData.parentAccountId || "",
        currency: accountData.currency || "",
        description: accountData.description || "",
      });
    }
  }, [accountData, open, reset]);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (formData) => {
    const selectedParent = parentAccountOptions.find(
      (opt) => opt.value === formData.parentAccountId
    );

    const accountType = selectedParent?.group || "";

    const payload = {
      accountName: formData.accountName,
      accountCode: formData.accountCode,
      accountType,
      parentAccountId: formData.parentAccountId,
      currency: formData.currency,
      description: formData.description,
    };

    if (accountId) {
      updateAccount.mutate(
        { id: accountId, data:payload },
        { onSuccess: handleClose }
      );
    } else {
      createAccount.mutate(payload, {
        onSuccess: handleClose,
      });
    }
  };

  return (
    <Box>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title={accountId ? "Edit Account" : "Create Account"}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={accountId ? "Update" : "Submit"}
        cancelLabel="Cancel"
        submitDisabled={!isDirty}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>

          <Box sx={{ flex: "1 1 48%" }}>
            {/* Parent Account*/}
            <Controller
              name="parentAccountId"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  label="Account Type"
                  {...field}
                  options={parentAccountOptions}
                  error={!!errors.parentAccountId}
                  helperText={errors.parentAccountId?.message}
                  mandatory
                  searchable
                  mb={0}
                />
              )}
            />
          </Box>
          {/* Account Name */}
          <Box sx={{ flex: "1 1 48%" }}>

            <Controller
              name="accountName"
              control={control}
              render={({ field }) => (
                <CommonTextField
                  label="Account Name"
                  {...field}
                  error={!!errors.accountName}
                  helperText={errors.accountName?.message}
                  mandatory
                  mb={0}
                />
              )}
            />
          </Box>
          {/* Account Code */}

          <Box sx={{ flex: "1 1 48%" }}>


            {/* Account Code */}
            <Controller
              name="accountCode"
              control={control}
              render={({ field }) => (
                <CommonTextField
                  label="Account Code"
                  {...field}
                  error={!!errors.accountCode}
                  helperText={errors.accountCode?.message}
                  mandatory
                  mb={0}
                />
              )}
            />
          </Box>
          <Box sx={{ flex: "1 1 48%" }}>
            {/* Currency */}
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  label="Currency"
                  {...field}
                  options={currencyOptions}
                  error={!!errors.currency}
                  helperText={errors.currency?.message}
                  mandatory
                  mb={0}
                />
              )}
            />
          </Box>
          {/* Description (optional) */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <CommonDescriptionField
                label="Description"
                {...field}
                error={!!errors.description}
                helperText={errors.description?.message}
                mt={-1}
                mb={0}
              />
            )}
          />
        </Box>
      </CommonDialog>
    </Box>
  );
};

export default AccountantForm;