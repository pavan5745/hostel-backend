const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");
const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    //useNewUrlParser: true,
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
    //useCreateIndex: true,
    //useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connection successful!");
    //require("./dev-data/seed");
  })
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port:${port}`);
});
