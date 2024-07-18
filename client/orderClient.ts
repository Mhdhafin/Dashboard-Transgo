import client from "./apiClient";

export const getOrders = () => {
  return client.get("/orders");
};
