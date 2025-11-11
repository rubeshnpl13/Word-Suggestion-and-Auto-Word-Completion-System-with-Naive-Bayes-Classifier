import http from "api/http.api";

export const register = (data) => {
  return http.post(`/register`, data);
};

export const login = (credential) => {
  return http.post(`/login`, credential);
};
