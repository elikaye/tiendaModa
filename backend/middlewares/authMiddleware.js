import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado, token faltante' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto123');
    req.user = decoded; // aquí está la info del usuario del token
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
