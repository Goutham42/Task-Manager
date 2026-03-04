// src/api.ts
import axios from "axios";

export const API = "/server/task_app_function";

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const TASKS_URL = "/tasks";

// src/api.ts
export const LOGIN_URL =
  "/__catalyst/auth/login?redirect=/app/";