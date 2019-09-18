import BaseController from "./base.ctrl";
import { BaseContext } from "koa";
import TestService from "../service/test.service";
import { ParsedContext } from "../../app";
import redisClient from "../database/redisClient";
import WebsocketClient from "../../websocket";

export default class TestController extends BaseController<TestService> {
    constructor(service: TestService) {
        super(service);
    }
    async test(data: IGettest, ws?: WebsocketClient) {
        if (ws && ws instanceof WebsocketClient) {
            this.service.delegateTest(ws);
            return;
        }
        let response = await this.service.test();
    }

    async async_test(data: IGettest) {
        console.log(data);
        console.log("from async test");
        return {
            code: 0,
        }
    }
}

export interface IGettest {
    name: string
    age: number
}