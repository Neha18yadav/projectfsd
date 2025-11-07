import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Index common filter for data scoping & performance
postSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Post", postSchema);
