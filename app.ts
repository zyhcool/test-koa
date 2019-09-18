
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

    await Promise.all([
        startServer(),
        startFileServer(),
    ]);
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

function loadController() {
    let constrollers = {};
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
            Object.defineProperty(constrollers, method, {
                get() {
                    return new Controller(new Service());
                }
            })
        })
    })
    return constrollers;
}

function distributeRouter() {
    let controllers = loadController();
    let router = new Router();
    router.get("/syncEvent", async (ctx, next) => {
        let { eventName } = ctx.query;
        let instance = controllers[eventName];
        if (instance) {
            await instance[eventName](ctx);
            await next();
        }
    });

    router.get("/asyncEvent", async (ctx, next) => {
        const { eventName } = ctx.query;
        const instance = controllers[eventName];
        if (instance) {
            const sign = crypto.createHash("md5").update(JSON.stringify(ctx.standardRequest)).digest("hex");
            redisClient.rpush("queue", sign);
            redisClient.hset("asyncEvent", sign, JSON.stringify(ctx.standardRequest));
        }
        ctx.body = {
            code: 0,
            message: "success",
        }
        await next();
    })
    return router;
}

function distributeWsRouter() {
    let controllers = loadController();
    let router = new Router();
    router.get("/syncEvent", async (ctx, next) => {
        const { eventName } = ctx.query;
        const instance = controllers[eventName];
        console.log(eventName)
        if (instance) {
            let ws = new WebsocketClient(ctx.websocket);
            await instance[eventName](ctx.standardRequest,ws);
        }
    });
    
    router.get("/asyncEvent", async (ctx, next) => {
        const { eventName } = ctx.query;
        const instance = controllers[eventName];
        console.log(instance);
        if (instance) {
            console.log("jdk")
            // const sign = crypto.createHash("md5").update(JSON.stringify(ctx.standardRequest)).digest("hex");
            const sign = "jdkjfdjk"
            console.log(sign)
            redisClient.rpush("queue", sign);
            redisClient.hset("asyncEvent", sign, JSON.stringify(ctx.standardRequest));
        }
    });
    return router;
}

async function parseRequest(ctx: Koa.BaseContext, next: () => Promise<any>) {
    const { query, file } = ctx;
    const { body } = ctx.request;
    let result = {
        query,
        body,
        file,
    }
    ctx.standardRequest = result;
    await next();
}

export interface IStandardRequest<T> {
    query: {
        eventName: string,
        [key: string]: any,
    },
    body: T,
    file: {
        path: string,
        type: string,
    }
}

export interface ParsedContext<T = any> extends Koa.BaseContext {
    standardRequest: IStandardRequest<T>
}