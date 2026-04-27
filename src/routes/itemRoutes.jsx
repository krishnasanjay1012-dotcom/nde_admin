import NewCustomView from "../components/common/NewCustomView";
import EditCustomView from "../components/common/NDE-Edit-Custom-View";
import ItemList from "../pages/Items/Items-List";
import ItemDetails from "../components/Items/Items-Details";
import NewItems from "../pages/Items/New-Items";
import ItemOverview from "../components/Items/ItemTab/Item-OverView";
import ItemHistory from "../components/Items/ItemTab/Item-History";




export const itemsRoutes = [
  { path: "items", element: <ItemList /> },
  { path: "items/new", element: <NewItems /> },
  { path: "items/:itemId/edit", element: <NewItems /> },

  { path: ":module/new-custom-view", element: <NewCustomView /> },
  { path: ":module/edit/custom-view/:customId", element: <EditCustomView /> },


  {
    path: "items/details/:itemId",
    element: <ItemDetails />,
    children: [
      { index: true, element: <ItemOverview /> },
      { path: "overview", element: <ItemOverview /> },
      { path: "transaction", element: <ItemHistory /> },
      { path: "history", element: <ItemHistory /> },
    ],
  },
];
