# SmartWash Laundry Management System

A comprehensive desktop laundry shop management application with customer booking interface and admin dashboard.

## Features

### Customer Interface
- User registration and login system
- Interactive booking modal for scheduling laundry services
- Service selection with pricing
- Delivery service with distance-based pricing
- Payment options (Cash, GCash, PayMaya, Credit/Debit Card)
- Real-time booking status tracking
- Digital receipt system
- Account management

### Admin Dashboard
- Secure authentication (Username: `admin`, Password: `admin123`)
- Booking management with status updates
- Search and filter functionality
- Business statistics and metrics tracking
- Complete status workflow management

### Status Workflow
- **pending** - Initial booking status
- **confirmed** - Admin confirms the booking
- **in-progress** - Laundry is being processed
- **in-transit** - Out for delivery
- **completed** - Delivered (awaiting customer confirmation)
- **received** - Customer confirms receipt (customer-only action)
- **cancelled** - Booking cancelled

### Admin Access
- Hidden keyboard shortcut: Press `Ctrl+Alt+P` on the login page to access admin login

## Tech Stack

- **React 18.3** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons
- **date-fns** - Date manipulation
- **Sonner** - Toast notifications

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Installation

1. Extract the project files to your desired directory

2. Open the project in Visual Studio Code

3. Install dependencies:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

Or using pnpm:
```bash
pnpm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
smartwash/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── figma/           # Figma integration components
│   ├── AboutUs.tsx      # About page
│   ├── AdminDashboard.tsx
│   ├── AdminLogin.tsx
│   ├── BookingModal.tsx
│   ├── CustomerLogin.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── MyAccount.tsx
│   ├── Receipt.tsx
│   └── Services.tsx
├── styles/              # Global styles
│   └── globals.css      # Tailwind and custom styles
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── postcss.config.js    # PostCSS configuration
```

## Default Credentials

### Customer
- Users must register with:
  - First Name and Last Name
  - Email address
  - Password
  - 11-digit phone number

### Admin
- Username: `admin`
- Password: `admin123`

## Phone Number Validation
- Requires exactly 11 digits
- Philippine format (e.g., 09171234567)

## Currency
All prices are displayed in Philippine Pesos (₱)

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

- The application uses localStorage for data persistence
- No backend server required - all data is stored locally
- Admin access is available via Ctrl+Alt+P keyboard shortcut on login page
- Phone numbers must be exactly 11 digits
- All monetary values use Philippine Peso (₱) currency

## License

Proprietary - All rights reserved
