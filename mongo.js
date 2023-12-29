
const Mongoose = require("mongoose");

const MONGO_APP_URL = "mongodb+srv://neo-rajkishore:NeoRajkishore12345@disha.btaddfx.mongodb.net/disha_fashion?retryWrites=true&w=majority";

module.exports = {
  init: async () => {
    try {
      const MONGOOSE_OPTIONS = {
        maxPoolSize: 100,
        minPoolSize: 10,
      };
      await Mongoose.connect(MONGO_APP_URL, MONGOOSE_OPTIONS);
      console.info('Database Connected');
    } catch (error) {
      console.error('Could not connect to database: ', error);
    }
  },

  connection: Mongoose.connection,

  close: () => (Mongoose.connection.readyState !== 1 ? Mongoose.connection.close(false) : true),
};


