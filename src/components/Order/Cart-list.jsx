import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useRemoveClientCart } from "../../hooks/order/order-hooks";
import Cartedit from "./Cart-edit";

export default function CartList({ adminCart }) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const { mutate: removeCartItem, isPending } = useRemoveClientCart();

  const handleDrawerOpen = (item) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedItem(null);
  };

 const handleDelete = (id) => {
    if (!id) return;
    removeCartItem(id);
  };

  if (!adminCart || adminCart.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 6,
          color: "text.secondary",
          gap: 1.5,
          height: "70vh",
        }}
      >
        <ShoppingCartOutlinedIcon sx={{ fontSize: 40, color: "primary.main" }} />
        <Typography variant="h6">No products in cart</Typography>
        <Typography variant="body2" sx={{ textAlign: "center", maxWidth: 300 }}>
          Your cart is currently empty. Add some products to see them listed here.
        </Typography>
      </Box>
    );
  }

  const renderFields = (item) => {
    switch (item.product) {
      case "domain":
        return (
          <>
            <Box sx={{ maxWidth: 200 }}>
              <Tooltip title={item.domainName} arrow>
                <Typography
                  noWrap
                  sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                >
                  <strong>Domain Name:</strong> {item.domainName}
                </Typography>
              </Tooltip>
            </Box>
            <Typography><strong>Product Name:</strong> {item.productName}</Typography>
            <Typography><strong>Price:</strong> ${item.domainprice}</Typography>
            <Typography><strong>Year:</strong> {item.year || "-"}</Typography>
            <Typography><strong>Quantity:</strong> {item.quantity}</Typography>
            <Typography><strong>Service Type:</strong> {item.service_type}</Typography>
            <Typography><strong>Available:</strong> {item.available ? "Yes" : "No"}</Typography>
          </>
        );
      case "hosting":
        return (
          <>
            <Box sx={{ maxWidth: 200 }}>
              <Tooltip title={item.domainName} arrow>
                <Typography
                  noWrap
                  sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                >
                  <strong>Domain:</strong> {item.domainName}
                </Typography>
              </Tooltip>
            </Box>
            <Typography><strong>Plan:</strong> {item.productName}</Typography>
            <Typography><strong>Price:</strong> ${item.pleskPrice}</Typography>
            <Typography><strong>Period:</strong> {item.period}</Typography>
            <Typography><strong>Quantity:</strong> {item.quantity}</Typography>
            <Typography><strong>Service Type:</strong> {item.service_type}</Typography>
          </>
        );
      case "gsuite":
        return (
          <>
            <Box sx={{ maxWidth: 200 }}>
              <Tooltip title={item.productName} arrow>
                <Typography
                  noWrap
                  sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                >
                  <strong>Plan:</strong> {item.productName}
                </Typography>
              </Tooltip>
            </Box>
            <Typography><strong>Default Users:</strong> {item.defaultUser}</Typography>
            <Typography><strong>Offer Users:</strong> {item.offerUser}</Typography>
            <Typography><strong>Default Price:</strong> ${item.defaultPrice}</Typography>
            <Typography><strong>Offer Price:</strong> ${item.singleOfferprice}</Typography>
            <Typography><strong>Period:</strong> {item.period}</Typography>
            <Typography><strong>Quantity:</strong> {item.quantity}</Typography>
          </>
        );
      case "apps":
        return (
          <>
               <Box sx={{ maxWidth: 200 }}>
              <Tooltip title={item.productName} arrow>
                <Typography
                  noWrap
                  sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                >
                  <strong>Product Name:</strong> {item.productName}
                </Typography>
              </Tooltip>
            </Box>
            <Typography><strong>Paln Name:</strong> {item.planName || "-"}</Typography>
            <Typography><strong>Period:</strong> {item.period || "-"}</Typography>
            <Typography><strong>Quantity:</strong> {item.quantity}</Typography>
            <Typography><strong>Product Type:</strong> {item.productType || "-"}</Typography>
            <Typography><strong>description:</strong> {item.description || "-"}</Typography>
          </>
        );
      default:
        return <Typography>Unknown product type</Typography>;
    }
  };

  return (
    <>
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          overflowY: "auto",
          maxHeight: "600px",
        }}
      >
        {adminCart.map((item) => (
          <Card
            key={item._id || Math.random()}
            sx={{
              borderRadius: 2,
              p: 2,
              flex: "1 1 100%",
              maxWidth: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              border: "1px solid #EBEBEF",
            }}
          >
            {/* Top-right ribbon */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: "#6C75EF",
                px: 1.5,
                py: 0.5,
                borderBottomLeftRadius: 18,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                zIndex: 2,
              }}
            >
              <Typography variant="caption" sx={{ color: "#fff", fontWeight: "bold" }}>
                {item.groupName}
              </Typography>
              <IconButton size="small" onClick={() => handleDrawerOpen(item)}>
                <EditIcon fontSize="small" sx={{ color: "#fff", fontSize: 18 }} />
              </IconButton>
            </Box>

            {/* Product Info */}
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                {renderFields(item)}
              </Box>
            </CardContent>

            {/* Bottom-right delete button */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "#ec2d30",
                borderTopLeftRadius: 50,
                p: 0.8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton
                sx={{ p: 0.5 }}
                onClick={() => handleDelete(item._id)}
                disabled={isPending}
              >
                <DeleteIcon sx={{ color: "#fff", fontSize: 20 }} />
              </IconButton>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Drawer for editing */}
      <Cartedit open={isDrawerOpen} onClose={handleDrawerClose} item={selectedItem} />
    </>
  );
}


