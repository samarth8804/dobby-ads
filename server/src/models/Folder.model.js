import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

folderSchema.index({ parentId: 1, userId: 1 });

// Prevent duplicate folder names in same directory
folderSchema.index({ name: 1, parentId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Folder", folderSchema);
