import mongoose from 'mongoose';

const rolSchema = new mongoose.Schema(
  {
    home: {
      type: String,
      max: 255,
      default: '/',
      required: true
    },
    status: {
      type: Number,
      default: 1,
      required: true
    },
    group: {
      type: String,
      max: 20,
      unique: true,
      lowercase: true,
      trim: true,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    name: {
      type: String,
      max: 50,
      trim: true,
      required: true
    },
    users: [
      {
        username: [String],
        full_name: [String],
        _id: [String]
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Rol', rolSchema);
