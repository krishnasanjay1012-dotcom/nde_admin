import { useQuery } from "@tanstack/react-query";
import { getSuspensionReport,getGSuiteServiceDetailsByClient,getRenewalDataByDate,getResellerServiceDetailsByClient} from "../../services/suspension/suspension-service";

export const useSuspensionReport = (params) => {
  return useQuery({
    queryKey: ["suspensionReport", params],
    queryFn: () => getSuspensionReport(params),
     keepPreviousData: true, 
  });
};


export const useGSuiteServiceDetailsByClient = ({ customerId, skuId }) => {
  return useQuery({
    queryKey: ["gsuiteServiceDetailsClient", customerId, skuId],
    queryFn: () => getGSuiteServiceDetailsByClient({ customerId, skuId }),
    enabled: !!customerId && !!skuId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRenewalDataByDate = ({ days = 15, page = 1, limit = 10, service = "" }) => {
  return useQuery({
    queryKey: ["renewalDataByDate", days, page, limit, service],
    queryFn: () => getRenewalDataByDate({ days, page, limit, service }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};

export const useResellerServiceDetailsByClient = ({ domain_name }) => {
  return useQuery({
    queryKey: ["resellerServiceDetailsClient", domain_name],
    queryFn: () => getResellerServiceDetailsByClient({ domain_name }),
    enabled: !!domain_name, // only fetch if domain_name is provided
    staleTime: 5 * 60 * 1000,
  });
};