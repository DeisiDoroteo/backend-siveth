import express from "express";
import morgan from "morgan";
import usuariosRoutes from "./routes/usuarios.routes.js";
import employeesRoutes from "./routes/employees.routes.js";
import indexRoutes from "./routes/index.routes.js";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json()); // Este middleware debe ejecutarse antes de las rutas

// Routes
app.use("/", indexRoutes);
app.use("/ping", indexRoutes);
app.use("/api", usuariosRoutes);   // Corregir las rutas para evitar la ambigüedad

app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;
