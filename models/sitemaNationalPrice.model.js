import { Schema, model } from 'mongoose';

const dateTransformer = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString();
};

const sitemaNationalPriceSchema = new Schema({
  
    createdAt: {
        type: Date,
        transform: dateTransformer,
    },
    updatedAt: {
        type: Date,
        transform: dateTransformer,
    },
}, { timestamps: true });

export default model('sitemaNationalPrice', sitemaNationalPriceSchema);