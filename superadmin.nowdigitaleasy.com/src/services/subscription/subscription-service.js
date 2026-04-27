
import { apiGet } from "../axios-instance";
import { SUBSCRIPTION, SUBSCRIPTION_USER } from "../endpoints";

export const getSubscriptionsUser = () => {
  return apiGet(SUBSCRIPTION_USER);
};

export const getSubscriptions = ({
  searchTerm = "",
  page = 1,
  limit = 10,
  filter = "",
  sort,
  customFilters
}) => {

  const query = new URLSearchParams({
    page,
    limit,
    filter,
    searchTerm,
    sort,
    customFilters: JSON.stringify(customFilters),
  });
  return apiGet(
    `${SUBSCRIPTION}?${query.toString()}`
  );
};


export const getSubscriptionById = (id) => {
  return apiGet(`${SUBSCRIPTION}/${id}`);
};