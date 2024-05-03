import client from "./apiClient";

export const getDrivers = () => {
  return client.get("/drivers");
};

export const getDriverDetail = (id: number) => {
  return client.get(`/drivers/${id}`);
};

export const postDriver = (body: any) => {
  console.log("bod", body);
  return client.post("/drivers", body);
};

export const editDriver = (id: number, body: any) => {
  return client.put(`/drivers/${id}`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteDriver = (id: number) => {
  return client.delete(`/drivers/${id}`);
};
