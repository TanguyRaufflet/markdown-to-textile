#!/usr/bin/env node

/**
 * Test runner for Markdown to Textile converter
 * Runs assertion-based tests and reports results
 */

const MarkdownToTextile = require('./markdown-to-textile/markdown-to-textile.js');

const converter = new MarkdownToTextile();

const testSuites = [
  {
    suite: 'Headers',
    tests: [
      ['# H1', 'h1. H1\n'],
      ['## H2', 'h2. H2\n'],
      ['### H3', 'h3. H3\n'],
      ['#### H4', 'h4. H4\n'],
      ['##### H5', 'h5. H5\n'],
      ['###### H6', 'h6. H6\n'],
    ]
  },
  {
    suite: 'Emphasis',
    tests: [
      ['**bold**', '*bold*'],
      ['*italic*', '_italic_'],
      ['__bold alt__', '*bold alt*'],
      ['_italic alt_', '_italic alt_'],
      ['**bold** and *italic*', '*bold* and _italic_'],
      ['**bold _mixed_ text**', '*bold _mixed_ text*'],
      ['~~strikethrough~~', '-strikethrough-'],
    ]
  },
  {
    suite: 'Lists - flat',
    tests: [
      ['- Item 1', '* Item 1'],
      ['* Item 1', '* Item 1'],
      ['1. First', '# First'],
      ['2. Second', '# Second'],
    ]
  },
  {
    suite: 'Lists - nested',
    tests: [
      ['- A\n  - B\n    - C', '* A\n** B\n*** C'],
      ['1. A\n  1. B\n    1. C', '# A\n## B\n### C'],
    ]
  },
  {
    suite: 'Task lists',
    tests: [
      ['- [x] Done', '* {color:green}(/){color} Done'],
      ['- [ ] Open', '* {color:red}(x){color} Open'],
      ['  - [x] Nested done', '** {color:green}(/){color} Nested done'],
      ['  - [ ] Nested open', '** {color:red}(x){color} Nested open'],
      ['- [X] Case insensitive', '* {color:green}(/){color} Case insensitive'],
    ]
  },
  {
    suite: 'Links and Images',
    tests: [
      ['[text](http://example.com)', '"text":http://example.com'],
      ['![alt](image.png)', '!image.png(alt)!'],
      ['![](image.png)', '!image.png()!'],
      ['Before ![img](url) after', 'Before !url(img)! after'],
      ['[link](url) and ![img](url2)', '"link":url and !url2(img)!'],
    ]
  },
  {
    suite: 'Code',
    tests: [
      ['`inline code`', '@inline code@'],
      ['```\nplain code\n```', 'bc. plain code\n'],
      ['```javascript\nvar x = 1;\n```', 'bc(javascript). var x = 1;\n'],
    ]
  },
  {
    suite: 'Blockquotes',
    tests: [
      ['> single quote', 'bq. single quote'],
      ['>> nested quote', 'bq(2). nested quote'],
      ['>>> deep quote', 'bq(3). deep quote'],
    ]
  },
  {
    suite: 'Footnotes',
    tests: [
      ['Text[^1]', 'Text[1]'],
      ['[^1]: Footnote text', 'fn1. Footnote text'],
      ['See[^1] and[^2]', 'See[1] and[2]'],
    ]
  },
  {
    suite: 'Definition lists',
    tests: [
      ['Term\n: Definition', '- Term := Definition'],
    ]
  },
  {
    suite: 'Misc',
    tests: [
      ['---', '---'],
    ]
  },
  {
    suite: 'Tables',
    tests: [
      [
        '| Name | Age |\n|------|-----|\n| John | 25 |',
        '|_. Name|_. Age|\n|John|25|'
      ],
      [
        '| Left | Center | Right |\n|:-----|:------:|------:|\n| A | B | C |',
        '|_. Left|=. Center|>. Right|\n|A|=. B|>. C|'
      ],
    ]
  },
  {
    suite: 'Input validation',
    tests: [
      ['empty string', () => converter.convert('') === ''],
      ['non-string throws', () => {
        try { converter.convert(123); return false; }
        catch (e) { return e.message.includes('must be a string'); }
      }],
      ['null throws', () => {
        try { converter.convert(null); return false; }
        catch (e) { return e.message.includes('must be a string'); }
      }],
      ['oversized throws', () => {
        try { converter.convert('x'.repeat(500001)); return false; }
        catch (e) { return e.message.includes('maximum length'); }
      }],
      ['max valid size', () => {
        try { converter.convert('x'.repeat(500000)); return true; }
        catch (e) { return false; }
      }],
    ]
  },
  {
    suite: 'Mixed content',
    tests: [
      [
        '# Title\n\n**Bold** with `code` and [link](url).\n\n- Item 1\n- Item 2',
        'h1. Title\n\n\n*Bold* with @code@ and "link":url.\n* Item 1\n* Item 2'
      ],
    ]
  },
];

// Run tests
let totalPass = 0;
let totalFail = 0;
const failures = [];

testSuites.forEach(({ suite, tests }) => {
  let suitePass = 0;
  let suiteFail = 0;

  tests.forEach(([input, expected]) => {
    let passed;

    if (typeof expected === 'function') {
      // Custom assertion function
      passed = expected();
    } else {
      const result = converter.convert(input);
      passed = result.trim() === expected.trim();
      if (!passed) {
        failures.push({
          suite,
          input,
          expected: expected.trim(),
          got: result.trim()
        });
      }
    }

    if (passed) {
      suitePass++;
      totalPass++;
    } else {
      suiteFail++;
      totalFail++;
    }
  });

  const status = suiteFail === 0 ? 'PASS' : 'FAIL';
  console.log(`  ${status}  ${suite} (${suitePass}/${suitePass + suiteFail})`);
});

// Summary
console.log(`\n${'─'.repeat(40)}`);
console.log(`  ${totalPass} passed, ${totalFail} failed, ${totalPass + totalFail} total`);

if (failures.length > 0) {
  console.log('\nFailures:\n');
  failures.forEach(({ suite, input, expected, got }) => {
    console.log(`  ${suite}: ${JSON.stringify(input)}`);
    console.log(`    Expected: ${JSON.stringify(expected)}`);
    console.log(`    Got:      ${JSON.stringify(got)}\n`);
  });
}

process.exit(totalFail === 0 ? 0 : 1);
