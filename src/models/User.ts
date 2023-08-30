import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuid } from "uuid";

interface IUser extends Document {
  _id: string;
  walletAddress: string;
  email: string;
  password: string;
  collectionIds: string[];
  deletedAt?: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    _id: { type: String, required: true, default: uuid },

    walletAddress: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    collectionIds: { type: [String], required: false },
    deletedAt: { type: Date, select: false },
  },
  {
    autoCreate: false,
    timestamps: true,
  }
);

// If you want to add custom methods or statics to your model, you can do so like this:
userSchema.methods.someCustomMethod = function () {
  // Custom method implementation
};

// If you want to use pre or post hooks, you can do so like this:
userSchema.pre<IUser>("save", function (next) {
  // Pre-save hook implementation
  next();
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
