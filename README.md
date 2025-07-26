# TodoApp - Cross-Platform Task Management Mobile App

A beautiful, modern cross-platform todo application built with React, TypeScript, Tailwind CSS, and Capacitor. Features social authentication, full CRUD operations, smooth animations, and mobile-first design.

## 🚀 Features

- **Social Authentication**: Login with Google, Apple, Facebook, or GitHub
- **Full CRUD Operations**: Create, read, update, delete, and mark tasks as complete
- **Smart Filtering**: Filter by status (All, Active, Completed) and search functionality
- **Priority System**: Set task priority levels (Low, Medium, High) with visual indicators
- **Due Date Management**: Set and track due dates with smart date formatting
- **Mobile-First Design**: Responsive design optimized for mobile devices
- **Smooth Animations**: Framer Motion animations for delightful user experience
- **Pull-to-Refresh**: Intuitive mobile gestures
- **Offline Support**: Local storage persistence for offline functionality
- **Beautiful UI**: Modern gradient design with dark mode support

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Mobile**: Capacitor for cross-platform deployment
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Storage**: LocalStorage for data persistence
- **Authentication**: Mock social providers (easily replaceable with real OAuth)

## 📱 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- For mobile development: Android Studio (Android) or Xcode (iOS/Mac only)

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd todoapp

# Install dependencies
npm install
```

### 2. Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### 3. Mobile Development Setup

```bash
# Build the project
npm run build

# Add mobile platforms
npx cap add ios     # For iOS (Mac only)
npx cap add android # For Android

# Sync with native projects
npx cap sync

# Open in native IDEs
npx cap open ios     # Opens Xcode
npx cap open android # Opens Android Studio
```

### 4. Running on Mobile Devices

**For Android:**
```bash
npx cap run android
```

**For iOS (Mac only):**
```bash
npx cap run ios
```

## 🏗️ Architecture

The application follows a clean, modular architecture:

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── LoginScreen.tsx # Authentication interface
│   ├── AppHeader.tsx   # Main header with user info
│   ├── TodoCard.tsx    # Individual task card
│   ├── TodoForm.tsx    # Create/edit task modal
│   └── TodoList.tsx    # Main task list view
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication state management
│   └── TodoContext.tsx # Todo state management
├── types/              # TypeScript type definitions
│   └── todo.ts         # Todo and User interfaces
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── pages/              # Page components
    └── Index.tsx       # Main application page
```

### Data Flow
1. **Authentication**: Users authenticate via social providers (mocked for demo)
2. **State Management**: React Context manages auth and todo states
3. **Persistence**: LocalStorage provides offline data persistence
4. **UI Updates**: Framer Motion handles smooth animations and transitions

## 🎯 Key Features Implementation

### Authentication Flow
- Social login buttons with provider-specific styling
- Mock authentication for demo purposes
- Persistent login state with localStorage
- User profile management

### Task Management
- **CRUD Operations**: Full create, read, update, delete functionality
- **Status Tracking**: Open/Completed status with visual indicators
- **Priority Levels**: Low, Medium, High with color-coded badges
- **Due Dates**: Date picker with smart formatting and overdue detection
- **Search & Filter**: Real-time search and status-based filtering

### Mobile Experience
- **Responsive Design**: Mobile-first approach with touch-friendly interactions
- **Smooth Animations**: Page transitions, list animations, and micro-interactions
- **Floating Action Button**: Quick access to create new tasks
- **Pull-to-Refresh**: Native mobile gesture support
- **Swipe Actions**: Edit and delete tasks with gestures

### Performance Optimizations
- **Local Storage**: Offline-first approach with localStorage persistence
- **Optimistic Updates**: Immediate UI updates for better UX
- **Efficient Rendering**: React optimization patterns and memoization
- **Lazy Loading**: Component and asset optimization

## 🚀 Deployment

### Web Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

### Mobile App Distribution
1. Build and test the app in respective IDEs
2. Follow platform-specific app store guidelines
3. Generate signed APK/IPA files for distribution

## 🔧 Configuration

### Capacitor Configuration
The app is configured for both development and production in `capacitor.config.ts`:
- Development: Hot reload from Lovable sandbox
- Production: Static file serving from dist folder

### Environment Setup
- Update `capacitor.config.ts` for your domain
- Configure social authentication providers with real OAuth credentials
- Set up crash reporting (Sentry, Firebase Crashlytics)

## 🤝 Assumptions & Design Decisions

1. **Mock Authentication**: Used mock social providers for demo purposes - easily replaceable with real OAuth implementation
2. **Local Storage**: Used for persistence instead of backend database - suitable for offline-first approach
3. **React Context**: Chosen over Redux for simpler state management in this scope
4. **No Backend**: Focused on frontend and mobile experience - backend can be added later
5. **Material Design**: Inspired by modern mobile app design patterns
6. **Accessibility**: Implemented ARIA labels and keyboard navigation support

## 📊 Demo Video

[Demo Video Link] - Replace with your Loom video link showing the working application

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

This project is a part of a hackathon run by https://www.katomaran.com