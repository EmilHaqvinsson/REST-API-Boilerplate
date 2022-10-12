export interface SaveURL {
    URL: string,
    images?: string[],
    isDownloaded: string
}

export interface ReadURL {
    _id: number,
    URL: string,
    hasImages: boolean,
    isDownloaded: string,
    createdAt: Date,
    updatedAt: Date,
}