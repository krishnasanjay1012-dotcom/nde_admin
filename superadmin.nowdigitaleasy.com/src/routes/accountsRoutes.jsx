import NewCustomView from "../components/common/NewCustomView";
import EditCustomView from "../components/common/NDE-Edit-Custom-View";
import Accountant from "../pages/Accountant/Accountant-List";
import AccountDetails from "../components/common/Accountant/Account-Details";



export const accountsRoutes = [
  { path: "accountant/accounts", element: <Accountant /> },

  { path: "accountant/:module/new-custom-view", element: <NewCustomView /> },
  { path: "accountant/:module/edit/custom-view/:customId", element: <EditCustomView /> },
  { path: "accountant/accounts/details/:accountId", element: <AccountDetails /> },

];
