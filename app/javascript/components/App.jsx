import { useCallback, useEffect, useState } from "react";
import api from "../utils/api";
import Login from "./Login";
import Register from "./Register";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

const App = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(
		!!localStorage.getItem("token"),
	);
	const [authMode, setAuthMode] = useState("login");
	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	// 1. Stabilize logout so it can be safely used in other stabilized functions
	const handleLogout = useCallback(() => {
		localStorage.removeItem("token");
		setIsAuthenticated(false);
		setTodos([]);
	}, []);

	// 2. Wrap fetchTodos in useCallback to prevent re-render loops
	const fetchTodos = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const { data } = await api.get("/api/v1/todos");
			setTodos(data);
		} catch (err) {
			if (err.response?.status === 401) {
				handleLogout();
			} else {
				setError("Could not load todos.");
			}
		} finally {
			setIsLoading(false);
		}
	}, [handleLogout]); // Depends on the stable handleLogout

	const handleAddTodo = async (title) => {
		try {
			const { data } = await api.post("/api/v1/todos", { title });
			setTodos((prev) => [data, ...prev]);
		} catch (_err) {
			setError("Failed to add task.");
		}
	};

	const handleToggleTodo = async (todo) => {
		try {
			const { data } = await api.patch(`/api/v1/todos/${todo.id}`, {
				completed: !todo.completed,
			});
			setTodos((prev) => prev.map((t) => (t.id === data.id ? data : t)));
		} catch (_err) {
			setError("Failed to update task.");
		}
	};

	const handleDeleteTodo = async (id) => {
		try {
			await api.delete(`/api/v1/todos/${id}`);
			setTodos((prev) => prev.filter((todo) => todo.id !== id));
		} catch (err) {
			console.error("Delete failed:", err);
			setError("Could not delete task.");
		}
	};

	useEffect(() => {
		if (isAuthenticated) {
			fetchTodos();
		}
	}, [isAuthenticated, fetchTodos]); // fetchTodos is now stable

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				{authMode === "login" ? (
					<Login
						onLoginSuccess={() => setIsAuthenticated(true)}
						onSwitchToRegister={() => setAuthMode("register")}
					/>
				) : (
					<Register
						onRegisterSuccess={() => setIsAuthenticated(true)}
						onSwitchToLogin={() => setAuthMode("login")}
					/>
				)}
			</div>
		);
	}

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-2xl border border-gray-100">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-extrabold text-gray-800">Tasks</h1>
				<button
					type="button" // 3. Changed from "submit" to "button"
					onClick={handleLogout}
					className="text-sm text-gray-400 hover:text-red-500 transition-colors"
				>
					Logout
				</button>
			</div>

			<TodoForm onAdd={handleAddTodo} isLoading={isLoading} />

			{error && (
				<div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
					{error}
				</div>
			)}

			<TodoList
				todos={todos}
				onToggle={handleToggleTodo}
				onDelete={handleDeleteTodo}
				isLoading={isLoading}
			/>
		</div>
	);
};

export default App;
