# Testing the Messaging System - Step by Step Guide

## Prerequisites

1. **Backend running**: `cd backend && python -m uvicorn app.main:app --reload`
2. **Frontend running**: `cd rental-marketplace && npm run dev`
3. **Database running**: Docker containers should be up

## Step 1: Check Existing Data

### Check Users
Navigate to `http://localhost:8000/docs` (FastAPI Swagger UI)

1. Find the **POST /auth/register** endpoint
2. Click "Try it out"
3. Create 2 test users:

**User 1 (Renter):**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**User 2 (Owner/Lender):**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@example.com",
  "password": "password123"
}
```

**Note the user IDs** returned (usually 1 and 2 if these are your first users).

### Check Items/Bookings
You need at least one booking to create a chat. If you don't have bookings yet, you can:
- Create an item via `/items/create` endpoint
- For testing, you can use a dummy `booking_id` (like 1) - the system will work even without a real booking

## Step 2: Create a Test Chat

### Using FastAPI Docs (Recommended for First Test)

1. Navigate to `http://localhost:8000/docs`
2. Find **POST /chats/** endpoint
3. Click "Try it out"
4. Enter:

```json
{
  "booking_id": 1,
  "renter_id": 1,
  "lender_id": 2
}
```

5. Click "Execute"
6. You should get a response like:

```json
{
  "id": 1,
  "booking_id": 1,
  "renter_id": 1,
  "lender_id": 2
}
```

**Note the chat ID** (usually 1).

### Using cURL (Alternative)

```bash
curl -X POST "http://localhost:8000/chats/" \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": 1,
    "renter_id": 1,
    "lender_id": 2
  }'
```

## Step 3: Send Test Messages via API

### Send First Message

1. In FastAPI docs, find **POST /messages/** endpoint
2. Click "Try it out"
3. Enter:

```json
{
  "content": "Hi! Is this item still available?",
  "chat_id": 1,
  "sender_id": 1,
  "receiver_id": 2
}
```

4. Click "Execute"

### Send Reply

```json
{
  "content": "Yes! It's available. When do you need it?",
  "chat_id": 1,
  "sender_id": 2,
  "receiver_id": 1
}
```

### Send Another Message

```json
{
  "content": "Great! I need it this weekend.",
  "chat_id": 1,
  "sender_id": 1,
  "receiver_id": 2
}
```

## Step 4: Test the Frontend UI

### View Messages Page

1. Navigate to `http://localhost:3000/messages`
2. You should see:
   - **Left panel**: List of chats (should show 1 chat)
   - **Right panel**: "Select a chat to start messaging"

### Open the Chat

1. Click on the chat in the left panel
2. You should see:
   - Chat header with the other user's name
   - All 3 messages you sent via API
   - Messages from user 1 on the right (blue)
   - Messages from user 2 on the left (gray)

### Send a Message via UI

1. Type a message in the input box at the bottom
2. Click "Send"
3. Your message should appear immediately

**Note**: The current user ID is hardcoded to `1` in the Messages component, so all messages you send from the UI will be from user 1.

## Step 5: Test Real-Time Polling

### Open in Two Browser Windows

1. Open `http://localhost:3000/messages` in your main browser
2. Open `http://localhost:3000/messages` in an incognito/private window (or different browser)

### Simulate Two Users Chatting

**Window 1 (User 1 - via UI):**
- The UI sends as user 1 by default
- Send a message via the UI

**Window 2 (User 2 - via API):**
- Use FastAPI docs to send a message as user 2
- Within 3 seconds, Window 1 should show the new message (auto-polling)

## Step 6: Test Other Features

### Get User Chats

**Endpoint**: `GET /chats/?user_id=1`

Should return a list of all chats for user 1 with:
- Other user info
- Last message
- Unread count

### Get Chat Messages

**Endpoint**: `GET /messages/chat/1?user_id=1`

Should return all messages in chat 1.

### Delete a Message

1. Note a message ID from your chat
2. **Endpoint**: `DELETE /messages/{message_id}?user_id=1`
3. The message should be deleted
4. Refresh the frontend to see it's gone

## Troubleshooting

### "Chat not found" or "User not found"
- Make sure your user IDs and chat IDs are correct
- Check the database has the records

### "Failed to load chats"
- Check the backend is running on port 8000
- Check browser console for errors (F12)
- Verify CORS is configured (should allow localhost:3000)

### Messages not showing in UI
- Check that `currentUserId = 1` matches an actual user in the chat
- Open browser console (F12) and look for errors
- Verify the API endpoint in the Network tab

### User ID is always 1
- This is expected! Currently hardcoded on line 10 of Messages.tsx
- To fix, implement authentication and pass real user ID
- For testing, you can temporarily change the hardcoded value

## Quick Test Script (All Commands)

```bash
# Create User 1
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe","email":"john@test.com","password":"password123"}'

# Create User 2
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Jane","last_name":"Smith","email":"jane@test.com","password":"password123"}'

# Create Chat
curl -X POST "http://localhost:8000/chats/" \
  -H "Content-Type: application/json" \
  -d '{"booking_id":1,"renter_id":1,"lender_id":2}'

# Send Message 1
curl -X POST "http://localhost:8000/messages/" \
  -H "Content-Type: application/json" \
  -d '{"content":"Hi! Is this available?","chat_id":1,"sender_id":1,"receiver_id":2}'

# Send Message 2
curl -X POST "http://localhost:8000/messages/" \
  -H "Content-Type: application/json" \
  -d '{"content":"Yes, it is!","chat_id":1,"sender_id":2,"receiver_id":1}'

# Get chats for user 1
curl "http://localhost:8000/chats/?user_id=1"

# Get messages in chat 1
curl "http://localhost:8000/messages/chat/1?user_id=1"
```

## Expected Results

After running these tests, you should have:
- ✅ 2 users in the database
- ✅ 1 chat between them
- ✅ Multiple messages in the chat
- ✅ Messages visible in the frontend at `/messages`
- ✅ Ability to send new messages via UI
- ✅ Messages updating within 3 seconds (polling)

## Next Steps After Testing

1. **Implement Authentication**: Replace hardcoded user ID with actual logged-in user
2. **Add "Message Owner" Button**: On item detail pages to easily start chats
3. **Auto-create Chats**: When bookings are made
4. **Add Notifications**: Email or browser notifications for new messages
5. **Upgrade to WebSockets**: For real-time messaging instead of polling

---

Happy testing! If you encounter any issues, check the browser console and FastAPI logs for error messages.
