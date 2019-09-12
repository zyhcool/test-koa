
import * as Koa from "koa";
import * as KoaBody from "koa-body";
import * as Router from "koa-router";
import * as serve from "koa-static";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import * as cluster from "cluster";
import { Const } from "./constants";
import * as redis from "redis";
import { timeConsum } from "./timeConsum";


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
        loadController(),
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
    const app = new Koa();

    app.use(KoaBody({
        multipart: true,
    } as any));

    app.use(async (ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        ctx.set("X-Response-Time", `${ms}ms`);
        console.log("time");
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
            console.log("header");
            await next();
        } catch (err) {
            console.log(err)
            ctx.body = {
                code: 2,
                message: "服务器错误",
            };
        }
    });


    const redisClient = redis.createClient(6379, "127.0.0.1");
    (function exc() {
        redisClient.blpop("time", (err, v) => {
            console.log(v)
            if (typeof v === "function") {
                setTimeout(() => {
                    return (() => {
                        exc()
                        v();
                    })()
                }, 0);
            }
        });
    })()

    const router = distributeRouter();
    app.use(router.routes()).use(router.allowedMethods());

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
    console.log(controllerDirs);
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
            throw new Error(`${moduleName}-没有响应的 service 类`);
        }
        const methods = Object.getOwnPropertyNames(Controller.prototype)
            .filter((name) => name !== "constructor");
        methods.forEach((method) => {
            Object.defineProperty(constrollers, method, {
                get() {
                    return {
                        controller: Controller,
                        service: Service,
                    };
                }
            })
        })
    })
    console.log(constrollers);
    return constrollers;
}

function distributeRouter() {
    let controllers = loadController();
    let router = new Router();
    router.get("/syncEvent", async (ctx, next) => {
        let { eventName } = ctx.query;
        let { controller: Controller, service: Service } = controllers[eventName];
        console.log(Controller,Service);
        if (Controller) {
            let instance = new Controller(ctx, next, new Service());
            await instance[eventName]();
            await next();
        }
    });
    router.post("/syncEvent", async (ctx, next) => {
        let { eventName } = ctx.query;
        let { controller: Controller, service: Service } = controllers[eventName];
        if (Controller) {
            let instance = new Controller(ctx, next, new Service());
            await instance[eventName]();
            await next();
        }
    })
    return router;
}