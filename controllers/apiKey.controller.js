import crypto from 'crypto';
import moment from 'moment'; 
import User from '../models/user.model.js';

export const addApikey = async (req, res) => {
	console.log(req.body.userId)
	const userId = req.body.userId;

	if (!userId || userId === '') {
		return res.status(404).json({ message: 'Missing field' });
	}

	const apiKey = crypto.randomBytes(32).toString('hex');
	const expirationDate = moment().add(30, 'days').toDate(); 

	try {
		const user = await User.findByIdAndUpdate(userId, {
			apiKey,
			expirationDate
		});
		if (!user) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		}

		return res
			.status(200)
			.json({
				message: 'Clave API generada exitosamente',
				apiKey,
				expiresAt: expirationDate
			});
	} catch (error) {
		console.error(error);
		if (error.name === 'ValidationError') {
			return res.status(400).json({ errors: error.errors });
		} else {
			return res.status(500).json({ message: 'Error interno del servidor' });
		}
	}
};
