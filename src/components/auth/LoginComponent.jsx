import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Logo from "../../assets/icons/logo.svg";
import { useLogin } from "../../hooks/auth/login";
import { setUserSession } from "../../utils/session";
import FlowerLoader from "../common/NDE-loader";

const validationSchema = Yup.object({
  userName: Yup.string().required("User Name is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const LoginComponent = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md"));

  const { mutate: doLogin, isPending } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const onSubmit = (values) => {
    const payload = {
      username: values.userName,
      password: values.password,
    };
    doLogin(payload, {
      onSuccess: (response) => {
        if (response?.data?.token) {
          setUserSession({
            token: response.data.token,
            username: response.data.username,
            role: response.data.role,
          });
          navigate("/home");
        }
      },
      onError: (err) => {
        console.error("Login failed:", err);
      },
    });
  };

  const bgColor = isMobileOrTablet
    ? theme.palette.primary.extraLight
    : theme.palette.primary.default;

  const leftPanelBg = isMobileOrTablet
    ? theme.palette.primary.light
    : "linear-gradient(135deg, #4752EB 0%, #2330E7 100%)";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        width: "100%",
        backgroundColor: bgColor,
      }}
    >

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          minWidth: { xs: "100%", md: "400px" },
          background: leftPanelBg,
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            p: { xs: 3, sm: 4 },
            borderRadius: "16px",
            maxWidth: { xs: "100%", sm: "380px" },
            width: "100%",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          {/* Logo & Heading */}
          <Box textAlign="center" mb={2}>
            <Box
              component="img"
              src={Logo}
              alt="System Logo"
              sx={{ width: 50, height: 50, mb: 2 }}
            />
            <Typography variant="h5" fontWeight={500}>
              Welcome back!
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            {/* Username */}
            <Box mb={2}>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  color: theme.palette.text.primary,
                  mb: 1,
                }}
              >
                User Name
              </Typography>
              <Controller
                name="userName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    placeholder="Enter your username"
                    variant="outlined"
                    autoComplete="username"
                    error={!!errors.userName}
                    helperText={errors.userName?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        height: 44,
                        "& fieldset": {
                          border: `1.5px solid ${theme.palette.primary.border}`,
                        },
                        "&:hover fieldset": {
                          border: `1.5px solid ${theme.palette.primary.main}`,
                        },
                        "&.Mui-focused fieldset": {
                          border: `2px solid ${theme.palette.primary.main}`,
                        },
                      },
                      "& .MuiInputBase-input": { fontSize: "0.875rem" },
                    }}
                  />
                )}
              />
            </Box>

            {/* Password */}
            <Box mb={1}>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  color: theme.palette.text.primary,
                  mb: 1,
                }}
              >
                Password
              </Typography>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        height: 44,
                        "& fieldset": {
                          border: `1.5px solid ${theme.palette.primary.border}`,
                        },
                        "&:hover fieldset": {
                          border: `1.5px solid ${theme.palette.primary.main}`,
                        },
                        "&.Mui-focused fieldset": {
                          border: `2px solid ${theme.palette.primary.main}`,
                        },
                      },
                      "& .MuiInputBase-input": { fontSize: "0.875rem" },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Box>

            {/* Forgot Password */}
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  color: theme.palette.primary.main,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </Typography>
            </Box>

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isValid || isPending}
              sx={{
                fontWeight: 500,
                borderRadius: "8px",
                height: 44,
                fontSize: "1rem",
                textTransform: "none",
                backgroundColor: theme.palette.primary.main,
                "&:hover": { backgroundColor: theme.palette.primary.dark },
                "&.Mui-disabled": {
                  backgroundColor: theme.palette.grey[5],
                  color: theme.palette.grey[3],
                },
              }}
            >
              {isPending ? <FlowerLoader color="white" size={15} /> : "Login"}
            </Button>
          </Box>

          {/* Signup Section */}
          {/* <Box
            sx={{
              textAlign: "center",
              mt: 3,
              pt: 3,
              borderTop: `1px solid ${theme.palette.grey[5]}`,
              fontSize: "0.875rem",
              color: theme.palette.grey[2],
            }}
          >
            Don't have an account?{" "}
            <Box
              component="span"
              sx={{
                fontSize: "0.875rem",
                color: theme.palette.primary.main,
                fontWeight: 600,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => navigate("/signup")}
            >
              Sign up
            </Box>
          </Box> */}
        </Box>
      </Box>
    </Box>
  );
};

export default LoginComponent;
