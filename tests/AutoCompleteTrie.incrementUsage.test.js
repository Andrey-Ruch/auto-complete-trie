import { describe, test, expect, beforeEach } from "@jest/globals";
import { AutoCompleteTrie } from "../src/models/AutoCompleteTrie.js";

describe("AutoCompleteTrie.incrementUsage", () => {
    let trie;

    beforeEach(() => {
        trie = new AutoCompleteTrie();
    });

    test("increments the frequency of an existing word", () => {
        trie.addWord("run");

        trie.incrementUsage("run");

        expect(trie._getRemainingTree("run").frequency).toBe(1);
    });

    test("accumulates across repeated calls", () => {
        trie.addWord("run");

        trie.incrementUsage("run");
        trie.incrementUsage("run");

        expect(trie._getRemainingTree("run").frequency).toBe(2);
    });

    test("returns the node whose frequency was updated", () => {
        trie.addWord("run");

        const node = trie.incrementUsage("run");

        expect(node).toBe(trie._getRemainingTree("run"));
        expect(node.frequency).toBe(1);
    });

    test("returns null for a word not in the trie", () => {
        trie.addWord("run");

        expect(trie.incrementUsage("cat")).toBeNull();
    });

    test("returns null for a path that exists but is only a prefix", () => {
        trie.addWord("running");

        expect(trie.incrementUsage("run")).toBeNull();
        // The prefix node's frequency must stay untouched.
        expect(trie._getRemainingTree("run").frequency).toBe(0);
    });

    test("does not affect the frequency of sibling words", () => {
        trie.addWord("car");
        trie.addWord("card");

        trie.incrementUsage("car");

        expect(trie._getRemainingTree("car").frequency).toBe(1);
        expect(trie._getRemainingTree("card").frequency).toBe(0);
    });

    test("is reflected in the ordering of predictWords", () => {
        trie.addWord("car");
        trie.addWord("card");

        trie.incrementUsage("card");

        expect(trie.predictWords("car").map((s) => s.word)).toEqual([
            "card",
            "car",
        ]);
    });
});
