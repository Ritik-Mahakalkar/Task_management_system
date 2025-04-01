const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456789",
    database: "task"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL");
    }
});


app.post("/tasks", (req, res) => {
    const { title, description, status, due_date } = req.body;
    
    if (!title || !description || !status || !due_date) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const query = "INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)";
    db.query(query, [title, description, status, due_date], (err, result) => {
        if (err) {
            console.error("Error adding task:", err);
            return res.status(500).json({ error: "Database error." });
        }
        res.status(201).json({ message: "Task added successfully", taskId: result.insertId });
    });
});


app.get("/tasks", (req, res) => {
    db.query("SELECT * FROM tasks", (err, result) => {
        if (err) {
            console.error("Error fetching tasks:", err);
            return res.status(500).json({ error: "Database error." });
        }
        res.json(result);
    });
});


app.put("/tasks/:id", (req, res) => {
    const { title, description, status, due_date } = req.body;
    const { id } = req.params;

    if (!title || !description || !status || !due_date) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const query = "UPDATE tasks SET title=?, description=?, status=?, due_date=? WHERE id=?";
    db.query(query, [title, description, status, due_date, id], (err, result) => {
        if (err) {
            console.error("Error updating task:", err);
            return res.status(500).json({ error: "Database error." });
        }
        res.json({ message: "Task updated successfully" });
    });
});


app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM tasks WHERE id=?", [id], (err, result) => {
        if (err) {
            console.error("Error deleting task:", err);
            return res.status(500).json({ error: "Database error." });
        }
        res.json({ message: "Task deleted successfully" });
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
