import { AutoCompleteTrie } from "./models/AutoCompleteTrie.js";
import { AutoCompleteController } from "./controllers/autoCompleteController.js";
import { ConsoleView } from "./views/consoleView.js";

const trie = new AutoCompleteTrie();
const controller = new AutoCompleteController(trie);
const view = new ConsoleView(controller);

view.start();
