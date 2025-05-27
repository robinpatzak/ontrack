import User from "../models/User";

const registerService = async (registerData: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}) => {
  const { email, firstName, lastName, password } = registerData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const user = await User.create({ email, firstName, lastName, password });

  return {
    user: user.omitPassword(),
  };
};

const loginService = async (loginData: { email: string; password: string }) => {
  const { email, password } = loginData;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  return {
    user: user.omitPassword(),
  };
};

export default {
  registerService,
  loginService,
};
