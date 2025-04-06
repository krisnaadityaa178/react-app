    import { useState } from "react";
    import './AuthForm.css'

    const AuthForm = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin
        ? "http://localhost:5000/api/login"
        : "http://localhost:5000/api/register";

        try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Terjadi kesalahan");
            return;
        }

        if (isLogin) {
            localStorage.setItem("token", data.token);
            onAuthSuccess();
        } else {
            setIsLogin(true);
            setEmail("");
            setPassword("");
            setError("Registrasi berhasil! Silakan login.");
        }
        } catch (err) {
        setError("Gagal menghubungi server");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center animated-bg">
            <div className="auth-box">
        <div className="backdrop-blur-md bg-white/60 border border-white/30 shadow-2xl rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {isLogin ? "Login" : "Register"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <p className="text-red-700 text-sm bg-red-100 border border-red-300 p-2 rounded">
                {error}
                </p>
            )}
            <input
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded-lg bg-white/90 text-gray-800  placeholder-gray-500 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200 cursor-pointer"
            >
                {isLogin ? "Login" : "Register"}
            </button>
            <p className="text-sm text-center text-gray-700">
                {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
                <span
                className="text-blue-700 font-semibold underline cursor-pointer"
                onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                }}
                >
                {isLogin ? "Register di sini" : "Login di sini"}
                </span>
            </p>
            </form>
        </div>
        </div>
        </div>
    );
    };

    export default AuthForm;
