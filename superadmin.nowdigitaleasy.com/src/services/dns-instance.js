import axios from "axios";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_DNSSERVICE_URL;
const instanceDns = axios.create();

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


export const dnsPost = async (url, data) =>
  instanceDns({
    method: "post",
    url: baseURL + url,
    data,
  });

export const dnsDelete = async (url, data) =>
  instanceDns({
    method: "delete",
    url: baseURL + url,
    data
  });

export const dnsGet = async (url, config = {}) => {
  const res = await instanceDns.get(baseURL + url, config);
  return res.data;
};

export const dnsUpdate = async (url, data) =>
  instanceDns({
    method: "put",
    url: baseURL + url,
    data,
  });

export const dnsPatch = async (url, data) =>
  instanceDns({
    method: "patch",
    url: baseURL + url,
    data,
  });


instanceDns.interceptors.request.use(
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


instanceDns.interceptors.response.use(
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

export default instanceDns;
