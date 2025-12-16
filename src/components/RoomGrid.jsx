import React, { useState } from 'react';
import RoomCard from './RoomCard';
import ActionModal from './ActionModal';
import { useRoomManager } from '../hooks/useRoomManager';

const RoomGrid = ({ roomManager }) => {
    const { rooms, checkIn, checkOut } = roomManager;
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRoomClick = (room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRoom(null);
    };

    const renderFloor = (floorName, title) => {
        const floorRooms = rooms.filter(room => room.floor === floorName);

        return (
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-slate-800 mb-4 px-2 border-l-4 border-indigo-500">
                    {title}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {floorRooms.map(room => (
                        <RoomCard
                            key={room.id}
                            room={room}
                            onClick={handleRoomClick}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            {renderFloor('Ground Floor', 'Ground Floor (G01-G04)')}
            {renderFloor('1st Floor', '1st Floor (101-108)')}
            {renderFloor('2nd Floor', '2nd Floor (201-208)')}

            <ActionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                room={selectedRoom}
                onCheckIn={checkIn}
                onCheckOut={checkOut}
                onAddPayment={roomManager.addDailyPayment}
            />
        </div>
    );
};

export default RoomGrid;
