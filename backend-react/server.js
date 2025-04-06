const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const SECRET_KEY = "rahasia-banget";

const app = express();
const PORT = 5000;

// PostgreSQL connection
const pool = new Pool({
    user: "postgres",        
    host: "localhost",
    database: "my_todos",      
    password: "root123",     
    port: 5432,
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Autentikasi token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
    });
};

import fs from 'fs';
import path from 'path';


// DELETE /tasks/:id
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;

    try {
    const result = await db.query('SELECT file_url FROM tasks WHERE id = $1', [id]);
    const filePath = result.rows[0]?.file_url;

    if (filePath) {
      // Hapus file dari folder
        fs.unlink(path.join(__dirname, 'uploads', path.basename(filePath)), (err) => {
        if (err) console.error('Gagal hapus file:', err);
        });
    }

    await db.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ message: 'Tugas dan file berhasil dihapus!' });
    } catch (err) {
    res.status(500).json({ error: 'Gagal hapus tugas' });
    }
});


// File Upload
const uploadFolder = "uploads/";
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.post("/api/upload", authenticateToken, upload.single("file"), async (req, res) => {
    const { todo_id } = req.body;

    if (!req.file || !todo_id) {
        return res.status(400).json({ message: "File atau todo_id tidak lengkap!" });
    }
    const fileName = req.file.originalname;
    const filePath = `/uploads/${req.file.filename}`;
    try {
        // Simpan ke tabel files (untuk histori / pengarsipan)
        await pool.query(
            "INSERT INTO files (todo_id, file_name, file_url) VALUES ($1, $2, $3)",
            [todo_id, fileName, filePath]
        );
        // Update juga ke kolom file_url pada todos
        await pool.query(
            "UPDATE todos SET file_url = $1 WHERE id = $2",
            [filePath, todo_id]
        );
        res.status(200).json({ fileUrl: filePath, message: "Upload sukses!" });
    } catch (err) {
        console.error("❌ Gagal menyimpan file:", err);
        res.status(500).json({ message: "Server error saat simpan file" });
    }
});


// Endpoint Ambil File
app.get("/api/todos/:id/files", authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "SELECT * FROM files WHERE todo_id = $1",
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("❌ Gagal ambil file:", err);
        res.status(500).json({ message: "Gagal ambil file" });
    }
});


// Hapus File Upload Endpoint
app.delete("/api/files/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const fileRes = await pool.query("SELECT file_url FROM files WHERE id = $1", [id]);
        const filePath = fileRes.rows[0]?.file_url;
        if (filePath) {
            fs.unlinkSync(path.join(__dirname, filePath));
        }
        await pool.query("DELETE FROM files WHERE id = $1", [id]);
        res.json({ message: "File berhasil dihapus" });
    } catch (err) {
        console.error("❌ Gagal hapus file:", err);
        res.status(500).json({ message: "Server error saat hapus file" });
    }
});


// Register dan Login 
app.post("/api/register", async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
        [email, hashedPassword]
        );
        res.status(201).json({ message: "Registrasi Berhasil" });
    } catch (err) {
        res.status(400).json({ message: "Email Sudah Terdaftar!" });
    }
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Email tidak ditemukan" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Password salah" });
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1d" });
    res.json({ token });
});

app.get("/api/todos", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const result = await pool.query(
      "SELECT * FROM todos WHERE user_id = $1 ORDER BY id ASC",
    [userId]
    );
    res.json(result.rows);
});

//due date 
app.post("/api/todos", authenticateToken, async (req, res) => {
    const { text, due_date } = req.body;
    const userId = req.user.userId;
    
        try {
        const newTodo = await pool.query(
            "INSERT INTO todos (user_id, text, due_date, completed) VALUES ($1, $2, $3, $4) RETURNING *",
            [userId, text, due_date, false]
        );
        res.json(newTodo.rows[0]);
        } catch (err) {
        console.error("❌ Error saat insert todo:", err);
        res.status(500).send("Server Error");
        }
    });

app.put("/api/todos/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;
    await pool.query(
        "UPDATE todos SET text = $1, completed = $2 WHERE id = $3",
        [text, completed, id]
    );
    res.json({ success: true });
});

app.delete("/api/todos/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM todos WHERE id = $1", [id]);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});