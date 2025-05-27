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
    console.error("User already exists with this email:", email);
  }

  const user = await User.create({ email, firstName, lastName, password });

  return {
    user: user.omitPassword(),
  };
};

export default {
  registerService,
};
