import React, { useState, useEffect } from 'react';

const ActionModal = ({ isOpen, onClose, room, onCheckIn, onCheckOut, onAddPayment }) => {
    const [guestName, setGuestName] = useState('');
    const [price, setPrice] = useState('');
    const [entryNumber, setEntryNumber] = useState('');
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');

    useEffect(() => {
        if (isOpen) {
            setGuestName('');
            setPrice('');
            setEntryNumber('');
            setShowPaymentForm(false);
            setPaymentAmount('');
        }
    }, [isOpen]);

    if (!isOpen || !room) return null;

    const isOccupied = room.status === 'occupied';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (showPaymentForm) {
            onAddPayment(room.id, paymentAmount);
            onClose();
            return;
        }

        if (isOccupied) {
            onCheckOut(room.id);
        } else {
            onCheckIn(room.id, guestName, price, entryNumber);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className={`p-4 border-b ${isOccupied ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                    <h2 className={`text-xl font-bold ${isOccupied ? 'text-red-800' : 'text-emerald-800'}`}>
                        Room {room.number} - {isOccupied ? 'Check Out' : 'Check In'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {isOccupied ? (
                        <div className="space-y-3">
                            {!showPaymentForm ? (
                                <>
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-500">Guest Name</p>
                                        <p className="font-medium text-slate-900">{room.guestName}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-500">Entry Number</p>
                                        <p className="font-medium text-slate-900">{room.entryNumber || '-'}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-500">Price (Check In)</p>
                                        <p className="font-medium text-slate-900">₹{room.price}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-500">Check-in Time</p>
                                        <p className="font-medium text-slate-900">{new Date(room.checkInTime).toLocaleString()}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowPaymentForm(true)}
                                        className="w-full py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                                    >
                                        + Add Daily Payment
                                    </button>
                                    <p className="text-red-600 font-medium pt-2 text-sm">Are you sure you want to check out this guest?</p>
                                </>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <h3 className="text-lg font-semibold text-slate-800">Add Daily Payment</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
                                        <input
                                            type="number"
                                            required={showPaymentForm}
                                            min="0"
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            placeholder="Enter payment amount"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Entry Number</label>
                                <input
                                    type="text"
                                    value={entryNumber}
                                    onChange={(e) => setEntryNumber(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Enter serial/entry number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Guest Name</label>
                                <input
                                    type="text"
                                    required
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Enter guest name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Enter amount"
                                />
                            </div>
                        </>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                if (showPaymentForm) setShowPaymentForm(false);
                                else onClose();
                            }}
                            className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors shadow-sm
                ${isOccupied && !showPaymentForm
                                    ? 'bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                                    : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'}
              `}
                        >
                            {showPaymentForm ? 'Add Payment' : (isOccupied ? 'Check Out Guest' : 'Check In Guest')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ActionModal;
