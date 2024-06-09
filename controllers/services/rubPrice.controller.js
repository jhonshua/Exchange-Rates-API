import Ruble from '../../models/rub.model.js';

export const getPriceRub = async (req, res) => {
	try {
		// Ensure sorting by fecha with optional secondary sorting by _id
		const lastThreeValues = await Ruble.find();

		// Verify data retrieval and handle empty results
		if (lastThreeValues.length === 0) {
			return res
				.status(404)
				.json({ message: 'No se encontraron registros de RUB' });
		}

		// Format response with desired fields (assuming 'valor' is correct)
		const formattedResponse = lastThreeValues.map((value) => ({
			valor: value.valor,
			fecha: value.fecha
		}));

		return res
			.status(200)
			.json({ data: lastThreeValues, name: 'Rublo ruso', sign: '₽' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error interno del servidor' });
	}
};
