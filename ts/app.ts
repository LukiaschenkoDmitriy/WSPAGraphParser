import { WSPALogger, Logger } from "./components/logger";
import { WSPADownloader } from "./components/downloader";
import { username, password} from "./data.json";

let logger: Logger = new WSPALogger({
    loginURL: "https://puw.wspa.pl/login/index.php"
}, {
    username: username,
    password: password
});

new WSPADownloader(logger).download("./files/file1.xlsx", "https://puw.wspa.pl/pluginfile.php/97278/mod_folder/content/0/Informatyka%20-%20studia%20I%20stopnia%20-%20st%20I%20-%20semestr%20zimowy.xlsx?forcedownload=1%22%3E%3Cspan%20class=%22fp-icon%22%3E%3Cimg%20class=%22icon%20%22%20alt=%22Informatyka%20-%20studia%20I%20stopnia%20-%20st%20I%20-%20semestr%20zimowy.xlsx%22%20title=%22Informatyka%20-%20studia%20I%20stopnia%20-%20st%20I%20-%20semestr%20zimowy.xlsx%22%20src=%22https://puw.wspa.pl/theme/image.php/alpha/core/1663828636/f/spreadsheet-24%22%3E%3C/span%3E%3Cspan%20class=%22fp-filename%22%3EInformatyka%20-%20studia%20I%20stopnia%20-%20st%20I%20-%20semestr%20zimowy.xlsx")