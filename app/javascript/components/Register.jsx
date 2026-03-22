import { useState } from "react";
import api from "../utils/api";

const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
	const [formData, setFormData] = useState({
		email_address: "",
		password: "",
		password_confirmation: "",
	});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (formData.password !== formData.password_confirmation) {
			setError("Passwords do not match.");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const { data } = await api.post("/api/v1/users", { user: formData });
			localStorage.setItem("token", data.token);
			onRegisterSuccess();
		} catch (err) {
			const messages = err.response?.data?.errors;
			setError(
				Array.isArray(messages) ? messages.join(", ") : "Registration failed.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-0 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
			<div className="text-center mb-8">
				<h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
				<p className="text-gray-500 mt-2">
					Join us to start organizing your day
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-5">
				<div>
					<label
						htmlFor="email_address"
						className="block text-sm font-semibold text-gray-700 mb-1"
					>
						Email Address
					</label>
					<input
						id="email_address" // FIXED: Added ID to match label htmlFor
						name="email_address"
						type="email"
						className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
						placeholder="name@example.com"
						value={formData.email_address}
						onChange={handleChange}
						required
					/>
				</div>

				<div>
					<label
						htmlFor="password"
						className="block text-sm font-semibold text-gray-700 mb-1"
					>
						Password
					</label>
					<input
						id="password" // FIXED: Added ID to match label htmlFor
						name="password"
						type="password"
						className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
						placeholder="Min 6 characters"
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>

				<div>
					<label
						htmlFor="password_confirmation"
						className="block text-sm font-semibold text-gray-700 mb-1"
					>
						Confirm Password
					</label>
					<input
						id="password_confirmation" // FIXED: Added ID to match label htmlFor
						name="password_confirmation"
						type="password"
						className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
						placeholder="Repeat password"
						value={formData.password_confirmation}
						onChange={handleChange}
						required
					/>
				</div>

				{error && (
					<div
						role="alert"
						className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100"
					>
						<span aria-hidden="true">⚠️</span> {error}
					</div>
				)}

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex justify-center items-center disabled:bg-blue-300"
				>
					{loading ? (
						<>
							<svg
								className="animate-spin h-5 w-5 mr-3 text-white"
								viewBox="0 0 24 24"
							>
								<title>Register button</title>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
									fill="none"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							Creating Account...
						</>
					) : (
						"Register"
					)}
				</button>
			</form>

			<div className="mt-8 pt-6 border-t border-gray-100 text-center">
				<p className="text-sm text-gray-600">
					Already have an account?{" "}
					<button
						type="button"
						onClick={onSwitchToLogin}
						className="text-blue-600 hover:text-blue-800 font-bold transition-colors underline-offset-4 hover:underline"
					>
						Sign in here
					</button>
				</p>
			</div>
		</div>
	);
};

export default Register;
