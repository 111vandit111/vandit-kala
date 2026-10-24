import mongoose from "mongoose";
import { getEnv } from "./env";

const globalForMongoose = globalThis as typeof globalThis & {
  mongoosePromise?: Promise<typeof mongoose>;
};

export function connectDb(): Promise<typeof mongoose> {
  if (!globalForMongoose.mongoosePromise) {
    globalForMongoose.mongoosePromise = mongoose
      .connect(getEnv().MONGODB_URI, { autoIndex: true })
      .catch((err: unknown) => {
        globalForMongoose.mongoosePromise = undefined;
        throw err;
      });
  }
  return globalForMongoose.mongoosePromise;
}
