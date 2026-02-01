import React, { useState } from 'react';

const AdminLayout = ({ children, activeTab, setActiveTab, onLogout, userProfile }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
        { id: 'users', label: 'User Management', icon: 'fa-users' },
        { id: 'events', label: 'Event Manager', icon: 'fa-calendar-alt' },
        { id: 'images', label: 'Image Manager', icon: 'fa-images' },
        { id: 'pages', label: 'Page Editor', icon: 'fa-file-alt' },
        { id: 'css', label: 'CSS Manager', icon: 'fa-palette' },
        { id: 'scripts', label: 'Script Manager', icon: 'fa-code' },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 transition-all duration-300 ease-in-out flex flex-col border-r border-gray-700 fixed h-full z-10`}
            >
                <div className="p-4 flex items-center justify-between border-b border-gray-700">
                    <div className={`font-bold text-xl text-blue-500 ${!sidebarOpen && 'hidden'}`}>Admin</div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                    >
                        <i className={`fas ${sidebarOpen ? 'fa-chevron-left' : 'fa-bars'}`}></i>
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-2">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 group
                                        ${activeTab === item.id
                                            ? 'bg-blue-600/20 text-blue-400 border border-blue-600/50'
                                            : 'hover:bg-gray-700/50 text-gray-400 hover:text-gray-100'
                                        }`}
                                >
                                    <i className={`fas ${item.icon} w-6 text-center ${activeTab === item.id ? 'text-blue-400' : 'group-hover:text-white'}`}></i>
                                    <span className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${!sidebarOpen && 'opacity-0 w-0'}`}>
                                        {item.label}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <i className="fas fa-sign-out-alt w-6 text-center"></i>
                        <span className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${!sidebarOpen && 'opacity-0 w-0'}`}>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 bg-gray-900 p-8`}>
                <div className="max-w-7xl mx-auto">
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white capitalize">{activeTab.replace('-', ' ')}</h1>
                            <p className="text-gray-400 mt-1">Manage your website content and settings</p>
                        </div>
                        {userProfile && (
                            <div className="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-full border border-gray-700">
                                <i className="fas fa-user-circle text-2xl text-gray-400"></i>
                                <div className="text-sm">
                                    <p className="text-white font-medium">{userProfile.name || 'Admin User'}</p>
                                    <p className="text-xs text-gray-500">{userProfile.email || ''}</p>
                                </div>
                            </div>
                        )}
                    </header>

                    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden min-h-[600px]">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
