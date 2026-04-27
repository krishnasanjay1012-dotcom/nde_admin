import { apiDelete, apiGet } from "../axios-instance";
import { PRODUCT_GET_ALL, PLESK_GET, PRODUCT_DELETE } from "../endpoints";

export const getAllProducts = ({ filter = "all" }) => {
  return apiGet(`${PRODUCT_GET_ALL}?filter=${filter}`);
};

export const getPleskList = () => {
  return apiGet(PLESK_GET);
};

export const deleteProduct = (productId) => {
  return apiDelete(`${PRODUCT_DELETE}/${productId}`);
};
