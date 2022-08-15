/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */

interface Range {
	lhs: number;
	rhs: number;
}

export function supportedLanguages(): Array<string> {
	const lang = ["javascript", "swift", "typescript"];
	if (lang.includes("*")) {
		return [];
	}
	return lang;
}

// MARK: --- Main

export function helloWorld(): void {
	console.log("Hello, world!");
	console.log(`I speak ${supportedLanguages()}`);
}

// MARK: ---
