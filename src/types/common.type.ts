
interface IStandardRequest<T = any> {
    query: {
        eventName: string,
        [key: string]: any,
    },
    body: T,
    file: IFile,
    token: string,
}

interface IFile {
    path: string;
    name: string;
    hash: string;
}