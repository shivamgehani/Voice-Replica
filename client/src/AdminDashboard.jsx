import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboardPage.css"; // Add your CSS for styling

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
    const [editUser, setEditUser] = useState({ id: null, name: "", email: "", password: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [showUsers, setShowUsers] = useState(false); // State to control user list visibility
    const [showAddUserForm, setShowAddUserForm] = useState(false); // State to control add user form visibility
    const [showFeedbacks, setShowFeedbacks] = useState(false); // State to control feedback list visibility
    const [feedbacks, setFeedbacks] = useState([]); // State to store feedbacks
    const navigate = useNavigate();

    // Fetch all users on component mount
    useEffect(() => {
        if (showUsers) {
            fetchUsers();
        }
    }, [showUsers]);

    // Fetch all feedbacks on component mount
    useEffect(() => {
        if (showFeedbacks) {
            fetchFeedbacks();
        }
    }, [showFeedbacks]);

    // Fetch users from the backend
    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3001/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    // Fetch feedbacks from the backend
    // Fetch feedbacks from the backend
const fetchFeedbacks = async () => {
    try {
        console.log("Fetching feedbacks..."); // Debugging
        const response = await axios.get("http://localhost:3001/admin/feedbacks");
        console.log("Feedbacks fetched:", response.data); // Debugging
        setFeedbacks(response.data);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
    }
};
    // Add a new user
    const addUser = async () => {
        try {
            const response = await axios.post("http://localhost:3001/register", newUser);
            setUsers([...users, response.data]);
            setNewUser({ name: "", email: "", password: "" }); // Reset form
            alert("User added successfully!");
            setShowAddUserForm(false); // Hide the add user form after successful addition
        } catch (error) {
            console.error("Error adding user:", error);
            alert("Failed to add user. Please try again.");
        }
    };

    // Update an existing user
    const updateUser = async () => {
        try {
            const response = await axios.put(`http://localhost:3001/users/${editUser.id}`, editUser);
            setUsers(users.map((user) => (user._id === editUser.id ? response.data : user)));
            setIsEditing(false);
            setEditUser({ id: null, name: "", email: "", password: "" }); // Reset form
            alert("User updated successfully!");
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user. Please try again.");
        }
    };

    // Delete a user
    const deleteUser = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3001/users/${id}`);
                setUsers(users.filter((user) => user._id !== id)); // Use _id for MongoDB
                alert("User deleted successfully!");
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user. Please try again.");
            }
        }
    };

    // Handle form input changes
    const handleInputChange = (e, isNewUser = true) => {
        const { name, value } = e.target;
        if (isNewUser) {
            setNewUser({ ...newUser, [name]: value });
        } else {
            setEditUser({ ...editUser, [name]: value });
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newUser.name || !newUser.email || !newUser.password) {
            alert("All fields are required!");
            return;
        }
        if (isEditing) {
            updateUser();
        } else {
            addUser();
        }
    };

    // Handle edit button click
    const handleEdit = (user) => {
        setIsEditing(true);
        setEditUser({ id: user._id, name: user.name, email: user.email, password: "" }); // Use _id for MongoDB
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("adminToken"); // Clear any stored token
        navigate("/login"); // Redirect to login page
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            {/* Logout Button */}
            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>

            {/* Buttons to show users, add user, and feedbacks */}
            <div className="action-buttons">
                <button onClick={() => setShowUsers(!showUsers)}>
                    {showUsers ? "Hide Users" : "Show Users"}
                </button>
                <button onClick={() => setShowAddUserForm(!showAddUserForm)}>
                    {showAddUserForm ? "Cancel Add User" : "Add User"}
                </button>
                <button onClick={() => setShowFeedbacks(!showFeedbacks)}>
                    {showFeedbacks ? "Hide Feedbacks" : "Show Feedbacks"}
                </button>
            </div>

            {/* Add User Form */}
            {showAddUserForm && (
                <form onSubmit={handleSubmit} className="user-form">
                    <h2>Add User</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={newUser.name}
                        onChange={(e) => handleInputChange(e, true)}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => handleInputChange(e, true)}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => handleInputChange(e, true)}
                        required
                    />
                    <button type="submit">Add User</button>
                </form>
            )}

            {/* Users List */}
            {showUsers && (
                <div className="users-list">
                    <h2>Users</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}> {/* Use _id for MongoDB */}
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        
                                        <button onClick={() => deleteUser(user._id)}>Delete</button> {/* Use _id for MongoDB */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Feedbacks List */}
            {showFeedbacks && (
                <div className="feedbacks-list">
                    <h2>Feedbacks</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Feedback</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbacks.map((feedback) => (
                                <tr key={feedback._id}>
                                    <td>{feedback.feedback}</td>
                                    <td>{new Date(feedback.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;