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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const url = require("url");
const ls = require("vscode-languageserver");
const document_1 = require("./document");
// Create a server connection.
const connection = ls.createConnection(ls.ProposedFeatures.all);
const documents = new Map();
// Handler for `onInitialize` request.
connection.onInitialize((params) => {
    return {
        capabilities: {
            // Notify that we are interested in incremental updates to documents.
            textDocumentSync: ls.TextDocumentSyncKind.Incremental,
        }
    };
});
// Handler for `onDidOpenTextDocument` request.
connection.onDidOpenTextDocument((params) => {
    connection.console.log(`onDidOpenTextDocument called: ${params.textDocument.uri}`);
    documents.set(params.textDocument.uri, new document_1.CryptoTextDocument(params.textDocument.uri, params.textDocument.languageId, params.textDocument.version, params.textDocument.text));
    const { uri } = params.textDocument;
    const document = documents.get(uri);
    if (document) {
        process.nextTick(() => handleTextDocumentUpdate(uri, document));
    }
});
// Handler for `onDidChangeTextDocument` request.
connection.onDidChangeTextDocument((params) => {
    connection.console.log(`onDidChangeTextDocument called: ${params.textDocument.uri}`);
    const { uri } = params.textDocument;
    const document = documents.get(uri);
    if (!document) {
        throw new Error(`unknown document: ${uri}`);
    }
    // Apply the changes to the in-memory document and determine the diagnostic markers.
    document.applyChanges(params.contentChanges);
    process.nextTick(() => handleTextDocumentUpdate(uri, document));
});
// Handler for `onDidCloseTextDocument` request.
connection.onDidCloseTextDocument((params) => {
    connection.console.log(`onDidCloseTextDocument called: ${params.textDocument.uri}`);
    const { uri } = params.textDocument;
    if (!documents.has(uri)) {
        throw new Error(`unknown document: ${uri}`);
    }
    // Perform a cleanup when a file has been closed, removing the diagnostics.
    connection.sendDiagnostics({ uri, diagnostics: [] });
    documents.delete(uri);
});
/**
 * Extract the file, relative to the user home.
 * @param uri the file uri.
 * @param home the home uri.
 */
function extractFile(uri, home) {
    // ex: uri:  'file:///home/a/workspace/test/a.ts'
    // ex: home: '/home/a'
    const pathname = new url.URL(uri).pathname; // '/home/a/workspace/test/a.ts'
    const fileUri = pathname.replace(home + '/', ''); // '/workspace/test/a.ts'
    return fileUri; // 'workspace/test/a.ts'
}
/**
 * Create temporary file at the given path with the given content.
 * @param temporaryPath the temporary file path.
 * @param content the content of the text document.
 */
function createTemporaryFile(temporaryPath, content) {
    fs.writeFileSync(temporaryPath, content, { encoding: 'utf-8' });
}
/**
 * Handle the update of a text document, determining it's diagnostics.
 * @param uri the URI of the given resource.
 * @param document the underlying text document from which to perform processing.
 */
function handleTextDocumentUpdate(uri, document) {
    return __awaiter(this, void 0, void 0, function* () {
        // Collection of diagnostics for the given file.
        const diagnostics = [];
        const json = JSON.parse(document.getText());
        connection.console.log(`File: ${document.uri}, Diagnostics: ${diagnostics.length}`);
        diagnostics.push({
            severity: ls.DiagnosticSeverity.Warning,
            message: `Something from me:`,
            range: {
                start: {
                    character: 1,
                    line: 1,
                },
                end: {
                    character: 3,
                    line: 2,
                },
            },
            source: 'localizer'
        });
        connection.sendDiagnostics({
            uri,
            diagnostics
        });
        yield Promise.resolve(1);
    });
}
// Listen on the connection.
connection.listen();
//# sourceMappingURL=server.js.map