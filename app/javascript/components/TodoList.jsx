import React from "react"; 

const TodoList = ({ todos, onToggle, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (todos.length === 0) {
    return <p className="text-center text-gray-500 mt-10 italic">No tasks yet. Enjoy your day!</p>;
  }


  return (
    <ul className="space-y-3 mt-4">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={todo.completed || false}
              onChange={() => onToggle(todo)}
              className="h-5 w-5 text-blue-600 rounded cursor-pointer"
            />
            <span className={todo.completed ? "line-through text-gray-400" : "text-gray-700 font-medium"}>
              {todo.title}
            </span>
          </div>

          <button
            onClick={() => {
              onDelete(todo.id);
            }}
            className="text-xs text-gray-800 hover:text-red-500 opacity-400 group-hover:opacity-500 transition-opacity font-semibold animate-pulse"
          >
	     <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
