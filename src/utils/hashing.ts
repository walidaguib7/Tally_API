import * as argon2 from 'argon2';

export const hashing = async (password: string) => {
  const hashedPassword = await argon2.hash(password, {
    type: argon2.argon2id,
  });
  return hashedPassword;
};

export const Verify = async (Password: string, hashedPassword: string) => {
  return await argon2.verify(hashedPassword, Password);
};
