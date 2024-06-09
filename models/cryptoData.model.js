import { Schema, model } from 'mongoose';

const cryptoSchema= new Schema({
    fecha: {
        type: Date,
        required: true,
        default: Date.now,
      },
      data: {
        type: Array,
        required: true,
        default: [],
        items: {
          type: Object,
          required: true,
        },
      },
      status: {
        type: Object,
        required: false, 
        default: {}, 
      },
    }, { timestamps: true });
    

export default model('CryptoData', cryptoSchema);