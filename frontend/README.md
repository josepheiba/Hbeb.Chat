# Hbeb.Chat Frontend

Hbeb.Chat is a modern real-time chat application built with Expo and React Native. This repository contains the frontend codebase of the application.

## Features

- 🔐 Authentication (Login/Register/Logout)
- 💬 Real-time messaging
- 👥 Group chat functionality
- 👤 User profiles
- 🤝 Friend requests system
- 📱 Cross-platform (iOS & Android)
- 🌙 Modern UI design

## Tech Stack

- **Framework:** [Expo](https://expo.dev/)
- **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Real-time Communication:** [Socket.IO](https://socket.io/)
- **Storage:** [AsyncStorage](https://react-native-async-storage.github.io/)
- **UI Components:** React Native core components

## Project Structure

```
frontend/
├── api/                 # API integration services
├── app/                 # App screens and navigation
│   ├── (auth)/         # Authentication screens
│   ├── (tabs)/         # Main tab screens
│   └── _layout.jsx     # Root layout configuration
├── components/         # Reusable components
├── redux/             # Redux state management
│   ├── selectors/     # State selectors
│   ├── slices/        # Redux slices
│   └── thunks/        # Async actions
├── utils/             # Utility functions
└── assets/           # Static assets
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hbeb-chat.git
cd hbeb-chat/frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npx expo start
```

### Running the App

- Press `i` to run on iOS simulator
- Press `a` to run on Android emulator
- Scan QR code with Expo Go app on your phone

## Development

### Environment Setup

Create a `.env` file in the root directory and add necessary environment variables:

```env
API_URL=your_backend_url
```

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Best Practices

- Follow the established project structure
- Use meaningful component and variable names
- Write comments for complex logic
- Follow React Native performance best practices
- Keep components small and focused
- Use TypeScript for better type safety

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Contact

Your Name - [@yourusername](https://twitter.com/yourusername)

Project Link: [https://github.com/yourusername/hbeb-chat](https://github.com/yourusername/hbeb-chat)

## Acknowledgments

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
```
