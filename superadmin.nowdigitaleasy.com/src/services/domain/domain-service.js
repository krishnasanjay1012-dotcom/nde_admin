import { GET_ALL_DOMAINS,UPDATE_DOMAIN_DETAILS,DELETE_DOMAIN,CREATE_DOMAIN,DOMAIN_PRICING,GET_ALL_PRODUCT_GROUPS,UPDATE_DOMAIN_PRICING, DOMAIN_PRICE, TLD} from "../endpoints";
import { apiGet,apiDelete,apiPost,apiUpdate } from "../axios-instance"; 


export const getAllDomain = () => {
  return apiGet(GET_ALL_DOMAINS);
};
export const updateDomainDetails = (data) => {
  return apiUpdate(UPDATE_DOMAIN_DETAILS,data);
}
export const deleteDomain = ({ id }) => {
  return apiDelete(`${DELETE_DOMAIN}/${id}`);
};

export const createDomain = (data) => {
  return apiPost(CREATE_DOMAIN,data);
}
export const domainPricing = (id) => {
  return apiGet(`${DOMAIN_PRICING}${id}`);
}   

export const getAllProductGroups = () => {
  return apiGet(GET_ALL_PRODUCT_GROUPS);
}

export const updateDomainPricing = (data) => {
  return apiUpdate(UPDATE_DOMAIN_PRICING, data);
};

export const updateDomainPrice = ({ updateFor, data }) => {
  return apiUpdate(
    `${DOMAIN_PRICE}?updateFor=${updateFor}`,
    data
  );
};


// New Tld


export const addTld = (data) => {
  return apiPost(TLD, data);
};

export const updateTld = ({ id, data }) => {
  return apiUpdate(`${TLD}/${id}`, data);
};

export const getTldById = ({ id }) => {
  return apiGet(`${TLD}/${id}`);
};

export const deleteTld = (id) => {
  return apiDelete(`${TLD}/${id}`);
};
