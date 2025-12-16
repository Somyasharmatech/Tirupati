import React, { useState, useEffect } from 'react';

function RevenueModal({ isOpen, onClose, getRevenueForDate }) {
    // Default to local date YYYY-MM-DD
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
    const [data, setData] = useState({ total: 0, records: [] });

    useEffect(() => {
        const fetchRevenue = async () => {
            if (isOpen) {
                const revenueData = await getRevenueForDate(selectedDate);
                setData(revenueData);
            }
        };
        fetchRevenue();
    }, [selectedDate, isOpen, getRevenueForDate]);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 bg-indigo-600 text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold">Daily Revenue Report</h2>
                    <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded-md transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Filters & Total */}
                <div className="p-6 bg-slate-50 border-b border-slate-200">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <label htmlFor="report-date" className="text-sm font-medium text-slate-700">Date:</label>
                            <input
                                type="date"
                                id="report-date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                        </div>

                        <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-slate-200">
                            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Total Revenue</p>
                            <p className="text-2xl font-bold text-green-600">₹{data.total.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {data.records.length > 0 ? (
                        <div className="overflow-hidden bg-white border border-slate-200 rounded-lg shadow-sm">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Room</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Entry No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Guest</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Source</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {data.records.map((record, index) => (
                                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{record.roomNumber}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{record.entryNumber}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{record.guestName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-green-600">₹{record.price}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.source === 'Active' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-800'
                                                    }`}>
                                                    {record.source}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p>No bookings found for this date</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RevenueModal;
