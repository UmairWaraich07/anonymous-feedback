import mongoose from "mongoose";

type connectionObject = {
  isConnected?: Number;
};

let connection: connectionObject = {};

export const connectDB = async () => {
  if (connection?.isConnected) {
    console.log("already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    console.log(db);

    connection.isConnected = db.connections[0].readyState;
    console.log(connection);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log(`mongoDB connection failed, ${error}`);
    process.exit(1);
  }
};
