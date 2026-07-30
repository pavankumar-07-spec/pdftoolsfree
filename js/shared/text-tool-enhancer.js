/**
 * public/js/shared/text-tool-enhancer.js
 * Automatically injected enhancements for FreeToolsPDF text-input tools.
 * Handles: Live Word/Char Count, Clear/Reset Button, and Copy-to-Clipboard.
 */

(() => {
  'use strict';

  const TEXT_TOOL_MAPPING = {
  "word-repetition-checker": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "text-complexity-analyzer": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "stop-word-remover": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "title-length-checker": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "meta-description-length-checker": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "tsv-to-csv-converter": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "email-signature-generator": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "invisible-character-detector": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "character-inspector": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "unicode-inspector": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "csv-to-html-table": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "html-table-to-csv": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "merge-text-lists": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "bullet-list-generator": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "smart-title-case": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "constant-case-converter": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "normalize-unicode": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "keep-only-letters": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "keep-only-numbers": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "remove-special-characters": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "remove-punctuation": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "duplicate-word-finder": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "estimated-speaking-time": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "reading-level-analyzer": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "strip-markdown-formatting": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "remove-html-tags": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "extract-hashtags": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "extract-email-addresses": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "extract-urls": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "remove-emojis": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "word-character-counter": {
    "inputId": "count-text",
    "outputId": "calc-results-card",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": true
  },
  "study-hours-planner": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "random-number-name-picker": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "id-card-template-generator": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "resume-templates": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "cover-letters": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "passport-id-photo-maker": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "compress-image-to-target-size": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "image-border-frame-adder": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "image-color-palette-extractor": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "image-dpi-ppi-changer": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "image-to-base64": {
    "inputId": "base64-input",
    "outputId": "calc-results-card",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "base64-to-image": {
    "inputId": "base64-input",
    "outputId": "calc-results-card",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": true
  },
  "pdf-redaction-tool": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "pdf-split-by-file-size": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "pdf-n-up-print-layout": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "pdf-bookmark-toc-adder": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "pdf-esignature-tool": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "reorder-pdf-pages": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "pomodoro-study-timer": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "daily-to-do-list-planner": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "generic-countdown-timer": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "pdf-page-extractor-by-range": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "pdf-page-size-converter-a4-letter": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "pdf-optimize-for-web": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "pdf-digital-signature-verifier": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "character-counter": {
    "inputId": "source-text",
    "outputId": "results-card",
    "needsLiveCount": false,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "remove-empty-lines": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "remove-duplicate-lines": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "remove-extra-spaces": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "trim-lines": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "sort-lines": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "shuffle-lines": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "reverse-text": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "reverse-words": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "reverse-lines": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "case-converter": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "slug-generator": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "html-encoder": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "html-decoder": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "url-encoder": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "url-decoder": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "base64-encoder": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "base64-decoder": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "rot13-encoder": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "morse-code-encoder": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "morse-code-decoder": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "unicode-converter": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "ascii-converter": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "binary-text-converter": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "text-diff-checker": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "find-replace": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "json-formatter": {
    "inputId": "param-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": true
  },
  "json-validator": {
    "inputId": "param-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": true
  },
  "json-viewer": {
    "inputId": "input-data",
    "outputId": "output-data",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "json-minifier": {
    "inputId": "param-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": true
  },
  "json-beautifier": {
    "inputId": "input-data",
    "outputId": "output-data",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "xml-formatter": {
    "inputId": "source-code",
    "outputId": "result-code",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "xml-validator": {
    "inputId": "source-code",
    "outputId": "result-code",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "yaml-formatter": {
    "inputId": "source-code",
    "outputId": "result-code",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "yaml-validator": {
    "inputId": "source-code",
    "outputId": "result-code",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "html-formatter": {
    "inputId": "source-code",
    "outputId": "result-code",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "html-minifier": {
    "inputId": "source-code",
    "outputId": "result-code",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "css-formatter": {
    "inputId": "source-code",
    "outputId": "result-code",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "css-minifier": {
    "inputId": "source-code",
    "outputId": "result-code",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "js-beautifier": {
    "inputId": "source-code",
    "outputId": "result-code",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "js-minifier": {
    "inputId": "source-code",
    "outputId": "result-code",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "sql-formatter": {
    "inputId": "source-code",
    "outputId": "result-code",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "sql-beautifier": {
    "inputId": "source-code",
    "outputId": "result-code",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "regex-tester": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "jwt-decoder": {
    "inputId": "source-code",
    "outputId": "result-code",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "uuid-generator": {
    "inputId": "source-code",
    "outputId": "result-code",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "uuid-validator": {
    "inputId": "source-code",
    "outputId": "result-code",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "unix-timestamp-converter": {
    "inputId": "source-code",
    "outputId": "result-code",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "epoch-converter": {
    "inputId": "source-code",
    "outputId": "result-code",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "color-converter": {
    "inputId": "source-code",
    "outputId": "result-code",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "http-status-lookup": {
    "inputId": "source-code",
    "outputId": "result-code",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "mime-type-lookup": {
    "inputId": "source-code",
    "outputId": "result-code",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "binary-decimal": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "roman-numerals": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "number-to-words": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "compound-interest-calculator": {
    "inputId": "input-data",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": true
  },
  "shopping-list": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "checksum-generator": {
    "inputId": "input-data",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": true
  },
  "hash-verifier": {
    "inputId": "input-data",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": true
  },
  "file-hash-calculator": {
    "inputId": "input-data",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": true
  },
  "csv-viewer": {
    "inputId": "input-data",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": true
  },
  "csv-editor": {
    "inputId": "input-data",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": true
  },
  "csv-json": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "xml-viewer": {
    "inputId": "input-data",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": true
  },
  "xml-editor": {
    "inputId": "input-data",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": true
  },
  "add-prefix-suffix-to-lines": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "add-line-numbers": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": false
  },
  "remove-accents-diacritics": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "universal-file-to-base64": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "javascript-obfuscator": {
    "inputId": "source-text",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": false
  },
  "rsa-key-pair-generator": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "fibonacci-generator": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "meta-tag-generator": {
    "inputId": "meta-desc",
    "outputId": "meta-output",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "keyword-density-checker": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "robots-txt-generator": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "sitemap-generator": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "serp-simulator": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "hreflang-tag-generator": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "twitter-card-generator": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "string-length-checker": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "palindrome-checker": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "anagram-generator": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "string-splitter": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "text-reverser": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "whitespace-remover": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "diacritics-remover": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "camel-case-converter": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "snake-case-converter": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "pascal-case-converter": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "kebab-case-converter": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "title-case-converter": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "alternating-case-converter": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "htaccess-generator": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "bcrypt-generator": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "md2-generator": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "md4-generator": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "hmac-generator": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "pbkdf2-generator": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "random-color-generator": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "material-design-colors": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "cron-job-generator": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "bcrypt-validator": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "javascript-minifier": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "task-tracker": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "goal-setter": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "meeting-agenda-maker": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "world-clock": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "stopwatch": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "data-format-converter": {
    "inputId": "input-text",
    "outputId": "output-text",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": false
  },
  "hash-checksum-generator": {
    "inputId": "input-text",
    "outputId": "results-area",
    "needsLiveCount": true,
    "needsClearBtn": false,
    "needsCopyBtn": true
  },
  "open-graph-generator": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "regex-match-extractor": {
    "inputId": "regex-text",
    "outputId": "result-text",
    "needsLiveCount": false,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "responsive-design-tester": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  },
  "title-tag-analyzer": {
    "inputId": "text-input",
    "outputId": "result-text",
    "needsLiveCount": true,
    "needsClearBtn": true,
    "needsCopyBtn": false
  }
};

  function init() {
    const pathname = window.location.pathname;
    const toolId = pathname.split('/').pop().replace('.html', '');
    const config = TEXT_TOOL_MAPPING[toolId];

    if (!config) {
      return; // Page is not in the text tools enhancement map
    }

    const inputEl = document.getElementById(config.inputId);
    const outputEl = document.getElementById(config.outputId);

    if (!inputEl) {
      console.warn('[TextToolEnhancer] Input element not found:', config.inputId);
      return;
    }

    // 1. Live Character/Word/Line Counter
    if (config.needsLiveCount) {
      const counterId = config.inputId + '-counter-badge';
      if (!document.getElementById(counterId)) {
        const counterDiv = document.createElement('div');
        counterDiv.id = counterId;
        counterDiv.className = 'text-counter-badge glass-card';
        counterDiv.style.cssText = 'display:flex; gap:var(--space-4); margin-top:var(--space-2); font-size:0.875rem; color:var(--ink-soft); padding:var(--space-2) var(--space-4); border-radius:var(--radius-sm); background:var(--surface-2); border:1px solid var(--border); max-width:fit-content;';
        counterDiv.innerHTML = `
          <span>🔤 Characters: <strong class="char-count" style="color:var(--primary)">0</strong></span>
          <span>📝 Words: <strong class="word-count" style="color:var(--primary)">0</strong></span>
          <span>↔️ Lines: <strong class="line-count" style="color:var(--primary)">0</strong></span>
        `;
        
        // Insert counter right after inputEl
        inputEl.parentNode.insertBefore(counterDiv, inputEl.nextSibling);

        const charCountEl = counterDiv.querySelector('.char-count');
        const wordCountEl = counterDiv.querySelector('.word-count');
        const lineCountEl = counterDiv.querySelector('.line-count');

        const updateCounts = () => {
          const val = inputEl.value || '';
          charCountEl.textContent = val.length;
          wordCountEl.textContent = val.trim() ? val.trim().split(/\s+/).length : 0;
          lineCountEl.textContent = val ? val.split('\n').length : 0;
        };

        inputEl.addEventListener('input', updateCounts);
        updateCounts(); // Run initial count
      }
    }

    // 2. Clear / Reset Button
    if (config.needsClearBtn) {
      const clearBtnId = toolId + '-clear-btn';
      if (!document.getElementById(clearBtnId)) {
        const processBtn = document.getElementById('process-btn') || 
                           document.getElementById('calc-btn') || 
                           document.getElementById('submit-btn');

        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.id = clearBtnId;
        
        // Dynamically style based on primary action button if available
        let btnClasses = 'btn btn-primary pulse-hover btn-secondary btn-sm';
        if (processBtn) {
          if (processBtn.classList.contains('btn-sm')) {
            btnClasses = 'btn btn-primary pulse-hover btn-secondary btn-sm';
          } else {
            btnClasses = 'btn btn-primary pulse-hover btn-secondary';
          }
        }
        clearBtn.className = btnClasses;
        clearBtn.setAttribute('aria-label', '🧹 Clear');
        clearBtn.innerHTML = '🧹 Clear';
        clearBtn.style.marginLeft = 'var(--space-2)';

        if (processBtn) {
          processBtn.parentNode.insertBefore(clearBtn, processBtn.nextSibling);
        } else {
          // Fallback placement below input area
          const counterBadge = document.getElementById(config.inputId + '-counter-badge');
          const anchor = counterBadge || inputEl;
          anchor.parentNode.insertBefore(clearBtn, anchor.nextSibling);
          clearBtn.style.marginTop = 'var(--space-3)';
          clearBtn.style.display = 'block';
        }

        clearBtn.addEventListener('click', () => {
          inputEl.value = '';
          inputEl.dispatchEvent(new Event('input', { bubbles: true }));
          inputEl.dispatchEvent(new Event('change', { bubbles: true }));
          
          if (outputEl) {
            if (outputEl.tagName === 'TEXTAREA' || outputEl.tagName === 'INPUT') {
              outputEl.value = '';
            } else {
              outputEl.innerHTML = '';
            }
            outputEl.dispatchEvent(new Event('input', { bubbles: true }));
          }

          // Reset results cards if they are toggled
          const resultCard = document.getElementById('result-card') || 
                             document.getElementById('calc-results-card') || 
                             document.getElementById('results-card') ||
                             document.getElementById('result-area');
          if (resultCard) {
            resultCard.style.display = 'none';
          }
        });
      }
    }

    // 3. Copy-to-Clipboard Button
    if (config.needsCopyBtn && outputEl) {
      const copyBtnId = toolId + '-copy-btn';
      if (!document.getElementById(copyBtnId)) {
        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.id = copyBtnId;
        copyBtn.className = 'btn btn-primary pulse-hover btn-sm';
        copyBtn.setAttribute('aria-label', '📋 Copy');
        copyBtn.innerHTML = '📋 Copy';
        copyBtn.style.marginBottom = 'var(--space-2)';
        copyBtn.style.display = 'inline-block';

        // Insert before output element
        outputEl.parentNode.insertBefore(copyBtn, outputEl);

        copyBtn.addEventListener('click', async () => {
          const textToCopy = (outputEl.tagName === 'TEXTAREA' || outputEl.tagName === 'INPUT') ? 
                             outputEl.value : outputEl.innerText;
          
          if (!textToCopy) return;

          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(textToCopy);
            } else {
              const tempTa = document.createElement('textarea');
              tempTa.value = textToCopy;
              tempTa.style.position = 'absolute';
              tempTa.style.left = '-9999px';
              document.body.appendChild(tempTa);
              tempTa.select();
              document.execCommand('copy');
              document.body.removeChild(tempTa);
            }

            if (typeof showToast === 'function') {
              showToast('Copied to clipboard!', 'success');
            }

            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '✅ Copied!';
            setTimeout(() => { copyBtn.innerHTML = originalHTML; }, 1500);
          } catch (err) {
            console.error('Failed to copy:', err);
            if (typeof showToast === 'function') {
              showToast('Failed to copy text.', 'error');
            }
          }
        });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
