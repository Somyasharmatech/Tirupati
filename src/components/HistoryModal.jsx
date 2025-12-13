import React from 'react';

const HistoryModal = ({ isOpen, onClose, history }) => {
    const [searchTerm, setSearchTerm] = React.useState('');

    if (!isOpen) return null;

    const filteredHistory = history.filter(record =>
        record.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b bg-indigo-50 border-indigo-100 flex justify-between items-center gap-4">
                    <h2 className="text-xl font-bold text-indigo-800 whitespace-nowrap">
                        Booking History
                    </h2>

                    <div className="flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search by Guest Name or Room..."
                            className="w-full px-4 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <button
                        onClick={onClose}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        Close
                    </button>
                </div>

                <div className="overflow-auto p-4 flex-1">
                    {filteredHistory.length === 0 ? (
                        <div className="text-center text-slate-500 py-8">
                            {searchTerm ? 'No matching records found.' : 'No history available yet.'}
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm text-slate-700">
                            <thead className="bg-slate-50 text-slate-900 border-b">
                                <tr>
                                    <th className="p-3 font-semibold">Room</th>
                                    <th className="p-3 font-semibold">Guest Name</th>
                                    <th className="p-3 font-semibold">Price</th>
                                    <th className="p-3 font-semibold">Check In</th>
                                    <th className="p-3 font-semibold">Check Out</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredHistory.map((record) => (
                                    <tr key={record.id} className="hover:bg-slate-50">
                                        <td className="p-3 font-medium text-slate-900">{record.roomNumber}</td>
                                        <td className="p-3">{record.guestName}</td>
                                        <td className="p-3">₹{record.price}</td>
                                        <td className="p-3">{new Date(record.checkInTime).toLocaleString()}</td>
                                        <td className="p-3">{new Date(record.checkOutTime).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;
