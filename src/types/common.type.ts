
export interface IStandardRequest<T = any> {
    query: {
        eventName: string,
        [key: string]: any,
    },
    body: T,
    file: IFile,
    token: string,
}

export interface IFile {
    path: string;
    name: string;
    hash: string;
}

export interface IResonse<T = any> {
    code: number;
    message: string;
    data: T;
}