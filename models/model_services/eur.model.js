import { Schema, model } from 'mongoose';

const euroSchema = new Schema({
  fecha: {
    type: String,
    required: true,
  },
  precio: {
    type: String,
    required: true,
  },
  created:{
    type: Date,
    required: true,
  }
}, { timestamps: false }); 

export default model('Euro', euroSchema);