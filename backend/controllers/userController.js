const users = []; // luego lo conectas a BD

exports.getUsers = (req, res) => {
  res.json(users);
};

exports.createUser = (req, res) => {
  const newUser = {
    id: Date.now(),
    ...req.body,
    active: true
  };

  users.push(newUser);
  res.json(newUser);
};

exports.updateUser = (req, res) => {
  const id = parseInt(req.params.id);

  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ msg: "No existe" });

  Object.assign(user, req.body);

  res.json(user);
};

exports.deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  const index = users.findIndex(u => u.id === id);
  users.splice(index, 1);

  res.json({ msg: "Eliminado" });
};

exports.resetPassword = (req, res) => {
  res.json({ msg: "Password reseteada (mock)" });
};