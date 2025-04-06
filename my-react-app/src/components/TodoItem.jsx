    import { useState } from "react";
    import { motion } from "framer-motion";
    import { FaSpinner } from "react-icons/fa";

    const TodoItem = ({ todo, deleteTodo, updateTodo, toggleComplete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async () => {
        setIsLoading(true);
        await updateTodo(todo.id, editText);
        setIsEditing(false);
        setIsLoading(false);
    };

    const handleDelete = async () => {
        setIsLoading(true);
        // delay sebentar supaya animasi loading sempat muncul
        await new Promise((resolve) => setTimeout(resolve, 500));
        await deleteTodo(todo.id);
        // gak perlu setIsLoading(false) karena item ini kemungkinan unmount setelah dihapus
    };

    return (
        <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`flex justify-between items-center bg-gray-100/20 backdrop-blur-md p-3 rounded shadow ${
            todo.completed ? "opacity-50" : ""
        }`}
        >
        <p className="text-sm text-gray-600">
            Deadline: {todo.due_date ? new Date(todo.due_date).toLocaleDateString() : "Belum ada"}
        </p>
        <div className="flex items-center gap-2 w-full">
            <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleComplete(todo.id)}
            disabled={isLoading}
            />
            {isEditing ? (
            <input
                className="border rounded p-1 w-full"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                disabled={isLoading}
            />
            ) : (
            <span
                className={`w-full ${todo.completed ? "line-through text-gray-500" : ""}`}
            >
                {todo.text}
            </span>
            )}
        </div>
        <div className="flex gap-2 ml-2 items-center">
            {isEditing ? (
            <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-2 py-1 rounded flex items-center gap-1 cursor-pointer"
                disabled={isLoading}
            >
                {isLoading ? <FaSpinner className="animate-spin" /> : "Simpan"}
            </button>
            ) : (
            <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-white px-2 py-1 rounded cursor-pointer"
                disabled={isLoading}
            >
                Edit
            </button>
            )}

            <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1 cursor-pointer"
            disabled={isLoading}
            >
            {isLoading ? <FaSpinner className="animate-spin" /> : "Hapus"}
            </button>
        </div>
        </motion.div>
    );
    };

    export default TodoItem;
