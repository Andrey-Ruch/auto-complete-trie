import { AutoCompleteTrie } from "../models/AutoCompleteTrie.js";

const trie = new AutoCompleteTrie();

trie.addWord("run");
trie.addWord("running");
trie.addWord("there");
trie.addWord("this");
trie.addWord("cat");
trie.addWord("car");
trie.addWord("card");

console.log(JSON.stringify(trie, null, 2));

console.log(trie.findWord("running")); // true
console.log(trie.findWord("run")); // true
console.log(trie.findWord("dog")); // false - path breaks at 'd'

const node = trie._getRemainingTree("th");
console.log(node.value); // 'h'
console.log(Object.keys(node.children)); // ['e', 'i']
console.log(trie._getRemainingTree("xyz")); // null

const words = [];
trie._allWordsHelper("", trie, words);
console.log(words); // ['run', 'running', 'there', 'this', 'cat', 'car', 'card']
