# Hbeb.Chat

Welcome to the Hbeb.Chat project! This repository contains the source code for a chat application built with a Node.js backend and an Expo-based React Native frontend. The application supports user authentication, real-time messaging, and friend management.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [API Documentation](#api-documentation)
5. [WebSocket Events](#websocket-events)
6. [Testing](#testing)
7. [Contributing](#contributing)
8. [License](#license)

## Project Structure

```
Hbeb.Chat/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── utils/
│   ├── .env
│   ├── db.js
│   ├── index.js
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── api/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── redux/
│   ├── scripts/
│   ├── utils/
│   ├── .gitignore
│   ├── app.json
│   ├── babel.config.js
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md
```

## Backend Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Navigate to the `backend` directory:

   ```bash
   cd Hbeb.Chat/backend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory and add your environment variables:

   ```env
   MONGO_URI=mongodb://localhost:27017/yourdbname
   JWT_SECRET=your_jwt_secret
   ```

4. Start the backend server:

   ```bash
   npm start
   ```

The backend server should now be running on `http://localhost:3000`.

## Frontend Setup

### Prerequisites

- Node.js (v14 or higher)
- Expo CLI

### Installation

1. Navigate to the `frontend` directory:

   ```bash
   cd Hbeb.Chat/frontend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the Expo development server:

   ```bash
   npx expo start
   ```

Follow the instructions in the terminal to open the app on an emulator or a physical device.

## API Documentation

The backend API provides endpoints for user authentication, user management, and room management. Detailed documentation for each endpoint can be found in the `backend/README.md` file.

## WebSocket Events

The application uses WebSocket for real-time messaging. The WebSocket events and their descriptions are documented in the `backend/README.md` file.

## Testing

### Backend

To run the backend tests, navigate to the `backend` directory and run:

```bash
npm test
```

### Frontend

To run the frontend tests, navigate to the `frontend` directory and run:

```bash
npm test
```

## Contributing

We welcome contributions to the Hbeb.Chat project! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

### Steps to Contribute

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with descriptive messages.
4. Push your changes to your fork.
5. Open a pull request to the main repository.
