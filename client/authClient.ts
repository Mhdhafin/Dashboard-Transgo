import useAxiosAuth from "@/hooks/axios/use-axios-auth";
import client from "./apiClient";

export const Login = (body, customConfig = {}) => {
  const axiosAuth = useAxiosAuth();

  return axiosAuth.post("/auth/login", body, { ...customConfig });
};
``;
