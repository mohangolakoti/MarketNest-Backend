const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured');
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    const atlasHint =
      'Could not connect to MongoDB. If you use Atlas, ensure Network Access allows your current IP and that MONGO_URI includes the target database name.';

    if (
      error &&
      (error.name === 'MongooseServerSelectionError' || error.name === 'MongoServerSelectionError')
    ) {
      throw new Error(`${atlasHint} Original error: ${error.message}`);
    }

    throw error;
  }
};

module.exports = connectDB;