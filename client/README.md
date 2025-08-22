# Todo List Client

React TypeScript frontend for the Todo List management application.

## Features

- **User Management** - Create and manage user accounts
- **List Management** - Create todo lists associated with users
- **Task Management** - Create, update, and track tasks within lists
- **Real-time Updates** - Live data synchronization with backend API
- **Responsive Design** - Clean, functional interface with inline styling

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **Axios** - HTTP client for API communication

## Project Structure

```
src/
├── components/
│   ├── UserManager.tsx    # User CRUD operations
│   ├── ListManager.tsx    # List CRUD operations
│   └── TaskManager.tsx    # Task CRUD operations
├── api.ts                 # API client configuration
├── types.ts              # TypeScript type definitions
├── App.tsx               # Main application component
├── main.tsx              # Application entry point
└── index.css             # Global styles
```

## API Integration

The client connects to the FastAPI backend at `http://localhost:8000` and provides:

### User Operations
- Create new users with email, username, and password
- View all users
- Delete users

### List Operations
- Create lists associated with users
- View all lists with owner information
- Delete lists (cascades to tasks)

### Task Operations
- Create tasks within lists
- Mark tasks as complete/incomplete
- Set task priority levels (Low, Medium, High, Critical)
- Delete tasks

## Development

### Local Development
```bash
npm install
npm run dev
```
Server runs on http://localhost:5173

### Docker Development
```bash
# From project root
docker-compose up client
```
Client accessible at http://localhost:3000

### Build for Production
```bash
npm run build
npm run preview
```

## Environment Configuration

The client is configured to work with:
- **API Endpoint**: `http://localhost:8000`
- **Development Port**: `5173` (Vite default)
- **Production Port**: `3000` (via Docker)

## Container Configuration

- **Base Image**: `node:20-alpine`
- **Development Mode**: Uses Vite dev server with hot reload
- **Volume Mounting**: Source code mounted for live updates
- **Port Mapping**: `3000:5173` (external:internal)

## Dependencies

### Production
- `axios` - HTTP client for API requests
- `react` - UI framework
- `react-dom` - React DOM renderer

### Development
- `@types/react` & `@types/react-dom` - TypeScript definitions
- `@vitejs/plugin-react` - Vite React support
- `typescript` - TypeScript compiler
- `vite` - Build tool and dev server

## Usage

1. **Start with Users**: Create user accounts first
2. **Create Lists**: Add todo lists for each user
3. **Add Tasks**: Create tasks within lists
4. **Manage Tasks**: Update completion status and priority
5. **Navigate**: Use tab interface to switch between sections

## API Dependencies

Requires the FastAPI backend server to be running on port 8000. The client will display errors if the API is unavailable.