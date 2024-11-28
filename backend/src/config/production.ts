export const config = {
  cors: {
    origin: process.env.FRONTEND_URL || 'https://plana.vercel.app',
    credentials: true,
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
  },
};
