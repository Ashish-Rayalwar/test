const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const PENDING = "pending";
const COMPLETED = "completed";
const CANCELLED = "cancelled";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
    },

    fileId: {
      type: ObjectId,
      ref: "File",
      // unique: true,
    },

    status: {
      type: String,
      default: PENDING,
      enum: [PENDING, COMPLETED, CANCELLED],
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
