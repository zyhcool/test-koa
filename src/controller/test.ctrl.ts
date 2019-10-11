import BaseController from "./base.ctrl";
import { BaseContext } from "koa";
import TestService from "../service/test.service";
import redisClient from "../database/redisClient";
import WebsocketClient from "../../websocket";
import { IStandardRequest, IResonse } from "../types/common.type";
import { ITest } from "../types/test.type";
import "reflect-metadata"


const ClassDec = (): ClassDecorator => {
    return (target) => {
        return;
    }
};
const PropertyDec = (): PropertyDecorator => {
    return (target, key) => {
        return;
    }
};
const methodDec = (): MethodDecorator => {
    return (target, key, desc) => {
        return;
    }
};
@ClassDec()
export default class TestController extends BaseController<TestService> {
    constructor(service: TestService) {
        super(service);
    }

    @PropertyDec()
    public haha: string;

    async test(data: IStandardRequest, ws?: WebsocketClient) {
        if (ws && ws instanceof WebsocketClient) {
            this.service.delegateTest(ws);
            return;
        }
        let response = await this.service.test();
        return response;
    }

    async createTest(data: IStandardRequest, ws?: WebsocketClient) {
        if (ws && ws instanceof WebsocketClient) {
            this.service.delegateTest(ws);
            return;
        }
        let response = await this.service.createTest();
        return response;
    }

    @methodDec()
    async findTest(data: IStandardRequest, ws?: WebsocketClient) {
        let response: IResonse<ITest> = await this.service.findTest(data.body.id) as any;
        return response;
    }
}
