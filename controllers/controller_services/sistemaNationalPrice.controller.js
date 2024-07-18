import sitemaNationalPrice from '../../models/model_services/sitemaNationalPrice.model.js';

export const GetPrecioNational = async (req, res) => {
  try {
    // Ensure sorting by fecha with optional secondary sorting by _id
    const Values = await sitemaNationalPrice.find(); 

    // Verify data retrieval and handle empty results
    if (Values.length === 0) {
      return res.status(404).json({ message: 'No se encontraron registros Tasas Informativas del Sistema Bancario (Bs/USD)' });
    }


    return res.status(200).json({ data: Values, name: 'Tasas Informativas del Sistema Bancario ', sign: '(Bs/USD $)'  });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
  