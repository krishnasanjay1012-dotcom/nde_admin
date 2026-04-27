import { apiGet } from "../axios-instance";
import { SUSPENSION_REPORT,GSUITE_SERVICE_DETAILS_CLIENT,RENEWAL_DATA_BY_DATE,RESELLER_SERVICE_DETAILS_CLIENT } from "../endpoints";
import { webserviceGet } from "../web-service.instonce";

export const getSuspensionReport = ({
  filter = "",
  sort = "",
  page = 1,
  limit = 10,
}) => {
  return apiGet(
    `${SUSPENSION_REPORT}?filter=${filter}&sort=${sort}&page=${page}&limit=${limit}`
  );
};

export const getGSuiteServiceDetailsByClient = ({ customerId, skuId }) => {
  return apiGet(
    `${GSUITE_SERVICE_DETAILS_CLIENT}?customerId=${customerId}&skuId=${skuId}`
  );
};

export const getRenewalDataByDate = ({ days = 15, page = 1, limit = 10, service = "" }) => {
  return apiGet(
    `${RENEWAL_DATA_BY_DATE}?days=${days}&page=${page}&limit=${limit}&service=${service}`
  );
};
export const getResellerServiceDetailsByClient = ({ domain_name }) => {
  return webserviceGet(
    `${RESELLER_SERVICE_DETAILS_CLIENT}?domain_name=${domain_name}`
  );
};



