const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const moment = require('moment');
const nodemailer = require('nodemailer');

const bcrypt = require('bcryptjs');

const port = process.env.PORT || 3001;


// app.use(cors());
// app.use(express.json());
// const db = mysql.createConnection({
//     host:'uk-fast-web1216.main-hosting.eu',
//     user:'u233332198_BD_Siveth',
//     password:'Siveth28032003*',
//     database:'u233332198_BD_Siveth',

// });
// db.connect((err) => {
//   if (err) {
//       console.error('Error al conectar con la base de datos:', err);
//       return;
//   }
//   console.log('Conexión exitosa a la base de datos:', db.config.database);
// });

// // Configurar Nodemailer
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'siveth.uthh03@gmail.com', // Cambiar con tu dirección de correo electrónico
//     pass: 'opzjuhdnacdqidsy' // Cambiar con tu contraseña
//   }
// });

// app.get("/", (req, res) => {
//   res.send("Welcome to my first API with Node js!");
// });

// // Registro de usuarios
// app.post('/Create', (req, res, next) => {
//   const { nombre, apellidoPaterno, apellidoMaterno, correo, telefono, contrasenia, edad } = req.body;

//   // Realiza alguna validación de datos (ejemplo: todos los campos son obligatorios)
//   if (!nombre || !apellidoPaterno || !apellidoMaterno || !correo || !telefono || !contrasenia || !edad) {
//       res.status(400).json({ status: 'error', message: 'Datos incompletos o inválidos' });
//   } else {
//       // Hash de la contraseña
//       bcrypt.hash(contrasenia, 10, (err, hashedPassword) => {
//           if (err) {
//               console.log('Error al hashear la contraseña:', err);
//               res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
//           } else {
//               // Insertar datos en la base de datos con la contraseña hasheada
//               db.query('INSERT INTO Usuarios (Nombre, ApellidoP, ApellidoM, Correo, Telefono, Password, FechaN) VALUES (?, ?, ?, ?, ?, ?, ?)',
//                   [nombre, apellidoPaterno, apellidoMaterno, correo, telefono, hashedPassword, edad], (error, result) => {
//                       if (error) {
//                           console.log('Error al insertar usuario en la base de datos:', error);
//                           res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
//                       } else {
//                           res.json({ status: 'success', message: 'Usuario registrado con éxito' });
//                       }
//                   });
//           }
//       });
//   }
// });

// Logueo
app.post('/Login', (req, res, next) => {
  const { correo, contrasenia } = req.body;

  // Consultar la base de datos para verificar las credenciales
  const query = 'SELECT * FROM Usuarios WHERE Correo = ?';
  db.query(query, [correo], (error, results) => {
      if (error) {
          console.error('Error al realizar la consulta en la base de datos intenta mas tarde:', error);
          res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
      } else {
          if (results.length > 0) {
              // Usuario encontrado en la base de datos
              const usuario = results[0];
              // Comparar la contraseña hasheada almacenada en la base de datos con la contraseña proporcionada
              bcrypt.compare(contrasenia, usuario.Password, (err, result) => {
                  if (err) {
                      console.error('Error al comparar contraseñas:', err);
                      res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
                  } else {
                      if (result) {
                          // Contraseña correcta: Usuario autenticado
                          res.json({ status: 'success', message: 'Inicio de sesión exitoso' });
                      } else {
                          // Contraseña incorrecta
                          res.status(400).json({ status: 'error', message: 'Credenciales incorrectas' });
                      }
                  }
              });
          } else {
              // Usuario no encontrado en la base de datos
              res.status(400).json({ status: 'error', message: 'Usuario no registrado' });
          }
      }
  });
});



