import { useState } from "react";

const TodoForm = ({ onAdd, isLoading }) => {
	const [title, setTitle] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!title.trim()) return;
		onAdd(title);
		setTitle("");
	};

	return (
		<form onSubmit={handleSubmit} className="flex mb-4">
			<input
				type="text"
				className="border p-2 flex-grow rounded-l focus:ring-2 focus:ring-blue-500 outline-none m-1"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="What needs to be done?"
			/>
			<button
				type="submit"
				disabled={isLoading || !title.trim()}
				className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-500 transition-colors m-1"
			>
				{isLoading ? "..." : "Add"}
			</button>
		</form>
	);
};

export default TodoForm;
