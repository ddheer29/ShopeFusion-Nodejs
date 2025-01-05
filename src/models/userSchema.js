const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { _id: false }
);

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

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    purchaseDate: { type: Date, default: Date.now },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
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

const mongooseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    phone: {
      type: String,
      required: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Please use a valid phone number."],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Customer", "Vendor", "Admin"],
      required: true,
      default: "Customer",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    addresses: [AddressSchema],
    orders: [OrderSchema],
    vendorDetails: VendorSchema,
    otp: OTPSchema,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", mongooseSchema);
