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

const OrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const mongooseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: [OrderItemSchema],
    shippingAddress: AddressSchema,
    paymentMethod: {
      type: String,
      enum: [
        "Credit Card",
        "Debit Card",
        "PayPal",
        "UPI",
        "Cash on Delivery",
        "Net Banking",
      ],
      required: true,
    },
    paymentStaus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", mongooseSchema);
