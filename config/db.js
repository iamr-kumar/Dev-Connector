const mongoose = require('mongoose');

// connect to mongodb
const dbUri = process.env.MONGODB_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDb;
