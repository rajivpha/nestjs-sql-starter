import * as bcrypt from "bcrypt";

export const createOTP = async (): Promise<number> => {
  return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
};

export const createHash = async (password: string): Promise<string> => {
  try {
    // generate password hash
    const saltRounds = Math.floor(Math.random() * 10) + 5;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    console.error(err);
  }
};

export const comparePassword = async (
  userInputPassword: string,
  passwordFromDB: string,
): Promise<boolean> => {
  return await bcrypt.compare(userInputPassword, passwordFromDB);
};

export const generateRandomString = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
};
