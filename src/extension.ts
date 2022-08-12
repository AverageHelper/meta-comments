// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// MARK: - Colors

const lineNumberColor = new vscode.ThemeColor("editorLineNumber.foreground");
// const activeLineNumberColor = new vscode.ThemeColor("editorLineNumber.activeForeground");

const borderedLine = vscode.window.createTextEditorDecorationType({
	isWholeLine: true,
	fontWeight: "bold",
	border: `
		border: none;
		border-top: 1.5pt solid;
		margin-top: 0;
		`,
	borderColor: lineNumberColor
});

function decorate(editor: vscode.TextEditor): void {
	const sourceCode = editor.document.getText();
	const regex = /(\/\/\s*MARK: -)/u;

	const decorations: Array<vscode.DecorationOptions> = [];

	const lines = sourceCode.split("\n");
	for (const [idx, line] of lines.entries()) {
		const match = line.match(regex);

		if (match?.index !== undefined) {
			const end = match[1];
			if (end === undefined) continue;
			const range = new vscode.Range(
				new vscode.Position(idx, 0),
				new vscode.Position(idx, match.index + end.length)
			);
			decorations.push({ range });
		}
	}

	editor.setDecorations(borderedLine, decorations);
}

// MARK: - Start

export function activate(context: vscode.ExtensionContext): void {
	console.log("Loaded!");

	// Decorate editors on start
	console.log(
		`[activate] There are ${vscode.window.visibleTextEditors.length} text editors visible`
	);
	vscode.window.visibleTextEditors.forEach(decorate);

	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(event => {
			// on every text change...
			const openEditor = vscode.window.visibleTextEditors //
				.find(editor => editor.document.uri === event.document.uri);
			console.log(
				`[onDidChangeTextDocument] There are ${vscode.window.visibleTextEditors.length} text editors visible`
			);

			if (openEditor) decorate(openEditor);
		}),
		vscode.workspace.onDidOpenTextDocument(event => {
			// on open...
			const openEditor = vscode.window.visibleTextEditors //
				.find(editor => editor.document.uri === event.uri);
			console.log(
				`[onDidOpenTextDocument] There are ${vscode.window.visibleTextEditors.length} text editors visible`
			);

			if (openEditor) decorate(openEditor);
		}),
		vscode.window.onDidChangeActiveTextEditor(event => {
			// on tab change...
			const openEditor = vscode.window.visibleTextEditors //
				.find(editor => editor.document.uri === event?.document.uri);
			console.log(
				`[onDidChangeActiveTextEditor] There are ${vscode.window.visibleTextEditors.length} text editors visible`
			);

			if (openEditor) decorate(openEditor);
		})
	);
}

export function deactivate(): void {
	// this method is called when your extension is deactivated
}
