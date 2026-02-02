# User Cart Frontend

A modern React application for food ordering with real-time cart updates using Socket.io.

## Features

- User authentication
- Browse menu items
- Add items to cart
- Real-time cart updates via WebSocket
- Update cart quantities
- Remove items from cart
- Admin actions notification

## Tech Stack

- React 18
- Vite
- React Router v6
- TanStack Query (React Query)
- Socket.io Client
- Axios
- Tailwind CSS
- Lucide React (icons)

## Project Structure

```
user-cart-frontend/
├── src/
│   ├── app/                    # App configuration
│   ├── components/             # Reusable components
│   ├── contexts/              # React contexts
│   ├── features/              # Feature modules
│   │   ├── auth/              # Authentication
│   │   ├── cart/              # Cart management
│   │   └── menu/              # Menu display
│   ├── hooks/                 # Custom hooks
│   ├── pages/                 # Page components
│   ├── routes/                # Route configuration
│   └── services/              # API and socket services
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory:
   ```
   VITE_API_URL=http://localhost:3000/api
   VITE_SOCKET_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The application connects to a backend API with the following endpoints:

- `POST /auth/login` - User login
- `GET /user/menu` - Get menu items
- `GET /user/cart` - Get user cart
- `POST /user/cart/add` - Add item to cart
- `PATCH /user/cart/update` - Update cart item quantity
- `DELETE /user/cart/remove` - Remove item from cart

## WebSocket Events

The application listens to the following socket events:

- `cart:join` - Join user's cart room
- `cart:leave` - Leave user's cart room
- `user:cart:updated` - Cart updated event
- `user:cart:admin_action` - Admin action on cart

## License

MIT
# Gharse-user-react
