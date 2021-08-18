import URI from '@theia/core/lib/common/uri';

export interface ITranslationTreeNodeData {
    key: string;
}

export interface ITranslationGroupData {
    languages: Map<string, string>;
    data: ITranslationEntryRoot[];
}

export interface ITranslationEntryRoot {
    key: string;
    description: ITranslationKeyDescription | undefined;
    data: { [language: string]: string };
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
    description: string | undefined;
    placeholders: IPlaceholder[];
}

export interface IPlaceholder {
    name: string;
    description: string;
}

export interface LanguageResourceMaping {
    [language: string]: { resource: URI }
}

export interface TranslationGroup {
    name: string
    resources:  LanguageResourceMaping
}
