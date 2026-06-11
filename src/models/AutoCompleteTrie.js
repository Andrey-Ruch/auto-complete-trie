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

    findWord(word) {
        let currentNode = this;

        for (const char of word) {
            // If the path breaks at any point, the word can't exist
            if (!currentNode.children[char]) {
                return false;
            }
            currentNode = currentNode.children[char];
        }

        // The path exists - but it's only a word if the flag says so
        return currentNode.endOfWord;
    }

    predictWords(prefix) {}

    _getRemainingTree(prefix, node = this) {
        let currentNode = node;

        for (const char of prefix) {
            // Prefix isn't in the trie at all
            if (!currentNode.children[char]) {
                return null;
            }
            currentNode = currentNode.children[char];
        }

        // The node where the prefix ends
        return currentNode;
    }

    _allWordsHelper(prefix, node, allWords) {
        // If this node completes a word, the accumulated prefix IS that word
        if (node.endOfWord) {
            allWords.push(prefix);
        }

        // Recurse into every child, extending the prefix with its character
        for (const char in node.children) {
            this._allWordsHelper(prefix + char, node.children[char], allWords);
        }
    }
}
