import mongoose from "mongoose";

const connectDB = (uri) => {
  mongoose
    .connect(uri, { dbName: "CryptTalk" })
    .then((data) => {
      console.log(`connected to DB:${data.connection.host}`);
    })
    .catch((err) => {
      throw err;
    });
};

export { connectDB };
