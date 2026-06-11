import { AutoCompleteTrie } from "../models/AutoCompleteTrie.js";
import { AutoCompleteController } from "../controllers/autoCompleteController.js";

const trie = new AutoCompleteTrie();
const controller = new AutoCompleteController(trie);

console.log(controller.addWord("CAT")); // { success: true, message: "Added 'cat' to dictionary" }
console.log(controller.findWord("cat")); // { success: true, ... }
console.log(controller.predictWords("ca")); // { success: true, suggestions: ['cat'], ... }
console.log(controller.addWord("   ")); // { success: false, message: 'Please provide a valid word' }
