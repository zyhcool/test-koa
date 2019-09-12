import * as event from "events";
import { BaseContext } from "koa";

export default class BaseController<T> extends event.EventEmitter {
    ctx: BaseContext;
    next: () => Promise<any>;
    service: T;
    constructor(ctx: BaseContext, next: () => Promise<any>,service: T) {
        super();
        this.ctx = ctx;
        this.next = next;
        this.service = service;
    }
}