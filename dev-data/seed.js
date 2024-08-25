const mongoose = require("mongoose");
const Hostel = require("./../models/hostelModel");
const Room = require("./../models/roomModel");
const initialData = require("./initialData");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    //useNewUrlParser: true,
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
    //useCreateIndex: true,
    //useFindAndModify: false,
  })
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.log(err));

async function seedDatabase() {
  try {
    for (const hostelData of initialData.hostels) {
      let hostel = await Hostel.findOne({ name: hostelData.name });
      if (!hostel) {
        const roomDocs = await Room.insertMany(hostelData.rooms);
        const roomIds = roomDocs.map((room) => room._id);
        hostel = new Hostel({
          name: hostelData.name,
          address: hostelData.address,
          rooms: roomIds,
        });
        await hostel.save();
      }
    }
    console.log("Database seeded succefully");
    mongoose.connection.close();
  } catch (error) {
    console.log("error in seeding data");
    mongoose.connection.close();
  }
}

seedDatabase();
