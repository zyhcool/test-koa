import { BaseService } from "./base.service";

export default class TestService extends BaseService {
    constructor(){
        super();
    }
    testService(){
        console.log("from test service");
    }
}