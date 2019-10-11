import { BaseService } from "./base.service";
import WebsocketClient from "../../websocket";
import { Test } from "../model/test.model";
import { rdsFindById } from "../redis/decorator/common.di";
import { IResonse } from "../types/common.type";


export default class TestService extends BaseService {
    constructor() {
        super();
    }
    async test(){
        console.log("from test service");
    }

    delegateTest(ws: WebsocketClient) {
        ws.onopen = (e) => {
            console.log("open");
        }
        ws.onerror = (e) => {
            console.log(e.message, e.stacks);
        }
        ws.onclose = (e) => {
            console.log(e);
        }

        ws.onmessage = (e) => {
            console.log("onmessage: ", e.data)
        }
    }

    async createTest() {
        let test = await Test.create({
            name: "zyh",
            age: 9,
        })
        return test;
    }

    @rdsFindById()
    async findTest(id: string){
        let en = await Test.findById(id).exec();
        return en;
    }
}