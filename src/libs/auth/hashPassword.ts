import * as bcrypt from 'bcryptjs';

const saltRounds = 10;

async function hashPassword(password: string | null): Promise<string | null> {
  if (password != null) {
    const _password = await bcrypt.hash(password, saltRounds);
    return _password;
  }
  return null;
}


export { hashPassword };
