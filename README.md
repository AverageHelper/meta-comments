# meta-comments

Xcode has this really neat organizational feature for some languages where specially-formatted comments will decorate the editor with dividers and bold formatting. This extension brings some of that functionality to VS Code.

### Alternative Projects

My work here is largely based on that of these projects below.

[everdrone/mark-meta-comments](https://github.com/everdrone/mark-meta-comments) - Major design and implementation inspiration for this plugin.

[snak1t/vscode-marks-to-outline](https://github.com/snak1t/vscode-marks-to-outline) - Highlights MARK comments and adds them to the outline. Has their own style, but more configurable at the moment.

## Features

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

- `meta-comments.blockColor`: The background color to use between heavy block (`---`) marks.
- `meta-comments.lineLimit`: The maximum number of lines in a file before we consider searching it for mark comments.
- `meta-comments.shouldBoldCommentStart`: Set to `true` to bold the comment start (the `//` part) along with the rest of the line.

## Release Notes

See [CHANGELOG.md](/CHANGELOG.md).

## Known Issues

PRs are welcome and appreciated to help solve the following or any other issues you may have:

- Highlighted blocks (using `MARK: ---`) have a visible underline.
- Decorate the code minimap. There's an open issue at [microsoft/vscode#74843](https://github.com/microsoft/vscode/issues/74843).

## Contributing

This project lives primarily at [git.average.name](https://git.average.name/AverageHelper/meta-comments). Read-only mirrors also exist on [Codeberg](https://codeberg.org/AverageHelper/meta-comments) and [GitHub](https://github.com/AverageHelper/meta-comments). Issues or pull requests should be filed at [git.average.name](https://git.average.name/AverageHelper/meta-comments). You may sign in or create an account directly, or use one of several OAuth 2.0 providers.
