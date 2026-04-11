# TODO - Markdown to Textile Converter

## Step-by-Step Improvement Plan

### Step 1: Regex-Reihenfolge & Konvertierungs-Bugs fixen
- [x] Images-Pattern VOR Links-Pattern verschieben (sonst wird `![alt](url)` als Link gematcht)
- [x] Bold/Italic-Reihenfolge prüfen - Platzhalter-Technik verhindert Re-Matching
- [x] Italic-Pattern verbessern mit Lookbehind/Lookahead
- [x] `convert()`-Methode: unnötiges if/else entfernen (beide Branches machen dasselbe)
- [x] Verschachtelte Listen unterstützen (z.B. `  - Item` -> `** Item`)

### Step 2: Fehlenden "Send to Tab" Button hinzufuegen
- [x] `#send-to-tab` Button in `popup.html` ergaenzen
- [x] Keyboard-Shortcut Ctrl+Enter fuer Konvertierung im Popup

### Step 3: Manifest V2 -> V3 Migration
- [x] `manifest_version` auf 3 setzen
- [x] `browser_action` -> `action` umbenennen
- [x] `background.scripts` beibehalten (Firefox MV3 Event Pages)
- [x] `web_accessible_resources` auf neues Format umstellen
- [x] `browser_specific_settings` mit gecko ID und min-version hinzugefuegt
- [x] Doppelten `initializeContextMenu()`-Aufruf entfernt (MV3 Event Pages)
- [x] Version auf 1.1 erhoeht
- [x] `web-ext lint` bestanden - 0 Fehler, 0 Warnungen

### Step 4: Singleton Converter & Code Cleanup
- [x] Converter-Instanz nur einmal erzeugen (content.js: 3 Instanzen -> 1 const)
- [x] `document.execCommand('copy')` in popup.js durch moderne Clipboard API ersetzt
- [x] Dead Code entfernt (unreachable contentEditable branch in content.js)
- [x] contentEditable-Ersetzung mit Selection API statt deprecated execCommand

### Step 5: Input-Validierung & Security
- [x] Input-Laengenbegrenzung (500k Zeichen, DoS-Schutz)
- [x] Typ-Validierung (nur Strings akzeptiert)
- [x] Content Security Policy in manifest.json (script-src/style-src 'self')

### Step 6: Erweiterte Konvertierungen
- [x] Verschachtelte Blockquotes (`>> text` -> `bq(2). text`, `>>>` -> `bq(3).` etc.)
- [x] Footnotes-Support (`[^1]` -> `[1]`, `[^1]: text` -> `fn1. text`)
- [x] Definition Lists (`Term\n: Def` -> `- Term := Def`)
- [x] Task-Listen (`- [x]` -> Checkmark, `- [ ]` -> Cross, inkl. Nesting)

### Step 7: Tests
- [x] Unit-Tests fuer alle Konvertierungsregeln (48 Tests, 14 Suites)
- [x] Edge-Case-Tests (leerer Input, non-string, oversized Input)
- [x] Code-Block-Bug gefixt (Inline-Code matchte vor Block-Code)
- [x] Tabellen-Regex komplett ueberarbeitet (robusteres Pattern)
- [x] Separator-Erkennung gefixt (mittlere Pipe-Zeichen fehlten)
- [ ] Integrationstests fuer Browser-Extension-Messaging (erfordert Browser-Umgebung)

### Step 8: UX-Verbesserungen
- [x] Echtzeit-Preview beim Tippen (Toggle + 200ms Debounce)
- [x] Conversion-History im Popup (max 10, Dropdown zum Wiederherstellen)
- [x] Visuelles Feedback (Button-Flash-Animation bei Aktionen)

---

## Bereits erledigt
- [x] Newlines nach Textile-Headlines
- [x] Tabellen-Konvertierung vollstaendig implementiert
- [x] Code-Blocks generieren Textile `bc.` statt HTML
