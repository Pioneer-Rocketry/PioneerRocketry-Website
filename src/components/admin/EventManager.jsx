import React, { useState } from 'react';
import CreateEventModal from './CreateEventModal';

const EventManager = ({ events, loading, onCreateEvent, onDeleteEvent }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Upcoming Events</h3>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg shadow-green-500/20"
                >
                    <i className="fas fa-plus mr-2"></i>
                    Add Event
                </button>
            </div>

            <CreateEventModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={onCreateEvent}
            />

            {events.length === 0 ? (
                <div className="text-center text-gray-500 py-12 bg-gray-700/30 rounded-lg">
                    <i className="fas fa-calendar-times text-4xl mb-3"></i>
                    <p>No events found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-300 whitespace-nowrap">
                        <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3 rounded-tl-lg">Title</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 rounded-tr-lg text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {events.map((ev) => (
                                <tr key={ev.id} className="bg-gray-800 hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{ev.title}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span>{new Date(ev.start).toLocaleDateString()}</span>
                                            <span className="text-xs text-gray-500">{new Date(ev.start).toLocaleTimeString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                            ${new Date(ev.start) > new Date()
                                                ? 'bg-blue-900 text-blue-200'
                                                : 'bg-gray-600 text-gray-300'
                                            }`}>
                                            {new Date(ev.start) > new Date() ? 'Upcoming' : 'Past'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-400 hover:text-blue-300 mr-3">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => onDeleteEvent(ev.id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EventManager;
