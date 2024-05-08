import client from "./apiClient";

export const getRequests = () => {
  return client.get("/requests");
};
