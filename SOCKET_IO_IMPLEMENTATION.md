# Socket.IO Implementation Guide

## Overview
Socket.IO has been successfully integrated into Anvistride to enable real-time features including multi-device synchronization, real-time notifications, and live activity feeds.

## What's Implemented

### ✅ Phase 1: Core Real-Time Features

1. **Multi-Device Synchronization**
   - Real-time sync of all CRUD operations (Create, Read, Update, Delete)
   - Automatic updates across all user devices
   - Works for: Visions, Goals, Tasks, Ideas, Notes, Journal, Achievements

2. **Real-Time Notifications**
   - Server-pushed notifications via Socket.IO
   - Achievement unlock notifications
   - Milestone reached notifications
   - System notifications

3. **Live Activity Feed**
   - Real-time activity tracking
   - Shows recent actions across all entities
   - Persisted in localStorage
   - ActivityContext for easy access

## Architecture

### Server Side (`server/src/socket/socketServer.js`)
- Socket.IO server initialized alongside Express
- JWT-based authentication middleware
- User-specific rooms for targeted updates
- Event handlers for entity sync and activities

### Client Side
- **SocketContext** (`client/src/context/SocketContext.tsx`)
  - Manages Socket.IO connection
  - Handles authentication
  - Provides connection status
  - Auto-reconnection on disconnect

- **AppContext Integration**
  - Emits sync events on CRUD operations
  - Listens for updates from other devices
  - Prevents infinite loops with local update flags

- **NotificationContext Integration**
  - Listens for real-time notifications
  - Handles achievement and milestone events

- **ActivityContext** (`client/src/context/ActivityContext.tsx`)
  - Tracks user activities
  - Stores last 50 activities
  - Real-time updates via Socket.IO

## How It Works

### Multi-Device Sync Flow

1. **User Action on Device A:**
   ```
   User creates a vision → AppContext.addVision()
   → Emits 'entity:add' via Socket.IO
   → Updates local state
   ```

2. **Device B Receives Update:**
   ```
   Socket.IO receives 'entity:add' event
   → AppContext listener updates local state
   → UI automatically reflects changes
   ```

### Real-Time Notifications Flow

1. **Server Emits Notification:**
   ```
   Achievement unlocked → Server emits 'achievement:unlocked'
   → All user devices receive notification
   → NotificationContext adds to notifications
   → Toast notification appears
   ```

## Usage Examples

### Emitting Custom Events

```typescript
import { useSocket } from '@/context/SocketContext';

const { emit, isConnected } = useSocket();

// Emit custom event
if (isConnected) {
  emit('custom:event', { data: 'your data' });
}
```

### Listening to Custom Events

```typescript
import { useSocket } from '@/context/SocketContext';
import { useEffect } from 'react';

const { on, off, isConnected } = useSocket();

useEffect(() => {
  if (!isConnected) return;

  const handleCustomEvent = (data: any) => {
    console.log('Received:', data);
  };

  on('custom:event', handleCustomEvent);

  return () => {
    off('custom:event', handleCustomEvent);
  };
}, [isConnected, on, off]);
```

### Using Activity Feed

```typescript
import { useActivity } from '@/context/ActivityContext';

const { activities, clearActivities } = useActivity();

// Display activities
activities.map(activity => (
  <div key={activity.id}>
    {activity.type} - {activity.entity}
  </div>
));
```

## Connection Status

A `SocketStatus` component shows connection status on mobile devices:
- ✅ Green indicator when connected
- ❌ Red indicator when disconnected
- Auto-reconnects on network issues

## Environment Variables

Make sure to set:
- `VITE_API_BASE_URL` - API base URL (defaults to `http://localhost:5000/api`)
- `JWT_SECRET` - JWT secret for authentication
- `CLIENT_URL` - Client URL for CORS (production)

## Future Enhancements (Phase 2 & 3)

### Phase 2: Enhanced Features
- Live analytics updates
- Presence indicators
- Optimistic updates with conflict resolution
- Real-time quote rotation

### Phase 3: Collaboration (Enterprise)
- Team collaboration features
- Shared workspaces
- Collaborative editing
- Team notifications

## Troubleshooting

### Connection Issues
1. Check if user is authenticated (token in localStorage)
2. Verify server URL in SocketContext
3. Check browser console for connection errors
4. Ensure CORS is properly configured

### Sync Not Working
1. Verify Socket.IO connection status
2. Check if events are being emitted
3. Verify event listeners are registered
4. Check server logs for received events

## Testing

To test multi-device sync:
1. Open app in two different browsers/devices
2. Log in with the same account
3. Create/update/delete an item on Device A
4. Verify it appears on Device B instantly

## Performance Considerations

- Activities are limited to last 50 items
- Socket.IO uses efficient WebSocket transport
- Auto-reconnection prevents connection loss
- Local update flags prevent infinite loops

