import BaseController from "./base.ctrl";
import { BaseContext } from "koa";
import TestService from "../service/test.service";
import { ParsedContext } from "../../app";
import redisClient from "../database/redisClient";

export default class TestController extends BaseController<TestService> {
    constructor(service: TestService) {
        super(service);
    }
    test(ctx: ParsedContext<IGettest>) {
        this.service.testService();
        ctx.body = {
            code: 0,
        }
    }
    async async_test(data: IGettest) {
        console.log(data);
        console.log("from async test");
    }
}

export interface IGettest {
    name: string
    age: number
}