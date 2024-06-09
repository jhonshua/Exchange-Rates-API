import crypto from 'crypto';
import moment from 'moment';
import ApiKey from '../models/apiKey.model.js';

export const addApikey = async (req, res) => {
  const userId = req.body.userId;

  if (!userId || userId === '') {
    return res.status(404).json({ message: 'Missing field' });
  }

  try {
    // Find existing API key for the user
    const existingApiKey = await ApiKey.findOne({ userId });

    if (existingApiKey) {
      // Update existing API key
      existingApiKey.apiKey = crypto.randomBytes(32).toString('hex');
      existingApiKey.expiresAt = moment().add(30, 'days').toDate();

      await existingApiKey.save();

      return res.status(200).json({
        message: 'Clave API actualizada exitosamente',
        apiKey: existingApiKey.apiKey,
        expiresAt: existingApiKey.expiresAt,
      });
    } else {
      // Create a new API key
      const newApiKey = new ApiKey({
        userId,
        apiKey: crypto.randomBytes(32).toString('hex'),
        expiresAt: moment().add(30, 'days').toDate(),
      });

      await newApiKey.save();

      return res.status(200).json({
        message: 'Clave API generada exitosamente',
        apiKey: newApiKey.apiKey,
        expiresAt: newApiKey.expiresAt,
      });
    }
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ errors: error.errors });
    } else {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
};
