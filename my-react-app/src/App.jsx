import { useEffect, useState } from "react";
import axios from "axios";
import AuthForm from "./components/AuthForm";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [todoFiles, setTodoFiles] = useState({}); // ✅ simpan file per todo
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "incomplete") return !todo.completed;
    return true;
  });

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      fetchTodos();
    }
  }, []);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setTodos(res.data);
      res.data.forEach((todo) => {
        fetchFileForTodo(todo.id);
      });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 detik delay
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFileForTodo = async (todoId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/todos/${todoId}/files`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const files = res.data;
      if (files.length > 0) {
        setTodoFiles((prev) => ({ ...prev, [todoId]: files[0] }));
      }
    } catch (err) {
      console.error(`❌ Gagal ambil file untuk todo ${todoId}`, err);
    }
  };

  const handleFileChange = (e, todoId) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [todoId]: e.target.files[0],
    }));
  };

  const handleUpload = async (todoId) => {
    const file = selectedFiles[todoId];
    if (!file) {
      alert("📂 Pilih file dulu sebelum upload!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("todo_id", todoId);

    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("✅ File uploaded:", data.fileUrl);

      setSelectedFiles((prev) => {
        const updated = { ...prev };
        delete updated[todoId];
        return updated;
      });

      // 🆕 Refresh file
      fetchFileForTodo(todoId);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      console.error("❌ Upload error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = (text, dueDate) => {
    axios
      .post(
        "http://localhost:5000/api/todos",
        { text, due_date: dueDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => setTodos([...todos, res.data]))
      .catch((err) => console.error(err));
  };

  const deleteTodo = (id) => {
    axios
      .delete(`http://localhost:5000/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => setTodos(todos.filter((todo) => todo.id !== id)))
      .catch((err) => console.error(err));
  };

  const updateTodo = (id, newText) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);
    axios
      .put(
        `http://localhost:5000/api/todos/${id}`,
        {
          text: newText,
          completed: todoToUpdate.completed,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? { ...todo, text: newText } : todo
        );
        setTodos(updatedTodos);
      })
      .catch((err) => console.error(err));
  };

  const toggleComplete = (id) => {
    const todoToToggle = todos.find((todo) => todo.id === id);
    axios
      .put(
        `http://localhost:5000/api/todos/${id}`,
        {
          text: todoToToggle.text,
          completed: !todoToToggle.completed,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(updatedTodos);
      })
      .catch((err) => console.error(err));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setTodos([]);
  };

  if (!isAuthenticated) {
    return <AuthForm onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  const today = new Date().toISOString().split("T")[0];

  const todayNotifications = todos.filter((todo) => {
    const formattedDueDate = new Date(todo.due_date).toISOString().split("T")[0];
    return formattedDueDate === today && !todo.completed;
  });

  if (!isAuthenticated) {
    return <AuthForm onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-semibold">Memuat data tugas... ⏳</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-5 bg-white/20 backdrop-blur-md shadow-xl rounded-2xl border border-white/30">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">To-Do List</h1>
        <button
          onClick={handleLogout}
          className="rounded px-5 py-2 bg-red-500 text-sm text-white cursor-pointer hover:bg-green-500 transition duration-500"
        >
          Logout
        </button>
      </div>

      {todayNotifications.length > 0 && (
        <div className="bg-yellow-100/70 backdrop-blur-sm border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
          <p className="font-semibold">📢 Tugas Jatuh Tempo Hari Ini:</p>
          <ul className="list-disc list-inside">
            {todayNotifications.map((todo) => (
              <li key={todo.id}>{todo.text}</li>
            ))}
          </ul>
        </div>
      )}

      <TodoForm addTodo={addTodo} />

      <div className="flex justify-center gap-4 mt-4">
        {["all", "completed", "incomplete"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 rounded ${
              filter === type
                ? type === "completed"
                  ? "bg-green-500 text-white"
                  : type === "incomplete"
                  ? "bg-red-500 text-white"
                  : "bg-blue-500 text-white"
                : "bg-gray-200 cursor-pointer"
            }`}
          >
            {type === "all" ? "Semua" : type === "completed" ? "Selesai" : "Belum Selesai"}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {filteredTodos.length === 0 ? (
          <p className="text-center text-gray-300">Tidak ada tugas, ayo tambahkan!</p>
        ) : (
          filteredTodos.map((todo) => (
            <div key={todo.id} className="bordered p-3 rounded shadow-sm">
              <TodoItem
                todo={todo}
                deleteTodo={deleteTodo}
                updateTodo={updateTodo}
                toggleComplete={toggleComplete}
              />

              <div className="mt-2">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, todo.id)}
                />
                <button
                  onClick={() => handleUpload(todo.id)}
                  className="ml-2 px-4 py-1 bg-emerald-400 text-white rounded hover:bg-emerald-600 transition cursor-pointer"
                >
                  Upload File
                </button>
              </div>

              {todoFiles[todo.id] && (
                <div className="mt-2">
                  <a
                    href={`http://localhost:5000${todoFiles[todo.id].file_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    <button className="cursor-pointer bg-white relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-cyan-700 hover:text-white h-9 px-3">
                        <svg className="lucide lucide-newspaper text-blue-400 dark:text-blue-600" strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="#60A5FA" fill="none" viewBox="0 0 24 24" height={22} width={22} xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                          <path d="M18 14h-8" />
                          <path d="M15 18h-5" />
                          <path d="M10 6h8v4h-8V6Z" />
                        </svg>
                            Lihat File
                  </button>
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
