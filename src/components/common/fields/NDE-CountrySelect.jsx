// import { Box, TextField, Autocomplete, FormLabel } from "@mui/material";
// import { countries as countriesData } from "countries-list";

// const countries = Object.keys(countriesData).map((code) => ({
//   code,
//   label: countriesData[code].name,
//   phone: countriesData[code].phone,
//   currencyCode: countriesData[code].currency,
//   languages: countriesData[code].languages, 
// }));

// const CommonCountrySelect = ({
//   label = "Choose a country",
//   value,
//   onChange,
//   error = false,
//   helperText = "",
//   disabled = false,
//   sx = {},
//   mandatory = false,
//   iconColor = "#8A8AA3",
//   width = "100%",  
//   ...props
// }) => {
//   return (
//     <>
//       <FormLabel>
//         {label}
//         {mandatory && <span style={{ color: "red" }}> *</span>}
//       </FormLabel>
//       <Autocomplete
//         sx={{
//           width: width,
//           mt: 1,
//           mb: 2,
//           "& .MuiOutlinedInput-root": {
//             borderRadius: "6px",
//             height: 40,
//             "& fieldset": { border: "1px solid #D1D1D1" },
//           },
//           "& .MuiAutocomplete-popupIndicator": { color: iconColor },
//           "& .MuiAutocomplete-clearIndicator": { color: iconColor },
//           ...sx,
//         }}
//         options={countries}
//         autoHighlight
//         value={value || null}
//         onChange={(event, newValue) => onChange?.(newValue)}
//         getOptionLabel={(option) => option?.label || ""}
//         renderOption={(props, option) => (
//           <Box
//             key={option.code}
//             component="li"
//             sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
//             {...props}
//           >
//             <img
//               loading="lazy"
//               width="20"
//               srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
//               src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
//               alt={option.label}
//             />
//             {option.label} ({option.code}) +{option.phone}
//           </Box>
//         )}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             error={!!error}
//             helperText={helperText}
//             disabled={disabled}
//             inputProps={{ ...params.inputProps, autoComplete: "new-password" }}
//           />
//         )}
//         {...props}
//       />
//     </>
//   );
// };

// export default CommonCountrySelect;


import { Box, TextField, Autocomplete, FormLabel } from "@mui/material";
import { countries as countriesData } from "countries-list";

const countries = Object.keys(countriesData).map((code) => {
  const currencyCode = countriesData[code].currency;
  let currencySymbol = "";
  if (currencyCode) {
    try {
      currencySymbol = new Intl.NumberFormat("en", {
        style: "currency",
        currency: currencyCode,
        currencyDisplay: "symbol",
      })
        .formatToParts(0)
        .find((part) => part.type === "currency")?.value;
    } catch (error) {
      currencySymbol = currencyCode;
    }
  }

  // Convert language codes to en-US format
  const languages =
    countriesData[code].languages?.map((lang) => `${lang}-${code}`) || [];

  return {
    code,
    label: countriesData[code].name,
    phone: countriesData[code].phone,
    currencyCode,
    currencySymbol,
    languages,
  };
});

const CommonCountrySelect = ({
  label = "Choose a country",
  value,
  onChange,
  error = false,
  helperText = "",
  disabled = false,
  sx = {},
  mandatory = false,
  iconColor = "#8A8AA3",
  width = "100%",
  ...props
}) => {
  return (
    <>
      <FormLabel>
        {label}
        {mandatory && <span style={{ color: "red" }}> *</span>}
      </FormLabel>
      <Autocomplete
        sx={{
          width: width,
          mt: 1,
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "6px",
            height: 40,
            "& fieldset": { border: "1px solid #D1D1D1" },
          },
          "& .MuiAutocomplete-popupIndicator": { color: iconColor },
          "& .MuiAutocomplete-clearIndicator": { color: iconColor },
          ...sx,
        }}
        options={countries}
        autoHighlight
        value={value || null}
        onChange={(event, newValue) => onChange?.(newValue)}
        getOptionLabel={(option) => option?.label || ""}
        renderOption={(props, option) => (
          <Box
            key={option.code}
            component="li"
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            <img
              loading="lazy"
              width="20"
              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
              alt={option.label}
            />
            {option.label} ({option.code}) +{option.phone} {option.currencySymbol && ` - ${option.currencySymbol}`}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            error={!!error}
            helperText={helperText}
            disabled={disabled}
            inputProps={{ ...params.inputProps, autoComplete: "new-password" }}
          />
        )}
        {...props}
      />
    </>
  );
};

export default CommonCountrySelect;