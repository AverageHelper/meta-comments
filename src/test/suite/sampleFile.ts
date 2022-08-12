/* eslint-disable @typescript-eslint/no-unused-vars */
export {};

function capitalize<S extends string>(str: S): Capitalize<S> {
	return str.toUpperCase() as Capitalize<S>;
}

// MARK: - This renders.

const str = "this is a string";

// Typing "string." should bring up a list of functions, including `capitalize` above:
const capitalized = capitalize(str);
