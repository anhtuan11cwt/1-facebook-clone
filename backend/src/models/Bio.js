import mongoose from "mongoose";

const bioSchema = new mongoose.Schema(
  {
    bioText: {
      default: "",
      maxlength: [200, "Giới thiệu không được vượt quá 200 ký tự"],
      type: String,
    },
    education: {
      default: "",
      type: String,
    },
    homeTown: {
      default: "",
      type: String,
    },
    liveIn: {
      default: "",
      type: String,
    },
    phone: {
      default: "",
      type: String,
      validate: {
        message: "Số điện thoại phải có 9-10 số và bắt đầu bằng số 0",
        validator(value) {
          if (!value) return true;
          return /^0\d{8,9}$/.test(value);
        },
      },
    },
    relationship: {
      default: "",
      type: String,
      validate: {
        message: "Trạng thái quan hệ không hợp lệ",
        validator(value) {
          if (!value) return true;
          return [
            "single",
            "married",
            "in a relationship",
            "engaged",
            "divorced",
            "widowed",
          ].includes(value);
        },
      },
    },
    workPlace: {
      default: "",
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Bio", bioSchema);
