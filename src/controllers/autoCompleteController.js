import { AutoCompleteTrie } from "../models/AutoCompleteTrie.js";

const trie = new AutoCompleteTrie();

trie.addWord("run");
trie.addWord("running");
console.log(JSON.stringify(trie, null, 2));

console.log(trie.findWord("running")); // true
console.log(trie.findWord("run")); // true
console.log(trie.findWord("dog")); // false - path breaks at 'd'
