import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000"; // Change if backend uses a different port

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      alert("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(API_URL, { id: editingId, ...form });
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ name: "", email: "" });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data || "Operation failed");
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditingId(user._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(API_URL, { data: { id } });
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", textAlign: "center" }}>
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          style={{ width: "100%", margin: "8px 0", padding: "8px" }}
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          style={{ width: "100%", margin: "8px 0", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          {editingId ? "Update" : "Register"}
        </button>
      </form>

      <h3>Registered Users</h3>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((user) => (
            <li key={user._id} style={{ marginBottom: "12px" }}>
              <strong>{user.name}</strong> — {user.email}
              <br />
              <button onClick={() => handleEdit(user)} style={{ margin: "5px" }}>
                Edit
              </button>
              <button onClick={() => handleDelete(user._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
