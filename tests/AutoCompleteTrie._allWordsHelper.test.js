import { describe, test, expect, beforeEach } from "@jest/globals";
import { AutoCompleteTrie } from "../src/models/AutoCompleteTrie.js";

describe("AutoCompleteTrie._allWordsHelper", () => {
    let trie;

    beforeEach(() => {
        trie = new AutoCompleteTrie();
    });

    test("collects a single word from the root", () => {
        trie.addWord("run");

        const allWords = [];
        trie._allWordsHelper("", trie, allWords);

        expect(allWords).toEqual(["run"]);
    });

    test("collects every word in the trie from the root", () => {
        trie.addWord("run");
        trie.addWord("rug");
        trie.addWord("cat");

        const allWords = [];
        trie._allWordsHelper("", trie, allWords);

        expect(allWords.sort()).toEqual(["cat", "rug", "run"]);
    });

    test("collects a word and its longer extension", () => {
        trie.addWord("run");
        trie.addWord("running");

        const allWords = [];
        trie._allWordsHelper("", trie, allWords);

        expect(allWords.sort()).toEqual(["run", "running"]);
    });

    test("collects nothing from an empty trie", () => {
        const allWords = [];
        trie._allWordsHelper("", trie, allWords);

        expect(allWords).toEqual([]);
    });

    test("collects the empty string when it was added as a word", () => {
        trie.addWord("");

        const allWords = [];
        trie._allWordsHelper("", trie, allWords);

        expect(allWords).toEqual([""]);
    });

    test("reconstructs full words from a subtree using the supplied prefix", () => {
        trie.addWord("car");
        trie.addWord("cart");
        trie.addWord("can");

        const node = trie._getRemainingTree("ca");
        const allWords = [];
        trie._allWordsHelper("ca", node, allWords);

        expect(allWords.sort()).toEqual(["can", "car", "cart"]);
    });

    test("mutates the supplied accumulator and returns nothing", () => {
        trie.addWord("run");

        const allWords = [];
        const result = trie._allWordsHelper("", trie, allWords);

        expect(result).toBeUndefined();
        expect(allWords).toEqual(["run"]);
    });

    test("counts the starting node's own end-of-word flag", () => {
        trie.addWord("run");

        const node = trie._getRemainingTree("run");
        const allWords = [];
        trie._allWordsHelper("run", node, allWords);

        expect(allWords).toEqual(["run"]);
    });
});
