import { BaseContext } from "koa";

export function errorHandling(controllers) {
    return async (ctx: BaseContext, next: () => Promise<any>) => {
        if(methodNotFound(ctx, controllers)){
            return;
        }
        await handleUnexpectedError(ctx, next);
    }
}

function methodNotFound(ctx: BaseContext, controllers) {
    let { eventName } = ctx.query;
    if (!controllers[eventName]) {
        ctx.status = 404;
        ctx.body = {
            code: 404,
            message: `没有 ${eventName} 方法`,
        }
        return true;
    }
}

async function handleUnexpectedError(ctx: BaseContext, next: () => Promise<any>) {
    try {
        ctx.set("Access-Control-Allow-Origin", "*");
        ctx.set("Access-Control-Allow-Headers",
            `Content-Type,Accept,X-Requested-With`);
        ctx.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD, OPTIONS");
        await next();
    } catch (err) {
        ctx.body = {
            code: 2,
            message: "服务器错误",
        };
        ctx.status = 500;
        console.log(err);
    }

}