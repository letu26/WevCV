# VTIT Recruitment Portal

A modern recruitment portal built for Viettel Software using React, TypeScript, and Tailwind CSS.

## Features

- 🏠 **Landing Page** - Attractive landing page with company information
- 🔐 **Authentication** - Sign in and sign up functionality
- 👤 **Profile Management** - Create and manage professional CVs
- 📝 **CV Management** - Dynamic forms for projects and skills
- 🎯 **Status Tracking** - Track CV status (draft, pending, accepted, rejected)
- 🌐 **Multi-language** - Support for Vietnamese and English
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **State Management**: React Hooks
- **Animations**: Motion/React (Framer Motion)
- **UI Components**: Radix UI, shadcn/ui
- **Build Tool**: Vite 6
- **Form Handling**: React Hook Form
- **Notifications**: Sonner

## Project Structure

```
├── src/
│   ├── api/               # API layer
│   │   ├── ApiResponse.ts
│   │   └── Fetcher.tsx
│   ├── components/        # Shared components
│   │   ├── Header.tsx
│   │   └── SideBar.tsx
│   ├── config/            # Configuration files
│   │   └── index.ts
│   ├── hooks/             # Custom hooks
│   │   └── useDebounce.tsx
│   ├── layout/            # Layout components
│   │   └── user/
│   │       └── UserLayout.tsx
│   ├── pages/             # Page components
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── HomePage.tsx
│   │   ├── Profile.tsx
│   │   ├── Settings.tsx
│   │   ├── SignInPage.tsx
│   │   └── SignUpPage.tsx
│   ├── routes/            # Route configuration
│   │   └── AppRoutes.tsx
│   ├── services/          # API services
│   │   └── usersservices/
│   │       └── SignUp.ts
│   ├── types/             # TypeScript types
│   │   └── UserType.ts
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── public/
│   └── logo.svg
├── .env                   # Environment variables
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd viettel-recruitment-portal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy .env.example to .env and update the values
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://api.viettelsoftware.com
VITE_APP_NAME=VTIT Recruitment Portal
VITE_APP_VERSION=1.0.0
VITE_ENV=development
```

### API Configuration

Update the API endpoints in `src/config/index.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.viettelsoftware.com',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      // ... other endpoints
    },
  },
};
```

## API Integration

The application uses a custom Fetcher class for API calls with:

- Automatic token refresh
- Request/response interceptors
- Error handling
- Timeout management

### Example Usage

```typescript
import { AuthService } from '@/services/usersservices/SignUp';

// Login
const response = await AuthService.login({
  username: 'user',
  password: 'password'
});

// The service automatically saves tokens to localStorage
```

## Features in Detail

### Authentication Flow

1. Users can register with email, username, and password
2. Login returns `accessToken` and `refreshToken`
3. Tokens are automatically stored in localStorage
4. API requests automatically include the access token
5. Expired tokens are automatically refreshed

### CV Management

- Create multiple CVs with different information
- Add/remove projects dynamically
- Add/remove skills with tags
- Save as draft or submit for review
- Track CV status (draft, pending, accepted, rejected)
- Edit draft CVs
- View submitted CVs

### Multi-language Support

- Switch between Vietnamese and English
- Language preference saved to localStorage
- All UI text translated

## Color Scheme

- **Primary Color**: Red (#DC2626) - Viettel brand color
- **Secondary Colors**: White, Gray shades
- **Status Colors**:
    - Draft: Gray
    - Pending: Yellow
    - Accepted: Green
    - Rejected: Red

## Contact

**Viettel Software**
- Address: 36A Dịch Vọng Hậu, Cầu Giấy, Hà Nội
- Phone: 1900 9118 (Nhánh số 1)
- Email: contact@viettelsoftware.com
- Website: www.viettelsoftware.com

## License

© 2026 Viettel Software. All rights reserved.
