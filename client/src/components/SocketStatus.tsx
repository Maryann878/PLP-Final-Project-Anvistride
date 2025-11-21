// client/src/components/SocketStatus.tsx
import React from 'react';
import { useSocket } from '@/context/SocketContext';
import { Wifi, WifiOff } from 'lucide-react';

const SocketStatus: React.FC = () => {
  const { isConnected } = useSocket();

  // Only show on mobile or in development
  if (window.innerWidth > 768 && import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 md:hidden">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg backdrop-blur-md border transition-all duration-300 ${
          isConnected
            ? 'bg-green-50/90 border-green-200 text-green-700'
            : 'bg-red-50/90 border-red-200 text-red-700'
        }`}
        title={isConnected ? 'Real-time sync active' : 'Real-time sync disconnected'}
      >
        {isConnected ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <span className="text-xs font-semibold">
          {isConnected ? 'Synced' : 'Offline'}
        </span>
      </div>
    </div>
  );
};

export default SocketStatus;

