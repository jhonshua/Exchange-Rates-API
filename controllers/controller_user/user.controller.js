import User from '../../models/model_user/user.model.js';
import { createAccessToken } from '../../libs/jwt.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

function sendMail(mail) {
  // Creamos un transportador
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'josepepes33321@gmail.com',
      pass: 'zhuv gdgy dsyc suuu'
    }
  });

  // Enviamos el correo electrónico
  transporter.sendMail(mail);
}

// Obtener todo los Users
export const GetAllUsers = async (req, res) => {
  const total = await User.countDocuments();
  const limit = req.query.limit || Infinity;
  const skip = req.query.skip || 0;
  const page = skip / limit + 1;
  const sort = req.query.sort || 'asc';
  const status = req.query.status; // Parámetro para búsqueda por estado
  const full_name = req.query.full_name; // Parámetro para búsqueda por nombre completo
  const rol_name = req.query.rol_name; // Parámetro para búsqueda por rol
  
  const params = { skip, sort, page, status, full_name, rol_name };

  let users;

  if (full_name && status && rol_name) {
    users = await User.find({
      full_name: { $regex: full_name },
      status: status,
      rol_name: rol_name
    })
      .skip(skip)
      .limit(limit)
      .sort({ full_name: sort });
  } else if (full_name && rol_name) {
    users = await User.find({
      full_name: { $regex: full_name },
      rol_name: rol_name
    })
      .skip(skip)
      .limit(limit)
      .sort({ full_name: sort });
  } else if (status && rol_name) {
    users = await User.find({
      status: status,
      rol_name: rol_name
    })
      .skip(skip)
      .limit(limit)
      .sort({ full_name: sort });
  } else if (full_name) {
    users = await User.find({
      full_name: { $regex: full_name }
    })
      .skip(skip)
      .limit(limit)
      .sort({ full_name: sort });
  } else if (status) {
    users = await User.find({
      status: status
    })
      .skip(skip)
      .limit(limit)
      .sort({ full_name: sort });
  } else if (rol_name) {
    users = await User.find({
      rol_name: rol_name
    })
      .skip(skip)
      .limit(limit)
      .sort({ full_name: sort });
  } else {
    users = await User.find().skip(skip).limit(limit).sort({ full_name: sort });
  }

  if (!users) {
    return res.status(404).json({ message: 'Users not found' });
  }

  res.status(200).json({ total, users, params });
};

// Obtener  los User por id
export const GetUserById = async (req, res) => {
  const id = req.params.id;

  try {
    // Find user by ID
    const userFound = await User.findById(id);

    if (!userFound) {
      return res.status(404).json({ message: 'Usuario no encontrado' }); // Use Spanish for consistency
    }

    res.status(200).json(userFound);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error al obtener usuario.' }); // Generic error message
  }
};


// Borrar  los User por id
export const DeleteUser = async (req, res) => {
  const id = req.params.id;
  const rol = await User.findById(id);
  if (!rol) {
    return res.status(404).json({ message: 'User not found' });
  }
  try {
    const userDelete = await User.deleteOne({ _id: id });
    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'error occurred deleting Rol.' });
  }
};

// Crear  los User
export const CreateUser = async (req, res) => {
  const {
    rol,
    rol_name,
    full_name,
    username,
    email,
    phone,
    password,
    status,
    rol_id
  } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      rol,
      rol_name,
      full_name,
      username,
      email,
      phone,
      rol_id,
      status,
      password: passwordHash
    });
    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id });
    res.cookie('token', token);
    res.status(200).json({
      id: userSaved._id,
      full_name: userSaved.full_name,
      username: userSaved.username,
      rol: userSaved.rol,
      rol_name: userSaved.rol_name,
      staus: userSaved.status,
      email: userSaved.email,
      phone: userSaved.phone,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
      ability: [
        {
          action: 'manage',
          subject: 'all'
        }
      ]
    });

    // **Modificación**
    // Agregamos el texto del correo electrónico al cuerpo del mensaje
    const mail = {
      to: `${userSaved.email}`,
      from: 'josepepes33321@gmail.com',
      subject: 'Cambio de usuario',
      text: `
          Hola ${userSaved.full_name},
  
          Se ha creado tu usuario exitosamente .
  
        `
    };

    // Enviamos el correo electrónico
    sendMail(mail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Atualizar  los Users por id
export const UpdateUser = async (req, res) => {
  const id = req.params.id;

  try {
    // Find user by ID
    const userFound = await User.findById(id);

    if (!userFound) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Update user data selectively (efficiency improvement)
    const updatedFields = req.body; // Destructure directly if needed
    userFound.set(updatedFields);

    // Password validation (optional)
    // If password is included in the update request, consider validation
    // and hashing (if applicable) before saving.

    // Save updated user data
    const updatedUser = await userFound.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error al actualizar usuario.' }); // Generic error message
  }
};
