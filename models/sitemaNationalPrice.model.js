import { Schema, model } from 'mongoose';

const sitemaNationalPriceSchema = new Schema({
  banco: {
    type: String,
    required: true, // Mark 'banco' as a required field
  },
  compra: {
    type: Number,
    required: true, // Mark 'compra' as a required field
  },
  venta: {
    type: Number,
    required: true, // Mark 'venta' as a required field
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set default value for creation time
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Set default value for update time
  },
});

export default model('sitemaNationalPrice', sitemaNationalPriceSchema);
