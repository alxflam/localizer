import { injectable, inject } from 'inversify';
import { LabelProviderContribution, DidChangeLabelEvent, LabelProvider } from '@theia/core/lib/browser/label-provider';
import { TreeLabelProvider } from '@theia/core/lib/browser/tree/tree-label-provider';
import { TranslationGroupRootNode, TranslationKeyNode } from './translation-navigator-tree';

@injectable()
export class TranslationTreeLabelProvider implements LabelProviderContribution {

    @inject(LabelProvider)
    protected readonly labelProvider: LabelProvider;

    @inject(TreeLabelProvider)
    protected readonly treeLabelProvider: TreeLabelProvider;

    canHandle(element: object): number {
        return TranslationGroupRootNode.is(element) || TranslationKeyNode.is(element) ?
            this.treeLabelProvider.canHandle(element) + 1 :
            0;
    }

    getIcon(node: TranslationGroupRootNode): string {
        return this.labelProvider.getIcon(node);
    }

    getName(node: TranslationGroupRootNode): string {
        return this.labelProvider.getName(node);
    }

    getDescription(node: TranslationGroupRootNode): string {
        return this.labelProvider.getLongName(node);
    }

    affects(node: TranslationGroupRootNode, event: DidChangeLabelEvent): boolean {
        return event.affects(node);
    }

}