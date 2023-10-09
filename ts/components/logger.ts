import superagent, { Request, Response, SuperAgentStatic } from "superagent";
import cheerio from "cheerio";

export interface ILogger {
    login(loggerUser?: LoggerUser): Promise<Response>;
    loginChooiser(loggerUser?: LoggerUser) : LoggerUser;
}

export interface LoggerURLs {
    loginURL: string;
    redirectURL?: string;
}

export interface LoggerUser {
    username: string;
    password: string;
}

export abstract class Logger implements ILogger {
    protected loggerURLs: LoggerURLs;
    protected loggerUser: LoggerUser | undefined;
    protected agent:  SuperAgentStatic  = superagent.agent();

    constructor(loggerURLs: LoggerURLs, loggerUser? : LoggerUser) {
        this.loggerURLs = loggerURLs;
        this.loggerUser = loggerUser;
    }

    public abstract login(loggerUser?: LoggerUser): Promise<Response>;
    public loginChooiser(loggerUser?: LoggerUser) : LoggerUser {
        let username: string;
        let password: string;

        if (loggerUser == undefined) {
            if (this.loggerUser == undefined) {
                username = "";
                password = "";
            } else {
                username = this.loggerUser.username;
                password = this.loggerUser.password;
            }
        } else {
            username = loggerUser.username;
            password = loggerUser.password;
        }

        return {username : username, password : password};
    }

    public setLoggerUser(loggerUser: LoggerUser): void {
        this.loggerUser = loggerUser;
    }

    public setLoggerURLs(loggerURLs : LoggerURLs): void {
        this.loggerURLs = loggerURLs;
    }

    public getAgent(): SuperAgentStatic {
        return this.agent;
    }
}

export class WSPALogger extends Logger {
    constructor(loggerURLs: LoggerURLs, loggerUser?: LoggerUser) {
        super(loggerURLs, loggerUser);
    }

    public override login(loggerUser?: LoggerUser): Promise<Response> {
        let validUser = this.loginChooiser(loggerUser);

        let username = validUser.username;
        let password = validUser.password;

        return this.agent.post(this.loggerURLs.loginURL).type("form").send({
            username,
            password
        }).then((response: Response) => {
            return (cheerio.load(response.text)(".loginerrors").length != 0) ? response 
                : (this.loggerURLs.redirectURL == undefined ) ? response : this.agent.get(this.loggerURLs.redirectURL);
        });
    }
}