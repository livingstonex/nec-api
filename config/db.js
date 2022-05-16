const mongoose = require('mongoose');
const colors = require('colors');

const connectDb = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`.brightMagenta.bold);
};

module.exports = connectDb;