app.post('/buscarViajes', (req, res) => {
  try {
    const { origen, destino, fecha } = req.body;

    // Formatea la fecha utilizando moment
    const fechaFormateada = moment(fecha, 'YYYY-MM-DD').format('YYYY-MM-DD');

    // Consulta a la base de datos para obtener los viajes
    const query = 'SELECT * FROM viajes WHERE (? = "todos" OR Origen = ?) AND (? = "todos" OR Destino = ?) AND (? IS NULL OR Fecha = ?)';
    const values = [origen, origen, destino, destino, fecha, fechaFormateada];

    db.query(query, values, (error, results) => {
      if (error) {
        console.error('Error al realizar la consulta de viajes en la base de datos:', error);
        console.log('Query:', query);
        console.log('Values:', values);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor en la consulta a la base de datos' });
      } else {
        console.log('Resultados de búsqueda:', results);
        res.json(results);
      }
    });
  } catch (error) {
    console.error('Error en la ruta buscarViajes:', error);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
});

// Mueve el cierre de la ruta /buscarViajes aquí
// Ruta para obtener todos los datos
app.get('/api/compras', (req, res) => {
  const query = `
    SELECT tiposervicio.Descripcion AS tipo_servicio,
           usuarios.Correo AS correo_usuario,
           compras.total,
           compras.fecha
    FROM compras
    INNER JOIN tiposervicio ON compras.fk_tipoServicio = tiposervicio.id
    INNER JOIN usuarios ON compras.fk_usuario = usuarios.Correo
  `;

  // Ejecuta la consulta
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      res.json(result);
    }
  });
});

app.post('/api/compras/filtrar', (req, res) => {
  const { tipoServicio, correoUsuario, fecha } = req.body;

  // Consulta SQL base
  let query = `
    SELECT tiposervicio.Descripcion AS tipo_servicio,
           usuarios.Correo AS correo_usuario,
           compras.total,
           compras.fecha
    FROM compras
    INNER JOIN tiposervicio ON compras.fk_tipoServicio = tiposervicio.id
    INNER JOIN usuarios ON compras.fk_usuario = usuarios.Correo
  `;

  // Condiciones de filtrado si se proporcionan parámetros
  const conditions = [];
  if (tipoServicio) conditions.push(`tiposervicio.Descripcion = '${tipoServicio}'`);
  if (correoUsuario) conditions.push(`usuarios.Correo = '${correoUsuario}'`);
  if (fecha) conditions.push(`compras.fecha = '${fecha}'`);

  // Agrega las condiciones a la consulta si hay alguna
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  // Ejecuta la consulta
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error en la consulta con filtros API:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      res.json(result);
    }
  });
});

// En tu archivo de servidor (app.js o index.js)

// En tu archivo de servidor (app.js o index.js)

// app.post('/asignar', (req, res) => {
//   const { correo } = req.body;

//   // Generar un código aleatorio de 4 dígitos
//   const randomCode = Math.floor(1000 + Math.random() * 9000);

//   // Consulta para verificar si el usuario ya tiene un código asignado
//   const selectQuery = 'SELECT * FROM codepass WHERE fk_usuario = ?';
//   db.query(selectQuery, [correo], (selectError, selectResults) => {
//     if (selectError) {
//       console.error('Error al verificar si el usuario ya tiene un código asignado:', selectError);
//       res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
//     } else {
//       // Si el usuario ya tiene un código asignado, actualiza el código existente
//       if (selectResults.length > 0) {
//         const updateQuery = 'UPDATE codepass SET codigo = ? WHERE fk_usuario = ?';
//         db.query(updateQuery, [randomCode, correo], (updateError, updateResults) => {
//           if (updateError) {
//             console.error('Error al actualizar el código existente:', updateError);
//             res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
//           } else {
//             res.json({ status: 'success', message: 'Código aleatorio actualizado con éxito', code: randomCode });
//           }
//         });
//        } else {
//          // Si el usuario no tiene un código asignado, inserta uno nuevo
//          const insertQuery = 'INSERT INTO codepass (fk_usuario, codigo) VALUES (?, ?)';
//          db.query(insertQuery, [correo, randomCode], (insertError, insertResults) => {
//            if (insertError) {
//              console.error('Error al asignar el código aleatorio:', insertError);
//              res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
//            } else {
//              res.json({ status: 'success', message: 'Código aleatorio asignado con éxito', code: randomCode });
//            }
//          });
//        }
//     }
//   });
// });






