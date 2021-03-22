import * as bcrypt from 'bcrypt';

export const hashPass = (password: string) => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

export const comparePass = (password: string, hash: string) => {
    return bcrypt.compareSync(password, hash);
}