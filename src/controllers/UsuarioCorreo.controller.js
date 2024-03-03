import nodemailer from 'nodemailer';
import { pool } from "../db.js";
import bcrypt from 'bcrypt';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'siveth.uthh03@gmail.com', // Cambiar con tu dirección de correo electrónico
    pass: 'opzjuhdnacdqidsy' // Cambiar con tu contraseña
  }
});

export const AsignarCodigo = async (req, res) => {
  try {
    const { correo } = req.body;
    const randomCode = Math.floor(1000 + Math.random() * 9000);

    const selectQuery = 'SELECT * FROM codepass WHERE fk_usuario = ?';
    const [selectResults] = await pool.query(selectQuery, [correo]);

    if (selectResults.length > 0) {
      const updateQuery = 'UPDATE codepass SET codigo = ? WHERE fk_usuario = ?';
      await pool.query(updateQuery, [randomCode, correo]);
      res.json({ status: 'éxito', message: 'Código aleatorio actualizado con éxito', code: randomCode });
    } else {
      const insertQuery = 'INSERT INTO codepass (fk_usuario, codigo) VALUES (?, ?)';
      await pool.query(insertQuery, [correo, randomCode]);
      res.json({ status: 'éxito', message: 'Código aleatorio asignado con éxito', code: randomCode });
    }
  } catch (error) {
    console.error('Error al asignar código aleatorio:', error);
    return res.status(500).json({ message: 'Ocurrió un error al asignar el código aleatorio' });
  }
};

export const enviarCorreoRecuperacion = async (req, res) => {
  try {
    const { recipient_email } = req.body;

    const query = 'SELECT codigo FROM codepass WHERE fk_usuario = ?';
    const [results] = await pool.query(query, [recipient_email]);

    if (results.length > 0) {
      const OTP = results[0].codigo;

      const mailOptions = {
        from: 'siveth.uthh03@gmail.com', // Cambiar con tu dirección de correo electrónico de Gmail
        to: recipient_email,
        subject: 'Código de recuperación de contraseña',
        text: `Hola, acabas de recibir tu código de restablecimiento de contraseña. Por favor, ten cuidado y no lo compartas con nadie. Tu código es: ${OTP}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo electrónico de recuperación:', error);
          return res.status(500).json({ message: 'Error al enviar el correo electrónico de recuperación.' });
        } else {
          console.log('Correo electrónico de recuperación enviado:', info.response);
          return res.json({ message: 'Correo electrónico de recuperación enviado exitosamente.' });
        }
      });
    } else {
      return res.status(404).json({ message: 'No se encontró un código de recuperación asociado a este usuario.' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error interno del servidor al enviar el correo electrónico de recuperación.' });
  }
};

export const verificarCodigoRecuperacion = async (req, res) => {
  try {
    const { correo, codigo } = req.body;

    const query = 'SELECT * FROM codepass WHERE fk_usuario = ? AND codigo = ?';
    const [results] = await pool.query(query, [correo, codigo]);

    if (results.length > 0) {
      return res.json({ message: 'Código de recuperación válido. Redirigiendo...' });
    } else {
      return res.status(404).json({ message: 'El código de recuperación no es válido.' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error interno del servidor al verificar el código de recuperación.' });
  }
};

export const cambiarContrasenia = async (req, res) => {
  try {
    const { correo, contraseniaNueva } = req.body;

    const hashedPassword = await bcrypt.hash(contraseniaNueva, 10);

    const sql = "UPDATE usuarios SET Password = ? WHERE Correo = ?";
    await pool.query(sql, [hashedPassword, correo]);

    console.log("Contraseña actualizada correctamente");
    return res.status(200).send("Contraseña actualizada correctamente");
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    return res.status(500).send("Error al actualizar la contraseña");
  }
};
