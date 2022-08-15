# meta-comments

## Features

Xcode has this really neat organizational feature for some languages where specially-formatted comments will decorate the editor with dividers and bold formatting. This extension brings some of that functionality to VS Code.

![Marked headings, divided markings, and block markings](/images/demo.gif)

These comments can make clear to readers on _any_ IDE that something is going on. With this extension, VS Code will parse these comments and create visual editor decorations.

Plain marks are a soft visual content divider:

```ts
// MARK: Some Text
```

![Marked Headings](/images/mark-plain.png)

Divided marks get an overline, and their (optional) text appears in the Outline view:

```ts
// MARK: - Optional Text
```

![Divided Marked Headings and entry in the Outline view](/images/mark-divider.png)

Marked blocks color the editor background between them. Their text also appears in the Outline panel:

```ts
// MARK: --- Optional Text

	(...)

// MARK: ---
```

![Marked Block and entry in the Outline view](/images/mark-block.png)

## Extension Settings

This extension contributes the following settings:

* `meta-comments.blockColor`: The background color to use between heavy block (`---`) marks.
* `meta-comments.lineLimit`: The maximum number of lines in a file before we consider searching it for mark comments.
* `meta-comments.shouldBoldCommentStart`: Set to `true` to bold the comment start (the `//` part) along with the rest of the line.

## Release Notes

See [CHANGELOG.md](/CHANGELOG.md).

## Known Issues

PRs are welcome and appreciated to help solve the following or any other issues you may have:

- Highlighted blocks (using `MARK: ---`) have a visible underline.
