export class AutoCompleteController {
    constructor(trie) {
        this.trie = trie;
    }

    addWord(word) {
        const result = this._validate(word);
        if (!result.valid) {
            return { success: false, message: result.error };
        }

        this.trie.addWord(result.word);

        return {
            success: true,
            message: `Added '${result.word}' to dictionary`,
        };
    }

    findWord(word) {
        const result = this._validate(word);
        if (!result.valid) {
            return { success: false, message: result.error };
        }

        const exists = this.trie.findWord(result.word);

        return {
            success: exists,
            message: exists
                ? `'${result.word}' exists in dictionary`
                : `'${result.word}' not found in dictionary`,
        };
    }

    predictWords(prefix) {
        const result = this._validate(prefix);
        if (!result.valid) {
            return { success: false, message: result.error, suggestions: [] };
        }

        const suggestions = this.trie.predictWords(result.word);

        return {
            success: true,
            prefix: result.word,
            suggestions,
            message: suggestions.length
                ? `Suggestions for '${result.word}': ${suggestions.join(", ")}`
                : `No suggestions found for '${result.word}'`,
        };
    }

    // Single gate for all input: trim, lowercase, then enforce the rules
    _validate(input) {
        if (typeof input !== "string" || !input.trim()) {
            return { valid: false, error: "Please provide a valid word" };
        }

        const word = input.trim().toLowerCase();

        if (/\s/.test(word)) {
            return {
                valid: false,
                error: "Only single words are allowed (no spaces)",
            };
        }

        return { valid: true, word };
    }
}
