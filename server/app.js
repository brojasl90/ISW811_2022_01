const dotEnv = require("dotenv");
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const chalk = require("chalk");
const mongoose = require("mongoose");
const app = express();
const passport = require('passport');

// Routes

const facturasRouter = require("./routes/facturaRoutes");
const userRouter = require("./routes/user");
const estadoRouter = require("./routes/estadoRoute");

// esta linea ayuda a leer la configuracion que tenemos en el archivo .env
dotEnv.config();

// definimos el uri de la base de datos definido en el archivo .env
const mongoDB = process.env.MONGODB_DATABASE;

// se conecta a la base de datos
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// esta es la conexión a la base de datos la cual usaremos para detectar errores o conexiones
const db = mongoose.connection;

//  reporta un error en la conexión
db.on("error", console.error.bind(console, "MongoDB connection error"));

//  cuando se conecta a la BD monstrara este mensaje
db.once("open", () => console.log("Connected Successfully to DB " + mongoDB));

// se define el puerto que va a escuchar basado en el archivo de configuración .env
const port = process.env.PORT || 3000;

// usamos el middleware cors para aceptar llamadas cors en nuestro servidor
app.use(cors());
// este middleware nos sirve para loggear las llamadas al servidor
app.use(logger("dev"));

// middleware para manejar requests y respuestas json
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// todas las rutas las definimos aqui
app.use("/facturas/", facturasRouter);
app.use("/user/", userRouter);
app.use("/estados/", estadoRouter);



// iniciamos nuestro servidor
app.listen(port, () => {
  console.log(
    `${chalk.green("✓")} App is running at ${chalk.bgGreen(
      `http://localhost:${port}`
    )}`
  );
  console.log("Press CTRL-C to stop\n");
});
