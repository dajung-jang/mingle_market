import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export const productApi = {
  getAll: () => axios.get(`${BASE_URL}/products`),
  getById: (id) => axios.get(`${BASE_URL}/products/${id}`),
  add: (product) => axios.post(`${BASE_URL}/products`, product),
  update: (id, product) => axios.put(`${BASE_URL}/products/${id}`, product),
  delete: (id) => axios.delete(`${BASE_URL}/products/${id}`),
};