
export enum redisKeys {
    event = "event",
    queue = "queue",
    file = "file",
}

export interface IAsyncEventReqData<T = any> {
    token: string,
    method: string,
    data: T,
    time: number,
}