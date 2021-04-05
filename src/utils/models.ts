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

export interface IReservation {
    hours?: number,
    id?: number,
    startTime: Date,
    endTime: Date,
    userid?: number,
    type: string,
    monitorid?: number,
    headsetid?: number
}

export interface IAvailability {
    date: any,
    public: number,
    private: number,
    team: number,
    vr: number,
    fullTournament: number
}