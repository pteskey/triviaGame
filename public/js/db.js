require("dotenv").config();
const pgp = require("pg-promise")({
  error: function (error, e) {
    if (e.cn) {
      // A connection-related error;
      console.log("CN:", e.cn);
      console.log("EVENT:", error.message || error);
    }
  },
});

const db = pgp(process.env.DATABASE_URL + "?ssl=true");

module.exports = db;