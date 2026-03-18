import axios from './axios.js';

export const registerRequest = (user) => axios.post(`/register`, user);
export const loginRequest = (user) => axios.post(`/login`, user);
export const verifyTokenRequest = () => axios.get(`/verify`);
export const logoutRequest = () => axios.post(`/logout`);

export const getUsuariosRequest = () => axios.get(`/usuarios`);
export const deleteUsuarioRequest = (id) => axios.delete(`/usuario/${id}`);
export const changePasswordRequest = (id, data) => axios.put(`/usuario/${id}/password`, data);

export const backupRequest = () => axios.get("/backup", { responseType: "blob" });
