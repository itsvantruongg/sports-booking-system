require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const { initCronJobs } = require('./utils/cronJobs');

console.log('--- Server Starting ---');
// Connect to Database
console.log('Connecting to MongoDB...');
connectDB().then(() => {
  console.log('connectDB() call finished (async)');
  initCronJobs();
});

const server = http.createServer(app);
console.log('Server object created');

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Owner joins their specific room
  socket.on('join_owner_room', (ownerId) => {
    socket.join(ownerId);
    console.log(`Owner ${ownerId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Export io to be used in other files (controllers/services)
app.set('io', io);

const PORT = process.env.PORT || 5000;

console.log(`Attempting to listen on port ${PORT}...`);
server.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`👉 API Docs: http://localhost:${PORT}/api-docs`);
});