// import React from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   IconButton,
//   Box,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

// export default function CartList({ adminCart }) {
 


// if (!adminCart || adminCart.length === 0) {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         py: 6,
//         color: "text.secondary",
//         gap: 1.5,
//       }}
//     >
//       <ShoppingCartOutlinedIcon sx={{ fontSize: 40,color:'primary.main'}} />
//       <Typography variant="h6">No products in cart</Typography>
//       <Typography variant="body2" sx={{ textAlign: "center", maxWidth: 300 }}>
//         Your cart is currently empty. Add some products to see them listed here.
//       </Typography>
//     </Box>
//   );
// }


//   // helper: render fields based on product type
//   const renderFields = (item) => {
//     switch (item.product) {
//       case "domain":
//         return (
//           <>
//             <Typography><strong>Domain Name:</strong> {item.domainName}</Typography>
//             <Typography><strong>Product Name:</strong> {item.productName}</Typography>
//             <Typography><strong>Price:</strong> ${item.domainprice}</Typography>
//             <Typography><strong>Year:</strong> {item.year || "-"}</Typography>
//             <Typography><strong>Quantity:</strong> {item.quantity}</Typography>
//             <Typography><strong>Service Type:</strong> {item.service_type}</Typography>
//             <Typography><strong>Available:</strong> {item.available ? "Yes" : "No"}</Typography>
//           </>
//         );
//       case "hosting":
//         return (
//           <>
//             <Typography><strong>Domain:</strong> {item.domainName}</Typography>
//             <Typography><strong>Plan:</strong> {item.productName}</Typography>
//             <Typography><strong>Price:</strong> ${item.pleskPrice}</Typography>
//             <Typography><strong>Period:</strong> {item.period}</Typography>
//             <Typography><strong>Quantity:</strong> {item.quantity}</Typography>
//             <Typography><strong>Service Type:</strong> {item.service_type}</Typography>
//           </>
//         );
//       case "gsuite":
//         return (
//           <>
//             <Typography><strong>Plan:</strong> {item.productName}</Typography>
//             <Typography><strong>Default Users:</strong> {item.defaultUser}</Typography>
//             <Typography><strong>Offer Users:</strong> {item.offerUser}</Typography>
//             <Typography><strong>Default Price:</strong> ${item.defaultPrice}</Typography>
//             <Typography><strong>Offer Price:</strong> ${item.singleOfferprice}</Typography>
//             <Typography><strong>Period:</strong> {item.period}</Typography>
//             <Typography><strong>Quantity:</strong> {item.quantity}</Typography>
//           </>
//         );
//       case "apps":
//         return (
//           <>
//             <Typography><strong>Status:</strong> {item.available ? "Available" : "Unavailable"}</Typography>
//             <Typography><strong>Message:</strong> {item.message}</Typography>
//           </>
//         );
//       default:
//         return <Typography>Unknown product type</Typography>;
//     }
//   };

//   return (
//     <Box sx={{ p: 2, display: "flex", flexWrap: "wrap", gap: 2, overflowY: "auto", maxHeight: "450px" }}>
//       {adminCart.map((item) => (
//         <Card
//           key={item._id || Math.random()}
//           sx={{
//             borderRadius: 2,
//             p: 2,
//             flex: "1 1 calc(50% - 16px)",
//             maxWidth: "calc(50% - 16px)",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between",
//             position: "relative",
//             overflow: "hidden",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//             border: "1px solid #EBEBEF",
//           }}
//         >
//           {/* Top-right ribbon */}
//           <Box
//             sx={{
//               position: "absolute",
//               top: 0,
//               right: 0,
//               backgroundColor: "#6C75EF",
//               px: 1.5,
//               py: 0.5,
//               borderBottomLeftRadius: 18,
//               display: "flex",
//               alignItems: "center",
//               gap: 0.5,
//               zIndex: 2,
//             }}
//           >
//             <Typography variant="caption" sx={{ color: "#fff", fontWeight: "bold" }}>
//               {item.groupName}
//             </Typography>
//             <IconButton size="small">
//               <EditIcon fontSize="small" sx={{ color: "#fff", fontSize: 18 }} />
//             </IconButton>
//           </Box>

//           {/* Product Info */}
//            <CardContent sx={{ p: 0 }}>
//             <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5}}>
//               {renderFields(item)}
//             </Box>
//           </CardContent>

//           {/* Bottom-right delete button */}
//           <Box
//             sx={{
//               position: "absolute",
//               bottom: 0,
//               right: 0,
//               backgroundColor: "#ec2d30",
//               borderTopLeftRadius: 50,
//               p: 0.8,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <IconButton sx={{ p: 0.5 }}>
//               <DeleteIcon sx={{ color: "#fff", fontSize: 20 }} />
//             </IconButton>
//           </Box>
//         </Card>
//       ))}
//     </Box>
//   );
// }
