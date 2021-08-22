import * as React from 'react';
import { injectable, inject } from 'inversify';
import { ContextMenuRenderer, TreeProps, ViewContainerTitleOptions, ApplicationShell, TreeModel, TreeWidget } from '@theia/core/lib/browser';
import { TranslationNavigatorModel } from './translation-navigator-model';
import { SelectionService } from '@theia/core';
import { WorkspaceService } from '@theia/workspace/lib/browser';

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
        this.title.label = TRANSLATION_VIEW_CONTAINER_TITLE_OPTIONS.label;
        this.title.caption = TRANSLATION_VIEW_CONTAINER_TITLE_OPTIONS.label;
        this.title.iconClass = 'fa fa-globe';
        this.title.closable = true;
    }

    protected override renderTree(model: TreeModel): React.ReactNode {
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

}
