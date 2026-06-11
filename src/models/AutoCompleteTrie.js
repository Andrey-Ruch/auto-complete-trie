export class AutoCompleteTrie {
    constructor(value) {
        this.value = value;
        this.children = {};
        this.endOfWord = false;
    }

    addWord(word) {}

    findWord(word) {}

    predictWords(prefix) {}

    _getRemainingTree(prefix, node) {}

    _allWordsHelper(prefix, node, allWords) {}
}
