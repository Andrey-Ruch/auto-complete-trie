import { describe, test, expect, beforeEach } from "@jest/globals";
import { AutoCompleteTrie } from "../src/models/AutoCompleteTrie.js";

// The reference dictionary exercised in src/controllers/autoCompleteController.js
const DICTIONARY = ["run", "running", "there", "this", "cat", "car", "card"];

describe("AutoCompleteTrie whole flow", () => {
    let trie;

    beforeEach(() => {
        trie = new AutoCompleteTrie();
        DICTIONARY.forEach((word) => trie.addWord(word));
    });

    test("finds every added word but not non-words or bare prefixes", () => {
        DICTIONARY.forEach((word) => {
            expect(trie.findWord(word)).toBe(true);
        });

        expect(trie.findWord("dog")).toBe(false); // never added
        expect(trie.findWord("ca")).toBe(false); // prefix only
        expect(trie.findWord("th")).toBe(false); // prefix only
    });

    test("predicts every word under a branching prefix", () => {
        expect(trie.predictWords("ca").map((s) => s.word).sort()).toEqual([
            "car",
            "card",
            "cat",
        ]);
        expect(trie.predictWords("th").map((s) => s.word).sort()).toEqual([
            "there",
            "this",
        ]);
        expect(trie.predictWords("r").map((s) => s.word).sort()).toEqual([
            "run",
            "running",
        ]);
    });

    test("narrows predictions as the user types more characters", () => {
        expect(trie.predictWords("c").map((s) => s.word).sort()).toEqual([
            "car",
            "card",
            "cat",
        ]);
        expect(trie.predictWords("ca").map((s) => s.word).sort()).toEqual([
            "car",
            "card",
            "cat",
        ]);
        expect(trie.predictWords("car").map((s) => s.word).sort()).toEqual([
            "car",
            "card",
        ]);
        expect(trie.predictWords("card").map((s) => s.word)).toEqual(["card"]);
    });

    test("returns no predictions for a prefix that is not in the trie", () => {
        expect(trie.predictWords("dog")).toEqual([]);
    });

    test("returns the whole dictionary for an empty prefix", () => {
        expect(trie.predictWords("").map((s) => s.word).sort()).toEqual(
            [...DICTIONARY].sort(),
        );
    });

    test("reflects a word added mid-session in later predictions", () => {
        expect(trie.predictWords("car").map((s) => s.word).sort()).toEqual([
            "car",
            "card",
        ]);

        trie.addWord("care");

        expect(trie.predictWords("car").map((s) => s.word).sort()).toEqual([
            "car",
            "card",
            "care",
        ]);
    });

    test("does not duplicate results when an existing word is re-added", () => {
        const before = trie.predictWords("car").map((s) => s.word).sort();

        trie.addWord("car");

        expect(trie.predictWords("car").map((s) => s.word).sort()).toEqual(before);
    });

    test("orders predictions by usage frequency, most used first", () => {
        trie.incrementUsage("card");
        trie.incrementUsage("card");
        trie.incrementUsage("cat");

        expect(trie.predictWords("ca").map((s) => s.word)).toEqual([
            "card",
            "cat",
            "car",
        ]);
    });

    test("keeps findWord and predictWords consistent", () => {
        const predictions = trie.predictWords("ca");

        predictions.forEach(({ word }) => {
            expect(trie.findWord(word)).toBe(true);
        });
    });
});
