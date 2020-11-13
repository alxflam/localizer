import URI from "@theia/core/lib/common/uri";

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