const mongoose = require('mongoose');
const colors = require('colors');

module.exports = {
  async init() {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `MongoDB Connected: ${conn.connection.host}`.brightMagenta.bold
    );
  },

  closeAll() {
    return new Promise((resolve) => mongoose.disconnect(resolve));
  },
};
