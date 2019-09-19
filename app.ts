
import * as Koa from "koa";
import * as KoaBody from "koa-body";
import * as Router from "koa-router";
import * as serve from "koa-static";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import * as cluster from "cluster";
import * as crypto from "crypto";
import redisClient from "./src/database/redisClient";
import * as websocketfy from "koa-websocket";
import WebsocketClient from "./websocket";
import Redis from "./src/redis";
import BaseController from "./src/controller/base.ctrl";

const controllers: any = {};
main();


async function main() {
    if (cluster.isMaster && process.env.env) {
        console.log(`Master ${process.pid} is running`);

        os.cpus().forEach((cpu) => {
            cluster.fork();
        });

        cluster.on("exit", (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });
        return;
    }
    await loadController();
    await startServer();
    await startFileServer();
    await initRedis();
}

async function startFileServer() {
    const app = new Koa();

    app.use(async (ctx, next) => {
        ctx.set("Access-Control-Allow-Origin", "*");
        await next();
    });

    app.use(serve("upload"));

    app.listen(3001);
    console.log("static server at port 3001")
}

async function startServer() {
    const app = websocketfy(new Koa());

    app.use(KoaBody({
        multipart: true,
    } as any));

    // 解析请求数据
    app.use(parseRequest);
    app.ws.use(parseRequest);

    app.use(async (ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        ctx.set("X-Response-Time", `${ms}ms`);
    });

    app.use(async (ctx, next) => {
        await next();
        console.log(`${ctx.method} ${ctx.path} ${ctx.status} `);
    });

    app.use(async (ctx, next) => {
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
        }
    });


    const router = distributeRouter();
    app.use(router.routes()).use(router.allowedMethods());

    const wsRouter = distributeWsRouter();
    app.ws.use(wsRouter.routes()).use(wsRouter.allowedMethods());
    // app.ws.onConnection = (ws,req)=>{
    //     console.log(app.ws.server.options.server._connections);
    // }

    app.listen(3000, "0.0.0.0");

    console.log(`server start at port 3000`);
}

async function initRedis() {
    Redis.init(controllers);
}

async function loadController() {
    let controllerDirs = fs.readdirSync(path.resolve(__dirname, "./src/controller"))
        .filter((dir) => {
            return !dir.startsWith("base");
        })
    const serviceDirs = fs.readdirSync(path.resolve(__dirname, "./src/service"))
        .filter((dir) => {
            return !dir.startsWith("base");
        })
    controllerDirs.forEach((controllerDir) => {
        const moduleName = controllerDir.split(".")[0];
        let Controller = require(path.resolve(__dirname, "./src/controller", controllerDir)).default;
        let serviceDir = serviceDirs.find((serviceDir) => {
            return serviceDir.startsWith(moduleName);
        })
        const Service = require(path.resolve(__dirname, "./src/service", serviceDir)).default;
        if (!Controller) {
            throw new Error(`${moduleName}-没有相应的 controller 类`);
        }
        if (!Service) {
            throw new Error(`${moduleName}-没有相应的 service 类`);
        }
        const methods = Object.getOwnPropertyNames(Controller.prototype)
            .filter((name) => name !== "constructor");
        methods.forEach((method) => {
            Object.defineProperty(controllers, method, {
                get() {
                    return new Controller(new Service());
                }
            })
        })
    })
}

function distributeRouter() {
    let router = new Router();
    router.get("/syncEvent", async (ctx, next) => {
        const request: IStandardRequest = ctx.standardRequest;
        let { eventName } = ctx.query;
        let instance = controllers[eventName];
        const response: any = await getResponse(request, instance, eventName);
        ctx.body = response;
        await next()
    });

    router.get("/asyncEvent", async (ctx, next) => {
        const { eventName } = ctx.query;
        const instance = controllers[eventName];
        if (instance) {
            Redis.asyncEventQueue(ctx.standardRequest);
        }
        await next();
    })
    return router;
}

function distributeWsRouter() {
    let router = new Router();
    router.get("/syncEvent", async (ctx, next) => {
        const { eventName } = ctx.query;
        const instance = controllers[eventName];
        if (instance) {
            let ws = new WebsocketClient(ctx.websocket);
            await instance[eventName](ctx.standardRequest, ws);
        }
    });

    router.get("/asyncEvent", async (ctx, next) => {
        const { eventName } = ctx.query;
        const instance = controllers[eventName];
        if (instance) {
            Redis.asyncEventQueue(ctx.standardRequest);
        }
        await next();
    });
    return router;
}

async function parseRequest(ctx: Koa.BaseContext, next: () => Promise<any>) {
    const { query, file } = ctx;
    const { body } = ctx.request;
    let result: IStandardRequest = {
        query,
        body,
        file,
        token: "faketoken",
    }
    ctx.standardRequest = result;
    await next();
}

async function getResponse(request: IStandardRequest, instance: BaseController<any>, eventName: string) {
    let response: any = {};
    if (!instance) {
        return {
            code: 404,
            message: `没有 ${eventName} 方法`,
        }
    }
    response = await instance[eventName](request);
    if (Object.keys(response).length === 0) {
        throw new Error(`${eventName} 方法没有定义返回数据`);
    }
    return response;
}