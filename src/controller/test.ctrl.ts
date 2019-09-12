import BaseController from "./base.ctrl";
import { BaseContext } from "koa";
import TestService from "../service/test.service";

export default class TestController extends BaseController<TestService> {
    constructor(ctx: BaseContext, next: () => Promise<any>, service: TestService) {
        super(ctx, next, service);
    }
    test() {
        console.log("from test controller");
        this.service.testService();
    }
}