export class WebView {
    constructor(controller) {
        this.controller = controller;
    }

    start() {
        this.addInput = document.getElementById("add-input");
        this.addButton = document.getElementById("add-btn");
        this.feedback = document.getElementById("feedback");
        this.searchInput = document.getElementById("search-input");
        this.suggestions = document.getElementById("suggestions");
        this.wordCount = document.getElementById("word-count");

        this._bindEvents();
        this._updateCount();
    }

    _bindEvents() {
        this.addButton.addEventListener("click", () => this._handleAdd());
        this.addInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") this._handleAdd();
        });

        this.searchInput.addEventListener("input", () => this._handleSearch());

        // One listener for the whole list (event delegation)
        this.suggestions.addEventListener("click", (event) => {
            const item = event.target.closest("[data-word]");
            if (item) this._handleSuggestionClick(item.dataset.word);
        });
    }

    _handleAdd() {
        const result = this.controller.addWord(this.addInput.value);
        this._renderFeedback(result);

        if (result.success) {
            this.addInput.value = "";
            this.addInput.focus();
            this._updateCount();
            this._handleSearch(); // keep the dropdown in sync with the new word
        }
    }

    _handleSearch() {
        const prefix = this.searchInput.value.trim();

        if (!prefix) {
            this._hideSuggestions();
            return;
        }

        const { suggestions } = this.controller.predictWords(prefix);
        this._renderSuggestions(prefix.toLowerCase(), suggestions);
    }

    _handleSuggestionClick(word) {
        this.searchInput.value = word;
        this.controller.incrementUsage(word);
        this.searchInput.focus();
        this._handleSearch(); // re-rank now that this word was used
    }

    // Turn a controller result object into a colored feedback bar
    _renderFeedback(result) {
        const symbol = result.success ? "✓" : "✗";
        this.feedback.textContent = `${symbol} ${result.message}`;
        this.feedback.classList.toggle("feedback--success", result.success);
        this.feedback.classList.toggle("feedback--error", !result.success);
        this.feedback.hidden = false;
    }

    _renderSuggestions(prefix, suggestions) {
        this.suggestions.replaceChildren();

        if (!suggestions.length) {
            const empty = document.createElement("li");
            empty.className = "suggestion suggestion--empty";
            empty.textContent = "No suggestions";
            this.suggestions.append(empty);
        } else {
            for (const { word } of suggestions) {
                this.suggestions.append(this._buildSuggestionItem(prefix, word));
            }
        }

        this.suggestions.hidden = false;
    }

    // Build one row, highlighting the matched prefix without using innerHTML
    _buildSuggestionItem(prefix, word) {
        const item = document.createElement("li");
        item.className = "suggestion";
        item.dataset.word = word;

        const match = document.createElement("span");
        match.className = "match";
        match.textContent = word.slice(0, prefix.length);

        item.append(match, document.createTextNode(word.slice(prefix.length)));
        return item;
    }

    _hideSuggestions() {
        this.suggestions.replaceChildren();
        this.suggestions.hidden = true;
    }

    _updateCount() {
        this.wordCount.textContent = this.controller.getWordCount();
    }
}
