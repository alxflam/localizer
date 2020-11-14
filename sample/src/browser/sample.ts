import { Range, SymbolKind, Location } from 'vscode-languageserver-types';

export const SAMPLE_ID = 'sample';

export interface Definition {
    location: Location,
    selectionRange: Range,
    symbolName: string,
    symbolKind: SymbolKind,
    containerName: string | undefined
}

export interface Caller {
    callerDefinition: Definition,
    references: Range[]
}

export interface Callee {
    calleeDefinition: Definition,
    references: Range[]
}