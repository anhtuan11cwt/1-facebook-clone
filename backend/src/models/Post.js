import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    commentCount: {
      default: 0,
      type: Number,
    },
    comments: [
      {
        createdAt: {
          default: Date.now,
          type: Date,
        },
        mediaType: {
          default: null,
          enum: ["image", "video"],
          type: String,
        },
        mediaUrl: {
          default: null,
          type: String,
        },
        text: {
          required: true,
          trim: true,
          type: String,
        },
        user: {
          ref: "User",
          required: true,
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    content: {
      default: "",
      trim: true,
      type: String,
    },
    likeCount: {
      default: 0,
      type: Number,
    },
    likes: [
      {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    mediaType: {
      default: null,
      enum: ["image", "video"],
      type: String,
    },
    mediaUrl: {
      default: null,
      type: String,
    },
    shareCount: {
      default: 0,
      type: Number,
    },
    shares: [
      {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    user: {
      ref: "User",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Post", postSchema);
