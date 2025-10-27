# Messaging System Documentation

## Overview
A simple messaging system that allows renters and owners to communicate about bookings.

## Features
- Real-time messaging between renter and owner
- Chat list showing all conversations
- Message history for each chat
- Simple polling mechanism for new messages (updates every 3 seconds)
- Clean and responsive UI using Bootstrap

## Backend API Endpoints

### Chat Endpoints (`/chats`)

#### `POST /chats/`
Create a new chat for a booking.
```json
Request Body:
{
  "booking_id": 1,
  "renter_id": 1,
  "lender_id": 2
}
```

#### `GET /chats/?user_id={user_id}`
Get all chats for a user (as renter or lender).

#### `GET /chats/{chat_id}?user_id={user_id}`
Get a specific chat with all details and messages.

#### `DELETE /chats/{chat_id}?user_id={user_id}`
Delete a chat and all its messages.

### Message Endpoints (`/messages`)

#### `POST /messages/`
Send a new message.
```json
Request Body:
{
  "content": "Hello, is this item still available?",
  "chat_id": 1,
  "sender_id": 1,
  "receiver_id": 2
}
```

#### `GET /messages/chat/{chat_id}?user_id={user_id}&limit=50&offset=0`
Get messages for a specific chat with pagination.

#### `DELETE /messages/{message_id}?user_id={user_id}`
Delete a message (only sender can delete).

#### `GET /messages/latest/{chat_id}?user_id={user_id}&since_timestamp={timestamp}`
Get new messages since a specific timestamp (for polling).

## Frontend Components

### Pages
- **Messages** (`/messages`): Main messaging page with chat list and chat window

### Components
- **ChatList**: Displays list of all user chats with last message preview
- **ChatWindow**: Displays messages and allows sending new messages

### API Client
- Location: `src/features/messages/api.ts`
- Provides functions to interact with backend messaging endpoints

## How to Use

### 1. Start the Backend
```bash
cd backend
python -m uvicorn app.main:app --reload
```

### 2. Start the Frontend
```bash
cd rental-marketplace
npm run dev
```

### 3. Access Messages
Navigate to `http://localhost:3000/messages` to view and send messages.

## Current Limitations & TODOs

1. **Authentication**: Currently uses a hardcoded user ID (1). You need to:
   - Implement proper authentication context
   - Pass authenticated user ID to the Messages component
   - Update line 10 in `Messages.tsx`: `const currentUserId = 1;`

2. **Chat Creation**: Chats are created manually or through API. Consider:
   - Auto-creating chats when a booking is made
   - Adding a "Message Owner" button on item details page

3. **Real-time Updates**: Currently uses polling (every 3 seconds). For better performance:
   - Implement WebSocket connection for real-time updates
   - Add typing indicators
   - Add read receipts

4. **Notifications**:
   - Add email notifications for new messages
   - Add browser notifications
   - Add unread message badge in navigation

5. **UI Enhancements**:
   - Add message search functionality
   - Add file/image sharing
   - Add emoji support
   - Add message reactions

## Database Models

### Chat Model
```python
class Chat(Base):
    id: Integer (Primary Key)
    request_id: Integer (Foreign Key to Rental_Requests)
    booking_id: Integer (Foreign Key to Bookings)
    renter_id: Integer (Foreign Key to Users)
    lender_id: Integer (Foreign Key to Users)
```

### Message Model
```python
class Message(Base):
    id: Integer (Primary Key)
    content: String (max 1000 chars)
    timestamp: DateTime
    chat_id: Integer (Foreign Key to Chats)
    sender_id: Integer (Foreign Key to Users)
    receiver_id: Integer (Foreign Key to Users)
```

## Testing the System

### Using FastAPI Docs (Swagger UI)
1. Navigate to `http://localhost:8000/docs`
2. Test endpoints in this order:
   - Create a chat: `POST /chats/`
   - Send a message: `POST /messages/`
   - Get chat messages: `GET /messages/chat/{chat_id}`
   - Get user chats: `GET /chats/`

### Using the Frontend
1. Ensure you have at least 2 users and 1 booking in the database
2. Navigate to `/messages`
3. Select a chat from the list
4. Send a message
5. The message should appear in the chat window
6. New messages will appear automatically (polling every 3 seconds)

## File Structure

```
backend/
├── app/
│   ├── models/
│   │   ├── chat.py          # Chat database model
│   │   └── message.py       # Message database model
│   ├── schemas/
│   │   ├── chat.py          # Chat validation schemas
│   │   └── message.py       # Message validation schemas
│   ├── routers/
│   │   ├── chats.py         # Chat API endpoints
│   │   └── messages.py      # Message API endpoints
│   └── main.py              # Register routers here

rental-marketplace/
├── src/
│   ├── features/
│   │   └── messages/
│   │       ├── api.ts                    # API client functions
│   │       ├── pages/
│   │       │   └── Messages.tsx          # Main messages page
│   │       └── components/
│   │           ├── ChatList.tsx          # Chat list component
│   │           └── ChatWindow.tsx        # Chat window component
│   └── app/
│       └── router.tsx                    # Add /messages route here
```

## Security Considerations

1. **Authorization**: All endpoints verify that the user is a participant in the chat
2. **Input Validation**: Message content is limited to 1000 characters and cannot be empty
3. **Ownership**: Users can only delete their own messages
4. **Privacy**: Users can only access chats they are part of

## Next Steps

1. Implement authentication and pass real user IDs
2. Add "Message Owner" button on item listing pages
3. Auto-create chats when bookings are created
4. Consider implementing WebSocket for real-time updates
5. Add notification system for new messages
