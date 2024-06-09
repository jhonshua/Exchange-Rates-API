import { Schema, model } from 'mongoose';

const dolarSchema = new Schema({
    fecha: {
        type: Date,
        required: true,
        default: Date.now,
    },
    precio: {
        type: String,
        required: true,
    },
});

export default model('Dolar', dolarSchema);
