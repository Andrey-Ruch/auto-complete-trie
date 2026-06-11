import { describe, test, expect, beforeEach } from "@jest/globals";
import { AutoCompleteTrie } from "../src/models/AutoCompleteTrie.js";

describe("AutoCompleteTrie.findWord", () => {
    let trie;

    beforeEach(() => {
        trie = new AutoCompleteTrie();
    });

    test("finds a word that was added", () => {
        trie.addWord("run");

        expect(trie.findWord("run")).toBe(true);
    });

    test("does not find a word that was never added", () => {
        expect(trie.findWord("run")).toBe(false);
    });

    test("does not treat a stored prefix as a word on its own", () => {
        trie.addWord("run");

        expect(trie.findWord("r")).toBe(false);
        expect(trie.findWord("ru")).toBe(false);
    });

    test("finds a prefix that was also added as its own word", () => {
        trie.addWord("run");
        trie.addWord("running");

        expect(trie.findWord("run")).toBe(true);
        expect(trie.findWord("running")).toBe(true);
    });

    test("does not find a word longer than any stored path", () => {
        trie.addWord("run");

        expect(trie.findWord("running")).toBe(false);
    });

    test("does not find a word whose path diverges from stored words", () => {
        trie.addWord("run");

        expect(trie.findWord("rug")).toBe(false);
    });

    test("handles the empty string based on whether it was added", () => {
        expect(trie.findWord("")).toBe(false);

        trie.addWord("");
        expect(trie.findWord("")).toBe(true);
    });

    test("handles a single-character word", () => {
        trie.addWord("a");

        expect(trie.findWord("a")).toBe(true);
        expect(trie.findWord("b")).toBe(false);
    });

    test("finds each of several coexisting words and rejects non-added siblings", () => {
        trie.addWord("run");
        trie.addWord("rug");
        trie.addWord("cat");

        expect(trie.findWord("run")).toBe(true);
        expect(trie.findWord("rug")).toBe(true);
        expect(trie.findWord("cat")).toBe(true);
        expect(trie.findWord("car")).toBe(false);
    });

    test("does not mutate the trie when looking up a missing word", () => {
        trie.findWord("missing");

        expect(Object.keys(trie.children)).toHaveLength(0);
    });
});
