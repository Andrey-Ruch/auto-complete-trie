import { describe, test, expect, beforeEach } from "@jest/globals";
import { AutoCompleteTrie } from "../src/models/AutoCompleteTrie.js";

describe("AutoCompleteTrie._getRemainingTree", () => {
    let trie;

    beforeEach(() => {
        trie = new AutoCompleteTrie();
    });

    test("returns the node where an existing prefix ends", () => {
        trie.addWord("run");

        expect(trie._getRemainingTree("run").value).toBe("n");
    });

    test("returns the actual node object so the subtree can be reused", () => {
        trie.addWord("run");

        const expectedNode = trie.children.r.children.u.children.n;
        expect(trie._getRemainingTree("run")).toBe(expectedNode);
    });

    test("returns the subtree exposing the remaining branches", () => {
        trie.addWord("run");
        trie.addWord("rug");

        const uNode = trie._getRemainingTree("ru");
        expect(Object.keys(uNode.children).sort()).toEqual(["g", "n"]);
    });

    test("returns the node even when the prefix is not a complete word", () => {
        trie.addWord("running");

        const node = trie._getRemainingTree("run");
        expect(node).not.toBeNull();
        expect(node.endOfWord).toBe(false);
    });

    test("returns null for a prefix that is not in the trie", () => {
        trie.addWord("run");

        expect(trie._getRemainingTree("xyz")).toBeNull();
        expect(trie._getRemainingTree("car")).toBeNull();
    });

    test("returns null for a prefix that diverges partway", () => {
        trie.addWord("run");

        expect(trie._getRemainingTree("rx")).toBeNull();
    });

    test("returns the starting node for an empty prefix", () => {
        expect(trie._getRemainingTree("")).toBe(trie);
    });

    test("starts traversal from an explicitly provided node", () => {
        trie.addWord("run");

        const nNode = trie._getRemainingTree("un", trie.children.r);
        expect(nNode.value).toBe("n");
        expect(nNode).toBe(trie.children.r.children.u.children.n);
    });

    test("returns a leaf node for a prefix equal to a full word", () => {
        trie.addWord("run");

        const node = trie._getRemainingTree("run");
        expect(node.endOfWord).toBe(true);
        expect(Object.keys(node.children)).toHaveLength(0);
    });
});
