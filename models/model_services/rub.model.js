import { Schema, model } from 'mongoose';
  
const rubleSchema = new Schema({
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

export default model('Ruble', rubleSchema);