export class AutoCompleteController {
    constructor(trie) {
        this.trie = trie;
    }

    addWord(word) {
        const normalized = this._normalize(word);
        if (!normalized) {
            return { success: false, message: "Please provide a valid word" };
        }

        this.trie.addWord(normalized);

        return {
            success: true,
            message: `Added '${normalized}' to dictionary`,
        };
    }

    findWord(word) {
        const normalized = this._normalize(word);
        if (!normalized) {
            return { success: false, message: "Please provide a valid word" };
        }

        const exists = this.trie.findWord(normalized);

        return {
            success: exists,
            message: exists
                ? `'${normalized}' exists in dictionary`
                : `'${normalized}' not found in dictionary`,
        };
    }

    predictWords(prefix) {
        const normalized = this._normalize(prefix);
        if (!normalized) {
            return {
                success: false,
                message: "Please provide a valid prefix",
                suggestions: [],
            };
        }

        const suggestions = this.trie.predictWords(normalized);

        return {
            success: true,
            prefix: normalized,
            suggestions,
            message: suggestions.length
                ? `Suggestions for '${normalized}': ${suggestions.join(", ")}`
                : `No suggestions found for '${normalized}'`,
        };
    }

    // One place for input cleanup - trim whitespace, lowercase
    _normalize(input) {
        if (typeof input !== "string") return "";
        return input.trim().toLowerCase();
    }
}
