import React, { useState } from "react";
import "./App.css"; // styling

const initialState = [
  {
    id: 1,
    title: "Answer the void",
    completed: false,
  },
  {
    id: 2,
    title: "Avoid the void",
    completed: false,
  },

];

const TodoList = () => {
  const [todos, setTodos] = useState(initialState);
  const [newTodo, setNewTodo] = useState("");
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState("");

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos([{ id: Date.now(), title: newTodo, completed: false }, ...todos]);
    setNewTodo("");
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id) => {
    const todo = todos.find((todo) => todo.id === id);
    setEditing(id);
    setEditText(todo.title);
  };

  const saveEdit = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, title: editText } : todo
      )
    );
    setEditing(null);
    setEditText("");
  };

  return (
    <div className="todo-list-container">
      <h1>Todo List</h1>
      <div className="todo-input">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            {editing === todo.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => saveEdit(todo.id)}>Save</button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                />
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                >
                  {todo.title}
                </span>
                <button
                  onClick={() => editTodo(todo.id)}
                  disabled={editing === todo.id}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  disabled={!todo.completed}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
