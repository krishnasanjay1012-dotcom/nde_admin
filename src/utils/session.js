// import { useState, useEffect } from "react";

// const SESSION_KEYS = {
//   USERNAME: "userName",
//   ROLE: "role",
//   TOKEN: "accessToken",
// };

// export const setUserSession = (data) => {
//   sessionStorage.setItem(SESSION_KEYS.USERNAME, data.username);
//   sessionStorage.setItem(SESSION_KEYS.ROLE, data.role);
//   sessionStorage.setItem(SESSION_KEYS.TOKEN, data.token);
//   window.dispatchEvent(new Event("session-changed"));
// };

// export const getUserSession = () => {
//   return {
//     username: sessionStorage.getItem(SESSION_KEYS.USERNAME),
//     role: sessionStorage.getItem(SESSION_KEYS.ROLE),
//     token: sessionStorage.getItem(SESSION_KEYS.TOKEN),
//   };
// };

// export const clearUserSession = () => {
//   Object.values(SESSION_KEYS).forEach((key) =>
//     sessionStorage.removeItem(key)
//   );
//   window.dispatchEvent(new Event("session-changed"));
// };

// // Decode JWT token
// export const decodeToken = (token) => {
//   if (!token) return null;
//   try {
//     const [, payloadBase64] = token.split(".");
//     const binString = atob(payloadBase64);
//     const payload = JSON.parse(binString);
//     return payload;
//   } catch (err) {
//     console.error("Invalid token", err);
//     return null;
//   }
// };

// export const useAdminId = () => {
//   const [adminId, setAdminId] = useState(null);

//   useEffect(() => {
//     const updateId = () => {
//       const { token } = getUserSession();
//       if (token) {
//         const decoded = decodeToken(token);
//         if (decoded && decoded.adminId) {
//           setAdminId(decoded.adminId);
//         } else {
//           setAdminId(null);
//         }
//       } else {
//         setAdminId(null);
//       }
//     };

//     updateId();

//     window.addEventListener("session-changed", updateId);
//     return () => window.removeEventListener("session-changed", updateId);
//   }, []);

//   return adminId;
// };

import { useState, useEffect } from "react";

const SESSION_KEYS = {
  USERNAME: "userName",
  ROLE: "role",
  TOKEN: "accessToken",
};

export const setUserSession = (data) => {
  sessionStorage.setItem(SESSION_KEYS.USERNAME, data.username);
  sessionStorage.setItem(SESSION_KEYS.ROLE, data.role);
  sessionStorage.setItem(SESSION_KEYS.TOKEN, data.token);
  window.dispatchEvent(new Event("session-changed"));
};

export const getUserSession = () => {
  return {
    username: sessionStorage.getItem(SESSION_KEYS.USERNAME),
    role: sessionStorage.getItem(SESSION_KEYS.ROLE),
    token: sessionStorage.getItem(SESSION_KEYS.TOKEN),
  };
};

export const clearUserSession = () => {
  Object.values(SESSION_KEYS).forEach((key) =>
    sessionStorage.removeItem(key)
  );
  window.dispatchEvent(new Event("session-changed"));
};

// Decode JWT token
export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const [, payloadBase64] = token.split(".");
    const binString = atob(payloadBase64);
    const payload = JSON.parse(binString);
    return payload;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};

export const useAdminId = () => {
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    const updateId = () => {
      const { token } = getUserSession();
      if (token) {
        const decoded = decodeToken(token);
        if (decoded && decoded.adminId) {
          setAdminId(decoded.adminId);
        } else {
          setAdminId(null);
        }
      } else {
        setAdminId(null);
      }
    };

    updateId();

    window.addEventListener("session-changed", updateId);
    return () => window.removeEventListener("session-changed", updateId);
  }, []);

  return adminId;
};
