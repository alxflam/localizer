import { injectable, inject } from 'inversify';
import { ContextMenuRenderer, TreeProps, TreeWidget } from '@theia/core/lib/browser';
import { TranslationTreeModel } from './translation-tree-model';

export const TRANSLATION_TREE_CLASS = 'localizer-TranslationTree';

@injectable()
export class TranslationTreeWidget extends TreeWidget {

    constructor(
        @inject(TreeProps) readonly props: TreeProps,
        @inject(TranslationTreeModel) readonly model: TranslationTreeModel,
        @inject(ContextMenuRenderer) contextMenuRenderer: ContextMenuRenderer
    ) {
        super(props, model, contextMenuRenderer);
        this.addClass(TRANSLATION_TREE_CLASS);
    }

}