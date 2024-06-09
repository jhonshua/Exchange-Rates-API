import ApiKey from '../models/apiKey.model.js';

export const verifyApiKey = async (req, res, next) => {
    const apiKey = req.params.apiKey; // Obtener la API Key del query string
  
    if (!apiKey) {
      return res.status(400).json({ message: 'API Key no proporcionada' });
    }
  
    try {
      const apiKeyRecord = await ApiKey.findOne({ apiKey });
  
      if (!apiKeyRecord) {
        return res.status(401).json({ message: 'API Key no válida' });
      }
  
      if (apiKeyRecord.expirationDate < Date.now()) {
        return res.status(401).json({ message: 'API Key caducada' });
      }
  
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
  
  