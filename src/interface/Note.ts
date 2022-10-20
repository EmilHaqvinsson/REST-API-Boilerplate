export interface CreateNote {
    title?: string,
    content: string,
    author?: string,
    isPrivate?: boolean,
}

export interface ReadNote {
    _id: string,
    title?: string,
    content: string,
    author?: string,
    isPrivate: boolean,
    createdAt: Date,
    updatedAt: Date,
}
