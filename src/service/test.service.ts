import { BaseService } from "./base.service";
import WebsocketClient from "../../websocket";
import { Test } from "../model/test.model";


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

    // @rdsFindById() // 先查缓存再查数据库
    async findTest(id: string){
        // let en = await Test.findById(id).exec();
        let en = await Test.findById(id).cache().exec();
        console.log("en",en)
        return en;
    }
}