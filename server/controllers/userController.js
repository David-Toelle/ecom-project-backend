const {
  updateUserQuery,
  registerQuery,
  loginQuery,
  getUserByIdQuery,
} = require("../queries/userQueries");

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const token = await registerQuery(firstName, lastName, email, password);
    res.status(201).send({token, user:{firstName, lastName, email }  } );
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const token = await loginQuery(email, password);
    const user = await getUserByIdQuery(req.user.id);
    res.status(200).send({ token, user,});
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await getUserByIdQuery(req.user.id);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const updatedUser = await updateUserQuery(
      req.params.id,
      firstName,
      lastName,
      email,
      password
    );

    res.send(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateUser,
};
