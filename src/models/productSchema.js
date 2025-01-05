const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const VendorSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true },
    shopAddress: AddressSchema,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    totalRevenue: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    vendor: VendorSchema,
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
      required: true,
    },
    reviews: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
