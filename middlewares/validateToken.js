import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Este código es un middleware de Node.js que valida un token
// de autorización JWT.

const tokenSecreto = process.env.TOKEN_SECRET;

export const authRequired = (req, res, next) => {

  // Verificamos si el encabezado de autorización está presente.
  if ( req.headers['authorization'] == null && req.headers['authorization'] == undefined){
    res.status(500).json({ message: 'Error desconocido al verificar el token' });
  }

  const authorization = req.headers['authorization'] 
  if (authorization) {
    try {
      // Verificamos el token de acceso en el encabezado de autorización.
      jwt.verify(authorization.split(' ')[1], tokenSecreto, (err, user) => {
        if (err) {
          const errorType = err.name;
          switch (errorType) {
            case 'JsonWebTokenError':
              // Token inválido
              res.status(401).json({ message: 'Token inválido' });
              break;
            case 'TokenExpiredError':
              // Token expirado
              res.status(401).json({ message: 'Token expirado' });
              break;
            default:
              // Error desconocido
              res.status(500).json({ message: 'Error desconocido al verificar el token' });
          }
          return;
        }

        // Almacenamos el usuario en la solicitud
        req.user = user;

        // Continúa con la solicitud
        next();
      });
    } catch (error) {
      // Error inesperado
      console.error(error);
      res.status(500).json({ message: 'Error inesperado al verificar el token' });
    }
    return;
  }

  // Verificamos si el encabezado de cookies está presente.
  const token = req.cookies.token;
  if (token) {
    try {
      // Verificamos el token de acceso en el encabezado de cookies.
      jwt.verify(token, tokenSecreto, (err, user) => {
        if (err) {
          const errorType = err.name;
          switch (errorType) {
            case 'JsonWebTokenError':
              // Token inválido
              res.status(401).json({ message: 'Token inválido' });
              break;
            case 'TokenExpiredError':
              // Token expirado
              res.status(401).json({ message: 'Token expirado' });
              break;
            default:
              // Error desconocido
              res.status(500).json({ message: 'Error desconocido al verificar el token' });
          }
          return;
        }

        // Almacenamos el usuario en la solicitud
        req.user = user;

        // Continúa con la solicitud
        next();
      });
    } catch (error) {
      // Error inesperado
      console.error(error);
      res.status(500).json({ message: 'Error inesperado al verificar el token' });
    }
    return;
  }

  // Ninguno de los encabezados está presente.
  res.status(401).json({ message: 'Token no autorizado' });
};
