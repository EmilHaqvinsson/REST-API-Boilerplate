export interface CreateTodo {
    todo: string,
    isDone: boolean
}

export interface ReadTodo {
    _id: number,
    todo: string,
    isDone: boolean,
    createdAt: Date,
    updatedAt: Date,
}