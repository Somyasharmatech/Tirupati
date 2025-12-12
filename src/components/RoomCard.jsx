import React from 'react';

const RoomCard = ({ room, onClick }) => {
    const isOccupied = room.status === 'occupied';

    return (
        <div
            onClick={() => onClick(room)}
            className={`
        relative p-4 rounded-xl shadow-sm border-2 cursor-pointer transition-all duration-200 hover:shadow-md
        flex flex-col items-center justify-center h-24
        ${isOccupied
                    ? 'bg-red-50 border-red-200 hover:bg-red-100/50'
                    : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100/50'}
      `}
        >
            <span className={`text-lg font-bold ${isOccupied ? 'text-red-700' : 'text-emerald-700'}`}>
                {room.number}
            </span>
            <span className={`text-xs mt-1 font-medium ${isOccupied ? 'text-red-600' : 'text-emerald-600'}`}>
                {isOccupied ? 'Occupied' : 'Available'}
            </span>
            {isOccupied && (
                <span className="text-xs text-red-500 mt-1 truncate w-full text-center">
                    {room.guestName}
                </span>
            )}
        </div>
    );
};

export default RoomCard;
