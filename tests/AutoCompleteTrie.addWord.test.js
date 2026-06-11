import { describe, test, expect, beforeEach } from "@jest/globals";
import { AutoCompleteTrie } from "../src/models/AutoCompleteTrie.js";

/**
 * Walk the trie from `node` following each character of `word`.
 * Returns the node reached after the last character, or `undefined`
 * if the path breaks part-way through.
 */
function traverse(node, word) {
    let currentNode = node;

    for (const char of word) {
        currentNode = currentNode.children[char];
        if (!currentNode) return undefined;
    }

    return currentNode;
}

describe("AutoCompleteTrie.addWord", () => {
    let trie;

    beforeEach(() => {
        trie = new AutoCompleteTrie();
    });

    test("builds a node chain whose values match each character", () => {
        trie.addWord("run");

        expect(trie.children.r.value).toBe("r");
        expect(trie.children.r.children.u.value).toBe("u");
        expect(trie.children.r.children.u.children.n.value).toBe("n");
    });

    test("marks the final character's node as the end of a word", () => {
        trie.addWord("run");

        expect(traverse(trie, "run").endOfWord).toBe(true);
    });

    test("leaves intermediate nodes unmarked", () => {
        trie.addWord("run");

        expect(traverse(trie, "r").endOfWord).toBe(false);
        expect(traverse(trie, "ru").endOfWord).toBe(false);
    });

    test("marks the root and adds no children for an empty string", () => {
        trie.addWord("");

        expect(trie.endOfWord).toBe(true);
        expect(Object.keys(trie.children)).toHaveLength(0);
    });

    test("handles a single-character word", () => {
        trie.addWord("a");

        expect(trie.children.a.value).toBe("a");
        expect(trie.children.a.endOfWord).toBe(true);
        expect(Object.keys(trie.children.a.children)).toHaveLength(0);
    });

    test("shares a common prefix and branches where words diverge", () => {
        trie.addWord("run");
        trie.addWord("rug");

        const uNode = traverse(trie, "ru");
        expect(Object.keys(uNode.children).sort()).toEqual(["g", "n"]);
        expect(traverse(trie, "run").endOfWord).toBe(true);
        expect(traverse(trie, "rug").endOfWord).toBe(true);
    });

    test("marks a prefix word added after the longer word", () => {
        trie.addWord("running");
        trie.addWord("run");

        expect(traverse(trie, "run").endOfWord).toBe(true);
        // The deeper path to "running" must remain intact.
        expect(traverse(trie, "running").endOfWord).toBe(true);
    });

    test("extends a prefix word into a longer word", () => {
        trie.addWord("run");
        trie.addWord("running");

        expect(traverse(trie, "run").endOfWord).toBe(true);
        expect(traverse(trie, "running").endOfWord).toBe(true);
    });

    test("reuses existing nodes when the same word is added twice", () => {
        trie.addWord("run");
        const originalNode = traverse(trie, "run");

        trie.addWord("run");

        // No node replaced and no duplicate children created.
        expect(traverse(trie, "run")).toBe(originalNode);
        expect(Object.keys(trie.children)).toHaveLength(1);
        expect(Object.keys(traverse(trie, "ru").children)).toHaveLength(1);
    });

    test("never marks the root as the end of a non-empty word", () => {
        trie.addWord("run");

        expect(trie.endOfWord).toBe(false);
    });
});
