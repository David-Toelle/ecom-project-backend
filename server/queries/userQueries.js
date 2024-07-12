const { jwt, prisma } = require("../shared/shared");

// Register
const registerQuery = async (firstName, lastName, email, password) => {
  const registerUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password,
    },
  });
  const token = jwt.sign(
    {
      id: registerUser.id,
    },
    process.env.WEB_TOKEN,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

const loginQuery = async (email, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    if (user.password !== password) {
      throw new Error("Invalid login credentials.");
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.WEB_TOKEN,
      {
        expiresIn: "1h",
      }
    );
    console.log(token)
    return token;
  } catch (error) {
    console.error("Error in loginQuery:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

const getUserByIdQuery = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

const updateUserQuery = async (id, firstName, lastName, email, password) => {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        password,
      },
    });
    return updatedUser;
  };

module.exports = {
  registerQuery,
  loginQuery,
  getUserByIdQuery,
  updateUserQuery,
};
