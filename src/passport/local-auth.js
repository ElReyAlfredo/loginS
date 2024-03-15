const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user"); // Importación del modelo de usuario

// Serialización de usuario
passport.serializeUser((user, done) => {
  done(null, user.id); // Se serializa el ID del usuario
});

// Deserialización de usuario
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id); // Se busca al usuario por su ID
  done(null, user); // Se deserializa el usuario
});

// Estrategia de registro local
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email", // Campo para el correo electrónico
      passwordField: "password", // Campo para la contraseña
      passReqToCallback: true, // Pasa la solicitud al controlador de devolución de llamada
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email: email }); // Se busca al usuario por su correo electrónico
      if (user) {
        // Si el usuario ya existe, se devuelve un mensaje de error
        return done(
          null,
          false,
          req.flash("signupMessage", "The Email is already Taken.")
        );
      } else {
        // Si el usuario no existe, se crea uno nuevo
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password); // Se encripta la contraseña
        await newUser.save(); // Se guarda el nuevo usuario en la base de datos
        done(null, newUser); // Se llama a la función 'done' para indicar que el proceso ha terminado
      }
    }
  )
);

// Estrategia de inicio de sesión local
passport.use(
  "local-signin",
  new LocalStrategy(
    {
      usernameField: "email", // Campo para el correo electrónico
      passwordField: "password", // Campo para la contraseña
      passReqToCallback: true, // Pasa la solicitud al controlador de devolución de llamada
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email: email }); // Se busca al usuario por su correo electrónico
      if (!user) {
        // Si el usuario no existe, se devuelve un mensaje de error
        return done(null, false, req.flash("signinMessage", "No User Found"));
      }
      if (!user.comparePassword(password)) {
        // Si la contraseña no coincide, se devuelve un mensaje de error
        return done(
          null,
          false,
          req.flash("signinMessage", "Incorrect Password")
        );
      }
      return done(null, user); // Si el usuario y la contraseña son válidos, se llama a la función 'done'
    }
  )
);
