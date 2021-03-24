export interface IUserLocal {
    userid?: number,
    role?: number,
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

export interface IDbResponse {
    fieldCount: number,
    affectedRows: number,
    insertId: number,
    serverStatus: number,
    warningCount: number,
    message: string,
    protocol41: boolean,
    changedRows: number
}

export interface Payload {
    [key: string]: any,
    userid?: number,
    unique?: string
}

export interface IMembership {
    id: number,
    role: string,
    info?: string[],
    monthPrice: number,
    yearPrice: number
}