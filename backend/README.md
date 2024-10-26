# Hbeb.Chat Backend API Documentation

This document outlines the API endpoints and WebSocket functionality for the Hbeb.Chat backend application.

## Table of Contents
1. [Authentication Routes](#authentication-routes)
2. [User Routes](#user-routes)
3. [Room Routes](#room-routes)
4. [WebSocket Events](#websocket-events)

## Authentication Routes

### 1. Sign Up
- **Endpoint:** `POST /auth/signup`
- **Description:** Register a new user
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "username": "username",
    "biography": "User bio"
  }
  ```
- **Response Success (201):**
  ```json
  {
    "user_id": "user_id_here",
    "token": "jwt_token_here"
  }
  ```
- **Response Error (400):**
  ```json
  {
    "email": "Email is already registered",
    "password": "Password must be at least 6 characters long",
    "phone": "Phone number must be valid"
  }
  ```

### 2. Sign In
- **Endpoint:** `POST /auth/signin`
- **Description:** Authenticate an existing user
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response Success (200):**
  ```json
  {
    "user_id": "user_id_here",
    "token": "jwt_token_here"
  }
  ```
- **Response Error (400):**
  ```json
  {
    "email": "Incorrect email",
    "password": "Incorrect password"
  }
  ```

### 3. Verify Token
- **Endpoint:** `POST /auth/token`
- **Description:** Verify JWT token validity
- **Request Body:**
  ```json
  {
    "token": "jwt_token_here",
    "user_id": "user_id_here"
  }
  ```
- **Response Success (200):**
  ```json
  {
    "token": "Token is valid",
    "user_id": "user_id_here"
  }
  ```

## User Routes

### 1. Update User
- **Endpoint:** `POST /user/update`
- **Description:** Update user profile information
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "token": "jwt_token_here",
    "user_id": "user_id_here",
    "email": "new_email@example.com",
    "phone": "new_phone_number",
    "username": "new_username",
    "biography": "new_bio"
  }
  ```
- **Response Success (200):** Updated user object

### 2. Fetch User
- **Endpoint:** `POST /user/fetch`
- **Description:** Get user information
- **Authentication:** Required
- **Request Body Options:**
  ```json
  {
    "token": "jwt_token_here",
    "user_id": "user_id_here",
    // Optional: One of the following
    "users": ["user_id1", "user_id2"],
    "user": "specific_user_id",
    "email": "user@example.com",
    "phone": "phone_number",
    "room": "room_id"
  }
  ```
- **Response Success (200):** User object(s) without password

### 3. Friend Request Operations
- **Send Request - `POST /user/friend_request`**
  ```json
  {
    "token": "jwt_token_here",
    "user_id": "user_id_here",
    "email": "friend@example.com"
  }
  ```

- **Accept Request - `POST /user/friend_accept`**
  ```json
  {
    "token": "jwt_token_here",
    "user_id": "user_id_here",
    "friend_id": "friend_id_here"
  }
  ```

- **Reject Request - `POST /user/friend_reject`**
  ```json
  {
    "token": "jwt_token_here",
    "user_id": "user_id_here",
    "friend_id": "friend_id_here"
  }
  ```

### 4. Fetch Contacts
- **Endpoint:** `POST /user/fetch_contact`
- **Description:** Get user's friends list
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "token": "jwt_token_here",
    "user_id": "user_id_here"
  }
  ```

## Room Routes

### 1. Create Room
- **Endpoint:** `POST /room/create`
- **Description:** Create a new chat room
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "token": "jwt_token_here",
    "user_id": "user_id_here",
    "users": ["user_id1", "user_id2"],
    "name": "Room Name" // Optional
  }
  ```
- **Response Success (201):**
  ```json
  {
    "room_id": "room_id_here",
    "users": ["user_id1", "user_id2"],
    "name": "Room Name"
  }
  ```

### 2. Fetch Rooms
- **Endpoint:** `POST /room/fetch`
- **Description:** Get room information
- **Authentication:** Required
- **Request Body Options:**
  ```json
  {
    "token": "jwt_token_here",
    "user_id": "user_id_here",
    // Optional: One of the following
    "room_ids": ["room_id1", "room_id2"],
    "users": ["user_id1", "user_id2"]
  }
  ```
- **Response:** Array of room objects with last messages

## WebSocket Events

### Connection
- **Authentication:** Required via token in handshake
  ```javascript
  const socket = io("SERVER_URL", {
    auth: { token: "jwt_token_here" }
  });
  ```

### Events
1. **Join Room**
   - Emit: `join_room` with room_id
   - Receive: `previous_messages` with recent messages

2. **Send Message**
   - Emit: `message`
   ```json
   {
     "room_id": "room_id_here",
     "content": "message content"
   }
   ```
   - Receive: `message` event with message details

3. **Load More Messages**
   - Emit: `load_more_messages`
   ```json
   {
     "room_id": "room_id_here",
     "lastMessageId": "message_id_here"
   }
   ```
   - Receive: `more_messages` with older messages

### Error Handling
- All routes return appropriate HTTP status codes
- WebSocket operations emit `error` events for failures
- Authentication errors return 401 status with error details

## Notes
- All authenticated routes require valid JWT token and user_id
- Passwords are hashed using bcrypt
- WebSocket connections require valid JWT for authentication
- Room messages are paginated (20 messages per request)
