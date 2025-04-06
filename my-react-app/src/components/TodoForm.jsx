import { useState } from "react";

const TodoForm = ({ addTodo }) => {
    const [task, setTask] = useState("");
    const [dueDate, setDueDate] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!task.trim()) return;
        console.log("🎯 Kirim todo:", { text: task, due_date: dueDate });
        addTodo(task, dueDate);
        setTask("");
        setDueDate("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                className="border p-2 rounded w-full"
                placeholder="Tambah tugas..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
            />
            <input
                type="date"
                className="border p-2 rounded w-full"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                Tambah
            </button>
                
        </form>
    );
};


export default TodoForm;