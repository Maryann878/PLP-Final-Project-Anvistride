// client/src/components/SocketStatus.tsx
import React from 'react';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import { Wifi, WifiOff } from 'lucide-react';

const SocketStatus: React.FC = () => {
  const { isConnected } = useSocket();
  const { user } = useAuth();

  // Only show when user is logged in and on mobile
  if (!user || (window.innerWidth > 768 && import.meta.env.PROD)) {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-4 z-30 md:hidden">
      <div
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg shadow-md backdrop-blur-md border transition-all duration-300 ${
          isConnected
            ? 'bg-green-50/90 border-green-200 text-green-700'
            : 'bg-amber-50/90 border-amber-200 text-amber-700'
        }`}
        title={isConnected ? 'Real-time sync active' : 'Connecting to server...'}
      >
        {isConnected ? (
          <Wifi className="h-3.5 w-3.5" />
        ) : (
          <WifiOff className="h-3.5 w-3.5" />
        )}
        <span className="text-[10px] font-medium">
          {isConnected ? 'Synced' : 'Connecting...'}
        </span>
      </div>
    </div>
  );
};

export default SocketStatus;

