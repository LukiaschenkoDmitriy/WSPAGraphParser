import { Response } from "superagent";
import { Logger } from "./logger"
import fs from "fs";

export class Downloader {
    private logger: Logger;

    public constructor(logger: Logger) {
        this.logger = logger;
    }

    public download(localPath: string, fileURL: string) {
        this.logger.login().then((response: Response) => {
            this.logger.getAgent().get(fileURL).end((_, response) => {
                fs.writeFile(localPath, response.body, (err) => {
                    if (err) console.log("Download error");
                    else console.log("Download finished");
                });
            })
        })
    }
}