import Dolar from '../../models/model_services/usd.model.js';

export const getPriceUsd = async (req, res) => {
	try {
		// Ensure sorting by fecha with optional secondary sorting by _id
		const Values = await Dolar.find();

		// Verify data retrieval and handle empty results
		if (Values.length === 0) {
			return res
				.status(404)
				.json({ message: 'No se encontraron registros de USD' });
		}

		return res
			.status(200)
			.json({
				data: Values,
				name: 'United States Dollar',
				sign: '$'
			});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error interno del servidor' });
	}
};
