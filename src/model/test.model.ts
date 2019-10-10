import { Mongoose } from "mongoose";
import { mgConnection } from "../database/mongo";


const mongoose = new Mongoose();

const testSchema = new mongoose.Schema({
    name: String,
    age: Number,
})

export const Test = mgConnection.model("Test",testSchema);