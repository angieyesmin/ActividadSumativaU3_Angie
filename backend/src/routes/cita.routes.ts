import { Router } from "express";

import {
  borrarCita, cambiarEstado, modificarCita,
  obtenerCita, obtenerCitas, registrarCita,
} from "../controllers/cita.controller.js";

import { asyncHandler } from "../utils/asyncHandler.js";

export const citaRouter = Router();

citaRouter.get("/", asyncHandler(obtenerCitas));
citaRouter.get("/:id", asyncHandler(obtenerCita));
citaRouter.post("/", asyncHandler(registrarCita));
citaRouter.put("/:id", asyncHandler(modificarCita));
citaRouter.patch("/:id/estado", asyncHandler(cambiarEstado));
citaRouter.delete("/:id", asyncHandler(borrarCita));