// Endpoint para enviar correo de recuperación
// app.post('/sendemail', (req, res) => {
//   const { recipient_email } = req.body;

//   // Consultar el código de recuperación en la base de datos
//   const query = 'SELECT codigo FROM codepass WHERE fk_usuario = ?';
//   db.query(query, [recipient_email], (error, results) => {
//     if (error) {
//       console.error('Error al consultar el código de recuperación en la base de datos:', error);
//       return res.status(500).json({ message: 'Error interno del servidor al consultar el código de recuperación.' });
//     } else {
//       if (results.length > 0) {
//         const OTP = results[0].codigo;

//         // Configurar el correo electrónico
//         const mailOptions = {
//           from: 'siveth.uthh03@gmail.com', // Cambiar con tu dirección de correo electrónico
//           to: recipient_email,
//           subject: 'Código de recuperación de contraseña',
//           text: `Hola, acabas de recivir tu codigo de restablecimiento de contraseña, ten cuidado y no lo compartas con nadie, tu codigo es: ${OTP}`
//         };

//         // Enviar el correo electrónico
//         transporter.sendMail(mailOptions, (error, info) => {
//           if (error) {
//             console.error('Error al enviar el correo electrónico de recuperación:', error);
//             return res.status(500).json({ message: 'Error al enviar el correo electrónico de recuperación.' });
//           } else {
//             console.log('Correo electrónico de recuperación enviado:', info.response);
//             return res.json({ message: 'Correo electrónico de recuperación enviado exitosamente.' });
//           }
//         });
//       } else {
//         // El usuario no tiene un código de recuperación asociado en la base de datos
//         return res.status(404).json({ message: 'No se encontró un código de recuperación asociado a este usuario.' });
//       }
//     }
//   });
// });

// Ruta para verificar el código de recuperación de contraseña
// app.post('/verificar', (req, res) => {
//   const { correo, codigo } = req.body;

//   // Consultar el código de recuperación en la base de datos
//   const query = 'SELECT * FROM codepass WHERE fk_usuario = ? AND codigo = ?';
//   db.query(query, [correo, codigo], (error, results) => {
//     if (error) {
//       console.error('Error al consultar el código de recuperación en la base de datos:', error);
//       return res.status(500).json({ message: 'Error interno del servidor al consultar el código de recuperación.' });
//     } else {
//       if (results.length > 0) {
//         // Si se encuentra un código coincidente, redirigir al usuario a otra pantalla
//         return res.json({ message: 'Código de recuperación válido. Redirigiendo...' });
//       } else {
//         // Si no se encuentra un código coincidente, devolver un mensaje de error
//         return res.status(404).json({ message: 'El código de recuperación no es válido.' });
//       }
//     }
//   });
// });

// En tu archivo de servidor (app.js o index.js)

// Ruta para cambiar la contraseña
// app.post("/cambiarContrasenia", (req, res) => {
//   const { correo, contraseniaNueva } = req.body;

//   // Generar hash de la contraseña nueva
//   bcrypt.hash(contraseniaNueva, 10, (err, hashedPassword) => {
//     if (err) {
//       console.error("Error al generar hash de la contraseña nueva:", err);
//       res.status(500).send("Error al actualizar la contraseña");
//       return;
//     }

//     // Actualizar la contraseña en la base de datos con el hash generado
//     const sql = "UPDATE usuarios SET Password = ? WHERE Correo = ?";
//     db.query(sql, [hashedPassword, correo], (err, result) => {
//       if (err) {
//         console.error("Error al actualizar la contraseña:", err);
//         res.status(500).send("Error al actualizar la contraseña");
//         return;
//       }
//       console.log("Contraseña actualizada correctamente");
//       res.status(200).send("Contraseña actualizada correctamente");
//     });
//   });
// });



// Inicio del servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto: ${port}`);
});
