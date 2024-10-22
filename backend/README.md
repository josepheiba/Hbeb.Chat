# Hbeb.Chat Backend API Documentation

This document outlines the API endpoints for the Hbeb.Chat backend application.

## Table of Contents
1. [Authentication Routes](#authentication-routes)
2. [User Routes](#user-routes)
3. [Room Routes](#room-routes)

## Authentication Routes

### 1. Sign Up
- **Endpoint:** `POST /auth/signup`
- **Description:** Register a new user
- **Required Parameters:**
  - `email` (string): User's email address
  - `password` (string): User's password (minimum 6 characters)
- **Optional Parameters:**
  - `phone` (string): User's phone number
  - `username` (string): User's display name
  - `biography` (string): User's bio
- **Response:**
  - `user_id` (string): Newly created user's ID
  - `token` (string): JWT for authentication

### 2. Sign In
- **Endpoint:** `POST /auth/signin`
- **Description:** Authenticate an existing user
- **Required Parameters:**
  - `email` (string): User's email address
  - `password` (string): User's password
- **Response:**
  - `user_id` (string): User's ID
  - `token` (string): JWT for authentication

### 3. Verify Token
- **Endpoint:** `POST /auth/token`
- **Description:** Verify the validity of a JWT
- **Required Parameters:**
  - `token` (string): JWT to verify
  - `user_id` (string): User's ID
- **Response:**
  - Confirmation of token validity

## User Routes

### 1. Update User
- **Endpoint:** `POST /user/update`
- **Description:** Update user information
- **Required Parameters:**
  - `token` (string): JWT for authentication
  - `user_id` (string): User's ID
- **Optional Parameters:**
  - `email` (string): New email address
  - `phone` (string): New phone number
  - `username` (string): New username
  - `biography` (string): New biography
  - `contacts` (array): Updated contacts list
- **Response:**
  - Updated user object

### 2. Fetch User
- **Endpoint:** `POST /user/fetch`
- **Description:** Retrieve user information
- **Required Parameters:**
  - `token` (string): JWT for authentication
  - `user_id` (string): User's ID
- **Optional Parameters (one of the following):**
  - `user` (string): ID of the user to fetch
  - `email` (string): Email of the user to fetch
  - `phone` (string): Phone number of the user to fetch
  - `room` (string): Room ID to fetch all users in that room
- **Response:**
  - User object(s) without password

### 3. Delete User
- **Endpoint:** `POST /user/delete`
- **Description:** Delete user account
- **Required Parameters:**
  - `token` (string): JWT for authentication
  - `user_id` (string): User's ID
- **Response:**
  - Deleted user object

### 4. Send Friend Request
- **Endpoint:** `POST /user/friend_request`
- **Description:** Send a friend request to another user
- **Required Parameters:**
  - `token` (string): JWT for authentication
  - `user_id` (string): User's ID
  - `friend_id` (string): ID of the user to send the request to
- **Response:**
  - Updated user object with new friend request

## Room Routes

### 1. Create Room
- **Endpoint:** `POST /room/create`
- **Description:** Create a new chat room
- **Required Parameters:**
  - `token` (string): JWT for authentication
  - `user_id` (string): User's ID
  - `users` (array): Array of user IDs to be included in the room
- **Response:**
  - `room_id` (string): Newly created room ID
  - `users` (array): Array of user IDs in the room

### 2. Fetch Room
- **Endpoint:** `POST /room/fetch`
- **Description:** Retrieve room information
- **Required Parameters:**
  - `token` (string): JWT for authentication
  - `user_id` (string): User's ID
- **Optional Parameters (one of the following):**
  - `room_ids` (array): Array of room IDs to fetch
  - `users` (array): Array of user IDs to find rooms for
- **Response:**
  - Array of room objects

### 3. Update Room
- **Endpoint:** `POST /room/update`
- **Description:** Update room information
- **Required Parameters:**
  - `token` (string): JWT for authentication
  - `user_id` (string): User's ID
  - `room_id` (string): ID of the room to update
- **Optional Parameters:**
  - `name` (string): New room name
  - `users` (array): Updated array of user IDs in the room
- **Response:**
  - Updated room object

### 4. Delete Room
- **Endpoint:** `POST /room/delete`
- **Description:** Delete a chat room
- **Required Parameters:**
  - `token` (string): JWT for authentication
  - `user_id` (string): User's ID
  - `room_id` (string): ID of the room to delete
- **Response:**
  - Confirmation message

## Notes
- All routes (except signup and signin) require the `token` and `user_id` for authentication.
- The WebSocket functionality for real-time messaging is not included in this REST API documentation, as it operates separately using socket connections.
