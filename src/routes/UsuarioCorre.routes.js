import { Router } from "express";
import {
  AsignarCodigo,
  enviarCorreoRecuperacion,
  verificarCodigoRecuperacion,
  cambiarContrasenia,
} from "../controllers/UsuarioCorreo.controller.js";

const router = Router();

// GET all Employees
router.post("/asignar",  AsignarCodigo);

// GET An Employee
router.post("/sendemail", enviarCorreoRecuperacion);

// DELETE An Employee
router.post("/verificar", verificarCodigoRecuperacion);

// INSERT An Employee
router.post("/cambiarContrasenia", cambiarContrasenia);


export default router;
