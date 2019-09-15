import * as event from "events";
import { BaseContext } from "koa";

export default class BaseController<T> extends event.EventEmitter {
    service: T;
    constructor(service: T) {
        super();
        this.service = service;
    }
}