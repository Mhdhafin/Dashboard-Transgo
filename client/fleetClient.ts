import client from "./apiClient";

export const getFleets = () => {
  return client.get("/fleets");
};
