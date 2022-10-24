export interface CreateNote {
    title?: string,
    content: string,
    author?: string,
    isPrivate?: boolean,
    tags?: string[]
}

export interface ReadNote {
    _id: string,
    title?: string,
    content: string,
    author?: string,
    isPrivate: boolean,
    tags: string[],
    createdAt: Date,
    updatedAt: Date,
}
