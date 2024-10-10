import mongoose from "mongoose";

const VarriantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  regular_price: {
    type: Number,
    default: 0,
  },
  sale_price: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  stock_status: {
    type: String,
    enum: ["in_stock", "out_of_stock"],
    default: "in_stock",
  },
  description: {
    type: String,
    default: "",
  },
});

export const AttributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: [VarriantSchema],
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Attribute", AttributeSchema);
