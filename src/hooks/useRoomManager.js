import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const generateRooms = () => {
    const rooms = [];
    const floors = [
        { name: 'Ground Floor', prefix: 'G', start: 1, end: 4 },
        { name: '1st Floor', prefix: '10', start: 1, end: 8 },
        { name: '2nd Floor', prefix: '20', start: 1, end: 8 }
    ];

    floors.forEach(floor => {
        for (let i = floor.start; i <= floor.end; i++) {
            const num = floor.prefix === '10' || floor.prefix === '20'
                ? `${floor.prefix}${i}`
                : `${floor.prefix}0${i}`;

            rooms.push({
                id: num,
                number: num,
                floor: floor.name,
                status: 'available',
                guest_name: '',
                price: 0,
                entry_number: '',
                check_in_time: null
            });
        }
    });

    return rooms;
};

export const useRoomManager = () => {
    const [rooms, setRooms] = useState(generateRooms());
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial Fetch and Subscription
    useEffect(() => {
        fetchRooms();
        fetchHistory();

        // Real-time subscription for rooms updates
        const channel = supabase
            .channel('room-updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, (payload) => {
                if (payload.new) {
                    setRooms(currentRooms =>
                        currentRooms.map(room =>
                            room.id === payload.new.id
                                ? { ...room, ...mapDbToClient(payload.new) }
                                : room
                        )
                    );
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const mapDbToClient = (dbRoom) => ({
        id: dbRoom.id,
        number: dbRoom.number,
        floor: dbRoom.floor,
        status: dbRoom.status,
        guestName: dbRoom.guest_name || '',
        price: dbRoom.price || '',
        entryNumber: dbRoom.entry_number || '',
        checkInTime: dbRoom.check_in_time
    });

    const fetchRooms = async () => {
        try {
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .order('id');

            if (error) throw error;

            if (data && data.length > 0) {
                setRooms(data.map(mapDbToClient));
            } else {
                // Initial seed if DB is empty
                const initialRooms = generateRooms().map(r => ({
                    id: r.id,
                    number: r.number,
                    floor: r.floor,
                    status: 'available'
                }));
                await supabase.from('rooms').insert(initialRooms);
                // State is already initialRooms by default
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const { data, error } = await supabase
                .from('history')
                .select('*')
                .order('check_out_time', { ascending: false });

            if (error) throw error;

            if (data) {
                setHistory(data.map(h => ({
                    id: h.id,
                    roomNumber: h.room_number,
                    guestName: h.guest_name,
                    price: h.price,
                    entryNumber: h.entry_number,
                    checkInTime: h.check_in_time,
                    checkOutTime: h.check_out_time
                })));
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const checkIn = async (roomId, guestName, price, entryNumber) => {
        const now = new Date().toISOString();

        // Optimistic update
        setRooms(prev => prev.map(r => r.id === roomId ? {
            ...r,
            status: 'occupied',
            guestName,
            price,
            entryNumber,
            checkInTime: now
        } : r));

        try {
            const { error } = await supabase
                .from('rooms')
                .update({
                    status: 'occupied',
                    guest_name: guestName,
                    price: Number(price),
                    entry_number: entryNumber,
                    check_in_time: now
                })
                .eq('id', roomId);

            if (error) throw error;
        } catch (err) {
            console.error("Check-in failed:", err);
            fetchRooms(); // Revert on error
        }
    };

    const checkOut = async (roomId) => {
        const room = rooms.find(r => r.id === roomId);
        if (!room) return;

        const now = new Date().toISOString();

        // Optimistic update
        setRooms(prev => prev.map(r => r.id === roomId ? {
            ...r,
            status: 'available',
            guestName: '',
            price: '',
            entryNumber: '',
            checkInTime: null
        } : r));

        try {
            // 1. Update Room
            const { error: roomError } = await supabase
                .from('rooms')
                .update({
                    status: 'available',
                    guest_name: null,
                    price: null,
                    entry_number: null,
                    check_in_time: null
                })
                .eq('id', roomId);

            if (roomError) throw roomError;

            // 2. Add to History
            const { data: histData, error: histError } = await supabase
                .from('history')
                .insert([{
                    room_number: room.number,
                    guest_name: room.guestName,
                    price: Number(room.price),
                    entry_number: room.entryNumber,
                    check_in_time: room.checkInTime,
                    check_out_time: now
                }])
                .select();

            if (histError) throw histError;

            // Update local history
            if (histData) {
                const newRecord = {
                    id: histData[0].id,
                    roomNumber: room.number,
                    guestName: room.guestName,
                    price: room.price,
                    entryNumber: room.entryNumber,
                    checkInTime: room.checkInTime,
                    checkOutTime: now
                };
                setHistory(prev => [newRecord, ...prev]);
            }

        } catch (err) {
            console.error("Check-out failed:", err);
            fetchRooms(); // Revert
        }
    };

    const getRoom = (roomId) => rooms.find(r => r.id === roomId);

    // Helper to get YYYY-MM-DD in local time
    const getLocalDateString = (date = new Date()) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().split('T')[0];
    };

    const getRevenueForDate = (dateString = getLocalDateString()) => {
        // Filter active rooms that checked in on this date (Local Time)
        const activeRevenue = rooms
            .filter(r => {
                if (r.status !== 'occupied' || !r.checkInTime) return false;
                const recordDate = getLocalDateString(new Date(r.checkInTime));
                return recordDate === dateString;
            })
            .map(r => ({
                source: 'Active',
                roomNumber: r.number,
                guestName: r.guestName,
                entryNumber: r.entryNumber || '-',
                price: Number(r.price) || 0
            }));

        // Filter history for check-ins on this date (Local Time)
        const historyRevenue = history
            .filter(h => {
                if (!h.checkInTime) return false;
                const recordDate = getLocalDateString(new Date(h.checkInTime));
                return recordDate === dateString;
            })
            .map(h => ({
                source: 'History',
                roomNumber: h.roomNumber,
                guestName: h.guestName,
                entryNumber: h.entryNumber || '-',
                price: Number(h.price) || 0
            }));

        const allRecords = [...activeRevenue, ...historyRevenue];
        const total = allRecords.reduce((sum, item) => sum + item.price, 0);

        return {
            total,
            records: allRecords
        };
    };

    return {
        rooms,
        history,
        checkIn,
        checkOut,
        getRoom,
        getRevenueForDate,
        loading
    };
};
