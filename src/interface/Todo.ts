export interface CreateTodo {
    todo: string,
    isDone: boolean,
    extraInformation?: string,
    isRepeating?: boolean,
    repeatInterval?: string
}

export interface ReadTodo {
    _id: number,
    todo: string,
    isDone: boolean,
    extraInformation: string,
    isRepeating: boolean,
    createdAt: Date,
    updatedAt: Date,
}