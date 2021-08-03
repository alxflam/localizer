import URI from "@theia/core/lib/common/uri";

export interface ITranslationTreeNodeData {
    key: string;
}

export interface ITranslationGroupData {
    languages: Map<string, URI>;
    data: ITranslationEntryRoot[];
}

export interface ITranslationEntryRoot {
    key: string;
    description: ITranslationKeyDescription | undefined;
    data: Map<string, ITranslationLanguageEntry>;
}

export interface ITranslationLanguageEntry {
    key: string;
    value: string;
}

export interface ITranslationEntry {
    line: number;
    key: string;
    value: string;
    description: ITranslationKeyDescription | undefined;
}

export interface ITranslationKeyDescription {
    description: string | undefined ;
    placeholders: IPlaceholder[];
}

export interface IPlaceholder {
    name: string;
    description: string;
}

export interface TranslationGroup {
    name: string
    resources: URI[]
}