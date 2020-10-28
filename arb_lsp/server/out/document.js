"use strict";
/********************************************************************************
 * Copyright (C) 2020 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoTextDocument = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
/**
 * Implementation of a `TextDocument` for `Crypto`.
 */
class CryptoTextDocument {
    constructor(uri, languageId, version, content) {
        this._document = vscode_languageserver_textdocument_1.TextDocument.create(uri, languageId, version, content);
    }
    /**
     * Get the document uri.
     */
    get uri() {
        return this._document.uri;
    }
    /**
     * Get the document language.
     */
    get languageId() {
        return this._document.languageId;
    }
    /**
     * Get the document version.
     */
    get version() {
        return this._document.version;
    }
    /**
     * Get the document line count.
     */
    get lineCount() {
        return this._document.lineCount;
    }
    /**
     * Get the text at the range.
     */
    getText(range) {
        return this._document.getText(range);
    }
    /**
     * Get the position at the given offset.
     */
    positionAt(offset) {
        return this._document.positionAt(offset);
    }
    /**
     * Get the offset at the given position.
     */
    offsetAt(position) {
        return this._document.offsetAt(position);
    }
    /**
     * Apply changes to the document.
     */
    applyChanges(changes) {
        changes.forEach((change) => {
            if ('range' in change) {
                this.applyEdits([{
                        newText: change.text,
                        range: change.range,
                    }]);
            }
            else {
                this._document = vscode_languageserver_textdocument_1.TextDocument.create(this.uri, this.languageId, this.version, change.text);
            }
        });
    }
    /**
     * Apply edits to the document.
     * @param edits the document edits.
     */
    applyEdits(edits) {
        this._document = vscode_languageserver_textdocument_1.TextDocument.create(this.uri, this.languageId, this.version, vscode_languageserver_textdocument_1.TextDocument.applyEdits(this._document, edits));
    }
    // #region TypeFox code
    /**
     * Copyright (C) 2017, 2018 TypeFox and others.
     *
     * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
     * in compliance with the License.
     * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
     */
    // https://github.com/theia-ide/typescript-language-server/blob/12f82d5af939c437210d69aa8d58cdf11d88fd42/server/src/document.ts
    /**
     * Get the text at the given line number.
     */
    getLine(line) {
        const lineRange = this.getLineRange(line);
        return this.getText(lineRange);
    }
    /**
     * Get the line number range.
     */
    getLineRange(line) {
        const lineStart = this.getLineStart(line);
        const lineEnd = this.getLineEnd(line);
        return vscode_languageserver_1.Range.create(lineStart, lineEnd);
    }
    /**
     * Get the end position for the given line number.
     */
    getLineEnd(line) {
        const nextLineOffset = this.getLineOffset(line + 1);
        return this.positionAt(nextLineOffset - 1);
    }
    /**
     * Get the line offset for the given line number.
     */
    getLineOffset(line) {
        const lineStart = this.getLineStart(line);
        return this.offsetAt(lineStart);
    }
    /**
     * Get the start position for the given line number.
     */
    getLineStart(line) {
        return vscode_languageserver_1.Position.create(line, 0);
    }
}
exports.CryptoTextDocument = CryptoTextDocument;
//# sourceMappingURL=document.js.map