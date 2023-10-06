import superagent, { Request, Response, SuperAgentStatic } from "superagent";
import cheerio from "cheerio";

export interface ILogger {
    login(loggerUser: LoggerUser): Promise<Response>;
    autoLogin(): Promise<Response>;
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
    protected loggerUser: LoggerUser;
    protected agent:  SuperAgentStatic  = superagent.agent();

    constructor(loggerURLs: LoggerURLs, loggerUser : LoggerUser) {
        this.loggerURLs = loggerURLs;
        this.loggerUser = loggerUser;
    }

    public abstract login(loggerUser: LoggerUser): Promise<Response>;
    public abstract autoLogin(): Promise<Response>;

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
    constructor(loggerURLs: LoggerURLs, loggerUser: LoggerUser) {
        super(loggerURLs, loggerUser);
    }

    public override login(loggerUser: LoggerUser): Promise<Response> {
        let username = loggerUser.username;
        let password = loggerUser.password;

        return this.agent.post(this.loggerURLs.loginURL).type("form").send({
            username,
            password
        }).then((response: Response) => {
            return (cheerio.load(response.text)(".loginerrors").length != 0) ? response 
                : (this.loggerURLs.redirectURL == undefined ) ? response : this.agent.get(this.loggerURLs.redirectURL);
        });
    }

    public override autoLogin(): Promise<Response> {
        return this.login(this.loggerUser);
    }
}