import client from "./apiClient";

export const getDrivers = () => {
  return client.get("/drivers");
};
