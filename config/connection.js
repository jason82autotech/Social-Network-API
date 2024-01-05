const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/socialNetwork');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

const dbConnection = mongoose.connection;

dbConnection.on('open', () => {
  console.log('MongoDB connection opened');
});

dbConnection.on('connected', () => {
  console.log('MongoDB connected');
});

dbConnection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

dbConnection.on('error', (error) => {
  console.error('MongoDB error:', error);
});

process.on('SIGINT', () => {
  dbConnection.close(() => {
    console.log('MongoDB connection closed due to application termination');
    process.exit(0);
  });
});

connectToDatabase();

module.exports = {
  getDbConnection: () => dbConnection,
};
