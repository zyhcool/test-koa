import { Mongoose } from "mongoose";
import { mgConnection } from "../database/mongo";


const mongoose = new Mongoose();

const fileSchema = new mongoose.Schema({
    filename: String,
    type: String,
})

export const File = mgConnection.model("File", fileSchema);