const mongoose = require("mongoose"); // Importación del módulo mongoose para interactuar con la base de datos MongoDB
const bcrypt = require("bcrypt-nodejs"); // Importación del módulo bcrypt para el cifrado de contraseñas

const { Schema } = mongoose; // Extracción del constructor Schema desde mongoose

const userSchema = new Schema({
  email: String, // Campo para el correo electrónico del usuario
  password: String, // Campo para la contraseña del usuario
});

// Método para cifrar la contraseña del usuario
userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10)); // Se utiliza bcrypt para generar un hash de la contraseña
};

// Método para comparar la contraseña proporcionada con la contraseña almacenada en la base de datos
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password); // Se compara la contraseña proporcionada con la contraseña almacenada
};

// Se exporta el modelo de usuario, que utiliza el esquema definido
module.exports = mongoose.model("user", userSchema);
