export class AutoCompleteTrie {
    constructor(value = "") {
        this.value = value;
        this.children = {};
        this.endOfWord = false;
    }

    addWord(word) {
        let currentNode = this;

        for (const char of word) {
            // Create a child node only if the path doesn't exist yet
            if (!currentNode.children[char]) {
                currentNode.children[char] = new AutoCompleteTrie(char);
            }

            // Move down the tree (reusing the existing path when possible)
            currentNode = currentNode.children[char];
        }

        // Mark the last character's node as a complete word
        currentNode.endOfWord = true;
    }

    findWord(word) {}

    predictWords(prefix) {}

    _getRemainingTree(prefix, node) {}

    _allWordsHelper(prefix, node, allWords) {}
}
