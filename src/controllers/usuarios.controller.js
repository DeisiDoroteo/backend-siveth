import bcrypt from 'bcrypt';
import { pool } from "../db.js";

export const createUser = async (req, res) => {
  try {
    const { nombre, apellidoPaterno, apellidoMaterno, correo, telefono, contrasenia, edad } = req.body;

   // Verificar que no falte ningun dato
    if (!nombre || !apellidoPaterno || !apellidoMaterno || !correo || !telefono || !contrasenia || !edad) {
      return res.status(400).json({ status: 'error', message: 'Datos incompletos o inválidos' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contrasenia, 10);

    // Insertar datos en la base de datos con la contraseña hasheada
    
    await pool.query(
      "INSERT INTO usuarios (Nombre, ApellidoP, ApellidoM, Correo, Telefono, Password, FechaN) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nombre, apellidoPaterno, apellidoMaterno, correo, telefono, hashedPassword, edad]
    );

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al insertar usuario en la base de datos:', error);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};




// Obtener todos los usuarios
// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};





// Obtener un usuario por su ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM Usuarios WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error);
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
};

// Eliminar un usuario por su ID
export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM Usuarios WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error("Error al eliminar usuario por ID:", error);
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
};

// Actualizar un usuario por su ID
export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellidoPaterno, apellidoMaterno, correo, telefono, contrasenia, edad } = req.body;

    const [result] = await pool.query(
      "UPDATE Usuarios SET Nombre = ?, ApellidoP = ?, ApellidoM = ?, Correo = ?, Telefono = ?, Password = ?, FechaN = ? WHERE id = ?",
      [nombre, apellidoPaterno, apellidoMaterno, correo, telefono, contrasenia, edad, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
    }

    res.json({ status: "success", message: "Usuario actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar usuario por ID:", error);
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
};

