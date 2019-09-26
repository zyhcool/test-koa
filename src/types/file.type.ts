export enum FileStatus {
    start = "start",
    pending = "pending",
    end = "end",
}


export interface IWsUploadFileQueryData {
    filename: string;
    hash: string;
    chunkNum: string;
}