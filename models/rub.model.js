import { Schema, model } from 'mongoose';

const dateTransformer = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString(); 
  };
  
const rubleSchema = new Schema({
    fecha: {
        type: String,
        required: true,
      },
      precio: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        transform: dateTransformer,
      },
      updatedAt: {
        type: Date,
        transform: dateTransformer,
      },
    }, { timestamps: true }); 

export default model('Ruble', rubleSchema);