import { WSPALogger, Logger } from "./components/logger";
import { username, password} from "./data.json";
import { WSPAGraphParser } from "./components/parser";

let logger: Logger = new WSPALogger({
    loginURL: "https://puw.wspa.pl/login/index.php"
}, { username, password });

let parser = new WSPAGraphParser();
parser.initialize("D:/symfony/WSPAGraphParser/files/file1.xlsx");