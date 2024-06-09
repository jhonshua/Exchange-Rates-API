import User from '../models/user.model.js';

export const validateUserRegistration = async (req, res, next) => {
	const EMAIL_REGEX =
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	const PASSWORD_REGEX = /^[a-zA-Z0-9]{6}$/;

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

	if (
		!full_name ||
		!username ||
		!email ||
		!password ||
		!phone ||
		!status ||
		!rol_id ||
		!ability
	) {
		return res.status(400).json({ message: 'Missing field' });
	}
	//validation mail

	if (!EMAIL_REGEX.test(email)) {
		return res.status(400).json({ message: 'Invalid email address' });
	}

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: 'Email already exists' });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal server error' });
	}

	//validation password
	if (!PASSWORD_REGEX.test(password)) {
		return res.status(400).json({ message: 'Invalid password' });
	}
	next();
};

export const validateReqBody = async (req, res, next) => {

	if (!Object.keys(req.body).length ) {
		return res.status(401).json({ message: 'Missing body reques' });
	}

	if (!Object.keys(req.body).length === 0) {
		return res.status(400).json({ message: 'Empty JSON body.' });
	}
	next();
}


export const validateUserlogin = async (req, res, next) => {


	const { email, password } = req.body;

	if (!email) {
		return res.status(400).json({ message: 'Missing field email' });
	}
	if (!password) {
		return res.status(400).json({ message: 'Missing field password' });
	}

	next();

}
