import axios from "axios";

export const userApi = axios.create({
  baseURL: "http://localhost:5000/api/accounts",
});
export const orderApi = axios.create({
  baseURL: "http://localhost:5000/order",
});

export const fileApi = axios.create({
  baseURL: "http://localhost:5000/api",
});
