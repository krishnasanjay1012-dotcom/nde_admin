import { apiGet } from "../axios-instance";
import { APPS_PRODUCT_LIST, DOMAIN_PRODUCT_LIST, GSUITE_PRODUCT_LIST, PLESK_PRODUCT_LIST, PURCHASED_PRODUCT_LIST } from "../endpoints";


export const getDomainProductList = ({
  filter = "all",
  productId,
  searchTerm = "",
  page = 1,
  limit = 10,
  sort = "domainName",
  config,
}) => {
  return apiGet(
    `${DOMAIN_PRODUCT_LIST}?filter=${filter}&productId=${productId}&searchTerm=${searchTerm}&page=${page}&limit=${limit}&sort=${sort}&config=${config}`
  );
};


export const getGsuiteProductList = ({
  filter = "all",
  productId,
  searchTerm = "",
  page = 1,
  limit = 10,
  sort = "customerName",
  config,
}) => {
  return apiGet(
    `${GSUITE_PRODUCT_LIST}?filter=${filter}&productId=${productId}&searchTerm=${searchTerm}&page=${page}&limit=${limit}&sort=${sort}&config=${config}`
  );
};

export const getPleskProductList = ({
  productId,
  searchTerm = "",
  page = 1,
  limit = 10,
  sort = "customerName",
  config
}) => {
  return apiGet(
    `${PLESK_PRODUCT_LIST}?productId=${productId}&searchTerm=${searchTerm}&page=${page}&limit=${limit}&sort=${sort}&config=${config}`
  );
};

export const getAppsProductList = ({
  productId = "",
  searchTerm = "",
  page = 1,
  limit = 10,
  sort = "customerName",
  filter = "all",
}) => {
  return apiGet(
    `${APPS_PRODUCT_LIST}?filter=${filter}&productId=${productId}&searchTerm=${searchTerm}&page=${page}&limit=${limit}&sort=${sort}`
  );
};

export const getPurchasedProductList = ({
  filter = "",
  searchTerm = "",
  page = 1,
  limit = 10,
  customFilters
}) => {

  const query = new URLSearchParams({
    filter,
    page,
    limit,
    searchTerm,
    customFilters: JSON.stringify(customFilters),
  });
  return apiGet(
    `${PURCHASED_PRODUCT_LIST}?${query.toString()}`
  );
};
