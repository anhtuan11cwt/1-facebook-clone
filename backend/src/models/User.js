import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    bio: {
      default: null,
      ref: "Bio",
      type: mongoose.Schema.Types.ObjectId,
    },
    coverPhoto: {
      default: null,
      type: String,
    },
    dateOfBirth: {
      required: true,
      type: Date,
      validate: {
        message: "Bạn phải đủ 18 tuổi",
        validator(value) {
          if (!value) return false;
          const age = Math.floor(
            (Date.now() - new Date(value).getTime()) / 31557600000,
          );
          return age >= 18;
        },
      },
    },
    email: {
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    followerCount: {
      default: 0,
      type: Number,
    },
    followers: [
      {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    following: [
      {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    followingCount: {
      default: 0,
      type: Number,
    },
    gender: {
      enum: {
        message: "Giới tính không hợp lệ",
        values: ["male", "female"],
      },
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
      validate: {
        message: "Mật khẩu phải có ít nhất 8 ký tự",
        validator(value) {
          return value && value.length >= 8;
        },
      },
    },
    profilePicture: {
      default: null,
      type: String,
    },
    username: {
      minlength: [3, "Tên người dùng phải có ít nhất 3 ký tự"],
      required: true,
      trim: true,
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
