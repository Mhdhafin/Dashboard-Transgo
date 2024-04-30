import client from "./apiClient";

export const login = (body, customConfig = {}) => {
  return client.post("/auth/login", body, { ...customConfig });
};
