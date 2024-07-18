import User from '../../models/model_user/user.model.js';
//import Rol from '../models/rol.model.js';
import { createAccessToken } from '../../libs/jwt.js';
import { sendMail } from '../../libs/sendEmail.js';
import bcrypt from 'bcryptjs';

//registramos nuevo usuario**************************************************
export const register = async (req, res) => {
console.log('me ejecuto')
	const {
		full_name,
		username,
		email,
		password,
		phone,
		status,
		rol_id,
		ability
	} = req.body;


	const passwordHash = await bcrypt.hash(password, 10);
	const newUser = new User({
		full_name,
		username,
		email,
		password: passwordHash,
		phone: parseInt(phone),
		status,
		rol_id,
		ability
	});

	try {
		const userSaved = await newUser.save();
		const token = await createAccessToken({ id: userSaved._id });
		res.cookie('token', token);
		res.status(200).json(userSaved);
		sendMail(userSaved.email, userSaved.username, userSaved.rol_id, password);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

//login usuario*******************************************************************
export const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Find user by email
		const userFound = await User.findOne({ email });
		if (!userFound) {
			return res.status(400).json({ message: 'Invalid email or password' }); 
		}

		// Validate password
		const isMatch = await bcrypt.compare(password, userFound.password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid email or password' }); 
		}

		// Generate token and retrieve user information
		const token = await createAccessToken({ id: userFound._id });
		//const rolFound = await Rol.findOne({ name: userFound.rol_name });

		res.cookie('token', token);
		res.json({
			accessToken: token,
			authentication: {
				strategy: 'local'
			},
			user: {
				_id: userFound._id,
				username: userFound.username,
				email: userFound.email,
				full_name: userFound.full_name,
				rol_id: userFound.rol_id,
				role: userFound.rol_name,
				ability: userFound.ability
			}
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

//logout de usuario**************************************************************************************
export const logout = (req, res) => {
	res.cookie('token', '', {
		expires: new Date(0)
	});
	return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
};

//eliminamos usarios de la aplicacion********************************************************************
export const deleteUser = async (req, res) => {
	const { id } = req.body;

	try {
		// Find user by ID
		const userFound = await User.findOne({ _id: id });

		if (!userFound) {
			return res.status(400).json({ message: 'Usuario no existe' });
		}
		await User.deleteOne({ _id: id });

		res.status(200).json({ message: 'Usuario borrado con exito!' });
	} catch (error) {
		console.error(error); 
		res.status(500).json({ message: 'Error al borrar usuario.' }); 
	}
};
