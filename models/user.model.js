import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: false,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true,
    minLength: 13,
    maxLength: 13
  },
  status: {
    type: String,
    required: true
  },
  rol_id: {
    type: String,
    required: true
  },
  ability: {
    type: Object,
    required: true
  },
  apiKey: {
    type: String,
    default: null // Valor por defecto null para apiKey
  },
  expirationDate: {
    type: Date,
    default: null // Valor por defecto null para expirationDate
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
