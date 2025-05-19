const mongoose = require('mongoose');

const connectDB = async () => {
  const dbUrl = process.env.MONGODB_URL;

  // Validate the MongoDB URL
  if (!dbUrl) {
    console.error('MONGODB_URL environment variable is not set.');
    process.exit(1);
  }

  let retries = 5; // Number of retries if the connection fails

  while (retries) {
    try {
      // Attempt to connect to the MongoDB
      await mongoose.connect(dbUrl);
      console.log('MongoDB connected successfully');
      break; // Break out of the loop if connection is successful
    } catch (error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
      retries -= 1;

      if (retries === 0) {
        console.error('All retry attempts failed. Exiting...');
        process.exit(1);
      }

      console.log(`Retrying to connect... (${5 - retries}/5)`);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
    }
  }
};

module.exports = connectDB;
