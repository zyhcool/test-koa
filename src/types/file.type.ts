export enum FileStatus {
    start = "start",
    pending = "pending",
    end = "end",
}

export interface IFileData {
    hash: string,
    index: number;
    file: string;
    filename: string;
    chunkNum: number;
}