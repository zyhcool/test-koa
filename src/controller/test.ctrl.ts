import BaseController from "./base.ctrl";
import { BaseContext } from "koa";
import TestService from "../service/test.service";
import redisClient from "../database/redisClient";
import WebsocketClient from "../../websocket";
import { IStandardRequest } from "../types/common.type";


export default class TestController extends BaseController<TestService> {
    constructor(service: TestService) {
        super(service);
    }

    async test(data: IStandardRequest, ws?: WebsocketClient) {
        if (ws && ws instanceof WebsocketClient) {
            this.service.delegateTest(ws);
            return;
        }
        let response = await this.service.test();
        return response;
    }

    async createTest(data:IStandardRequest,ws?:WebsocketClient){
        if (ws && ws instanceof WebsocketClient) {
            this.service.delegateTest(ws);
            return;
        }
        let response = await this.service.createTest();
        return response;
    }

    async findTest(data:IStandardRequest,ws?:WebsocketClient){
        let response = await this.service.findTest(data.body.id);
        return response;
    }
}

export interface IGettest {
    name: string
    age: number
}