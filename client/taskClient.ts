import client from "./apiClient";

export const getRequestTask = () => {
  return client.get("");
};
