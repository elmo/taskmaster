// app/javascript/utils/api.js
import axios from "axios";

console.log("Current API_URL Environment Variable:", window.ENV?.API_URL);

const api = axios.create({
	baseURL: window.ENV?.API_URL || "https://127.0.0.1:3000",
	headers: {
		"Content-Type": "application/json",
		"X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')?.content,
	},
});

// The "Interceptor": This runs automatically before EVERY request
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export default api;
