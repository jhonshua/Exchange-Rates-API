import { Schema, model } from 'mongoose';

const notValidTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default model('notValidToken', notValidTokenSchema );