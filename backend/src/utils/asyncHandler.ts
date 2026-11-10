//Tipos proporcionados por Express,
import type { RequestHandler } from "express";

//Extrae automaticamente los parámetros de un controlador de Express
//req, res, next
type FuncionAsincrona = (
  ...argumentos: Parameters<RequestHandler> 
  //..argumentos recibe los parámetros como un lista
) => Promise<void>; //una función asíncron que no necesita devolver un valor

//recibe un controlador asíncrino y devuelve un controlador compatible
//con express
export const asyncHandler = (
  funcion: FuncionAsincrona,
): RequestHandler => (req, res, next) => {
  void funcion(req, res, next).catch(next); //ejecuta el controlador
  //si ocurre un error lo captura catch
};
