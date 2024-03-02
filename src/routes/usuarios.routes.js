import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  deleteUserById,
  updateUserById ,
} from "../controllers/usuarios.controller.js";

const router = Router();

// Obtener todos los usuarios
router.get("/usuarios", getUsers);

// Obtener un usuario por su ID
router.get("/usuarios/:id", getUserById);


// Eliminar un usuario por su ID
router.delete("/usuarios/:id", deleteUserById);

// INSERT An Employee
router.post("/Create", createUser);
// router.post("/employees", createEmployee)


// Actualizar un usuario por su ID
router.put("/usuarios/:id", updateUserById);



export default router;
