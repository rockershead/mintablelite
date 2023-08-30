import mongoose from "mongoose";
const caFilePath = "./ca.pem";
const mongoUrl = process.env.DBURL;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  tlsAllowInvalidCertificates: true,
  tlsCAFile: caFilePath,
};

const mongoConnect = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(mongoUrl, options)
      .then(() => {
        console.log("Connected to MongoDB");
        resolve();
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        reject(err);
      });
  });
};

export  { mongoConnect };
