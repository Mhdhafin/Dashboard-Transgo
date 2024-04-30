import axios from "axios";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  headers: {
    Accept: "application/json",
  },
});

export default client;
