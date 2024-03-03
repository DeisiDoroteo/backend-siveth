import { Router } from "express";
import {
  createUser,
  getUsers,
  logUser,

} from "../controllers/usuarios.controller.js";

const router = Router();

// Obtener todos los usuarios
router.get("/usuarios", getUsers);

// Insertar un usuario
router.post("/Create", createUser);

// Insertar un usuario
router.post("/logueo", logUser);

export default router;
