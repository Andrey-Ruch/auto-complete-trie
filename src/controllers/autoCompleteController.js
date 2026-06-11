import { AutoCompleteTrie } from "../models/AutoCompleteTrie.js";

const trie = new AutoCompleteTrie();
trie.addWord("run");
trie.addWord("running");
console.log(JSON.stringify(trie, null, 2));
