export const PORT = process.env.PORT || 4001;
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = process.env.DB_PORT || 3306;
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME || "parafacturas";

if (!process.env.TOKEN_SECRET) {
  throw new Error("TOKEN_SECRET no está definida en las variables de entorno. El servidor no puede iniciar.");
}
if (!process.env.DB_PASSWORD) {
  throw new Error("DB_PASSWORD no está definida en las variables de entorno. El servidor no puede iniciar.");
}

export const TOKEN_SECRET = process.env.TOKEN_SECRET;
