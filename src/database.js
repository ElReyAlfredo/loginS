const mongoose = require("mongoose");
const { mongodb } = require("./keys");

mongoose
  .connect(mongodb.URI, {})
  .then((db) => console.log("La base de datos esta conectada viejón"))
  .catch((err) => console.error(err));
