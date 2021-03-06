import { ContributionProvider } from '@theia/core';
import URI from '@theia/core/lib/common/uri';
import { injectable, inject, named } from 'inversify';
import { ITranslationEntryRoot, ITranslationGroupData, ITranslationTreeNodeData, TranslationGroup } from '../common/translation-types';
import { TranslationSupport } from './translation-support';

@injectable()
export class TranslationManager {

    @inject(ContributionProvider)
    @named(TranslationSupport)
    protected readonly contributions: ContributionProvider<TranslationSupport>;

    protected service: TranslationSupport;

    public setTranslationSupport(instance: TranslationSupport): void {
        this.service = instance;
    }

    getTranslationSupport(): TranslationSupport {
        if (this.service === undefined) {
            throw new Error('No TranslationSupport instance is active!');
        }
        return this.service;
    }

    getTranslationSupportForURI(uri: URI): TranslationSupport {
        let result: TranslationSupport | undefined;
        for (const handler of this.contributions.getContributions()) {
            if (handler.supports(uri)) {
                result = handler;
            }
        }
        if (result === undefined) {
            throw new Error('No TranslationSupport instance supports the resource ' + uri);
        }
        return result;
    }

    getTranslationGroups(): TranslationGroup[] {
        const manager = this.getActiveHandler();
        if (!manager) {
            return [];
        }

        const groups = manager.getTranslationGroups();
        if (groups.length === 0) {
            return [
                {
                    name: 'Nothing there yet',
                    resources: {}
                }
            ];
        }
        return groups;
    }

    getTranslationKeys(group: TranslationGroup): ITranslationTreeNodeData[] {
        const manager = this.getActiveHandler();
        if (!manager) {
            return [];
        }

        const keys = manager.getTranslationKeys(group);
        return keys;
    }

    getTranslationEntries(group: TranslationGroup): ITranslationGroupData {
        const manager = this.getActiveHandler();
        if (!manager) {
          throw new Error('No active handler');
        }

        return manager.getTranslationEntries(group);
    }

    getTranslationEntry(group: TranslationGroup, key: string): ITranslationEntryRoot {
        const manager = this.getActiveHandler();
        if (!manager) {
          throw new Error('No active handler');
        }

        return manager.getTranslationEntry(group, key);
    }

    getTranslation(key: string, uri: string): string | undefined {
        const manager = this.getActiveHandler();
        if (!manager) {
          throw new Error('No active handler');
        }

        return manager.getTranslation(key, uri);
    }

    private getActiveHandler(): TranslationSupport | undefined {
        for (const handler of this.contributions.getContributions()) {
            if (handler.isActive()) {
                return handler;
            }
        }
        return undefined;
    }

}
