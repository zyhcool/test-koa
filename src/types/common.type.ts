
interface IStandardRequest<T=any>{
    query:{
        eventName: string,
        [key: string]: any,
    },
    body: T,
    file:{
        path: string,
        type: string,
    },
    token: string,
}