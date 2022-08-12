// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { get, reloadConfig } from "./config.js";

// MARK: - TEST AREA

// MARK: Sortof what we're looking for in a single-line header-ish marker
// Only boldens with a trailing space (with the hope that the user would add some text)
// Marks with lines always get a line. Text is optional on those.

// These are not marks:
// MARK
// MARK:
// MARK-
// MARK:-

// MARK: - Wrap both sides of the line with two marks
// MARK: -

{
	// MARK: marks work inside of blocks as well

	// MARK: -
	// they can even have lines in here!

	{
		{
			// MARK: also nested blocks
		}
	}
}

// These marks appear in VS Code's Outline, under "marks"

// TODO: Future work
// - Tweak line styling
// - Marks with triple-hyphens (---) by default have a line, but when paired
//   with a second such mark, form a "block" that displays distinctly
//   from surrounding code.

// MARK: -

const boldedMark = /(\/\/\s*MARK:\s+)/u;
const linedMark = /(\/\/\s*MARK:\s+-)/u;
const markContent = /(\/\/\s*MARK:\s+-\s+)(.+)/u;

const lineNumberColor = new vscode.ThemeColor("editorLineNumber.foreground");

const bolded = vscode.window.createTextEditorDecorationType({
	fontWeight: "bold"
});

const overlined = vscode.window.createTextEditorDecorationType({
	isWholeLine: true,
	border: `
		border: none;
		border-top: 1px solid;
		`,
	borderColor: lineNumberColor
});

// MARK: - Actions

function decorate(editor: vscode.TextEditor): void {
	// Prepare and register decorations
	const boldedDecorations: Array<vscode.DecorationOptions> = [];
	const linedDecorations: Array<vscode.DecorationOptions> = [];

	const sourceCode = editor.document.getText();
	const lines = sourceCode.split("\n");

	// Efficiency workaround: Avoid searching very large files
	const lineLimit = get("lineLimit");
	if (lines.length > lineLimit) {
		void vscode.window.showWarningMessage(
			`[meta-comments] File ${editor.document.fileName} is ${lines.length} lines long, more than our ${lineLimit} line limit for finding markers.`
		);
		return;
	}

	// The user might want to bold the whole thing, and not just after the `MARK:` part.
	// I'm torn, so I'll let them choose.
	const shouldBoldCommentStart = get("shouldBoldCommentStart");

	// FIXME: There's got to be a more efficient way to do this
	for (const [idx, line] of lines.entries()) {
		// For each line...

		// MARK: Bold text
		const bolded = line.match(boldedMark);
		if (bolded?.index !== undefined) {
			const end = bolded[1];
			if (end !== undefined) {
				// bold the whole comment
				let boldStart = bolded.index;

				if (!shouldBoldCommentStart) {
					// bold only after the comment start
					const text = line.slice(bolded.index);
					const indexOfMark = text.indexOf("MARK:"); // avoid bolding the comment start
					boldStart = bolded.index + indexOfMark;
				}

				const range = new vscode.Range(
					new vscode.Position(idx, boldStart),
					new vscode.Position(idx, line.length) // rest of the line
				);
				boldedDecorations.push({ range });
			}
		}

		// MARK: Horizontal rule
		const lined = line.match(linedMark);
		if (lined?.index !== undefined) {
			const end = lined[1];
			if (end !== undefined) {
				const range = new vscode.Range(
					new vscode.Position(idx, 0),
					new vscode.Position(idx, lined.index + end.length)
				);
				linedDecorations.push({ range });
			}
		}
	}

	editor.setDecorations(overlined, linedDecorations);
	editor.setDecorations(bolded, boldedDecorations);
}

function decorateAllEditors(context: string): void {
	console.log(`[${context}] ${editorCount()} text editors are visible`);
	vscode.window.visibleTextEditors.forEach(decorate);
}

function decorateEditorWithUri(uri: vscode.Uri, context: string): void {
	console.log(`[${context}] ${editorCount()} text editors are visible`);
	const openEditor = vscode.window.visibleTextEditors //
		.find(editor => editor.document.uri === uri);
	if (openEditor) decorate(openEditor);
}

function editorCount(): number {
	return vscode.window.visibleTextEditors.length;
}

// MARK: - Symbols

interface MarkTokens {
	text: string;
	range: vscode.Range;
}

const allKnownLanguages = vscode.languages.getLanguages();

const symbolProvider: vscode.DocumentSymbolProvider = {
	provideDocumentSymbols(document, canceler) {
		// Efficiency workaround: Avoid searching very large files
		const lineCount = document.lineCount;
		const lineLimit = get("lineLimit");
		if (lineCount > lineLimit) {
			void vscode.window.showWarningMessage(
				`[meta-comments] File ${document.fileName} is ${lineCount} lines long, more than our ${lineLimit} line limit for finding markers.`
			);
			return [];
		}

		// Find and gather symbold
		const markTokens: Array<MarkTokens> = [];

		const sourceCode = document.getText();
		const lines = sourceCode.split("\n");

		// FIXME: There's got to be a more efficient way to do this
		for (const [idx, line] of lines.entries()) {
			// For each line...

			// MARK: Mark contents
			const mark = line.match(markContent);
			if (mark?.index !== undefined) {
				const text = mark[0];
				const end = mark[1];
				if (text !== undefined && end !== undefined) {
					// The symbol is the whole line
					const range = new vscode.Range(
						new vscode.Position(idx, 0),
						new vscode.Position(idx, line.length)
					);
					// The text is the part after the mark
					const text = line.slice(mark.index + end.length);
					markTokens.push({ range, text });
				}
			}

			if (canceler.isCancellationRequested) {
				console.log("Cancelled token search");
				return []; // break early
			}
		}

		console.log(`Found ${markTokens.length} mark tokens`);

		// Provide symbols to VS Code
		return markTokens.map(token => {
			const location = new vscode.Location(document.uri, token.range);
			return new vscode.SymbolInformation(token.text, vscode.SymbolKind.Key, "", location);
		});
	}
};

// MARK: - Events and Listeners

export async function activate(context: vscode.ExtensionContext): Promise<void> {
	console.log("Loaded!");
	reloadConfig("activate");

	// Decorate editors on start
	decorateAllEditors("activate");

	context.subscriptions.push(
		// Provide symbols to path ribbon
		vscode.languages.registerDocumentSymbolProvider(await allKnownLanguages, symbolProvider, {
			label: "marks"
		}),

		// Decorate special comments
		vscode.workspace.onDidChangeTextDocument(event => {
			// on every text change...
			decorateEditorWithUri(event.document.uri, "onDidChangeTextDocument");
		}),
		vscode.workspace.onDidOpenTextDocument(event => {
			// on open...
			decorateEditorWithUri(event.uri, "onDidOpenTextDocument");
		}),
		vscode.window.onDidChangeActiveTextEditor(event => {
			// on tab change...
			if (!event?.document.uri) return;
			decorateEditorWithUri(event.document.uri, "onDidChangeActiveTextEditor");
		}),
		vscode.window.onDidChangeVisibleTextEditors(() => {
			decorateAllEditors("onDidChangeVisibleTextEditors");
		}),

		// Load new config
		vscode.workspace.onDidChangeConfiguration(() => {
			reloadConfig("onDidChangeConfiguration");
		})
	);
}

export function deactivate(): void {
	// this method is called when your extension is deactivated
}
