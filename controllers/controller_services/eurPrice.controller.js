import Euro from '../../models/model_services/eur.model.js';

export const getPriceEur = async (req, res) => {
	try {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		const formattedYesterday = yesterday.toLocaleDateString('en-CA');

		const today = new Date();
		const formattedtoday = today.toLocaleDateString('en-CA');

		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);
		const formattedtomorrow = tomorrow.toLocaleDateString('en-CA');

		const yesterdaySearch = `${formattedYesterday}T17:00:00.000Z`;
		const todaySearch = `${formattedtoday}T18:00:00.000Z`;
		const tomorrowSearch = `${formattedtomorrow}T18:00:00.000Z`;

		const todayDocuments = await Euro.find({
			created: { $gte: yesterdaySearch, $lt: todaySearch }
		});

		const tomorrowDocuments = await Euro.find({
			created: { $gte: todaySearch, $lt: tomorrowSearch }
		});

		if (todayDocuments.length === 0) {
			return res
				.status(404)
				.json({ message: 'No se encontraron registros de euros para hoy' });
		}

		return res.status(200).json({
			data: todayDocuments,
			name: ' Euro | Unión Europea',
			rate: "Euro vs Bs",
			indicator: "BCV",
			sign: '€'
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error interno del servidor' });
	}
};

export const getPriceEurDate = async (req, res) => {
	try {
		// Check for dates in request body
		if (!req.body || !req.body.startDate || !req.body.endDate) {
			return res
				.status(400)
				.json({
					message: 'Faltan fechas en el cuerpo de la solicitud (req.body)'
				});
		}

		const startDate = new Date(req.body.startDate);
		const endDate = new Date(req.body.endDate);

		// Validate date format
		if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
			return res
				.status(400)
				.json({
					message: 'Las fechas proporcionadas tienen un formato incorrecto'
				});
		}

		// Ensure end date is after start date
		if (endDate <= startDate) {
			return res
				.status(400)
				.json({
					message: 'La fecha final debe ser posterior a la fecha inicial'
				});
		}

		const documents = await Euro.find({
			created: { $gte: startDate, $lt: endDate }
		});

		// Verify data retrieval and handle empty results
		if (documents.length === 0) {
			return res
				.status(404)
				.json({
					message:
						'No se encontraron registros de Euro entre las fechas solicitadas'
				});
		}

		return res.status(200).json({
			data: documents,
			name: ' Euro | Unión Europea',
			rate: "Euro vs Bs",
			indicator: "BCV",
			sign: '€'
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error interno del servidor' });
	}
};
