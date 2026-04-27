import { useInvoiceMailDetails } from "../../../hooks/sales/invoice-hooks";
import FlowerLoader from "../../../components/common/NDE-loader";
import { useParams } from "react-router-dom";
import SendEmail from "./SendEmail";
import { Box } from "@mui/material";
import { useGetContactPerson } from "../../../hooks/Customer/Customer-hooks";

const SendEmailWrapper = () => {
  const { invoiceId } = useParams();
  const { data, isLoading } = useInvoiceMailDetails(invoiceId);
  const invoiceDetails = data?.data;
  const { data: userData } = useGetContactPerson(invoiceDetails?.organization);
  const userList = userData?.data ?? [];

  console.log("invoiceDetails", invoiceDetails, userList);
  if (isLoading) {
    return (
      <Box
        height={"100%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <FlowerLoader />
      </Box>
    );
  }

  return (
    <SendEmail
      invoiceDetails={invoiceDetails}
      userList={userList}
      workSpaceId={invoiceDetails?.organization}
      invoiceId={invoiceId}
      cancelRoute={"/sales/invoices"}
    />
  );
};

export default SendEmailWrapper;
