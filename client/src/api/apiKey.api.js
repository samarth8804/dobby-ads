import axiosInstance from "./axios";

export const apiKeyApi = {
  list: () => axiosInstance.get("/keys"),
  create: (payload) => axiosInstance.post("/keys", payload),
  revoke: (id) => axiosInstance.delete(`/keys/${id}`),
};
