const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const clearData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected.');

    // Drop the current database entirely
    await mongoose.connection.db.dropDatabase();
    console.log('Database completely wiped!');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

clearData();
