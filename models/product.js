const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  richDescription: {
    type: String,
    default: "",
  },
  images: {
    type: Array,
    default:null,
  },
  brand: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: "0",
  },
  category: {
    type: String,
    required: true,
    enum: ["Electronics", "Mens", "Women", "Watches", "Other"],
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

productSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Product", productSchema);
