# Markdown to Textile Converter

A Firefox extension that allows you to easily convert Markdown text to Textile format directly in your browser.

## Features

- Convert selected Markdown text to Textile with a single right-click
- Built-in popup interface for converting larger pieces of text
- Works in text areas, input fields, and contentEditable elements
- **Live Preview** mode with real-time conversion as you type
- **Keyboard shortcut** Ctrl+Enter for quick conversion
- **Send to Tab** button to insert converted text into active page
- **Conversion history** with last 10 entries
- Supports common Markdown elements:
  - Headers (h1-h6)
  - Emphasis (bold/italic, including nested)
  - Lists (ordered/unordered, nested)
  - Task lists (`- [x]` / `- [ ]`)
  - Links and images
  - Inline code and code blocks (with language support)
  - Blockquotes (single and nested)
  - Footnotes
  - Definition lists
  - Tables with alignment
  - Horizontal rules
  - Strikethrough

## Installation

### From Firefox Add-ons (Recommended)

Visit the [Add-on page](https://addons.mozilla.org/de/firefox/addon/markdown-to-textile-converter/) and click "Add to Firefox"

### Manual Installation (Development)

1. Clone this repository:
   ```
   git clone https://github.com/dkd-dobberkau/markdown-to-textile.git
   ```

2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`

3. Click "Load Temporary Add-on" and select any file from the extension directory (e.g., `manifest.json`)

## Usage

### Context Menu (Right-Click)

1. Select Markdown text on any webpage
2. Right-click and choose "Convert Markdown to Textile"
3. The selected text will be replaced with its Textile equivalent

### Popup Interface

1. Click the extension icon in the Firefox toolbar
2. Enter or paste Markdown text in the top textarea
3. Click "Convert" (or press Ctrl+Enter) to transform it to Textile
4. Enable "Live Preview" for real-time conversion while typing
5. Use "Copy to Clipboard" or "Send to Tab" for the result
6. Access previous conversions via the History dropdown

## Examples

| Markdown | Textile |
|----------|---------|
| `# Heading` | `h1. Heading` |
| `**bold**` | `*bold*` |
| `*italic*` | `_italic_` |
| `[Link](url)` | `"Link":url` |
| ``` `code` ``` | `@code@` |
| ` ```code``` ` | `bc. code` |
| `> quote` | `bq. quote` |
| `>> nested` | `bq(2). nested` |
| `- [x] done` | `* {color:green}(/){color} done` |
| `[^1]` | `[1]` (footnote ref) |
| `Term\n: Def` | `- Term := Def` |
| Tables | Textile tables with alignment |

## Development

### Build System

The project includes a comprehensive build script for version management and packaging:

#### Quick Start
```bash
# Install web-ext globally (if not already installed)
npm install -g web-ext

# Build with patch version increment (1.0 → 1.0.1)
npm run build

# Build with minor version increment (1.0.1 → 1.1.0)
npm run build:minor

# Build with major version increment (1.1.0 → 2.0.0)
npm run build:major

# Set specific version
node build.js --version=2.5.3
```

#### Available Scripts
- `npm run build` - Increment patch version and build
- `npm run build:minor` - Increment minor version and build
- `npm run build:major` - Increment major version and build
- `npm test` - Run conversion tests with example Markdown
- `npm run test:interactive` - Interactive testing mode
- `npm run lint` - Validate extension with web-ext lint
- `npm run start` - Run extension in Firefox for testing
- `npm run package` - Build package without version bump

#### Build Process
The build script automatically:
1. **Updates version** in `manifest.json`
2. **Runs web-ext lint** to validate extension
3. **Builds extension package** (.zip file in `web-ext-artifacts/`)
4. **Creates git tag** for the version
5. **Shows next steps** for committing and pushing

#### Example Workflow
```bash
# Make your changes, then:
npm run build:minor      # Updates version and builds
git add .
git commit -m "Release v1.1.0"
git push && git push --tags
```

### Manual Commands
If you prefer to use web-ext directly:
```bash
web-ext lint --source-dir=./markdown-to-textile
web-ext build --source-dir=./markdown-to-textile
web-ext run --source-dir=./markdown-to-textile
```

### Testing

The project includes 48 assertion-based tests across 14 suites:

```bash
# Run all conversion tests
npm test
```

Test suites cover: Headers, Emphasis, Lists (flat + nested), Task lists, Links/Images, Code (inline + blocks), Blockquotes, Footnotes, Definition lists, Tables, Input validation, and Mixed content.

### Extension Structure

- `manifest.json` - Extension metadata and configuration
- `markdown-to-textile.js` - Core conversion logic
- `background.js` - Background script for context menu integration
- `content.js` - Content script for DOM manipulation
- `popup/` - Files for the popup interface

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the Mozilla Public License Version 2.0 - see the LICENSE file for details.

## Acknowledgments

- Inspired by the need to work with both Markdown and Textile formats
- Thanks to all contributors who help improve this extension
