import client from "./apiClient";

export const getCustomers = () => {
  return client.get("/customers");
};

export const getCustomersDetail = (id: number) => {
  return client.get(`/customers/${id}`);
};

export const postCustomer = (body) => {
  return client.post("/customers", body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const editCustomer = (id: number, body) => {
  return client.put(`/customers/${id}`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteCustomer = (id: number) => {
  return client.delete(`/customers/${id}`);
};
