import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const endpoints = {
  jobs: "/jobs/",
  job: (id) => `/jobs/${id}/`,
  apply: (id) => `/jobs/${id}/apply/`,
  companies: "/companies/",
  company: (id) => `/companies/${id}/`,
  companyJobs: (id) => `/companies/${id}/jobs/`,
  dashboardJobs: "/dashboard/jobs/",
  applicants: (id) => `/dashboard/jobs/${id}/applicants/`,
  register: "/auth/register/",
  login: "/auth/login/",
  profile: "/auth/profile/",
};
