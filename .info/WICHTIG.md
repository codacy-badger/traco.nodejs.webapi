
# WICHTIG

In dieser Datei werden einige wichtige Hinweise hinterlegt, die für mich später auf jeden fall noch nützlich sein werden.

## JSDoc von den DBClass Datein

Um ein Kommentar für JSDoc in einer DBClass Datei anzulegen muss ich folgendermaßen vorgehen, damit es in der Doku anständig gerendert wird:

```js
/**
 * Beschreibung der funktion
 * @alias module:classes.DBClassName.FunctionName
 * @param {string} Parameter1
 * @param {number} Parameter2
 * @returns {string}
 */
```

Wenn nach diesem Pattern ein JSDoc kommentar geschrieben wird, so wird dieser in der gerenderten Dokumentation auch bei der dementsprechenden DBClass angezeigt.

Die Konstruktorbeschreibung, also woraus die DBClass besteht wird im übrigen NICHt in der dementsprechenden DBClass Datei festgehalten, sondern in der `classes.js` im root-Verzeichnis, da dort alles DBClass zusammengetragen werden.
