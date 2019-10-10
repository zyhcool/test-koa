import { Mongoose, Connection } from "mongoose";

class MongoConnection {
    connection: Connection;
    constructor() {
        const mongoose = new Mongoose();
        mongoose.connect(`mongodb://127.0.0.1:27017/5q`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        this.connection = mongoose.connection;
        this.connection
            .on("ready", () => {
                console.log("mongo ready");
            })
            .on("connected", () => {
                console.log("mongo connected");
            })
            .on("disconnect", () => {
                console.log("mongo disconnect");
            })
            .on("error", () => {
                console.log("mongo error");
            })
    }
}


export let mgConnection = new MongoConnection().connection;