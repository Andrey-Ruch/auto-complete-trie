import { AutoCompleteTrie } from "./models/AutoCompleteTrie.js";
import { AutoCompleteController } from "./controllers/autoCompleteController.js";
import { WebView } from "./views/webView.js";

const controller = new AutoCompleteController(new AutoCompleteTrie());
const view = new WebView(controller);

view.start();
