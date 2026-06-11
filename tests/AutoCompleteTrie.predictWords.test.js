import { describe, test, expect, beforeEach } from "@jest/globals";
import { AutoCompleteTrie } from "../src/models/AutoCompleteTrie.js";

describe("AutoCompleteTrie.predictWords", () => {
    let trie;

    beforeEach(() => {
        trie = new AutoCompleteTrie();
    });

    test("returns every word that shares the prefix", () => {
        trie.addWord("run");
        trie.addWord("running");
        trie.addWord("rust");

        expect(trie.predictWords("ru").sort()).toEqual(["run", "running", "rust"]);
    });

    test("includes the prefix itself when it is a complete word", () => {
        trie.addWord("run");
        trie.addWord("running");

        expect(trie.predictWords("run").sort()).toEqual(["run", "running"]);
    });

    test("excludes the prefix when the path exists but is not a word", () => {
        trie.addWord("running");

        expect(trie.predictWords("run")).toEqual(["running"]);
    });

    test("returns a single match", () => {
        trie.addWord("cat");

        expect(trie.predictWords("ca")).toEqual(["cat"]);
    });

    test("returns an empty array for a prefix not in the trie", () => {
        trie.addWord("run");

        const result = trie.predictWords("xyz");
        expect(result).toEqual([]);
        expect(Array.isArray(result)).toBe(true);
    });

    test("returns every word when given an empty prefix", () => {
        trie.addWord("a");
        trie.addWord("ab");
        trie.addWord("cat");

        expect(trie.predictWords("").sort()).toEqual(["a", "ab", "cat"]);
    });

    test("returns an empty array for any prefix on an empty trie", () => {
        expect(trie.predictWords("any")).toEqual([]);
        expect(trie.predictWords("")).toEqual([]);
    });

    test("includes the empty string when it was added as a word", () => {
        trie.addWord("");

        expect(trie.predictWords("")).toEqual([""]);
    });

    test("returns the exact word for a full-word prefix with no extensions", () => {
        trie.addWord("run");

        expect(trie.predictWords("run")).toEqual(["run"]);
    });
});
