
import * as Koa from "koa";
import * as KoaBody from "koa-body";
import * as Router from "koa-router";
import * as serve from "koa-static";
import * as path from "path";
import * as fs from "fs";
import { Const } from "./constants";

main();

async function main() {
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
    const app = new Koa();

    app.use(KoaBody({
        multipart: true,
    } as any));

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
            if (!ctx.path.includes(".xlsx") && !(ctx.path.startsWith("/api/files/") && ctx.method === "GET")) {
                ctx.body = Object.assign({}, ctx.body, { code: 0 });
            }
        } catch (err) {
            console.log(err)
            ctx.body = {
                code: 2,
                message: "服务器错误",
            };
        }
    });

    const router = new Router();



    router.post("/upload", async (ctx, next) => {
        const file = ctx.request.files.file;
        console.log(file);

        const dstFile = `${Math.random().toString()}${file.name}`;
        if (!fs.existsSync(Const.uploadDir)) {
            fs.mkdirSync(Const.uploadDir);
        }
        fs.copyFileSync(file.path, path.join(Const.uploadDir, dstFile));
        fs.unlinkSync(file.path);

        await next();
    })

    app.use(router.routes()).use(router.allowedMethods());


    app.listen(3000, "0.0.0.0");

    console.log(`server start at port 3000`);
}
