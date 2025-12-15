import React, { useState } from 'react';
import RoomGrid from './components/RoomGrid';
import HistoryModal from './components/HistoryModal';
import RevenueModal from './components/RevenueModal';
import { useRoomManager } from './hooks/useRoomManager';

function App() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRevenueOpen, setIsRevenueOpen] = useState(false);

  // We need to access history data. 
  // Since useRoomManager is a hook, we usually use it inside a component.
  // RoomGrid uses it internally.
  // To avoid prop drilling from App -> RoomGrid or multiple hook instances (which might split state if not careful, though here it behaves like a singleton per use if state is local... WAIT.
  // CRITICAL: useRoomManager uses `useState`. If I call it in App AND RoomGrid, they will have SEPARATE states.
  // I need to hoist the state up to App and pass down to RoomGrid.

  const roomManager = useRoomManager();

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Tirupati Guest House
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRevenueOpen(true)}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Daily Report
            </button>
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-md transition-colors"
            >
              View History
            </button>
            <div className="text-sm text-slate-500 hidden sm:block">
              Room Management System
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Pass roomManager methods to RoomGrid to avoid duplicate hook instances */}
        <RoomGrid roomManager={roomManager} />
      </main>

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={roomManager.history}
      />

      <RevenueModal
        isOpen={isRevenueOpen}
        onClose={() => setIsRevenueOpen(false)}
        getRevenueForDate={roomManager.getRevenueForDate}
      />

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Tirupati Guest House. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
