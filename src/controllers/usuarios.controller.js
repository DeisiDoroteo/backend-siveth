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
export const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};



export const logUser= async (req, res) => {
  try {
    const { correo, contrasenia } = req.body;

    // Consultar la base de datos para verificar las credenciales
    const [rows] = await pool.query("SELECT * FROM Usuarios WHERE Correo = ?", [correo]);

    if (rows.length === 0) {
      return res.status(400).json({ status: "error", message: "Usuario no registrado" });
    }

    // Usuario encontrado en la base de datos
    const usuario = rows[0];
    
    // Comparar la contraseña hasheada almacenada en la base de datos con la contraseña proporcionada
    const passwordMatch = await bcrypt.compare(contrasenia, usuario.Password);

    if (passwordMatch) {
      // Contraseña correcta: Usuario autenticado
      res.json({ status: 'success', message: 'Inicio de sesión exitoso' });
    } else {
      // Contraseña incorrecta
      res.status(400).json({ status: 'error', message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error);
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
};
