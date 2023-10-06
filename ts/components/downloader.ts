import axios, { AxiosResponse } from "axios"
import {Response } from "superagent";
import {LoggerUser, Logger } from "./logger"
import fs from "fs";

export class WSPADownloader {
    private logger: Logger;

    public constructor(logger: Logger) {
        this.logger = logger;
    }

    public download(localPath: string, fileURL: string) {
        this.logger.autoLogin().then((response: Response | string) => {
            this.logger.getAgent().get(fileURL).end((_, response) => {
                fs.writeFile(localPath, response.body, (err) => {
                    if (err) console.log("Download error");
                    else console.log("Download finished");
                });
            })
        })
    }
}