import client from "./apiClient";

export const getCustomers = () => {
  return client.get("/customers");
};
