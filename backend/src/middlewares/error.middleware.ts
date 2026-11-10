import type { ErrorRequestHandler, RequestHandler } from "express";

export class AppError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const rutaNoEncontrada: RequestHandler = (req, res) => {
  res.status(404).json({
    mensaje: `No existe la ruta ${req.method} ${req.path}`,
  });
};

export const manejarErrores: ErrorRequestHandler = (
  error, _req, res, _next,
) => {
  console.error(error);
  const status = error instanceof AppError ? error.status : 500;
  res.status(status).json({
    mensaje: error instanceof Error
      ? error.message
      : "Error interno del servidor",
  });
};
