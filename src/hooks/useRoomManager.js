import { useState, useEffect } from 'react';

const generateRooms = () => {
    const rooms = [];

    // Ground Floor: G01-G04 (4 rooms)
    for (let i = 1; i <= 4; i++) {
        const num = `G0${i}`;
        rooms.push({
            id: num,
            number: num,
            floor: 'Ground Floor',
            status: 'available',
            guestName: '',
            price: '',
            checkInTime: null
        });
    }

    // 1st Floor: 101-108 (8 rooms)
    for (let i = 1; i <= 8; i++) {
        const num = `10${i}`;
        rooms.push({
            id: num,
            number: num,
            floor: '1st Floor',
            status: 'available',
            guestName: '',
            price: '',
            checkInTime: null
        });
    }

    // 2nd Floor: 201-208 (8 rooms)
    for (let i = 1; i <= 8; i++) {
        const num = `20${i}`;
        rooms.push({
            id: num,
            number: num,
            floor: '2nd Floor',
            status: 'available',
            guestName: '',
            price: '',
            checkInTime: null
        });
    }

    return rooms;
};

export const useRoomManager = () => {
    const [rooms, setRooms] = useState(() => {
        const saved = localStorage.getItem('tirupati_rooms');
        const initial = generateRooms();

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Check if the saved data matches the new structure (e.g. has G01)
                // This ensures we migrate from the old structure (101-106) automatically
                // but keep data for the new structure once established.
                const hasNewStructure = parsed.some(r => r.id === 'G01');

                if (hasNewStructure && parsed.length === initial.length) {
                    return parsed;
                }
            } catch (e) {
                console.error("Failed to parse saved rooms:", e);
            }
        }
        return initial;
    });

    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('tirupati_history');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('tirupati_rooms', JSON.stringify(rooms));
    }, [rooms]);

    useEffect(() => {
        localStorage.setItem('tirupati_history', JSON.stringify(history));
    }, [history]);

    const checkIn = (roomId, guestName, price) => {
        const now = new Date().toISOString();
        setRooms(prevRooms => prevRooms.map(room => {
            if (room.id === roomId) {
                return {
                    ...room,
                    status: 'occupied',
                    guestName,
                    price: Number(price),
                    checkInTime: now
                };
            }
            return room;
        }));
    };

    const checkOut = (roomId) => {
        const now = new Date().toISOString();
        setRooms(prevRooms => prevRooms.map(room => {
            if (room.id === roomId) {
                // Add to history
                const record = {
                    id: Date.now(), // simple unique id
                    roomNumber: room.number,
                    guestName: room.guestName,
                    price: room.price,
                    checkInTime: room.checkInTime,
                    checkOutTime: now
                };
                setHistory(prev => [record, ...prev]);

                return {
                    ...room,
                    status: 'available',
                    guestName: '',
                    price: '',
                    checkInTime: null
                };
            }
            return room;
        }));
    };

    const getRoom = (roomId) => rooms.find(r => r.id === roomId);

    return {
        rooms,
        history,
        checkIn,
        checkOut,
        getRoom
    };
};
