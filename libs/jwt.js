import 'dotenv/config';
import jwt from 'jsonwebtoken';

const tokenSecreto = process.env.TOKEN_SECRET;

export async function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, tokenSecreto, { expiresIn: '1d' }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}

