"use client";
import axios from "axios";
const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
});

client.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default client;
