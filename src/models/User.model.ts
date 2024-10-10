import mongoose, { Schema, Document } from "mongoose";

export interface RoomRequest extends Document {
  userId: Schema.Types.ObjectId;
  ownerId: Schema.Types.ObjectId;
  requestTime: Date;
  requestExpiry: Date;
  isAdvancePayment: boolean;
  advancePayment: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoomRequestSchema: Schema<RoomRequest> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  requestTime: {
    type: Date,
    required: true,
  },
  requestExpiry: {
    type: Date,
    required: true,
  },
  isAdvancePayment: {
    type: Boolean,
  },
  advancePayment: {
    type: Number,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: false,
  },
});

export interface User extends Document {
  name: string;
  email: string;
  username: string;
  password: string;
  isVerified: boolean;
  verificationToken: string;
  verificationTokenExpiry: Date;
  userType: string;
  isActive: boolean;
  roomRequests: RoomRequest[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<User> = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please enter valid email address"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verification Token is required"],
  },
  verificationTokenExpiry: {
    type: Date,
    required: [true, "Verification Token expiry is required"],
  },
  userType: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: false,
  },
  roomRequests: [RoomRequestSchema],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: false,
  },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
