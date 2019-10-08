import { Const } from "../../constants";
import * as fs from "fs"
import * as path from "path"
import { BaseContext } from "koa";
import { IFile } from "../types/common.type";

export default class FileUtil {
    static mkUploadDir(): string {
        let uploadDir = Const.uploadDir;
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(path.resolve(".", uploadDir));
        }
        return uploadDir;
    }

    static mkUploadTemp(hash: string) {
        if (!fs.existsSync(Const.tempUploadDir)) {
            fs.mkdirSync(path.resolve("./", Const.tempUploadDir));
        }
        const hashPath = path.join(Const.tempUploadDir, hash);
        if (!fs.existsSync(hashPath)) {
            fs.mkdirSync(hashPath);
        }
        return hashPath;
    }

    static handleHttpUpload(file: IFile) {
        const { path: temPath, name, hash } = file;
        const uploadDir = this.mkUploadDir();
        const filename = `${hash}-${name}`;
        const filepath = path.resolve(uploadDir, filename);
        if (!fs.existsSync(filepath)) {
            let ws = fs.createWriteStream(filepath, { flags: "a+" });
            let rs = fs.createReadStream(temPath);
            rs.pipe(ws);
            fs.unlinkSync(temPath);
        }
        return filename;
    }
}