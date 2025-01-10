import axios from "axios";

// Use the environment variable for the base URL
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export const fetchUsers = () => API.get("/users");
