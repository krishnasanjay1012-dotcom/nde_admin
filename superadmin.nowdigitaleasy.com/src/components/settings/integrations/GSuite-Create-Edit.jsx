// import { useEffect, useState } from "react";
// import { Box, IconButton, InputAdornment } from "@mui/material";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import CommonTextField from "../../common/fields/NDE-TextField";
// import CommonDialog from "../../common/NDE-Dialog";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// const schema = yup.object().shape({
//   clientId: yup.string().required("Client ID is required"),
//   aliasName: yup.string().required("Alias Name is required"),
//   clientSecret: yup.string().required("Client Secret is required"),
//   callback: yup.string().url("Must be a valid URL").required("Callback URL is required"),
// });

// const GSuiteDetails = ({ open, setOpen, initialData = null, onSubmitAction }) => {
//   const [showSecret, setShowSecret] = useState(false);

//   const defaultFormData = initialData
//     ? {
//         clientId: initialData.clientId || initialData.original?.clientID || "",
//         aliasName: initialData.aliasName || initialData.original?.aliasName || "",
//         clientSecret: initialData.original?.clientSecret || "",
//         callback: initialData.original?.callback_url || "",
//       }
//     : {
//         clientId: "",
//         aliasName: "",
//         clientSecret: "",
//         callback: "",
//       };

//   const { handleSubmit, control, formState: { errors }, reset } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: defaultFormData,
//   });

//   useEffect(() => {
//     reset(defaultFormData);
//     setShowSecret(false); 
//   }, [initialData, open]);

//   const handleClose = () => {
//     setOpen(false);
//     reset();
//     setShowSecret(false);
//   };

//   const onSubmit = (data) => {
//     const payload = {
//       clientID: data.clientId,
//       clientSecret: data.clientSecret,
//       callback_url: data.callback,
//       aliasName: data.aliasName,
//     };
//     onSubmitAction(payload);
//     handleClose();
//   };

//   return (
//     <Box>
//       <CommonDialog
//         open={open}
//         onClose={handleClose}
//         title={initialData ? "Edit G-Suite Details" : "Create G-Suite Details"}
//         onSubmit={handleSubmit(onSubmit)}
//         submitLabel={initialData ? "Update" : "Submit"}
//         cancelLabel="Cancel"
//       >
//         <Box>
//           {["clientId", "aliasName", "clientSecret", "callback"].map((fieldName) => (
//             <Controller
//               key={fieldName}
//               name={fieldName}
//               control={control}
//               render={({ field }) => (
//                 <CommonTextField
//                   label={fieldName
//                     .replace(/([A-Z])/g, " $1")
//                     .replace(/^./, (str) => str.toUpperCase())}
//                   type={fieldName === "clientSecret" ? (showSecret ? "text" : "password") : "text"}
//                   {...field}
//                   error={!!errors[fieldName]}
//                   helperText={errors[fieldName]?.message}
//                   mandatory={true}
//                   sx={{ mb: 2 }}
//                   InputProps={
//                     fieldName === "clientSecret"
//                       ? {
//                           endAdornment: (
//                             <InputAdornment position="end">
//                               <IconButton
//                                 onClick={() => setShowSecret((prev) => !prev)}
//                                 edge="end"
//                               >
//                                 {showSecret ? <VisibilityOff /> : <Visibility />}
//                               </IconButton>
//                             </InputAdornment>
//                           ),
//                         }
//                       : {}
//                   }
//                 />
//               )}
//             />
//           ))}
//         </Box>
//       </CommonDialog>
//     </Box>
//   );
// };

// export default GSuiteDetails;


import { useEffect } from "react";
import { Box } from "@mui/material";
import CommonSelect from "../../common/fields/NDE-Select";
import CommonDialog from "../../common/NDE-Dialog";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useUpdateGSuiteCurrency } from "../../../hooks/settings/gsuite";

const schema = yup.object().shape({
  currency: yup.string().required("Currency is required"),
});

const CurrencyDetails = ({
  open,
  setOpen,
  initialData,
  currencyOptions = [],
}) => {  
    
  const defaultValues = {
    currency: initialData?.currency?._id || initialData?.original?.currency?.code || "",
  };

    const updateCurrencyMutation = useUpdateGSuiteCurrency();
  

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors ,isDirty},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (open && initialData) {
      reset(defaultValues);
    }
  }, [open, initialData, reset]);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    
    updateCurrencyMutation.mutate(
      {
        _id: initialData.id,
        currency: data.currency,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };


  return (
    <CommonDialog
      open={open && !!initialData}
      onClose={handleClose}
      title="Edit Currency"
      onSubmit={handleSubmit(onSubmit)}
      submitLabel="Update"
      cancelLabel="Cancel"
      width={400}
      submitDisabled={!isDirty}
    >
      <Box>
        <Controller
          name="currency"
          control={control}
          render={({ field }) => (
            <CommonSelect
              {...field}
              label="Currency"
              options={currencyOptions}
              error={!!errors.currency}
              helperText={errors.currency?.message}
              mandatory
            />
          )}
        />
      </Box>
    </CommonDialog>
  );
};

export default CurrencyDetails;
