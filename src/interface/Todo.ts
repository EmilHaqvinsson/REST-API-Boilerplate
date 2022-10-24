export interface CreateTodo {
    todo: string,
    isDone: boolean,
    extraInformation?: string,
    isRepeating?: boolean,
    repeatInterval?: string,
    tags?: string[]
}

export interface ReadTodo {
    _id: number,
    todo: string,
    isDone: boolean,
    extraInformation: string,
    isRepeating: boolean,
    repeatInterval: string,
    tags: string[],
    createdAt: Date,
    updatedAt: Date,
}