import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from './routes/route'
import CustomToastContainer from "./components/common/NDE-Snackbar";
import { AppThemeProvider } from "./context/ThemeContext";
import { CssBaseline, ThemeProvider } from "@mui/material";
// import theme from "./theme/theme";



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
});


export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ThemeProvider theme={theme}> */}
      <AppThemeProvider>
          <CssBaseline />
          <CustomToastContainer />
          <Router />
      </AppThemeProvider>
      {/* </ThemeProvider> */}
    </QueryClientProvider>
  );
}
