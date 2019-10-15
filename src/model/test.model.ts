import { Mongoose } from "mongoose";
import { mgConnection } from "../database/mongo";


const mongoose = new Mongoose();

const testSchema = new mongoose.Schema({
    name: String,
    age: Number,
})

testSchema.pre("save", (next, docs) => {
    console.log("-------- save pre: ----------")
    console.log(docs);
    next();
})

testSchema.pre("findOne", (next, docs) => {
    console.log("--------- findOne pre: --------");
    console.log(docs);
    next();
})

testSchema.post("findOne", (doc, next) => {
    console.log("-------- findOne post: ---------");
    console.log(doc);
    next();
})
export const Test = mgConnection.model("Test", testSchema);
