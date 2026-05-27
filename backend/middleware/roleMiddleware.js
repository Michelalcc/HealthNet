module.exports = (rolesPermitidos = []) => {

  return (req, res, next) => {

    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    if (!rolesPermitidos.length) {
      return next(); // si no defines roles, deja pasar
    }

    if (!rolesPermitidos.includes(user.rol)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    next();
  };
};