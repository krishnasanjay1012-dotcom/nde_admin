import SendMailCustomer from "./SendEmail-Customer";
import { useParams } from "react-router-dom";
import {
  useStatementDetails,
} from "../../../hooks/Customer/Customer-hooks";
import FlowerLoader from "../../common/NDE-loader";
import { Box } from "@mui/material";

const SendEmailCustomerWrapper = () => {
  const { customerId } = useParams();
  console.log("aasasasa", customerId);
  const { data: statementDeatils, isLoading } = useStatementDetails({
    userId: customerId,
    filter: "this_month",
  });
  if (isLoading) {
    return (
      <Box
        width={"100%"}
        height={"100%"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <FlowerLoader />
      </Box>
    );
  }
  return <SendMailCustomer statementDeatils={statementDeatils?.data} customerId={customerId}  />;
};

export default SendEmailCustomerWrapper;
