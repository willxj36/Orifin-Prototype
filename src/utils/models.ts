export interface IUserLocal {
    userid?: number,
    role?: string,
}

export interface IUser {
    id?: number,
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string,
    role?: string,
    _created?: Date
}