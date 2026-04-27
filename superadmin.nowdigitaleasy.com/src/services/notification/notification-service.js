import { NOTIFICATION_GET_ALL, NOTIFICATION_UPDATE } from "../endpoints";
import { apiGet, apiUpdate} from "../axios-instance";


// Get all notifications
export const getNotifications = ({page = 1, limit = 20}) => {
  return apiGet(`${NOTIFICATION_GET_ALL}?page=${page || 1}&limit=${limit || 20}`);
};

export const updateNotification = (data) => {
  return apiUpdate(NOTIFICATION_UPDATE, data);
};