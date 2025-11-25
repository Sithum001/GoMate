# GoMate (Expo)

Simple React Native (Expo) app demonstrating:

- User authentication (dummyjson login + local registration)
- Navigation with React Navigation (stack + bottom tabs)
- Redux Toolkit for state management
- redux-persist + AsyncStorage for persistence
- Favourites, Details, Profile, Dark mode toggle
- Formik + Yup for form validation
- **Transport API integration** for UK bus routes and schedules

## Quick start

1. Install dependencies

```powershell
cd d:/Mobile/GoMate
npm install
```

2. Get Transport API credentials (optional, for real data)
   - Sign up at https://developer.transportapi.com/
   - Create an app to get `app_id` and `api_key`
   - Update `src/store/slices/itemsSlice.js` with your credentials:
     ```javascript
     const TRANSPORT_API_KEY = 'YOUR_API_KEY_HERE';
     const TRANSPORT_APP_ID = 'YOUR_APP_ID_HERE';
     ```

3. Start the app

```powershell
npx expo start
```

Then press `w` for web, or scan the QR with Expo Go (iOS/Android).

## Login Options

- **Demo user**: emilys / emilyspass
- **Register new**: Click "Register" button to create a new account (persisted locally)

## Features

- View UK transport routes and schedules (with mock fallback)
- Mark routes as favourites (persisted)
- Toggle dark mode
- User profile and logout
- Form validation with Yup

## Notes

- Authentication uses dummyjson for demo users + local Redux state for registered users
- Transport data falls back to mock data if API is unavailable or credentials not set
- All favourite routes and user data persist across app sessions


