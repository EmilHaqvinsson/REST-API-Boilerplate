export interface CreateTodo {
    todo: string,
    isDone: boolean,
    extraInformation: string
}

export interface ReadTodo {
    _id: number,
    todo: string,
    isDone: boolean,
    extraInformation: string,
    createdAt: Date,
    updatedAt: Date,
}