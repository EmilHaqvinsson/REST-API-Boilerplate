export interface SaveURL {
    URL: string,
    hasImages: boolean,
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