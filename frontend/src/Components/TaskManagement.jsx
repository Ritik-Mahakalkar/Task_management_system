import React, { useEffect, useState } from "react";
import './TaskManagement.css'
import axios from "axios";

const apiUrl = "http://localhost:5000/tasks";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({ id: "", title: "", description: "", status: "Pending", due_date: "" });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(apiUrl);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!task.title || !task.description || !task.due_date) {
      alert("All fields are required.");
      return;
    }
    
    try {
      if (task.id) {
        await axios.put(`${apiUrl}/${task.id}`, task);
      } else {
        await axios.post(apiUrl, task);
      }
      fetchTasks();
      setTask({ id: "", title: "", description: "", status: "Pending", due_date: "" });
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleEdit = (task) => {
    setTask(task);
  };

  const handleDelete = async (id) => {
    if (window.confirm(" you want to delete ?")) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>Task Management System</h2>

      <form className="main-container"  onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", background: "white", padding: "15px", borderRadius: "5px" }}>
        <input type="hidden" name="id" value={task.id} />
        <input type="text" name="title" placeholder="Task Title" value={task.title} onChange={handleChange} required />
        <input type="text" name="description" placeholder="Task Description" value={task.description} onChange={handleChange} required />
        <select name="status" value={task.status} onChange={handleChange}>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <input type="date" name="due_date" value={task.due_date} onChange={handleChange} required />
        <button className="form-btn" type="submit">{task.id ? "Update Task" : "Add Task"}</button>
      </form>

      <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>{t.description}</td>
              <td>{t.status}</td>
              <td>{t.due_date}</td>
              <td>
                <button style={{ color: "blue", margin: "2px", cursor: "pointer" }} onClick={() => handleEdit(t)}><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
<path fill="#E57373" d="M42.583,9.067l-3.651-3.65c-0.555-0.556-1.459-0.556-2.015,0l-1.718,1.72l5.664,5.664l1.72-1.718C43.139,10.526,43.139,9.625,42.583,9.067"></path><path fill="#FF9800" d="M4.465 21.524H40.471999999999994V29.535H4.465z" transform="rotate(134.999 22.469 25.53)"></path><path fill="#B0BEC5" d="M34.61 7.379H38.616V15.392H34.61z" transform="rotate(-45.02 36.61 11.385)"></path><path fill="#FFC107" d="M6.905 35.43L5 43 12.571 41.094z"></path><path fill="#37474F" d="M5.965 39.172L5 43 8.827 42.035z"></path>
</svg></button>
                <button style={{ color: "red", margin: "2px", cursor: "pointer" }} onClick={() => handleDelete(t.id)}><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
<linearGradient id="nyvBozV7VK1PdF3LtMmOna_pre7LivdxKxJ_gr1" x1="18.405" x2="33.814" y1="10.91" y2="43.484" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#32bdef"></stop><stop offset="1" stop-color="#1ea2e4"></stop></linearGradient><path fill="url(#nyvBozV7VK1PdF3LtMmOna_pre7LivdxKxJ_gr1)" d="M39,10l-2.835,31.181C36.072,42.211,35.208,43,34.174,43H13.826	c-1.034,0-1.898-0.789-1.992-1.819L9,10H39z"></path><path fill="#0176d0" d="M32,7c0-1.105-0.895-2-2-2H18c-1.105,0-2,0.895-2,2c0,0,0,0.634,0,1h16C32,7.634,32,7,32,7z"></path><path fill="#007ad9" d="M7,9.886L7,9.886C7,9.363,7.358,8.912,7.868,8.8C10.173,8.293,16.763,7,24,7s13.827,1.293,16.132,1.8	C40.642,8.912,41,9.363,41,9.886v0C41,10.501,40.501,11,39.886,11H8.114C7.499,11,7,10.501,7,9.886z"></path>
</svg></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskManagement;
