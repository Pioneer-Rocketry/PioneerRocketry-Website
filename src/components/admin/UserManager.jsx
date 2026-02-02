import React, { useState, useEffect } from 'react';
import { apiUrls } from '../../config/api-urls';

const UserManager = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Determines API URL based on environment
    const getApiUrl = () => {
        if (window.location.hostname === 'localhost') {
            return 'http://localhost:8787';
        }
        return apiUrls.url.baseUrl;
    };
    const currentAPIurl = getApiUrl();

    // User Flags Configuration
    const userFlags = [
        { value: 0, label: 'Viewer' },
        { value: 5, label: 'Member' },
        { value: 10, label: 'Helper' },
        { value: 15, label: 'Manage Users' },
        { value: 20, label: 'Admin' },
        { value: 25, label: 'Super Admin' }
    ];

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${currentAPIurl}${apiUrls.url.admin.users.getAll}`, {
                method: apiUrls.methods.admin.users.getAll,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.result && data.result.results) {
                setUsers(data.result.results);
            }
        } catch (error) {
            console.error("Error loading users:", error);
            alert("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) loadUsers();
    }, [token]);

    const handleRoleChange = async (userId, newFlag) => {
        // Optimistic UI update or wait for server? Legacy waited.
        // Let's call server first.
        try {
            const response = await fetch(`${currentAPIurl}${apiUrls.url.admin.users.update}`, {
                method: apiUrls.methods.admin.users.update,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    flag: parseInt(newFlag),
                    id: userId
                })
            });
            const data = await response.json();

            if (data.success) {
                alert("User updated successfully");
                loadUsers(); // Refresh list to confirm
            } else {
                alert("User update incomplete/failed");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Error updating user");
        }
    };

    return (
        <div className="p-6">
            <header className="mb-6">
                <h2 className="text-2xl font-bold text-white">User Management</h2>
                <p className="text-gray-400">Manage user roles and permissions.</p>
            </header>

            {loading ? (
                <div className="text-center text-gray-400">Loading users...</div>
            ) : (
                <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-700 text-gray-300">
                                <tr>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {users.map((user) => {
                                    const currentFlag = Math.trunc(user.flags); // Ensure integer match

                                    return (
                                        <tr key={user.id} className="hover:bg-gray-750">
                                            <td className="p-4 font-medium text-white">{user.name}</td>
                                            <td className="p-4 text-gray-300">{user.email}</td>
                                            <td className="p-4 text-gray-500 font-mono text-xs">{user.id}</td>
                                            <td className="p-4">
                                                <select
                                                    defaultValue={currentFlag}
                                                    id={`role-select-${user.id}`}
                                                    className="bg-gray-900 text-white border border-gray-600 rounded px-2 py-1 focus:border-blue-500 focus:outline-none"
                                                >
                                                    {userFlags.map(flag => (
                                                        <option key={flag.value} value={flag.value}>
                                                            {flag.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        const select = document.getElementById(`role-select-${user.id}`);
                                                        const newFlag = select.value;
                                                        if (newFlag != currentFlag) {
                                                            handleRoleChange(user.id, newFlag);
                                                        }
                                                    }}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                                >
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManager;
