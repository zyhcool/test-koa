import BaseController from "./base.ctrl";
import { BaseContext } from "koa";
import TestService from "../service/test.service";
import redisClient from "../database/redisClient";
import WebsocketClient from "../../websocket";

export default class TestController extends BaseController<TestService> {
    constructor(service: TestService) {
        super(service);
    }
    async test(data: IGettest, ws?: WebsocketClient) {
        if (ws && ws instanceof WebsocketClient) {
            console.log("delegate");
            this.service.delegateTest(ws);
            return;
        }
        console.log("async")
        let response = await this.service.test();
        return response;
    }
}

export interface IGettest {
    name: string
    age: number
}