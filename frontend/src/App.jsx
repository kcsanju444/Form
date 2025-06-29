import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (editingId) {
        await axios.put(API_URL, { id: editingId, ...form });
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ name: "", email: "" });
      setEditingId(null);
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data || "Operation failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditingId(user._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    setIsLoading(true);
    setError(null);
    try {
      await axios.delete(API_URL, { data: { id } });
      await fetchUsers();
    } catch (err) {
      setError("Failed to delete user. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>User Management</h1>
          <p>Register and manage your users</p>
        </div>
      </header>

      <main className="app-main">
        <div className="form-container">
          <div className="form-card">
            <h2>{editingId ? "Update User" : "Add New User"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                  disabled={isLoading}
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="form-actions">
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="spinner"></span>
                  ) : editingId ? (
                    "Update User"
                  ) : (
                    "Register User"
                  )}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => {
                      setEditingId(null);
                      setForm({ name: "", email: "" });
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="users-container">
          <div className="users-header">
            <h2>Registered Users</h2>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="users-list">
            {isLoading && users.length === 0 ? (
              <div className="loading">Loading users...</div>
            ) : error && users.length === 0 ? (
              <div className="error-message">{error}</div>
            ) : filteredUsers.length === 0 ? (
              <div className="empty-state">
                {searchTerm ? "No matching users found" : "No users registered yet"}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user._id} className="user-card">
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                  <div className="user-actions">
                    <button
                      onClick={() => handleEdit(user)}
                      className="edit-btn"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="delete-btn"
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .app {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background-color: #f5f7fa;
        }

        .app-header {
          background-color: #4361ee;
          color: white;
          padding: 1.5rem 2rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .header-content h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .header-content p {
          opacity: 0.9;
        }

        .app-main {
          display: flex;
          flex: 1;
          overflow: hidden;
          padding: 2rem;
          gap: 2rem;
        }

        .form-container {
          flex: 0 0 400px;
          height: 100%;
        }

        .form-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          height: 100%;
        }

        .form-card h2 {
          margin-bottom: 1.5rem;
          color: #333;
          font-size: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #eee;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #555;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #4361ee;
          box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .primary-btn {
          background-color: #4361ee;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 150px;
        }

        .primary-btn:hover {
          background-color: #3a56d4;
        }

        .primary-btn:disabled {
          background-color: #aaa;
          cursor: not-allowed;
        }

        .secondary-btn {
          background-color: white;
          color: #4361ee;
          border: 1px solid #4361ee;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .secondary-btn:hover {
          background-color: #f0f4ff;
        }

        .secondary-btn:disabled {
          color: #aaa;
          border-color: #aaa;
          cursor: not-allowed;
        }

        .users-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .users-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .users-header h2 {
          font-size: 1.5rem;
          color: #333;
        }

        .search-box input {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          border-radius: 20px;
          min-width: 250px;
        }

        .users-list {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 2rem;
        }

        .user-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem;
          margin-bottom: 1rem;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .user-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .user-info h3 {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
          color: #333;
        }

        .user-info p {
          color: #666;
          font-size: 0.9rem;
        }

        .user-actions {
          display: flex;
          gap: 0.75rem;
        }

        .edit-btn {
          background-color: white;
          color: #4361ee;
          border: 1px solid #4361ee;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-btn:hover {
          background-color: #f0f4ff;
        }

        .edit-btn:disabled {
          color: #aaa;
          border-color: #aaa;
          cursor: not-allowed;
        }

        .delete-btn {
          background-color: white;
          color: #f72585;
          border: 1px solid #f72585;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .delete-btn:hover {
          background-color: #fff0f6;
        }

        .delete-btn:disabled {
          color: #aaa;
          border-color: #aaa;
          cursor: not-allowed;
        }

        .error-message {
          color: #f72585;
          background-color: #fff0f6;
          padding: 1rem;
          border-radius: 6px;
          margin: 1rem 0;
          border-left: 4px solid #f72585;
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
          color: #666;
          font-size: 1.1rem;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 992px) {
          .app-main {
            flex-direction: column;
            padding: 1rem;
          }

          .form-container {
            flex: 0 0 auto;
            width: 100%;
          }

          .users-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .search-box input {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default App;