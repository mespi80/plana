# Plana - Social Event Discovery Platform

Plana is a location-based mobile application that helps users discover and explore local events through an intuitive map and list interface.

## Features

- 🗺️ Interactive map view of local events
- 🔍 Event discovery based on location
- 👤 User authentication with Google OAuth
- 🌓 Dark mode support
- 📱 Responsive design
- 🎯 Role-based user management

## Tech Stack

### Frontend
- React
- TypeScript
- Material-UI
- Google Maps API
- React Router
- Context API for state management

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Google OAuth

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Google Cloud Platform account for Maps and OAuth

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/plana.git
cd plana
```

2. Install dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables
```bash
# Frontend
cp frontend/.env.example frontend/.env
# Update the values in .env with your configuration

# Backend
cp backend/.env.example backend/.env
# Update the values in .env with your configuration
```

4. Start the development servers
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server (in a new terminal)
cd frontend
npm start
```

## Deployment

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the environment variables
4. Deploy

### Frontend (Vercel)
1. Create a new project on Vercel
2. Connect your GitHub repository
3. Configure the environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
