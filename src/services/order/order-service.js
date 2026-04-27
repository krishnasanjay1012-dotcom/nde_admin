import { apiDelete, apiGet, apiPost, apiUpdate } from "../axios-instance";
import { CART_ADMIN, CART_UPDATE, DOMAIN_CHECK, GET_ALL_PRODUCTS, MAKE_ORDER, ORDER_ADMIN_ORDER, ORDER_DELETE, ORDER_GET_ALL, PRODUCT_BY_GROUP, REMOVE_CLIENT_CART, WALLET_BALANCE } from "../endpoints";

export const getAllOrders = ({ 
  page = 1, 
  limit = 10, 
  searchTerm = "", 
  filter = "", 
  date_filter = "", 
  start_date = "", 
  end_date = "",
  sort
}) => {
  return apiGet(
    `${ORDER_GET_ALL}?page=${page}&limit=${limit}&searchTerm=${searchTerm}&filter=${filter}&date_filter=${date_filter}&start_date=${start_date}&end_date=${end_date}&sort=${sort || ''}`
  );
};


export const getProductsByGroup = (groupId) => {
  return apiGet(`${PRODUCT_BY_GROUP}/${groupId}`);
};

export const getAllProducts = () => {
  return apiGet(GET_ALL_PRODUCTS);
};

export const getAdminCartByUser = (userId) => {
  return apiGet(`${CART_ADMIN}/${userId}`);
};

export const addToAdminCart = (data) => {
  return apiPost(CART_ADMIN, data);
};
export const deleteClientCartItem  = (id) => {
  return apiDelete(`${REMOVE_CLIENT_CART}/${id}`);
};

export const makeOrder = (data) => {
  return apiPost(MAKE_ORDER, data);
};

export const getWalletBalance = (clientId, workspace_Id) => {
  return apiGet(`${WALLET_BALANCE}/${clientId}?workspace_Id=${workspace_Id}`);
};

export const checkDomain = (domain) => {
  return apiGet(`${DOMAIN_CHECK}/${domain}`);
};
export const updateCart = (data) => {
  return apiUpdate(CART_UPDATE, data);
};

export const deleteOrder = (productId) => {
  return apiDelete(`${ORDER_DELETE}/${productId}`);
};

export const getAdminOrderById = (id) => {
  return apiGet(`${ORDER_ADMIN_ORDER}?id=${id}`);
};