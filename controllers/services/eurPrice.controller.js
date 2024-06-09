import Euro from '../../models/eur.model.js';

export const getPriceEur = async (req, res) => {
  try {
    // Ensure sorting by fecha with optional secondary sorting by _id
    const Values = await Euro.find(); 

    // Verify data retrieval and handle empty results
    if (Values.length === 0) {
      return res.status(404).json({ message: 'No se encontraron registros de EUR' });
    }


    return res.status(200).json({ data: Values, name: 'euro de la union europea', sign: '€'  });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
  