import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // load tasks from local storage
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [newTask, setNewTask] = useState({ name: "", description: "", priority: "Low", dueDate: "", status: "To Do" });
  const [filter, setFilter] = useState("All"); // task filter
  const [sortOrder, setSortOrder] = useState("None"); // sorting state

  // save tasks to local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // handle input changes
  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  // add task
  const addTask = () => {
    if (!newTask.name.trim()) return;
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
    setNewTask({ name: "", description: "", priority: "Low", dueDate: "", status: "To Do" });
  };

  // delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // update task Status
  const updateTaskStatus = (id, newStatus) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, status: newStatus } : task)));
  };

  // function to get priority-based background colors
  const getPriorityColor = (priority) => {
    if (priority === "High") return "rgba(255, 0, 0, 0.2)"; // Red
    if (priority === "Medium") return "rgba(255, 165, 0, 0.2)"; // Orange
    return "rgba(144, 238, 144, 0.2)"; // Green
  };

  // function to check due date status
  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return "";
    const today = new Date().toISOString().split("T")[0];
    if (dueDate < today) return "❗ Overdue";
    if (dueDate === today) return "⚠ Due Today";
    return "";
  };

  // sort tasks based on priority
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    if (sortOrder === "High") return priorityOrder[b.priority] - priorityOrder[a.priority];
    if (sortOrder === "Low") return priorityOrder[a.priority] - priorityOrder[b.priority];
    return 0;
  });

  return (
    <div className="container">
      <h1>Task Manager</h1>

      {/* task input form */}
<div className="input-group">
  <input type="text" name="name" value={newTask.name} onChange={handleChange} placeholder="Task Name" required />
  <textarea name="description" value={newTask.description} onChange={handleChange} placeholder="Task Description"></textarea>
  <select name="priority" value={newTask.priority} onChange={handleChange}>
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
  </select>
  <input type="date" name="dueDate" value={newTask.dueDate} onChange={handleChange} />
  <button onClick={addTask}>Add Task</button>
</div>


      {/* filters */}
      <div>
        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Tasks</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <select onChange={(e) => setSortOrder(e.target.value)}>
          <option value="None">Sort by Priority</option>
          <option value="High">High to Low</option>
          <option value="Low">Low to High</option>
        </select>
      </div>

      {/* task list */}
      {sortedTasks
        .filter((task) => filter === "All" || task.status === filter)
        .map((task) => (
          <div key={task.id} className="task" style={{ backgroundColor: getPriorityColor(task.priority) }}>
            <h3>{task.name}</h3>
            <p>{task.description}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Due Date:</strong> {task.dueDate} <span style={{ color: "red" }}>{getDueDateStatus(task.dueDate)}</span></p>
            <p><strong>Status:</strong> {task.status}</p>
            <select value={task.status} onChange={(e) => updateTaskStatus(task.id, e.target.value)}>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <button onClick={() => deleteTask(task.id)} style={{ marginLeft: "10px", color: "red" }}>Delete</button>
          </div>
      ))}
    </div>
  );
}

export default App;
