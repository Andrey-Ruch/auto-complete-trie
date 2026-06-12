import readline from "readline";

export class ConsoleView {
    constructor(controller) {
        this.controller = controller;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: "\n> ",
        });
    }

    start() {
        console.log("=== AutoComplete Trie Console ===");
        console.log("Type 'help' for commands");

        this.rl.prompt();

        this.rl.on("line", (line) => {
            this._handleInput(line);
            this.rl.prompt();
        });

        this.rl.on("close", () => {
            console.log("Goodbye!");
            process.exit(0);
        });
    }

    _handleInput(line) {
        const [command, ...args] = line.trim().split(/\s+/);
        const argument = args.join(" ");

        switch ((command || "").toLowerCase()) {
            case "add":
                this._render(this.controller.addWord(argument));
                break;

            case "find":
                this._render(this.controller.findWord(argument));
                break;

            case "complete":
                this._render(this.controller.predictWords(argument));
                break;

            case "help":
                this._showHelp();
                break;

            case "exit":
                this.rl.close();
                break;

            case "":
                break; // empty line - just re-prompt

            default:
                console.log(
                    `✗ Unknown command: '${command}'. Type 'help' for commands.`,
                );
        }
    }

    // Turn a controller result object into console output
    _render(result) {
        const symbol = result.success ? "✓" : "✗";
        console.log(`${symbol} ${result.message}`);
    }

    _showHelp() {
        console.log(`Commands:
  add <word>        - Add word to dictionary
  find <word>       - Check if word exists
  complete <prefix> - Get completions
  help              - Show this message
  exit              - Quit program`);
    }
}
