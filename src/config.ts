import * as vscode from "vscode";

// MARK: ---
// These defaults should match the definition
// given in `contributes.configuration` in package.json

type BlockColor = "editor.inactiveSelectionBackground" | "editor.selectionBackground";

const DEFAULT_CONFIG = {
	/** We shouldn't parse documents larger than this */
	lineLimit: 10000,

	/** Whether to also bold the comment start (`//`) */
	shouldBoldCommentStart: false,

	/** The background color between heavy block (`---`) marks */
	blockColor: "editor.inactiveSelectionBackground" as BlockColor,

	/** We shouldn't parse files that source control ignores, unless the user says so */
	shouldParseIgnoredFiles: false
};
// MARK: --- Functions

// MARK: reloadConfig

type Config = typeof DEFAULT_CONFIG;

function isConfigKey(tbd: unknown): tbd is keyof Config {
	return Object.keys(DEFAULT_CONFIG).includes(tbd as string);
}

let workspaceConfig: vscode.WorkspaceConfiguration | undefined;

/** Loads the extension's config from VS Code. */
export function reloadConfig(context: string): void {
	workspaceConfig = vscode.workspace.getConfiguration("meta-comments");
	console.log(`[${context}] Loaded config values`);
}

// MARK: get

/** Returns the given config value for the given `key`. */
export function get<K extends keyof Config>(key: K): Config[K];

/** Returns the given config value for the given `key`. */
export function get(key: string): Config[keyof Config] | undefined;

export function get<K extends keyof Config>(key: K): Config[K] | undefined {
	if (!isConfigKey(key)) return undefined;
	return workspaceConfig?.get(key) ?? DEFAULT_CONFIG[key];
}
