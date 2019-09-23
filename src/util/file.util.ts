import { Const } from "../../constants";
import * as fs from "fs"
import * as path from "path"
import { BaseContext } from "koa";

export default class FileUtil {
    static mkUploadDir(): string {
        let uploadDir = Const.uploadDir;
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(path.resolve(".", uploadDir));
        }
        return uploadDir;
    }

    static mkUploadTemp(hash: string){
        if(!fs.existsSync(Const.tempUploadDir)){
            fs.mkdirSync(path.resolve("./",Const.tempUploadDir));
        }
        const hashPath = path.join(Const.tempUploadDir,hash);
        if(!fs.existsSync(hashPath)){
            fs.mkdirSync(hashPath);
        }
        return hashPath;
    }

    // static handleUpload(ctx:BaseContext){
    //     const 
    // }
}