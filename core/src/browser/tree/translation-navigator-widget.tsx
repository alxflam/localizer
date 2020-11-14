import { injectable, inject, postConstruct } from 'inversify';
import { ContextMenuRenderer, TreeProps, ViewContainerTitleOptions, ApplicationShell, TreeModel, TreeWidget, ExpandableTreeNode, TreeNode } from '@theia/core/lib/browser';
import { TranslationNavigatorModel } from './translation-navigator-model';
import { SelectionService } from '@theia/core';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import * as React from 'react';


export const TRANSLATION_NAVIGATOR_ID = 'translation';
export const TRANSLATION_VIEW_CONTAINER_ID = 'translation-view-container';
export const TRANSLATION_VIEW_CONTAINER_TITLE_OPTIONS: ViewContainerTitleOptions = {
    label: 'Translation',
    iconClass: 'fa fa-globe', // 'navigator-tab-icon',
    closeable: true
};

export const LABEL = 'No translation files available';
export const CLASS = 'localizer-Translation';

@injectable()
export class TranslationNavigatorWidget extends TreeWidget {


    constructor(
        @inject(TreeProps) readonly props: TreeProps,
        @inject(TranslationNavigatorModel) readonly model: TranslationNavigatorModel,
        @inject(ContextMenuRenderer) contextMenuRenderer: ContextMenuRenderer,
        @inject(SelectionService) protected readonly selectionService: SelectionService,
        @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService,
        @inject(ApplicationShell) protected readonly shell: ApplicationShell
    ) {
        super(props, model, contextMenuRenderer);
        this.id = TRANSLATION_NAVIGATOR_ID;
        this.addClass(CLASS);
    }

    @postConstruct()
    protected init(): void {
        super.init();
    }

    protected renderTree(model: TreeModel): React.ReactNode {
        return this.model.root === undefined
            ? this.renderOpenWorkspaceDiv()
            : super.renderTree(model);
    }

    /**
     * Render some text
     */
    protected renderOpenWorkspaceDiv(): React.ReactNode {
        return <div className='theia-navigator-container'>
            <div className='center'>You have not yet opened a workspace.</div>
        </div>;
    }
 
    protected isExpandable(node: TreeNode): node is ExpandableTreeNode {
        // TODO: check if root, then true, else if has children
        return true;
    }

}