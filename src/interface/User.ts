export interface CreateUser {
    username: string,
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    avatarUrl?: string,
    stayLoggedIn?: boolean,
    token?: string
}

export interface ReadUser {
    _id: number,
    username: string,
    email: string,
    password: string,
    token?: string,
    firstName?: string,
    lastName?: string,
    avatarUrl?: string,
    stayLoggedIn?: boolean,
    createdAt: Date,
    updatedAt: Date,
}