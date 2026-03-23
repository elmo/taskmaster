// app/javascript/components/Login.jsx
import { useState } from "react";
import api from "../../utils/api";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const LOGIN_MUTATION = `
    mutation LoginUser($email: String!, $password: String!) {
    loginUser(input: { email: $email, password: $password }) {
      token
      user { email }
      errors
    }
  }
`;

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const response = await api.post("/graphql", {
      query: LOGIN_MUTATION,
      operationName: "LoginUser",
      variables: { email, password }
    });

    // Axios gives you 'data'. GraphQL puts its result inside 'data.data'.
    const graphQLResponse = response.data;

    // Check for GraphQL syntax/schema errors first
    if (graphQLResponse.errors) {
      setError(graphQLResponse.errors[0].message);
      return;
    }

    const result = graphQLResponse.data?.loginUser;

    if (result?.token) {
      localStorage.setItem("token", result.token);
      onLoginSuccess();
    } else {
      // This handles "Invalid email/password" from your Ruby resolve method
      setError(result?.errors?.join(", ") || "Invalid credentials.");
    }
  } catch (err) {
    // This handles network 500 errors or timeout issues
    setError("Server connection failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
		<div className="max-w-md mx-auto mt-0 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
			<div className="text-center mb-8">
				<h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
				<p className="text-gray-500 mt-2">Sign in to manage your tasks</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-5">
				<div>
					<label
						htmlFor="email-input"
						className="block text-sm font-semibold text-gray-700 mb-1"
					>
						Email Address
					</label>
					<input
						id="email-input"
						type="email"
						className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
						placeholder="name@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>

				<div>
					<label
						htmlFor="password-input"
						className="block text-sm font-semibold text-gray-700 mb-1"
					>
						Password
					</label>
					<input
						id="password-input"
						type="password"
						className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
						placeholder="••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

				{error && (
					<div
						role="alert"
						className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100"
					>
						⚠️ {error}
					</div>
				)}

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex justify-center items-center disabled:bg-blue-300"
				>
					{loading ? "Signing in..." : "Sign In"}
				</button>
			</form>
		</div>

  );
};

export default Login;

