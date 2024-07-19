import { Schema, model } from 'mongoose';
  
const dolarSchema = new Schema({
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

export default model('Dolar', dolarSchema);
