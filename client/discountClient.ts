import client from "./apiClient";

export const getDiscount = () => {
    return client.get("/discount");
};
