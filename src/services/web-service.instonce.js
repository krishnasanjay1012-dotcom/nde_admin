import axios from "axios";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_WEBSERVICE_URL;
const webservice = axios.create();

const getErrorMessage = (error) => {
  if (!error) return "Something went wrong";

  if (error.response) {
    const data = error.response.data;

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors
        .map(err => err.field ? `${err.field}: ${err.message}` : err.message)
        .join("\n");
    }

    if (data?.message) {
      return data.message;
    }

    if (data?.error?.message) {
      return data.error.message;
    }
    return error.message || "Something went wrong";
  }

  if (error.request) {
    return "Network error. Please check your connection.";
  }

  return error.message || "Something went wrong";
};

// const getErrorMessage = (error) => {
//   if (!error) return "Something went wrong";

//   if (error.response) {
//     const data = error.response.data;

//     // First priority → API message
//     if (data?.message) {
//       return data.message;
//     }

//     // Validation errors (if objects)
//     if (Array.isArray(data?.errors) && data.errors.length > 0) {
//       return data.errors
//         .map((err) =>
//           typeof err === "string"
//             ? err
//             : err.field
//               ? `${err.field}: ${err.message}`
//               : err.message
//         )
//         .join("\n");
//     }

//     if (data?.error?.message) {
//       return data.error.message;
//     }

//     return error.message || "Something went wrong";
//   }

//   if (error.request) {
//     return "Network error. Please check your connection.";
//   }

//   return error.message || "Something went wrong";
// };


export const webservicePost = async (url, data) =>
  webservice({
    method: "post",
    url: baseURL + url,
    data,
  });

export const webserviceDelete = async (url, data) =>
  webservice({
    method: "delete",
    url: baseURL + url,
    data,
  });

export const webserviceGet = async (url) =>
  webservice({
    method: "get",
    url: baseURL + url,
  });

export const webserviceUpdate = async (url, data) =>
  webservice({
    method: "put",
    url: baseURL + url,
    data,
  });

export const webservicePatch = async (url, data) =>
  webservice({
    method: "patch",
    url: baseURL + url,
    data,
  });


webservice.interceptors.request.use(
  (config) => {
    if (config.url.endsWith("login")) {
      config.headers["Content-Type"] = "application/json";
    }

    const token = sessionStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    toast.error(error.message || "Request error", {
      position: "top-right",
    });
    return Promise.reject(error);
  }
);


webservice.interceptors.response.use(
  (response) => {
    if (
      response.data?.statusCode === 200 ||
      response.data?.statusCode === 201 ||
      response.status === 200 ||
      response.status === 201
    ) {
      if (
        response.data?.message &&
        response.config.method !== "get"
      ) {
        toast.success(response.data.message, {
          position: "top-center",
        });
      }
      return response.data;
    }
    return Promise.reject(response);
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      (error?.response?.status === 401 ||
        error?.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // refresh token logic here
      } catch (err) {
        console.error("Token refresh failed:", err);
      }
    }

        //  if (!error.response || error.code === "ERR_NETWORK") {
    //   window.location.href = "/network-error";
    //   return Promise.reject(error);
    // }

    setTimeout(() => {
      document.body.classList.remove("loading-indicator");
    }, 2000);

    toast.error(getErrorMessage(error), {
      position: "top-center",
    });

    return Promise.reject(error);
  }
);

export default webservice;
