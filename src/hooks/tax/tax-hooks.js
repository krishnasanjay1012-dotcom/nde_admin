import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTaxes,
  getTaxesPdf,
  getTaxesExcel,
  createTax,
  getGstTaxList,
  deleteGstTax,
  updateGstTax,
} from "../../services/tax/tax-service";

export const useTaxes = ({
  page = 1,
  limit = 10,
  date_filter,
  start_date,
  end_date,
}) =>
  useQuery({
    queryKey: ["taxes", page, limit, date_filter, start_date, end_date],
    queryFn: () => getTaxes({ page, date_filter, limit, start_date, end_date }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
export const useTaxesPdf = (pdfUrl) => {
  return useQuery({
    queryKey: ["taxPdf", pdfUrl],
    queryFn: () => getTaxesPdf(pdfUrl),
    enabled: !!pdfUrl,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTaxesExcel = () => {
  return useQuery({
    queryKey: ["taxExcel"],
    queryFn: getTaxesExcel,
    staleTime: 5 * 60 * 1000,
    enabled: false,
  });
};

export const useGetGstTaxes = () => {
  return useQuery({
    queryKey: ["GstTaxes"],
    queryFn: getGstTaxList,
  });
};

export const useCreateGSTTax = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTax,
    onSuccess: () => {
      queryClient.invalidateQueries(["GstTaxes"]);
    },
  });
};

export const useUpdateGstTaxes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateGstTax(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GstTaxes"] });
    },
  });
};

export const useDeleteGstTaxes = (taxId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGstTax,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["GstTaxes", taxId] }),
  });
};
