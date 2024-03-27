const mongoose = require('mongoose');

const loadConnectionString = () => {
  const connectionString = process.env.MONGO_URI+process.env.DB_NAME;
  if (!connectionString) {
    throw new Error('MongoDB connection string not found in environment variable');
  }
  return connectionString;
};

const mongoDB = {
  connection: null,

  connect() {
    const connectionString = loadConnectionString();

    return mongoose.connect(connectionString)
      .then((connection) => {
        mongoDB.connection = connection;
        return mongoDB.connection;
      });
  },

  disconnect() {
    return mongoose.disconnect()
      .then(() => {
        console.log('MongoDB disconnecting...');
        mongoDB.connection = null;
        console.log('MongoDB disconnected successfully');
        return this;
      });
  }
};

module.exports = mongoDB;