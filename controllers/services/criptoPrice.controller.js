import CryptoData from '../../models/cryptoData.model.js';

export const getPriceCripto = async (req, res) => {
    try {
        // Ensure sorting by fecha with optional secondary sorting by _id
        const Values = await CryptoData.find();

        // Verify data retrieval and handle empty results
        if (Values.length === 0) {
            return res.status(404).json({ message: 'No se encontraron registros de Criptos' });
        }


        return res.status(200).json({ data: Values });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};